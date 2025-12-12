import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { Tenant } from "../tenant/types";
import { operationKeys } from "../operation/queries";
import { odometerKeys } from "../odometer/queries";
import type { Service } from "./types";
import { create, getAll, getOne, remove, update } from "./api";

// TODO: add filters
export const serviceKeys = {
  key: (tenantId: Tenant["id"]) => {
    return ["services", { tenantId }] as const;
  },
  lists: (tenantId: Tenant["id"]) => {
    return [...serviceKeys.key(tenantId), "list"] as const;
  },
  list: (tenantId: Tenant["id"], filters: object = {}) => {
    return [...serviceKeys.lists(tenantId), filters] as const;
  },
  details: (tenantId: Tenant["id"]) => {
    return [...serviceKeys.key(tenantId), "details"] as const;
  },
  detail: (tenantId: Tenant["id"], id: Service["id"]) => {
    return [...serviceKeys.details(tenantId), id] as const;
  },
};

export const servicesQuery = (tenantId: Tenant["id"], filters = {}) => {
  return queryOptions({
    queryKey: serviceKeys.list(tenantId, filters),
    queryFn: getAll,
  });
};

export const serviceQuery = (tenantId: Tenant["id"], id: Service["id"]) => {
  return queryOptions({
    queryKey: serviceKeys.detail(tenantId, id),
    queryFn: getOne,
  });
};

export const useCreateService = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: create,
    onSuccess: ({ operation, service, items, odometer }, { tenantId }) => {
      query.setQueryData(
        operationKeys.detail(tenantId, operation.id),
        operation,
      );

      Object.assign(service, { items });
      query.setQueryData(serviceKeys.detail(tenantId, service.id), service);

      const promises = [
        query.invalidateQueries({
          queryKey: operationKeys.lists(tenantId),
        }),
        query.invalidateQueries({
          queryKey: serviceKeys.lists(tenantId),
        }),
      ];

      if (odometer) {
        query.setQueryData(
          odometerKeys.operation(tenantId, operation.id),
          odometer,
        );

        promises.push(
          query.invalidateQueries({
            queryKey: odometerKeys.lists(tenantId),
          }),
        );
      }

      return Promise.all(promises);
    },
  });
};

export const useUpdateService = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: update,
    onSuccess: ({ operation, service, items, odometer }, { tenantId }) => {
      query.setQueryData(
        operationKeys.detail(tenantId, operation.id),
        operation,
      );
      query.setQueryData(serviceQuery(tenantId, service.id).queryKey, (old) => {
        if (!old) return;

        Object.assign(service, { items });
        return {
          ...old,
          ...service,
        };
      });

      const promises = [
        query.invalidateQueries({
          queryKey: operationKeys.lists(tenantId),
        }),
        query.invalidateQueries({
          queryKey: serviceKeys.lists(tenantId),
        }),
      ];

      if (odometer) {
        query.setQueryData(
          odometerKeys.operation(tenantId, operation.id),
          odometer,
        );
        promises.push(
          query.invalidateQueries({
            queryKey: odometerKeys.lists(tenantId),
          }),
        );
      }

      return Promise.all(promises);
    },
  });
};

export const useRemoveService = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: remove,
    onSuccess: ({ operationId, id, odometerId }, { tenantId }) => {
      query.removeQueries({
        queryKey: serviceKeys.detail(tenantId, id),
      });
      query.removeQueries({
        queryKey: operationKeys.detail(tenantId, operationId),
      });

      const promises = [
        query.invalidateQueries({
          queryKey: operationKeys.lists(tenantId),
        }),
        query.invalidateQueries({
          queryKey: serviceKeys.lists(tenantId),
        }),
      ];

      if (odometerId) {
        query.removeQueries({
          queryKey: odometerKeys.detail(tenantId, operationId),
        });
        promises.push(
          query.invalidateQueries({
            queryKey: odometerKeys.lists(tenantId),
          }),
        );
      }

      return Promise.all(promises);
    },
  });
};
