import type { User } from "../user/types";
import type { Tenant, TenantRole } from "../tenant/types";
import type z from "zod";
import type { acceptInvitationSchema, createInvitationSchema } from "./schemas";

export const InvitationStatus = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
} as const;

export type InvitationStatusType =
  (typeof InvitationStatus)[keyof typeof InvitationStatus];

export interface Invitation {
  id: string;
  email: string;
  token: string;
  role: TenantRole;
  status: InvitationStatusType;
  authorId: User["id"];
  tenantId: Tenant["id"];
  expiredAt: string;
  createdAt: string;
  updatedAt: string;

  tenant?: Tenant;
}

export type CreateInvitation = z.infer<typeof createInvitationSchema>;
export type AcceptInvitation = z.infer<typeof acceptInvitationSchema>;
