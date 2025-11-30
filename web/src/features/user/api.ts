import type { QueryFunctionContext } from "@tanstack/react-query";
import { API_URL, AUTH_HEADER_TENANT_ID_NAME } from "@/lib/utils";
import type { User } from "./types";
import type { userKeys } from "./queries";

export const getOne = async ({
  queryKey: [, { tenantId }, , id],
}: QueryFunctionContext<
  ReturnType<(typeof userKeys)["detail"]>
>): Promise<User> => {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "GET",
    credentials: "include",
    headers: {
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }

  return res.json();
};
