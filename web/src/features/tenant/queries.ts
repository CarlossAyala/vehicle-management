import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import type { Tenant, UserTenant } from "./types";
import {
  create,
  getOne,
  getAll,
  getUserTenant,
  getUserTenants,
  getMembers,
  updateRoles,
  removeMember,
} from "./api";
import { profileQuery } from "../auth/queries";
import { useNavigate } from "@tanstack/react-router";

/**
 * #TODOs
 * - add pagination
 * - add `lists`to keys and update list invalidations
 * - add filters to `lists`
 */

export const tenantKeys = {
  key: (tenantId: Tenant["id"] | undefined = undefined) => {
    return ["tenants", { tenantId }] as const;
  },
  list: () => [...tenantKeys.key(), "list"] as const,
  detail: (id: Tenant["id"]) => {
    return [...tenantKeys.key(), "detail", id] as const;
  },
  members: (tenantId: Tenant["id"]) => {
    return [...tenantKeys.key(tenantId), "members"] as const;
  },
};

export const userTenantKeys = {
  key: () => ["user-tenants"] as const,
  list: () => [...userTenantKeys.key(), "list"] as const,
  detail: (id: Tenant["id"]) => {
    return [...userTenantKeys.key(), "detail", id] as const;
  },
};

export const membersQuery = (tenantId: Tenant["id"]) => {
  return queryOptions({
    queryKey: tenantKeys.members(tenantId),
    queryFn: getMembers,
  });
};

export const tenantQuery = (id: Tenant["id"]) => {
  return queryOptions({
    queryKey: tenantKeys.detail(id),
    queryFn: () => getOne(id),
  });
};

export const tenantsQuery = queryOptions({
  queryKey: tenantKeys.list(),
  queryFn: getAll,
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
    mutationFn: create,
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

export const useUpdateRoles = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: updateRoles,
    onSuccess: (roles, { tenantId, userId }) => {
      query.setQueryData(membersQuery(tenantId).queryKey, (old) => {
        if (!old) return;

        return old.map((m) =>
          m.id === userId
            ? {
                ...m,
                roles,
              }
            : m,
        );
      });
    },
  });
};

export const useRemoveMember = () => {
  const query = useQueryClient();
  const { data: auth } = useSuspenseQuery(profileQuery);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: removeMember,
    onSuccess: async (_, { tenantId, userId }) => {
      if (auth?.id === userId) {
        await query.invalidateQueries({
          queryKey: tenantKeys.list(),
        });

        query.removeQueries({ queryKey: tenantKeys.key(tenantId) });

        navigate({ to: "/tenants" });
      }

      query.setQueryData(membersQuery(tenantId).queryKey, (old) => {
        if (!old) return;
        return old.filter((m) => m.id !== userId);
      });
    },
  });
};
