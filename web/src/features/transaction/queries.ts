import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { Tenant } from "../tenant/types";
import type { Transaction } from "./types";
import { create, getAll, getOne, remove, update } from "./api";
import { operationKeys } from "../operation/queries";
import { odometerKeys } from "../odometer/queries";

export const transactionKeys = {
  key: (tenantId: Tenant["id"]) => {
    return ["transactions", { tenantId }] as const;
  },
  lists: (tenantId: Tenant["id"]) => {
    return [...transactionKeys.key(tenantId), "list"] as const;
  },
  list: (tenantId: Tenant["id"], filters: object = {}) => {
    return [...transactionKeys.lists(tenantId), filters] as const;
  },
  details: (tenantId: Tenant["id"]) => {
    return [...transactionKeys.key(tenantId), "details"] as const;
  },
  detail: (tenantId: Tenant["id"], id: Transaction["id"]) => {
    return [...transactionKeys.details(tenantId), id] as const;
  },
};

export const transactionsQuery = (tenantId: Tenant["id"], filters = {}) => {
  return queryOptions({
    queryKey: transactionKeys.list(tenantId, filters),
    queryFn: getAll,
  });
};

export const transactionQuery = (
  tenantId: Tenant["id"],
  id: Transaction["id"],
) => {
  return queryOptions({
    queryKey: transactionKeys.detail(tenantId, id),
    queryFn: getOne,
  });
};

export const useCreateTransaction = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: create,
    onSuccess: ({ operation, transaction, items, odometer }, { tenantId }) => {
      query.setQueryData(
        transactionKeys.detail(tenantId, operation.id),
        operation,
      );

      Object.assign(transaction, { items });
      query.setQueryData(
        transactionKeys.detail(tenantId, transaction.id),
        transaction,
      );

      const promises = [
        query.invalidateQueries({
          queryKey: operationKeys.lists(tenantId),
        }),
        query.invalidateQueries({
          queryKey: transactionKeys.lists(tenantId),
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

export const useUpdateTransaction = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: update,
    onSuccess: ({ operation, transaction, items, odometer }, { tenantId }) => {
      query.setQueryData(
        operationKeys.detail(tenantId, operation.id),
        operation,
      );
      query.setQueryData(
        transactionQuery(tenantId, transaction.id).queryKey,
        (old) => {
          if (!old) return;

          Object.assign(transaction, { items });
          return {
            ...old,
            ...transaction,
          };
        },
      );

      const promises = [
        query.invalidateQueries({
          queryKey: operationKeys.lists(tenantId),
        }),
        query.invalidateQueries({
          queryKey: transactionKeys.lists(tenantId),
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

export const useRemoveTransaction = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: remove,
    onSuccess: ({ operationId, id, odometerId }, { tenantId }) => {
      query.removeQueries({
        queryKey: transactionKeys.detail(tenantId, id),
      });
      query.removeQueries({
        queryKey: operationKeys.detail(tenantId, operationId),
      });

      const promises = [
        query.invalidateQueries({
          queryKey: operationKeys.lists(tenantId),
        }),
        query.invalidateQueries({
          queryKey: transactionKeys.lists(tenantId),
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
