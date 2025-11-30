import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from "@nestjs/common";
import { Request } from "express";
import { TenantRole } from "../user-tenant/user-tenant.interface";
import {
  AUTH_TENANT_ROLES_KEY,
  SKIP_AUTH_KEY,
  SKIP_AUTH_ROLES_KEY,
  SKIP_AUTH_TENANT_KEY,
} from "./auth.constants";

export const SkipAuth = () => SetMetadata(SKIP_AUTH_KEY, true);
export const SkipAuthTenant = () => SetMetadata(SKIP_AUTH_TENANT_KEY, true);
export const SkipAuthRoles = () => SetMetadata(SKIP_AUTH_ROLES_KEY, true);

export const Public = () => {
  return applyDecorators(SkipAuth(), SkipAuthTenant(), SkipAuthRoles());
};

export const Roles = (roles: TenantRole[]) => {
  return SetMetadata(AUTH_TENANT_ROLES_KEY, roles);
};

export const GetAuth = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    return request.auth;
  },
);
