import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { randomBytes } from "node:crypto";
import { Tenant } from "../tenants/entities/tenant.entity";
import { TenantsService } from "../tenants/tenants.service";
import { User } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";
import { Invitation } from "./entities/invitation.entity";
import { CreateInvitationDto } from "./dto/create-invitation.dto";
import { InvitationStatus } from "./invitation.interface";
import { AcceptInvitationDto } from "./dto/accept-invitation.dto";
import { AuthService } from "../auth/auth.service";
import { SessionsService } from "../sessions/sessions.service";
import { Session } from "../sessions/entities/session.entity";
import { UserTenantService } from "../user-tenant/user-tenant.service";
import { UserTenant } from "../user-tenant/entities/user-tenant.entity";

/**
 * #TODO
 * - refactor multiple resources actions using transactions
 */

@Injectable()
export class InvitationService {
  constructor(
    @InjectRepository(Invitation)
    private readonly repository: Repository<Invitation>,
    private readonly tenantService: TenantsService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly sessionService: SessionsService,
    private readonly userTenantService: UserTenantService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    tenantId: Tenant["id"],
    authorId: User["id"],
    dto: CreateInvitationDto,
  ): Promise<Invitation> {
    const invitation = await this.repository.findOneBy({
      email: dto.email,
      tenantId,
    });

    const user = await this.userService.findByEmail(dto.email);
    if (user) {
      const hasRoleInTenant =
        await this.userTenantService.findByUserIdAndTenantId(user.id, tenantId);
      if (hasRoleInTenant) {
        throw new BadRequestException("User is already member of the tenant");
      }
    }

    if (invitation && invitation.status === InvitationStatus.PENDING) {
      throw new BadRequestException("Invitation already exists");
    }
    if (invitation && invitation.status === InvitationStatus.ACCEPTED) {
      throw new BadRequestException("User has already accepted the invitation");
    }

    const token = randomBytes(32).toString("hex");
    const expiredAt = new Date();
    const DAYS_TO_EXPIRE = 7;
    expiredAt.setDate(expiredAt.getDate() + DAYS_TO_EXPIRE);

    if (invitation) {
      Object.assign(invitation, {
        ...dto,
        token,
        status: InvitationStatus.PENDING,
        authorId,
        expiredAt,
      });

      return this.repository.save(invitation);
    }

    const _invitation = this.repository.create({
      ...dto,
      token,
      status: InvitationStatus.PENDING,
      authorId,
      tenantId,
      expiredAt,
    });

    return this.repository.save(_invitation);
  }

  // TODO: Add pagination
  async findAllTenant(tenantId: Tenant["id"]): Promise<Invitation[]> {
    return this.repository.find({
      where: { tenantId, status: InvitationStatus.PENDING },
    });
  }

  // TODO: Add pagination
  async findAllUser(userId: User["id"]): Promise<Invitation[]> {
    const user = await this.userService.findByIdOrFail(userId);

    return this.repository.find({
      where: {
        email: user.email,
        status: InvitationStatus.PENDING,
      },
      relations: {
        tenant: true,
      },
    });
  }

  async findOneId(
    tenantId: Tenant["id"],
    userId: User["id"],
    id: Invitation["id"],
  ): Promise<Invitation> {
    const invitation = await this.repository.findOneBy({ id });
    if (!invitation) {
      throw new NotFoundException("Invitation not found");
    }

    const user = await this.userService.findByIdOrFail(userId);
    if (invitation.email !== user.email || invitation.tenantId !== tenantId) {
      throw new NotFoundException("Invitation not found");
    }

    return invitation;
  }

  async findOneToken(token: Invitation["token"]): Promise<Invitation> {
    const invitation = await this.repository.findOneBy({ token });
    if (!invitation) {
      throw new NotFoundException("Invitation not found");
    }

    return invitation;
  }

  async accept(
    userId: User["id"],
    id: Invitation["id"],
  ): Promise<{
    invitation: Invitation;
    tenant: Tenant;
    userTenant: UserTenant;
  }> {
    const invitation = await this.repository.findOneBy({
      id,
    });
    if (!invitation) {
      throw new NotFoundException("Invitation not found");
    }
    const user = await this.userService.findByIdOrFail(userId);

    if (invitation.email !== user.email) {
      throw new NotFoundException("Invitation not found");
    }

    const userTenant = await this.userTenantService.findByUserIdAndTenantId(
      user.id,
      invitation.tenantId,
    );
    if (userTenant) throw new BadRequestException("User already in tenant");

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestException("Invitation is not pending");
    }
    if (invitation.expiredAt < new Date()) {
      await this.repository.update(
        { status: InvitationStatus.EXPIRED },
        { id: invitation.id },
      );
      throw new BadRequestException("Invitation expired");
    }

    const tenant = await this.tenantService.findByIdOrFail(invitation.tenantId);

    return this.dataSource.transaction(async (manager) => {
      const updated = await manager.getRepository(Invitation).save({
        id: invitation.id,
        status: InvitationStatus.ACCEPTED,
      });

      const _userTenant = manager.create(UserTenant, {
        userId: user.id,
        tenantId: invitation.tenantId,
        role: invitation.role,
      });
      const userTenant = await manager
        .getRepository(UserTenant)
        .save(_userTenant);

      return { invitation: updated, tenant, userTenant };
    });
  }

  async acceptPublic(
    token: Invitation["token"],
    dto: AcceptInvitationDto,
  ): Promise<{
    // tenant: Tenant;
    invitation: Invitation;
    sessionId?: Session["id"];
  }> {
    const resource = await this.repository.findOneBy({ token });
    if (!resource) {
      throw new BadRequestException("Invitation not found");
    }
    if (resource.status !== InvitationStatus.PENDING) {
      throw new BadRequestException("Invitation is not pending");
    }
    if (resource.expiredAt < new Date()) {
      await this.repository.update(
        { status: InvitationStatus.EXPIRED },
        { id: resource.id },
      );
      throw new BadRequestException("Invitation expired");
    }

    // const tenant = await this.tenantService.findByIdOrFail(invitation.tenantId);

    const account = await this.userService.findByEmail(resource.email);
    if (account) {
      const invitation = await this.repository.save({
        id: resource.id,
        status: InvitationStatus.ACCEPTED,
      });

      await this.tenantService.addUser(
        account.id,
        resource.tenantId,
        resource.role,
      );

      return { invitation };
    }

    const invitation = await this.repository.save({
      id: resource.id,
      status: InvitationStatus.ACCEPTED,
    });

    const user = await this.authService.register({
      ...dto,
      email: resource.email,
    });
    const session = await this.sessionService.create({
      userId: user.id,
    });

    await this.tenantService.addUser(user.id, resource.tenantId, resource.role);

    return { invitation, sessionId: session.id };
  }

  async reject(userId: User["id"], id: Invitation["id"]): Promise<Invitation> {
    const [invitation, user] = await Promise.all([
      this.repository.findOneBy({
        id,
      }),
      this.userService.findByIdOrFail(userId),
    ]);

    if (!invitation || invitation.email !== user.email) {
      throw new BadRequestException("Invitation not found");
    }
    if (invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestException("Invitation is not pending");
    }
    if (invitation.expiredAt < new Date()) {
      await this.repository.update(
        { status: InvitationStatus.EXPIRED },
        { id: invitation.id },
      );
      throw new BadRequestException("Invitation expired");
    }

    // const tenant = await this.tenantService.findByIdOrFail(invitation.tenantId);

    return this.repository.save({
      id: invitation.id,
      status: InvitationStatus.REJECTED,
    });
  }

  async remove(
    tenantId: Tenant["id"],
    id: Invitation["id"],
  ): Promise<{ id: Invitation["id"] }> {
    const invitation = await this.repository.findOneBy({ id, tenantId });
    if (!invitation) {
      throw new NotFoundException("Invitation not found");
    }

    await this.repository.remove(invitation);

    return { id };
  }
}
