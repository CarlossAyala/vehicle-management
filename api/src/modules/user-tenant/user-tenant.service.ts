import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../user/entities/user.entity";
import { Tenant } from "../tenants/entities/tenant.entity";
import { UserTenant } from "./entities/user-tenant.entity";
import { CreateUsersTenantDto } from "./dto/create-users-tenant.dto";
import { UpdateUsersTenantDto } from "./dto/update-users-tenant.dto";

@Injectable()
export class UserTenantService {
  constructor(
    @InjectRepository(UserTenant)
    private readonly repository: Repository<UserTenant>,
  ) {}

  async findById(id: UserTenant["id"]): Promise<UserTenant | null> {
    return this.repository.findOneBy({ id });
  }

  async findAllByUserId(userId: User["id"]): Promise<UserTenant[]> {
    return this.repository.find({
      where: { userId },
    });
  }

  async findByUserIdAndTenantId(
    userId: User["id"],
    tenantId: Tenant["id"],
  ): Promise<UserTenant | null> {
    return this.repository.findOneBy({ userId, tenantId });
  }

  async getUserTenantRoles(
    userId: User["id"],
    tenantId: Tenant["id"],
  ): Promise<UserTenant["role"][]> {
    const roles = await this.repository.find({
      where: { userId, tenantId },
    });

    return roles.map((r) => r.role);
  }

  create(_dto: CreateUsersTenantDto) {
    return "This action adds a new usersTenant";
  }

  async findAll(userId: User["id"]): Promise<UserTenant[]> {
    return this.repository.find({
      where: { userId },
    });
  }

  async findOne(
    tenantId: Tenant["id"],
    userId: User["id"],
    id: UserTenant["id"],
  ): Promise<UserTenant> {
    const userTenant = await this.findById(id);
    if (
      !userTenant ||
      userTenant.tenantId !== tenantId ||
      userTenant.userId !== userId
    ) {
      throw new NotFoundException("User Tenant not found");
    }

    return userTenant;
  }

  update(id: number, _dto: UpdateUsersTenantDto) {
    return `This action updates a #${id} usersTenant`;
  }

  remove(id: number) {
    return `This action removes a #${id} usersTenant`;
  }
}
