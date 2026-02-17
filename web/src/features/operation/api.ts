import type { QueryFunctionContext } from "@tanstack/react-query";
import { API_URL, AUTH_HEADER_TENANT_ID_NAME } from "@/lib/utils";
import type { Fuel } from "../fuel/types";
import type { Odometer } from "../odometer/types";
import type { Operation } from "./types";
import type { operationKeys } from "./queries";
import type { Pagination } from "@/lib/filters";
import type { Service } from "../service/types";

// TODO: Add filters
export const getAll = async ({
  queryKey,
}: QueryFunctionContext<ReturnType<(typeof operationKeys)["list"]>>): Promise<
  Pagination<Operation>
> => {
  const [, { tenantId }, , _filters] = queryKey;

  const filters = "";

  const res = await fetch(`${API_URL}/operations?${filters}`, {
    credentials: "include",
    headers: {
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch operations");
  }

  return res.json();
};

export const stats = async ({
  queryKey,
}: QueryFunctionContext<ReturnType<(typeof operationKeys)["stats"]>>): Promise<{
  count: number;
}> => {
  const [, { tenantId }] = queryKey;

  const res = await fetch(`${API_URL}/operations/stats`, {
    credentials: "include",
    headers: {
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch operations stats");
  }

  return res.json();
};

export const getOne = async ({
  queryKey,
}: QueryFunctionContext<
  ReturnType<(typeof operationKeys)["detail"]>
>): Promise<Operation> => {
  const [, { tenantId }, , id] = queryKey;

  const res = await fetch(`${API_URL}/operations/${id}`, {
    credentials: "include",
    headers: {
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch operation");
  }

  return res.json();
};

export const getEntity = async ({
  queryKey,
}: QueryFunctionContext<
  ReturnType<(typeof operationKeys)["entity"]>
>): Promise<{ operation: Operation; entity: Fuel | Odometer | Service }> => {
  const [, { tenantId }, , id] = queryKey;

  const res = await fetch(`${API_URL}/operations/${id}/entity`, {
    credentials: "include",
    headers: {
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch operation entity");
  }

  return res.json();
};
