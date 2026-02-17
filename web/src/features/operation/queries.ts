import { queryOptions, skipToken } from "@tanstack/react-query";
import type { Tenant } from "../tenant/types";
import type { Operation, OperationType } from "./types";
import { getAll, getEntity, getOne, stats } from "./api";

export const operationKeys = {
  key: (tenantId: Tenant["id"]) => {
    return ["operations", { tenantId }] as const;
  },
  lists: (tenantId: Tenant["id"]) => {
    return [...operationKeys.key(tenantId), "list"] as const;
  },
  list: (
    tenantId: Tenant["id"],
    filters: {
      type?: OperationType[];
    },
  ) => {
    return [...operationKeys.lists(tenantId), filters] as const;
  },
  details: (tenantId: Tenant["id"]) => {
    return [...operationKeys.key(tenantId), "details"] as const;
  },
  detail: (tenantId: Tenant["id"], id?: Operation["id"]) => {
    return [...operationKeys.details(tenantId), id] as const;
  },
  entity: (tenantId: Tenant["id"], id: Operation["id"]) => {
    return [...operationKeys.detail(tenantId, id), "entity"] as const;
  },
  stats: (tenantId: Tenant["id"]) => {
    return [...operationKeys.key(tenantId), "stats"] as const;
  },
};

export const operationsQuery = (
  tenantId: Tenant["id"],
  filters: object = {},
) => {
  return queryOptions({
    queryKey: operationKeys.list(tenantId, filters),
    queryFn: getAll,
  });
};

export const operationQuery = (
  tenantId: Tenant["id"],
  id?: Operation["id"],
) => {
  return queryOptions({
    queryKey: operationKeys.detail(tenantId, id),
    queryFn: id ? getOne : skipToken,
  });
};

export const operationEntityQuery = (
  tenantId: Tenant["id"],
  id: Operation["id"],
) => {
  return queryOptions({
    queryKey: operationKeys.entity(tenantId, id),
    queryFn: getEntity,
  });
};

export const operationStatsQuery = (tenantId: Tenant["id"]) => {
  return queryOptions({
    queryKey: operationKeys.stats(tenantId),
    queryFn: stats,
  });
};
