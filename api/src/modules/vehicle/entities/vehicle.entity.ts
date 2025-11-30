import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Expose } from "class-transformer";
import { Tenant } from "src/modules/tenants/entities/tenant.entity";
import { Operation } from "src/modules/operation/entities/operation.entity";
import { VehicleStatus, VehicleType } from "../vehicle.interface";

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    default: "",
  })
  nickname: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column({
    default: "",
  })
  variant: string;

  @Column()
  year: number;

  @Column()
  licensePlate: string;

  @Column({
    type: "enum",
    enum: VehicleType,
  })
  type: VehicleType;

  @Column({
    type: "enum",
    enum: VehicleStatus,
  })
  status: VehicleStatus;

  @Expose()
  get fullName(): string {
    const base = `${this.brand} ${this.model}`;
    return this.variant
      ? `${base} ${this.variant} ${this.year}`
      : `${base} ${this.year}`;
  }

  @Column()
  tenantId: Tenant["id"];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Tenant, (tenant) => tenant.vehicles)
  @JoinColumn({ name: "tenantId" })
  tenant: Tenant;

  @OneToMany(() => Operation, (operation) => operation.vehicle)
  operations: Operation[];
}
