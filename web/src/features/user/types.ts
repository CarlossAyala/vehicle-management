import type { UserTenant } from "../tenant/types";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;

  fullName: string;
  initials: string;

  roles?: UserTenant[];
}
