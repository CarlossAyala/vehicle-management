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
import { Service } from "./service.entity";

@Entity()
export class ServiceItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  description: string;

  @Column()
  amount: number;

  @Column()
  serviceId: Service["id"];

  @Column()
  categoryId: Category["id"];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Service, (service) => service.items, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "serviceId" })
  service: Service;

  @ManyToOne(() => Category, (category) => category.serviceItems, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "categoryId" })
  category: Category;
}
