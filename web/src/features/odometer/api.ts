import qs from "query-string";
import type { QueryFunctionContext } from "@tanstack/react-query";
import { API_URL, AUTH_HEADER_TENANT_ID_NAME } from "@/lib/utils";
import type { Pagination } from "@/lib/filters";
import { QUERY_STRING_OPTIONS } from "@/lib/query-string";
import type { Operation } from "../operation/types";
import type {
  CreateOdometerProps,
  Odometer,
  OdometerResponse,
  RemoveOdometerProps,
  UpdateOdometerProps,
} from "./types";
import type { odometerKeys } from "./queries";

export const create = async ({
  tenantId,
  values,
}: CreateOdometerProps): Promise<OdometerResponse> => {
  const res = await fetch(`${API_URL}/odometers`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    throw new Error("Failed to create odometer");
  }

  return res.json();
};

export const getAll = async ({
  queryKey: [, { tenantId }, , filters],
}: QueryFunctionContext<ReturnType<(typeof odometerKeys)["list"]>>): Promise<
  Pagination<Odometer>
> => {
  const query = qs.stringify(filters, QUERY_STRING_OPTIONS);
  const url = query ? `${API_URL}/odometers?${query}` : `${API_URL}/odometers`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch odometers");
  }

  return res.json();
};

export const stats = async ({
  queryKey,
}: QueryFunctionContext<ReturnType<(typeof odometerKeys)["stats"]>>): Promise<{
  total: number;
}> => {
  const [, { tenantId }] = queryKey;

  const res = await fetch(`${API_URL}/odometers/stats`, {
    method: "GET",
    credentials: "include",
    headers: {
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch odometer stats");
  }

  return res.json();
};

export const getByOperationId = async ({
  queryKey: [, { tenantId }, , , operationId],
}: QueryFunctionContext<
  ReturnType<(typeof odometerKeys)["operation"]>
>): Promise<Odometer | null> => {
  const res = await fetch(`${API_URL}/odometers/by-operation/${operationId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to get odometer");
  }

  const result = await res.text();

  return result.length ? JSON.parse(result) : null;
};

export const getOne = async ({
  queryKey: [, { tenantId }, , id],
}: QueryFunctionContext<
  ReturnType<(typeof odometerKeys)["detail"]>
>): Promise<Odometer> => {
  const res = await fetch(`${API_URL}/odometers/${id}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to get odometer");
  }

  return res.json();
};

export const update = async ({
  tenantId,
  id,
  values,
}: UpdateOdometerProps): Promise<OdometerResponse> => {
  const res = await fetch(`${API_URL}/odometers/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    throw new Error("Failed to update odometer");
  }

  return res.json();
};

export const remove = async ({
  tenantId,
  id,
}: RemoveOdometerProps): Promise<{
  operationId: Operation["id"];
  id: Odometer["id"];
}> => {
  const res = await fetch(`${API_URL}/odometers/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete odometer");
  }

  return res.json();
};
