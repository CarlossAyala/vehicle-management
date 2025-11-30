import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Operation } from "src/modules/operation/entities/operation.entity";
import { TransactionType } from "../transaction.interface";
import { TransactionItem } from "./transaction-item.entity";

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: TransactionType,
  })
  type: TransactionType;

  @Column()
  description: string;

  @Column()
  operationId: Operation["id"];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Operation, (operation) => operation.transaction, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "operationId" })
  operation: Operation;

  @OneToMany(() => TransactionItem, (item) => item.transaction)
  items: TransactionItem[];
}
