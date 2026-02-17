import { API_URL, AUTH_HEADER_TENANT_ID_NAME } from "@/lib/utils";
import type { Odometer } from "../odometer/types";
import type { Operation } from "../operation/types";
import type { Tenant } from "../tenant/types";
import type {
  CreateTransactionSchema,
  Transaction,
  TransactionItem,
  UpdateTransactionSchema,
} from "./types";
import type { QueryFunctionContext } from "@tanstack/react-query";
import type { transactionKeys } from "./queries";
import type { Pagination } from "@/lib/filters";
import qs from "query-string";
import { QUERY_STRING_OPTIONS } from "@/lib/query-string";

export const create = async ({
  tenantId,
  values,
}: {
  tenantId: Tenant["id"];
  values: CreateTransactionSchema;
}): Promise<{
  operation: Operation;
  transaction: Transaction;
  items: TransactionItem[];
  odometer?: Odometer;
}> => {
  const res = await fetch(`${API_URL}/transactions`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    throw new Error("Failed to create transaction");
  }

  return res.json();
};

export const getAll = async ({
  queryKey: [, { tenantId }, , filters],
}: QueryFunctionContext<ReturnType<(typeof transactionKeys)["list"]>>): Promise<
  Pagination<
    Transaction & {
      items: TransactionItem[];
    }
  >
> => {
  const query = qs.stringify(filters, QUERY_STRING_OPTIONS);
  const url = query
    ? `${API_URL}/transactions?${query}`
    : `${API_URL}/transactions`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch transactions");
  }

  return res.json();
};

export const stats = async ({
  queryKey,
}: QueryFunctionContext<
  ReturnType<(typeof transactionKeys)["stats"]>
>): Promise<{
  expense: number;
  income: number;
}> => {
  const [, { tenantId }] = queryKey;

  const res = await fetch(`${API_URL}/transactions/stats`, {
    method: "GET",
    credentials: "include",
    headers: {
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch transactions stats");
  }

  return res.json();
};

export const getOne = async ({
  queryKey: [, { tenantId }, , id],
}: QueryFunctionContext<
  ReturnType<(typeof transactionKeys)["detail"]>
>): Promise<
  Transaction & {
    items: TransactionItem[];
  }
> => {
  const res = await fetch(`${API_URL}/transactions/${id}`, {
    method: "GET",
    credentials: "include",
    headers: {
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch transaction");
  }

  return res.json();
};

export const update = async ({
  tenantId,
  id,
  values,
}: {
  tenantId: Tenant["id"];
  id: Transaction["id"];
  values: UpdateTransactionSchema;
}): Promise<{
  operation: Operation;
  transaction: Transaction;
  items: TransactionItem[];
  odometer?: Odometer;
}> => {
  const res = await fetch(`${API_URL}/transactions/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    throw new Error("Failed to update transaction");
  }

  return res.json();
};

export const remove = async ({
  tenantId,
  id,
}: {
  tenantId: Tenant["id"];
  id: Transaction["id"];
}): Promise<{
  operationId: Operation["id"];
  id: Transaction["id"];
  odometerId?: Odometer["id"];
}> => {
  const res = await fetch(`${API_URL}/transactions/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete transaction");
  }

  return res.json();
};
