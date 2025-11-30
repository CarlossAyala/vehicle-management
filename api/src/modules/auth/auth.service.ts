import { pbkdf2Sync } from "node:crypto";
import { DataSource } from "typeorm";
import { BadRequestException, Injectable } from "@nestjs/common";
import { User } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";
import { UserTenant } from "../user-tenant/entities/user-tenant.entity";
import { UserTenantService } from "../user-tenant/user-tenant.service";
import { Session } from "../sessions/entities/session.entity";
import { SessionsService } from "../sessions/sessions.service";
import { LoginDto, RegisterDto } from "./dto/auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionsService,
    private readonly userTenantService: UserTenantService,
    private readonly dataSource: DataSource,
  ) {}

  async register(dto: RegisterDto): Promise<void> {
    const { email, password, firstName, lastName } = dto;

    const account = await this.userService.findByEmail(email);
    if (account) {
      throw new BadRequestException("Email already in use");
    }

    await this.dataSource.transaction(async (manager) => {
      const hash = this.generateHash(password);

      const _user = manager.create(User, {
        email,
        firstName,
        lastName,
        password: hash,
      });
      await manager.save(_user);
    });
  }

  async login({ email, password }: LoginDto): Promise<{
    user: User;
    session: Session;
  }> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException("Invalid credentials");
    }

    const isPasswordValid = this.compareHash(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException("Invalid credentials");
    }

    const session = await this.sessionService.create({
      userId: user.id,
    });

    return { user, session };
  }

  async logout(sessionId: Session["id"]): Promise<void> {
    await this.sessionService.remove(sessionId);
  }

  async profile(userId: User["id"]): Promise<User> {
    return this.userService.findByIdOrFail(userId);
  }

  async findTenants(userId: User["id"]): Promise<UserTenant[]> {
    return this.userTenantService.findAllByUserId(userId);
  }

  private generateHash(password: string): string {
    // TODO: Move this to the .env
    const SALT = "b37a702f1abf9baf6cc38920fb753f78";
    const ITERATIONS = 1_000;
    const KEY_LENGTH = 512;
    const DIGEST = "sha512";

    return pbkdf2Sync(password, SALT, ITERATIONS, KEY_LENGTH, DIGEST).toString(
      "hex",
    );
  }

  private compareHash(password: string, hash: string): boolean {
    return this.generateHash(password) === hash;
  }
}
