import type z from "zod";
import type { User } from "../user/types";
import type { createTenantSchema, updateRolesSchema } from "./schemas";

export const TenantRoles = {
  OWNER: "owner",
  ADMIN: "admin",
  FLEET_MANAGER: "fleet_manager",
  DRIVER: "driver",
  MEMBER: "member",
} as const;

export type TenantRole = (typeof TenantRoles)[keyof typeof TenantRoles];

export const TenantTypes = {
  PERSONAL: "personal",
  FLEET: "fleet",
} as const;

export type TenantType = (typeof TenantTypes)[keyof typeof TenantTypes];

export interface Tenant {
  id: string;
  name: string;
  description: string;
  type: TenantType;
  createdAt: string;
  updatedAt: string;
}

export interface UserTenant {
  id: string;
  role: TenantRole;
  userId: User["id"];
  tenantId: Tenant["id"];
  createdAt: string;
  updatedAt: string;
}

export type CreateTenantDto = z.infer<typeof createTenantSchema>;
export type UpdateRoles = z.infer<typeof updateRolesSchema>;
