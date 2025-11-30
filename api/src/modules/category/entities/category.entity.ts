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
import { Tenant } from "src/modules/tenants/entities/tenant.entity";
import { OperationType } from "src/modules/operation/operation.interface";
import { ServiceItem } from "src/modules/service/entities/service-item.entity";
import { TransactionItem } from "src/modules/transaction/entities/transaction-item.entity";
import { Fuel } from "src/modules/fuel/entities/fuel.entity";

@Entity()
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({
    type: "enum",
    enum: OperationType,
  })
  source: OperationType;

  @Column({ nullable: true })
  tenantId?: Tenant["id"];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Tenant, (tenant) => tenant.categories, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "tenantId" })
  tenant?: Tenant;

  @OneToMany(() => Fuel, (fuel) => fuel.category)
  fuels: Fuel[];

  @OneToMany(() => ServiceItem, (item) => item.category)
  serviceItems: ServiceItem[];

  @OneToMany(() => TransactionItem, (item) => item.category)
  transactionItems: TransactionItem[];
}
