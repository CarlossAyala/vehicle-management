import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Operation } from "src/modules/operation/entities/operation.entity";
import { Category } from "src/modules/category/entities/category.entity";
import { DecimalTransformer } from "src/common/transformers/number.transformer";

@Entity()
export class Fuel {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  quantity: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  amount: number;

  @Column({
    default: "",
  })
  description: string;

  @Column()
  operationId: Operation["id"];

  @Column()
  categoryId: Category["id"];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Operation, (operation) => operation.fuel, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "operationId" })
  operation: Operation;

  @ManyToOne(() => Category, (category) => category.fuels, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "categoryId" })
  category: Category;
}
