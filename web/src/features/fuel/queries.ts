import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { Tenant } from "../tenant/types";
import { operationKeys } from "../operation/queries";
import { odometerKeys } from "../odometer/queries";
import type { Fuel, FuelFilters } from "./types";
import { create, getAll, getOne, remove, update } from "./api";

export const fuelKeys = {
  key: (tenantId: Tenant["id"]) => {
    return ["fuel", { tenantId }] as const;
  },
  lists: (tenantId: Tenant["id"]) => {
    return [...fuelKeys.key(tenantId), "list"] as const;
  },
  list: (tenantId: Tenant["id"], filters: FuelFilters) => {
    return [...fuelKeys.lists(tenantId), filters] as const;
  },
  details: (tenantId: Tenant["id"]) => {
    return [...fuelKeys.key(tenantId), "detail"] as const;
  },
  detail: (tenantId: Tenant["id"], id: Fuel["id"]) => {
    return [...fuelKeys.details(tenantId), id] as const;
  },
};

export const fuelsQuery = (tenantId: Tenant["id"], filters: FuelFilters) => {
  return queryOptions({
    queryKey: fuelKeys.list(tenantId, filters),
    queryFn: getAll,
  });
};

export const fuelQuery = (tenantId: Tenant["id"], id: Fuel["id"]) => {
  return queryOptions({
    queryKey: fuelKeys.detail(tenantId, id),
    queryFn: getOne,
  });
};

export const fuelSuspenseQuery = (tenantId: Tenant["id"], id: Fuel["id"]) => {
  return queryOptions({
    queryKey: fuelKeys.detail(tenantId, id),
    queryFn: getOne,
  });
};

export const useCreateFuel = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: create,
    onSuccess: ({ fuel, operation, odometer }, { tenantId }) => {
      query.setQueryData(fuelKeys.detail(tenantId, fuel.id), fuel);
      query.setQueryData(
        operationKeys.detail(tenantId, operation.id),
        operation,
      );
      if (odometer) {
        query.setQueryData(
          odometerKeys.operation(tenantId, operation.id),
          odometer,
        );
      }

      return query.invalidateQueries({
        queryKey: fuelKeys.lists(tenantId),
      });
    },
  });
};

export const useUpdateFuel = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: update,
    onSuccess: ({ fuel, operation, odometer }, { tenantId }) => {
      query.setQueryData(fuelKeys.detail(tenantId, fuel.id), fuel);
      query.setQueryData(
        operationKeys.detail(tenantId, operation.id),
        operation,
      );

      if (odometer) {
        query.setQueryData(
          odometerKeys.operation(tenantId, operation.id),
          odometer,
        );
      } else {
        query.removeQueries({
          queryKey: odometerKeys.operation(tenantId, operation.id),
        });
      }

      return Promise.all([
        query.invalidateQueries({
          queryKey: fuelKeys.lists(tenantId),
        }),
        query.invalidateQueries({
          queryKey: odometerKeys.lists(tenantId),
        }),
      ]);
    },
  });
};

export const useRemoveFuel = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: remove,
    onSuccess: ({ operationId, id, odometerId }, { tenantId }) => {
      query.removeQueries({
        queryKey: fuelKeys.detail(tenantId, id),
      });
      query.removeQueries({
        queryKey: operationKeys.detail(tenantId, operationId),
      });
      if (odometerId) {
        query.removeQueries({
          queryKey: odometerKeys.detail(tenantId, operationId),
        });
      }

      return query.invalidateQueries({
        queryKey: fuelKeys.lists(tenantId),
      });
    },
  });
};
