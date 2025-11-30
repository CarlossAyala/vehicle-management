import type { QueryFunctionContext } from "@tanstack/react-query";
import { API_URL, AUTH_HEADER_TENANT_ID_NAME } from "@/lib/utils";
import type {
  CreateVehicleProps,
  VehicleProps,
  UpdateVehicleProps,
  Vehicle,
} from "./types";
import type { vehicleKeys } from "./queries";
import type { Pagination } from "@/lib/filters";
import qs from "query-string";
import { QUERY_STRING_OPTIONS } from "@/lib/query-string";

export const create = async ({
  tenantId,
  values,
}: CreateVehicleProps): Promise<Vehicle> => {
  const res = await fetch(`${API_URL}/vehicles`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    throw new Error("Failed to create vehicle");
  }

  return res.json();
};

export const getAll = async ({
  queryKey: [, { tenantId }, , filters],
}: QueryFunctionContext<ReturnType<(typeof vehicleKeys)["list"]>>): Promise<
  Pagination<Vehicle>
> => {
  const query = qs.stringify(filters, QUERY_STRING_OPTIONS);
  const url = query ? `${API_URL}/vehicles?${query}` : `${API_URL}/vehicles`;

  const res = await fetch(url, {
    credentials: "include",
    headers: {
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId!,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch vehicles");
  }

  return res.json();
};

export const getOne = async ({
  queryKey: [, { tenantId }, , id],
}: QueryFunctionContext<
  ReturnType<(typeof vehicleKeys)["detail"]>
>): Promise<Vehicle> => {
  const res = await fetch(`${API_URL}/vehicles/${id}`, {
    credentials: "include",
    headers: {
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId!,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch vehicle");
  }

  return res.json();
};

export const update = async ({
  tenantId,
  id,
  values,
}: UpdateVehicleProps): Promise<Vehicle> => {
  const res = await fetch(`${API_URL}/vehicles/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    throw new Error("Failed to update vehicle");
  }

  return res.json();
};

export const remove = async ({ tenantId, id }: VehicleProps): Promise<void> => {
  const res = await fetch(`${API_URL}/vehicles/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete vehicle");
  }
};
