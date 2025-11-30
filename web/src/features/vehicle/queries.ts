import {
  keepPreviousData,
  queryOptions,
  skipToken,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { Tenant } from "../tenant/types";
import type {
  CreateVehicleProps,
  UpdateVehicleProps,
  Vehicle,
  VehicleFilter,
  VehicleProps,
} from "./types";
import { create, getAll, getOne, remove, update } from "./api";

export const vehicleKeys = {
  key: (tenantId: Tenant["id"]) => {
    return ["vehicles", { tenantId }] as const;
  },
  lists: (tenantId: Tenant["id"]) => {
    return [...vehicleKeys.key(tenantId), "list"] as const;
  },
  list: (tenantId: Tenant["id"], filters: VehicleFilter = {}) => {
    return [...vehicleKeys.lists(tenantId), filters] as const;
  },
  details: (tenantId: Tenant["id"]) => {
    return [...vehicleKeys.key(tenantId), "details"] as const;
  },
  detail: (tenantId: Tenant["id"], id?: Vehicle["id"]) => {
    return [...vehicleKeys.details(tenantId), id] as const;
  },
};

export const vehiclesQuery = (
  tenantId: Tenant["id"],
  filters: VehicleFilter = {},
) => {
  return queryOptions({
    queryKey: vehicleKeys.list(tenantId, filters),
    queryFn: getAll,
    placeholderData: keepPreviousData,
  });
};

export const vehicleQuery = (tenantId: Tenant["id"], id?: Vehicle["id"]) => {
  return queryOptions({
    queryKey: vehicleKeys.detail(tenantId, id),
    queryFn: id ? getOne : skipToken,
  });
};

export const vehicleSuspenseQuery = (
  tenantId: Tenant["id"],
  id: Vehicle["id"],
) => {
  return queryOptions({
    queryKey: vehicleKeys.detail(tenantId, id),
    queryFn: getOne,
  });
};

export const useCreateVehicle = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVehicleProps) => create(data),
    onSuccess: async (vehicle, { tenantId }) => {
      query.setQueryData(vehicleQuery(tenantId, vehicle.id).queryKey, vehicle);

      await query.resetQueries({
        queryKey: vehicleKeys.lists(tenantId),
      });
    },
  });
};

export const useUpdateVehicle = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateVehicleProps) => update(data),
    onSuccess: async (vehicle, { tenantId }) => {
      query.setQueryData(vehicleQuery(tenantId, vehicle.id).queryKey, vehicle);
      await query.resetQueries({
        queryKey: vehicleKeys.lists(tenantId),
      });
    },
  });
};

export const useRemoveVehicle = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: (data: VehicleProps) => remove(data),
    onSuccess: async (_, { tenantId, id }) => {
      query.removeQueries({
        queryKey: vehicleQuery(tenantId, id).queryKey,
      });
      await query.resetQueries({
        queryKey: vehicleKeys.lists(tenantId),
      });
    },
  });
};
