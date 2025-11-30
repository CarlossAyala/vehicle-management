import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "src/modules/user/entities/user.entity";

@Entity()
export class Session {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId: User["id"];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.sessions)
  @JoinColumn({ name: "userId" })
  user: User;
}
