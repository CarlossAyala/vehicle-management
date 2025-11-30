import { queryOptions, skipToken } from "@tanstack/react-query";
import type { Tenant } from "../tenant/types";
import type { User } from "./types";
import { getOne } from "./api";

export const userKeys = {
  key: (tenantId: Tenant["id"]) => {
    return ["users", { tenantId }] as const;
  },
  lists: (tenantId: Tenant["id"]) => {
    return [...userKeys.key(tenantId), "list"] as const;
  },
  // TODO: users should have its own filter
  list: (tenantId: Tenant["id"], filters: object) => {
    return [...userKeys.lists(tenantId), filters] as const;
  },
  details: (tenantId: Tenant["id"]) => {
    return [...userKeys.key(tenantId), "detail"] as const;
  },
  detail: (tenantId: Tenant["id"], id?: User["id"]) => {
    return [...userKeys.details(tenantId), id] as const;
  },
};

export const userQuery = (tenantId: Tenant["id"], id?: User["id"]) => {
  return queryOptions({
    queryKey: userKeys.detail(tenantId, id),
    queryFn: id ? getOne : skipToken,
  });
};
