import {
  Index,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Tenant } from "src/modules/tenants/entities/tenant.entity";
import { User } from "src/modules/user/entities/user.entity";
import { TenantRole } from "src/modules/user-tenant/user-tenant.interface";
import { InvitationStatus } from "../invitation.interface";

@Index("idx_invitation_email", ["email"])
@Index("idx_invitation_token", ["token"])
@Entity()
export class Invitation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  email: string;

  @Column()
  token: string;

  @Column({
    type: "enum",
    enum: TenantRole,
  })
  role: TenantRole;

  @Column({
    type: "enum",
    enum: InvitationStatus,
  })
  status: InvitationStatus;

  @Column()
  authorId: User["id"];

  @Column()
  tenantId: Tenant["id"];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: "timestamptz" })
  expiredAt: Date;

  @ManyToOne(() => Tenant, (tenant) => tenant.invitations, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "tenantId" })
  tenant: Tenant;

  @ManyToOne(() => User, (user) => user.invitations, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "authorId" })
  author: User;
}
