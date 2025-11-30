import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { randomBytes } from "node:crypto";
import { Tenant } from "../tenants/entities/tenant.entity";
import { TenantsService } from "../tenants/tenants.service";
import { TenantType } from "../tenants/tenants.interface";
import { User } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";
import { Invitation } from "./entities/invitation.entity";
import { CreateInvitationDto } from "./dto/create-invitation.dto";
import { InvitationStatus } from "./invitation.interface";

@Injectable()
export class InvitationService {
  constructor(
    @InjectRepository(Invitation)
    private readonly repository: Repository<Invitation>,
    private readonly tenantService: TenantsService,
    private readonly userService: UserService,
  ) {}

  async create(
    tenantId: Tenant["id"],
    authorId: User["id"],
    dto: CreateInvitationDto,
  ): Promise<Invitation> {
    const record = await this.repository.findOneBy({
      email: dto.email,
      tenantId,
    });
    if (
      record &&
      [InvitationStatus.ACCEPTED, InvitationStatus.PENDING].includes(
        record.status,
      )
    ) {
      throw new ConflictException("Invitation already exists");
    }

    const token = randomBytes(32).toString("hex");
    const expiredAt = new Date(Date.now() + 1_000 * 60 * 60 * 24 * 7); // 7d

    const _invitation = this.repository.create({
      ...dto,
      token,
      status: InvitationStatus.PENDING,
      authorId,
      tenantId,
      expiredAt,
    });
    console.log("before", _invitation);

    const invitation = await this.repository.save(_invitation);

    console.log("after _invitation", _invitation);
    console.log("after invitation", invitation);

    return invitation;
  }

  async findAll(tenantId: Tenant["id"]): Promise<Invitation[]> {
    return this.repository.find({ where: { tenantId } });
  }

  async findReceived(
    tenantId: Tenant["id"],
    userId: User["id"],
  ): Promise<Invitation[]> {
    const tenant = await this.tenantService.findByIdOrFail(tenantId);
    if (tenant.type !== TenantType.PERSONAL) {
      throw new ForbiddenException(
        "Only personal tenants can list received invitations",
      );
    }

    const user = await this.userService.findByIdOrFail(userId);

    return this.repository.find({
      where: {
        email: user.email,
      },
      order: {
        createdAt: "DESC",
      },
    });
  }

  async findSent(tenantId: Tenant["id"]): Promise<Invitation[]> {
    const tenant = await this.tenantService.findByIdOrFail(tenantId);
    if (tenant.type !== TenantType.FLEET) {
      throw new ForbiddenException(
        "Only fleet tenants can list sent invitations",
      );
    }

    return this.repository.find({
      where: {
        tenantId,
      },
      order: {
        createdAt: "DESC",
      },
    });
  }

  async findOne(
    tenantId: Tenant["id"],
    id: Invitation["id"],
  ): Promise<Invitation> {
    const invitation = await this.repository.findOneBy({ id, tenantId });
    if (!invitation) {
      throw new NotFoundException("Invitation not found");
    }

    return invitation;
  }

  // POST /invitations/:token/accept
  // POST /invitations/:token/reject
  // GET /invitations/:token/verify

  async remove(
    tenantId: Tenant["id"],
    id: Invitation["id"],
  ): Promise<Invitation> {
    const invitation = await this.repository.findOneBy({ id, tenantId });
    if (!invitation) {
      throw new NotFoundException("Invitation not found");
    }

    return this.repository.remove(invitation);
  }
}
