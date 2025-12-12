import type { QueryFunctionContext } from "@tanstack/react-query";
import qs from "query-string";
import { QUERY_STRING_OPTIONS } from "@/lib/query-string";
import type { Pagination } from "@/lib/filters";
import { API_URL, AUTH_HEADER_TENANT_ID_NAME } from "@/lib/utils";
import type { Tenant } from "../tenant/types";
import type { Operation } from "../operation/types";
import type { Odometer } from "../odometer/types";
import type {
  CreateServiceSchema,
  Service,
  ServiceItem,
  UpdateServiceSchema,
} from "./types";
import type { serviceKeys } from "./queries";

export const create = async ({
  tenantId,
  values,
}: {
  tenantId: Tenant["id"];
  values: CreateServiceSchema;
}): Promise<{
  operation: Operation;
  service: Service;
  items: ServiceItem[];
  odometer?: Odometer;
}> => {
  const res = await fetch(`${API_URL}/services`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    throw new Error("Failed to create service");
  }

  return res.json();
};

export const getAll = async ({
  queryKey: [, { tenantId }, , filters],
}: QueryFunctionContext<ReturnType<(typeof serviceKeys)["list"]>>): Promise<
  Pagination<
    Service & {
      items: ServiceItem[];
    }
  >
> => {
  const query = qs.stringify(filters, QUERY_STRING_OPTIONS);
  const url = query ? `${API_URL}/services?${query}` : `${API_URL}/services`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch services");
  }

  return res.json();
};

export const getOne = async ({
  queryKey: [, { tenantId }, , id],
}: QueryFunctionContext<ReturnType<(typeof serviceKeys)["detail"]>>): Promise<
  Service & {
    items: ServiceItem[];
  }
> => {
  const res = await fetch(`${API_URL}/services/${id}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to get service");
  }

  return res.json();
};

export const update = async ({
  tenantId,
  id,
  values,
}: {
  tenantId: Tenant["id"];
  id: Service["id"];
  values: UpdateServiceSchema;
}): Promise<{
  operation: Operation;
  service: Service;
  items: ServiceItem[];
  odometer?: Odometer;
}> => {
  const res = await fetch(`${API_URL}/services/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    throw new Error("Failed to update service");
  }

  return res.json();
};

export const remove = async ({
  tenantId,
  id,
}: {
  tenantId: Tenant["id"];
  id: Service["id"];
}): Promise<{
  operationId: Operation["id"];
  id: Service["id"];
  odometerId?: Odometer["id"];
}> => {
  const res = await fetch(`${API_URL}/services/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete service");
  }

  return res.json();
};
