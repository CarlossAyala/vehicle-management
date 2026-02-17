import {
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
import { TenantRole } from "../user-tenant.interface";

@Entity()
export class UserTenant {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: TenantRole,
  })
  role: TenantRole;

  @Column()
  userId: User["id"];

  @Column()
  tenantId: Tenant["id"];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.roles, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Tenant, (tenant) => tenant.roles, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "tenantId" })
  tenant?: Tenant;
}
