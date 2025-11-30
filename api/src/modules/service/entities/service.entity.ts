import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Operation } from "src/modules/operation/entities/operation.entity";
import { ServiceItem } from "./service-item.entity";

@Entity()
export class Service {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  description: string;

  @Column()
  operationId: Operation["id"];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Operation, (operation) => operation.service, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "operationId" })
  operation: Operation;

  @OneToMany(() => ServiceItem, (item) => item.service)
  items: ServiceItem[];
}
