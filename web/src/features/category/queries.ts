import { queryOptions, skipToken } from "@tanstack/react-query";
import type { Tenant } from "../tenant/types";
import type { Category } from "./types";
import { getAll, getOne } from "./api";
import { OperationTypes } from "../operation/types";

export const categoryKeys = {
  key: (tenantId: Tenant["id"]) => {
    return ["categories", { tenantId }] as const;
  },
  lists: (tenantId: Tenant["id"]) => {
    return [...categoryKeys.key(tenantId), "list"] as const;
  },
  list: (tenantId: Tenant["id"]) => {
    return [...categoryKeys.lists(tenantId)] as const;
  },
  details: (tenantId: Tenant["id"]) => {
    return [...categoryKeys.key(tenantId), "detail"] as const;
  },
  detail: (tenantId: Tenant["id"], id?: Category["id"]) => {
    return [...categoryKeys.details(tenantId), id] as const;
  },
} as const;

export const fuelCategoriesQuery = (tenantId: Tenant["id"]) => {
  return queryOptions({
    queryKey: categoryKeys.list(tenantId),
    queryFn: getAll,
    select: (categories) => {
      return categories.filter(
        (category) => category.source === OperationTypes.FUEL,
      );
    },
  });
};

export const categoriesQuery = (tenantId: Tenant["id"]) => {
  return queryOptions({
    queryKey: categoryKeys.list(tenantId),
    queryFn: getAll,
  });
};

export const categoryQuery = (tenantId: Tenant["id"], id: Category["id"]) => {
  return queryOptions({
    queryKey: categoryKeys.detail(tenantId, id),
    queryFn: id ? getOne : skipToken,
  });
};
