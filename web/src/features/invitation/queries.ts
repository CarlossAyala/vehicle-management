import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { Tenant } from "../tenant/types";
import type { Invitation } from "./types";
import {
  accept,
  acceptPublic,
  create,
  getAllTenant,
  getAllUser,
  getOneId,
  getOneToken,
  reject,
  remove,
} from "./api";
import { tenantKeys } from "../tenant/queries";

export const invitationKeys = {
  key: (tenantId: Tenant["id"] | undefined = undefined) => {
    return ["invitations", { tenantId }] as const;
  },
  lists: (tenantId?: Tenant["id"]) => {
    return [...invitationKeys.key(tenantId), "list"] as const;
  },
  list: (tenantId?: Tenant["id"], filters: object = {}) => {
    return [...invitationKeys.lists(tenantId), filters] as const;
  },
  details: (tenantId?: Tenant["id"]) => {
    return [...invitationKeys.key(tenantId), "detail"] as const;
  },
  detail: (
    tenantId: Tenant["id"] | undefined = undefined,
    id: Invitation["id"],
  ) => {
    return [...invitationKeys.details(tenantId), id] as const;
  },
  token: (token: Invitation["token"]) => {
    return [...invitationKeys.key(), "token", token] as const;
  },
};

export const invitationsTenantQuery = (
  tenantId: Tenant["id"] | undefined = undefined,
  filters: object,
) => {
  return queryOptions({
    queryKey: invitationKeys.list(tenantId, filters),
    queryFn: getAllTenant,
  });
};

export const invitationsUserQuery = (filters: object) => {
  return queryOptions({
    queryKey: invitationKeys.list(undefined, filters),
    queryFn: getAllUser,
  });
};

export const invitationIdQuery = (
  tenantId: Tenant["id"],
  id: Invitation["id"],
) => {
  return queryOptions({
    queryKey: invitationKeys.detail(tenantId, id),
    queryFn: getOneId,
  });
};

export const invitationTokenQuery = (token: Invitation["token"]) => {
  return queryOptions({
    queryKey: invitationKeys.token(token),
    queryFn: getOneToken,
  });
};

export const useCreateInvitation = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: create,
    onSuccess: (invitation, { tenantId }) => {
      query.setQueryData(
        invitationKeys.detail(tenantId, invitation.id),
        invitation,
      );

      const promises = [
        query.invalidateQueries({
          queryKey: invitationKeys.lists(tenantId),
        }),
      ];

      return Promise.all(promises);
    },
  });
};

export const useAcceptInvitation = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: accept,
    onSuccess: ({ invitation, tenant }, { id }) => {
      query.setQueryData(invitationKeys.detail(undefined, id), invitation);
      query.setQueryData(tenantKeys.detail(tenant.id), tenant);

      const promises = [
        query.invalidateQueries({
          queryKey: invitationKeys.lists(),
        }),
        query.invalidateQueries({
          queryKey: tenantKeys.list(),
        }),
      ];

      return Promise.all(promises);
    },
  });
};

export const useAcceptPublicInvitation = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: acceptPublic,
    onSuccess: ({ token }) => {
      const promises = [
        query.invalidateQueries({
          queryKey: invitationKeys.token(token),
        }),
      ];

      return Promise.all(promises);
    },
  });
};

export const useRejectInvitation = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: reject,
    onSuccess: (invitation, { id }) => {
      query.setQueryData(invitationKeys.detail(undefined, id), invitation);

      const promises = [
        query.invalidateQueries({
          queryKey: invitationKeys.lists(),
        }),
      ];

      return Promise.all(promises);
    },
  });
};

export const useRemoveInvitation = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: remove,
    onSuccess: (_, { tenantId, id }) => {
      query.removeQueries({ queryKey: invitationKeys.detail(tenantId, id) });

      const promises = [
        query.invalidateQueries({
          queryKey: invitationKeys.lists(tenantId),
        }),
      ];

      return Promise.all(promises);
    },
  });
};
