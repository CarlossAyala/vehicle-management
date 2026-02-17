import { DataSource } from "typeorm";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { EnvironmentVariables } from "src/config/envs";
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
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  async register(dto: RegisterDto): Promise<User> {
    const { email, password, firstName, lastName } = dto;

    const account = await this.userService.findByEmail(email);
    if (account) {
      throw new BadRequestException("Email already in use");
    }

    return this.dataSource.transaction(async (manager) => {
      const hash = await this.generateHash(password);

      const _user = manager.create(User, {
        email,
        firstName,
        lastName,
        password: hash,
      });
      const user = await manager.save(_user);

      return user;
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

    const isPasswordValid = await this.compareHash(password, user.password);
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

  private generateHash(password: string): Promise<string> {
    const SALT = +this.configService.getOrThrow("BCRYPT_SALT_ROUNDS");

    return bcrypt.hash(password, SALT);
  }

  private compareHash(password: string, hashValue: string): Promise<boolean> {
    return bcrypt.compare(password, hashValue);
  }
}
