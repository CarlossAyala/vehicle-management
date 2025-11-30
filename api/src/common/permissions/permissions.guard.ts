import { Reflector } from "@nestjs/core";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { TenantRole } from "src/modules/user-tenant/user-tenant.interface";
import { PermissionMetadata } from "./permissions.types";
import { PERMISSION_KEY } from "./permissions.constant";
import { PERMISSIONS } from "./permissions.config";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const request = ctx.switchToHttp().getRequest<Request>();

    const { resource, action } =
      this.reflector.getAllAndOverride<PermissionMetadata>(PERMISSION_KEY, [
        ctx.getHandler(),
        ctx.getClass(),
      ]) ?? {};

    if (!resource || !action) return true;

    return this.canPerform(request.auth.roles, resource, action);
  }

  canPerform(
    userRoles: TenantRole[],
    resource: keyof typeof PERMISSIONS,
    action: keyof (typeof PERMISSIONS)[typeof resource],
  ): boolean {
    const permission = PERMISSIONS[resource][action];
    if (permission.length === 0) return true; // No roles required, allow access

    return permission.some((role) => userRoles.includes(role));
  }
}
