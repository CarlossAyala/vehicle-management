import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { Tenant, UserTenant } from "./types";
import {
  createTenant,
  getTenant,
  getTenants,
  getUserTenant,
  getUserTenants,
} from "./api";

export const tenantKeys = {
  key: () => ["tenants"] as const,
  list: () => [...tenantKeys.key(), "list"] as const,
  detail: (id: Tenant["id"]) => {
    return [...tenantKeys.key(), "detail", id] as const;
  },
};

export const userTenantKeys = {
  key: () => ["user-tenants"] as const,
  list: () => [...userTenantKeys.key(), "list"] as const,
  detail: (id: Tenant["id"]) => {
    return [...userTenantKeys.key(), "detail", id] as const;
  },
};

export const tenantQuery = (id: Tenant["id"]) => {
  return queryOptions({
    queryKey: tenantKeys.detail(id),
    queryFn: () => getTenant(id),
  });
};

export const tenantsQuery = queryOptions({
  queryKey: tenantKeys.list(),
  queryFn: getTenants,
});

export const userTenantQuery = (id: UserTenant["id"]) => {
  return queryOptions({
    queryKey: userTenantKeys.detail(id),
    queryFn: () => getUserTenant(id),
  });
};

export const userTenantsQuery = queryOptions({
  queryKey: userTenantKeys.list(),
  queryFn: getUserTenants,
});

export const useCreateTenant = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: createTenant,
    onSuccess: ({ tenant, userTenant }) => {
      query.setQueryData(tenantQuery(tenant.id).queryKey, tenant);
      query.setQueryData(tenantsQuery.queryKey, (previous = []) => {
        return [...previous, tenant];
      });

      query.setQueryData(userTenantQuery(userTenant.id).queryKey, userTenant);
      query.setQueryData(userTenantsQuery.queryKey, (previous = []) => {
        return [...previous, userTenant];
      });
    },
  });
};
