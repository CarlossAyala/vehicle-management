import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { Tenant } from "../tenant/types";
import { operationKeys } from "../operation/queries";
import { odometerKeys } from "../odometer/queries";
import type { Service } from "./types";
import {
  create,
  createItem,
  getAll,
  getOne,
  remove,
  removeItem,
  update,
  updateItem,
} from "./api";

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
      query.setQueryData(serviceKeys.detail(tenantId, service.id), {
        service,
        items,
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

export const useCreateServiceItem = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: createItem,
    onSuccess: (item, { tenantId, id }) => {
      query.setQueryData(serviceQuery(tenantId, id).queryKey, (old) => {
        if (!old) return;

        return {
          ...old,
          items: [...old.items, item],
        };
      });
    },
  });
};

export const useUpdateService = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: update,
    onSuccess: ({ operation, service, odometer }, { tenantId }) => {
      query.setQueryData(
        operationKeys.detail(tenantId, operation.id),
        operation,
      );
      query.setQueryData(serviceQuery(tenantId, service.id).queryKey, (old) => {
        if (!old) return;

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

export const useUpdateServiceItem = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: updateItem,
    onSuccess: (item, { tenantId, id, itemId }) => {
      query.setQueryData(serviceQuery(tenantId, id).queryKey, (old) => {
        if (!old) return;

        return {
          ...old,
          items: old.items.map((i) => {
            if (i.id === itemId) {
              return item;
            }

            return i;
          }),
        };
      });

      // TODO: Check if in service table, the total get the update
      // otherwise, we will need to invalidated
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

export const useRemoveServiceItem = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: removeItem,
    onSuccess: (_, { tenantId, id, itemId }) => {
      query.setQueryData(serviceQuery(tenantId, id).queryKey, (old) => {
        if (!old) return;

        return {
          ...old,
          items: old.items.filter((i) => i.id !== itemId),
        };
      });

      // TODO: check useUpdateServiceItem
    },
  });
};
