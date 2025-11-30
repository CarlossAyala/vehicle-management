import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { UserTenant } from "src/modules/user-tenant/entities/user-tenant.entity";
import { Operation } from "src/modules/operation/entities/operation.entity";
import { Vehicle } from "src/modules/vehicle/entities/vehicle.entity";
import { Category } from "src/modules/category/entities/category.entity";
import { Invitation } from "src/modules/invitation/entities/invitation.entity";
import { TenantType } from "../tenants.interface";

@Entity()
export class Tenant {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    type: "enum",
    enum: TenantType,
  })
  type: TenantType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserTenant, (userTenant) => userTenant.tenant)
  roles: UserTenant[];

  @OneToMany(() => Vehicle, (vehicle) => vehicle.tenant)
  vehicles: Vehicle[];

  @OneToMany(() => Category, (category) => category.tenant)
  categories: Category[];

  @OneToMany(() => Operation, (operation) => operation.tenant)
  operations: Operation[];

  @OneToMany(() => Invitation, (invite) => invite.tenant)
  invitations: Invitation[];
}
