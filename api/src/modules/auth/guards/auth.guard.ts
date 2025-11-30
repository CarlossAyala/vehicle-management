import { Reflector } from "@nestjs/core";
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request, Response } from "express";
import { SessionsService } from "src/modules/sessions/sessions.service";
import { UserTenantService } from "src/modules/user-tenant/user-tenant.service";
import {
  AUTH_COOKIE_NAME,
  AUTH_HEADER_TENANT_NAME,
  SKIP_AUTH_KEY,
  SKIP_AUTH_ROLES_KEY,
  SKIP_AUTH_TENANT_KEY,
} from "../auth.constants";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly sessionService: SessionsService,
    private readonly usersTenantsService: UserTenantService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest<Request>();
    const response = ctx.switchToHttp().getResponse<Response>();

    const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (skipAuth) {
      return true;
    }

    const sessionId = this.extractSessionId(request);
    if (!sessionId) {
      throw new UnauthorizedException("No session ID found");
    }
    const session = await this.sessionService.findById(sessionId);
    if (!session) {
      response.clearCookie(AUTH_COOKIE_NAME);
      throw new UnauthorizedException("Invalid session");
    }
    request.auth.userId = session.userId;
    request.auth.sessionId = session.id;

    const skipAuthTenant = this.reflector.getAllAndOverride<boolean>(
      SKIP_AUTH_TENANT_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );
    if (!skipAuthTenant) {
      const tenantId = this.extractTenantId(request);
      if (!tenantId) {
        throw new UnauthorizedException("No tenant ID found");
      }
      const userTenant = await this.usersTenantsService.findByUserIdAndTenantId(
        request.auth.userId,
        tenantId,
      );
      if (!userTenant) {
        throw new UnauthorizedException("Invalid tenant");
      }
      request.auth.tenantId = tenantId;
    }

    const skipAuthRoles = this.reflector.getAllAndOverride<boolean>(
      SKIP_AUTH_ROLES_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );

    if (!skipAuthTenant && !skipAuthRoles) {
      const roles = await this.usersTenantsService.getUserTenantRoles(
        request.auth.userId,
        request.auth.tenantId!,
      );

      request.auth.roles = roles;
    }

    return true;
  }

  private extractSessionId(request: Request): string | undefined {
    return typeof request.cookies?.[AUTH_COOKIE_NAME] === "string"
      ? request.cookies[AUTH_COOKIE_NAME]
      : undefined;
  }

  private extractTenantId(request: Request): string | undefined {
    return request.get(AUTH_HEADER_TENANT_NAME);
  }
}
