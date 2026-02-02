import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, In, Repository } from "typeorm";
import { User } from "../user/entities/user.entity";
import { UserTenantService } from "../user-tenant/user-tenant.service";
import { Tenant } from "./entities/tenant.entity";
import { CreateTenantDto } from "./dto/create-tenant.dto";
import { UserTenant } from "../user-tenant/entities/user-tenant.entity";
import { TenantRole } from "../user-tenant/user-tenant.interface";
import { UpdateRolesDto } from "./dto/update-roles.dto";

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private readonly repository: Repository<Tenant>,
    private readonly userTenantService: UserTenantService,
    private readonly dataSource: DataSource,
  ) {}

  async findById(id: Tenant["id"]): Promise<Tenant | null> {
    return this.repository.findOneBy({ id });
  }

  async findByIdOrFail(id: Tenant["id"]): Promise<Tenant> {
    const tenant = await this.repository.findOneBy({ id });
    if (!tenant) {
      throw new NotFoundException("Tenant not found");
    }

    return tenant;
  }

  async findAllByIds(ids: Tenant["id"][]): Promise<Tenant[]> {
    return this.repository.findBy({ id: In(ids) });
  }

  async create(
    userId: User["id"],
    dto: CreateTenantDto,
  ): Promise<{
    tenant: Tenant;
    userTenant: UserTenant;
  }> {
    return this.dataSource.transaction(async (manager) => {
      const _tenant = manager.create(Tenant, dto);
      const tenant = await manager.save(_tenant);

      const _userTenant = manager.create(UserTenant, {
        userId,
        tenantId: tenant.id,
        role: TenantRole.OWNER,
      });
      const userTenant = await manager.save(_userTenant);

      return { tenant, userTenant };
    });
  }

  async findAll(userId: User["id"]): Promise<Tenant[]> {
    const userTenants = await this.userTenantService.findAllByUserId(userId);
    if (userTenants.length === 0) return [];

    const uniqueTenantIds = [
      ...new Set(userTenants.map((userTenant) => userTenant.tenantId)),
    ];
    return this.findAllByIds(uniqueTenantIds);
  }

  async findOne(userId: User["id"], tenantId: Tenant["id"]): Promise<Tenant> {
    const membership = await this.userTenantService.findByUserIdAndTenantId(
      userId,
      tenantId,
    );
    if (!membership) {
      throw new NotFoundException("Tenant not found");
    }

    return this.findByIdOrFail(tenantId);
  }

  async findMembers(tenantId: Tenant["id"]): Promise<User[]> {
    return this.dataSource.getRepository(User).find({
      where: {
        roles: {
          tenantId,
        },
      },
      relations: {
        roles: true,
      },
    });
  }

  async addUser(
    userId: User["id"],
    tenantId: Tenant["id"],
    role: TenantRole,
  ): Promise<UserTenant> {
    return this.dataSource.transaction(async (manager) => {
      const _userTenant = manager.create(UserTenant, {
        userId,
        tenantId,
        role,
      });
      return manager.save(_userTenant);
    });
  }

  async updateRoles(
    tenantId: Tenant["id"],
    userId: User["id"],
    dto: UpdateRolesDto,
  ): Promise<UserTenant[]> {
    const roles = await this.userTenantService.findAllByUserId(userId);
    if (roles.length === 0) {
      throw new NotFoundException("Member not found");
    }

    const toRemove = roles.filter((r) => !dto.roles.includes(r.role));
    const toCreate = dto.roles.filter(
      (r) => !roles.some((ur) => ur.role === r),
    );

    return this.dataSource.transaction(async (manager) => {
      await manager.remove(UserTenant, toRemove);
      const created = await manager.save(
        UserTenant,
        toCreate.map((role) => ({ userId, tenantId, role })),
      );

      return roles.filter((r) => dto.roles.includes(r.role)).concat(created);
    });
  }

  async removeMember(
    tenantId: Tenant["id"],
    userId: User["id"],
  ): Promise<void> {
    const membership = await this.userTenantService.findByUserIdAndTenantId(
      userId,
      tenantId,
    );
    if (!membership) {
      throw new NotFoundException("Member not found");
    }

    return this.dataSource.transaction(async (manager) => {
      const members = await this.dataSource
        .getRepository(UserTenant)
        .findBy({ tenantId });
      const users = new Set(members.map((m) => m.userId));
      if (users.size === 1) {
        const tenant = await this.findByIdOrFail(tenantId);
        await manager.remove(Tenant, tenant);
      }
    });
  }
}
