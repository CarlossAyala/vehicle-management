import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Category } from "src/modules/category/entities/category.entity";
import { Transaction } from "./transaction.entity";

@Entity()
export class TransactionItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  amount: number;

  @Column()
  description: string;

  @Column()
  transactionId: Transaction["id"];

  @Column()
  categoryId: Category["id"];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Transaction, (transaction) => transaction.items, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "transactionId" })
  transaction: Transaction;

  @ManyToOne(() => Category, (category) => category.transactionItems, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "categoryId" })
  category: Category;
}
