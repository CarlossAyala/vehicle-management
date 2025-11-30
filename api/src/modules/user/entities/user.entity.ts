import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Exclude, Expose } from "class-transformer";
import { UserTenant } from "src/modules/user-tenant/entities/user-tenant.entity";
import { Session } from "src/modules/sessions/entities/session.entity";
import { Operation } from "src/modules/operation/entities/operation.entity";
import { Invitation } from "src/modules/invitation/entities/invitation.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Index("idx_user_email", { unique: true })
  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Expose()
  get fullName(): string {
    return this.firstName + " " + this.lastName;
  }

  @Expose()
  get initials(): string {
    return this.fullName
      .split(" ")
      .map((name) => name.charAt(0).toUpperCase())
      .join("");
  }

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserTenant, (usersTenants) => usersTenants.user)
  roles: UserTenant[];

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @OneToMany(() => Operation, (operation) => operation.author)
  operations: Operation[];

  @OneToMany(() => Invitation, (invitation) => invitation.author)
  invitations: Invitation[];
}
