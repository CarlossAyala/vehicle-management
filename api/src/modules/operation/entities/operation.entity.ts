import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Tenant } from "src/modules/tenants/entities/tenant.entity";
import { User } from "src/modules/user/entities/user.entity";
import { Vehicle } from "src/modules/vehicle/entities/vehicle.entity";
import { Odometer } from "src/modules/odometer/entities/odometer.entity";
import { Service } from "src/modules/service/entities/service.entity";
import { Fuel } from "src/modules/fuel/entities/fuel.entity";
import { Transaction } from "src/modules/transaction/entities/transaction.entity";
import { OperationType } from "../operation.interface";

@Entity()
export class Operation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: OperationType,
  })
  type: OperationType;

  @Column()
  tenantId: Tenant["id"];

  @Column()
  vehicleId: Vehicle["id"];

  @Column()
  authorId: User["id"];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Tenant, (tenant) => tenant.operations)
  @JoinColumn({ name: "tenantId" })
  tenant: Tenant;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.operations)
  @JoinColumn({ name: "vehicleId" })
  vehicle: Vehicle;

  @ManyToOne(() => User, (user) => user.operations)
  @JoinColumn({ name: "authorId" })
  author: User;

  @OneToOne(() => Odometer, (odometer) => odometer.operation)
  odometer: Odometer;

  @OneToOne(() => Service, (service) => service.operation)
  service: Service;

  @OneToOne(() => Fuel, (fuel) => fuel.operation)
  fuel: Fuel;

  @OneToOne(() => Transaction, (transaction) => transaction.operation)
  transaction: Transaction;
}
