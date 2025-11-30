import type { QueryFunctionContext } from "@tanstack/react-query";
import { API_URL, AUTH_HEADER_TENANT_ID_NAME } from "@/lib/utils";
import type { Category } from "./types";
import type { categoryKeys } from "./queries";

export const getAll = async ({
  queryKey: [, { tenantId }, , _filters],
}: QueryFunctionContext<ReturnType<(typeof categoryKeys)["list"]>>): Promise<
  Category[]
> => {
  const res = await fetch(`${API_URL}/categories`, {
    credentials: "include",
    headers: {
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json();
};

export const getOne = async ({
  queryKey: [, { tenantId }, , id],
}: QueryFunctionContext<
  ReturnType<(typeof categoryKeys)["detail"]>
>): Promise<Category> => {
  const res = await fetch(`${API_URL}/categories/${id}`, {
    credentials: "include",
    headers: {
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch category");
  }

  return res.json();
};
