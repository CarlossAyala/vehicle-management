import type { QueryFunctionContext } from "@tanstack/react-query";
import qs from "query-string";
import { API_URL, AUTH_HEADER_TENANT_ID_NAME } from "@/lib/utils";
import { QUERY_STRING_OPTIONS } from "@/lib/query-string";
import type {
  Fuel,
  CreateFuelProps,
  FuelResponse,
  UpdateFuelProps,
  RemoveFuelProps,
  FuelRemoveResponse,
} from "./types";
import type { fuelKeys } from "./queries";
import type { Pagination } from "@/lib/filters";

export const create = async ({
  tenantId,
  values,
}: CreateFuelProps): Promise<FuelResponse> => {
  const res = await fetch(`${API_URL}/fuel`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    throw new Error("Failed to create fuel");
  }

  return res.json();
};

export const getAll = async ({
  queryKey: [, { tenantId }, , filters],
}: QueryFunctionContext<ReturnType<(typeof fuelKeys)["list"]>>): Promise<
  Pagination<Fuel>
> => {
  const query = qs.stringify(filters, QUERY_STRING_OPTIONS);
  const url = query ? `${API_URL}/fuel?${query}` : `${API_URL}/fuel`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch fuel");
  }

  return res.json();
};

export const getOne = async ({
  queryKey: [, { tenantId }, , id],
}: QueryFunctionContext<
  ReturnType<(typeof fuelKeys)["detail"]>
>): Promise<Fuel> => {
  const res = await fetch(`${API_URL}/fuel/${id}`, {
    method: "GET",
    credentials: "include",
    headers: {
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch fuel");
  }

  return res.json();
};

export const stats = async ({
  queryKey,
}: QueryFunctionContext<ReturnType<(typeof fuelKeys)["stats"]>>): Promise<{
  count: number;
  quantity: number;
  amount: number;
}> => {
  const [, { tenantId }] = queryKey;
  const url = `${API_URL}/fuel/stats`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch fuel stats");
  }

  return res.json();
};

export const update = async ({
  tenantId,
  id,
  values,
}: UpdateFuelProps): Promise<FuelResponse> => {
  const res = await fetch(`${API_URL}/fuel/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    throw new Error("Failed to update fuel");
  }

  return res.json();
};

export const remove = async ({
  tenantId,
  id,
}: RemoveFuelProps): Promise<FuelRemoveResponse> => {
  const res = await fetch(`${API_URL}/fuel/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete fuel");
  }

  return res.json();
};
