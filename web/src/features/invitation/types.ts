import type { User } from "../auth/types";
import type { Tenant, TenantRole } from "../tenant/types";

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
  createdAt: string;
  updatedAt: string;
  expiredAt: string;
}
