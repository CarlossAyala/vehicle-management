import { User } from "../user/entities/user.entity";
import { Tenant } from "../tenants/entities/tenant.entity";
import { UserTenant } from "../user-tenant/entities/user-tenant.entity";
import { Session } from "../sessions/entities/session.entity";

export interface AuthData {
  userId?: User["id"];
  sessionId?: Session["id"];
  tenantId?: Tenant["id"];
  roles: UserTenant["role"][];
}
