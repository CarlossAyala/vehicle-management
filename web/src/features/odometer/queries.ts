import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { Tenant } from "../tenant/types";
import type { Operation } from "../operation/types";
import { operationKeys } from "../operation/queries";
import type { Odometer, OdometerFilters } from "./types";
import {
  create,
  getAll,
  getByOperationId,
  getOne,
  remove,
  update,
} from "./api";

export const odometerKeys = {
  key: (tenantId: Tenant["id"]) => {
    return ["odometers", { tenantId }] as const;
  },
  lists: (tenantId: Tenant["id"]) => {
    return [...odometerKeys.key(tenantId), "list"] as const;
  },
  list: (tenantId: Tenant["id"], filters: OdometerFilters = {}) => {
    return [...odometerKeys.lists(tenantId), filters] as const;
  },
  details: (tenantId: Tenant["id"]) => {
    return [...odometerKeys.key(tenantId), "details"] as const;
  },
  detail: (tenantId: Tenant["id"], id: Odometer["id"]) => {
    return [...odometerKeys.details(tenantId), id] as const;
  },
  operation: (tenantId: Tenant["id"], operationId: Operation["id"]) => {
    return [
      ...odometerKeys.details(tenantId),
      "operation",
      operationId,
    ] as const;
  },
};

export const odometersQuery = (
  tenantId: Tenant["id"],
  filters: OdometerFilters,
) => {
  return queryOptions({
    queryKey: odometerKeys.list(tenantId, filters),
    queryFn: getAll,
  });
};

export const odometerQuery = (tenantId: Tenant["id"], id: Odometer["id"]) => {
  return queryOptions({
    queryKey: odometerKeys.detail(tenantId, id),
    queryFn: getOne,
  });
};

export const odometerByOperationQuery = (
  tenantId: Tenant["id"],
  id: Operation["id"],
) => {
  return queryOptions({
    queryKey: odometerKeys.operation(tenantId, id),
    queryFn: getByOperationId,
  });
};

export const useCreateOdometer = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: create,
    onSuccess: ({ operation, odometer }, { tenantId }) => {
      query.setQueryData(
        operationKeys.detail(tenantId, operation.id),
        operation,
      );
      query.setQueryData(
        odometerKeys.operation(tenantId, operation.id),
        odometer,
      );

      return query.invalidateQueries({
        queryKey: odometerKeys.lists(tenantId),
      });
    },
  });
};

export const useUpdateOdometer = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: update,
    onSuccess: ({ operation, odometer }, { tenantId }) => {
      return Promise.all([
        query.invalidateQueries({
          queryKey: operationKeys.detail(tenantId, operation.id),
        }),
        query.invalidateQueries({
          queryKey: odometerKeys.lists(tenantId),
        }),
        query.invalidateQueries({
          queryKey: odometerKeys.detail(tenantId, odometer.id),
        }),
      ]);
    },
  });
};

export const useRemoveOdometer = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: remove,
    onSuccess: ({ operationId, id }, { tenantId }) => {
      query.removeQueries({
        queryKey: operationKeys.detail(tenantId, operationId),
      });
      query.removeQueries({
        queryKey: odometerKeys.detail(tenantId, id),
      });

      return query.invalidateQueries({
        queryKey: odometerKeys.lists(tenantId),
      });
    },
  });
};
