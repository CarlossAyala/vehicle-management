import { Response } from "express";
import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { User } from "../user/entities/user.entity";
import { UserTenant } from "../user-tenant/entities/user-tenant.entity";
import { LoginDto, RegisterDto } from "./dto/auth.dto";
import { AUTH_COOKIE_CONFIG, AUTH_COOKIE_NAME } from "./auth.constants";
import {
  GetAuth,
  Public,
  SkipAuthRoles,
  SkipAuthTenant,
} from "./auth.decorator";
import { AuthService } from "./auth.service";
import { AuthData } from "./auth.interface";

@SkipAuthRoles()
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Public()
  @Post("register")
  async register(@Body() dto: RegisterDto): Promise<void> {
    return this.authService.register(dto);
  }

  @Public()
  @Post("login")
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginDto,
  ): Promise<User> {
    const { user, session } = await this.authService.login(dto);

    res.cookie(AUTH_COOKIE_NAME, session.id, AUTH_COOKIE_CONFIG);

    return user;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @SkipAuthTenant()
  @Post("logout")
  async logout(
    @Res({ passthrough: true }) res: Response,
    @GetAuth() auth: AuthData,
  ): Promise<void> {
    await this.authService.logout(auth.sessionId!);

    res.clearCookie(AUTH_COOKIE_NAME, AUTH_COOKIE_CONFIG);
  }

  @SkipAuthTenant()
  @Get("profile")
  async profile(@GetAuth() auth: AuthData): Promise<User> {
    return this.authService.profile(auth.userId!);
  }

  @SkipAuthTenant()
  @Get("tenants")
  async findTenants(@GetAuth() auth: AuthData): Promise<UserTenant[]> {
    return this.authService.findTenants(auth.userId!);
  }
}
