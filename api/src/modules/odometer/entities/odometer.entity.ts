import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Operation } from "src/modules/operation/entities/operation.entity";

@Entity()
export class Odometer {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  value: number;

  @Column({
    default: "",
  })
  description: string;

  @Column()
  operationId: Operation["id"];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Operation, (operation) => operation.odometer, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "operationId" })
  operation: Operation;
}
