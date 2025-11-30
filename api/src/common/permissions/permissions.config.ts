import { TenantRole } from "src/modules/user-tenant/user-tenant.interface";

export const PERMISSIONS = {
  TENANTS: {
    CREATE: [TenantRole],
    READ: [],
    UPDATE: [],
    DELETE: [],
    ASSIGN_DRIVER: [],
  },
  USERS_TENANTS: {
    CREATE: [],
    READ: [],
    UPDATE: [],
    DELETE: [],
    ASSIGN_DRIVER: [],
  },
  OPERATIONS: {
    CREATE: [],
    READ: [],
    UPDATE: [],
    DELETE: [],
    ASSIGN_DRIVER: [],
  },
  VEHICLES: {
    CREATE: [],
    READ: [],
    UPDATE: [],
    DELETE: [],
    ASSIGN_DRIVER: [],
  },
  FUEL: {
    CREATE: [],
    READ: [],
    UPDATE: [],
    DELETE: [],
    ASSIGN_DRIVER: [],
  },
  CATEGORIES: {
    CREATE: [],
    READ: [],
    UPDATE: [],
    DELETE: [],
    ASSIGN_DRIVER: [],
  },
  ODOMETER: {
    CREATE: [],
    READ: [],
    UPDATE: [],
    DELETE: [],
    ASSIGN_DRIVER: [],
  },
  SERVICE: {
    CREATE: [],
    READ: [],
    UPDATE: [],
    DELETE: [],
    ASSIGN_DRIVER: [],
  },
  TRANSACTION: {
    CREATE: [],
    READ: [],
    UPDATE: [],
    DELETE: [],
    ASSIGN_DRIVER: [],
  },
  INVITATION: {
    CREATE: [],
    READ: [],
    UPDATE: [],
    DELETE: [],
    ASSIGN_DRIVER: [],
  },
};
