import { API_URL, AUTH_HEADER_TENANT_ID_NAME } from "@/lib/utils";
import type { Tenant } from "../tenant/types";
import type { AcceptInvitation, CreateInvitation, Invitation } from "./types";
import type { QueryFunctionContext } from "@tanstack/react-query";
import type { invitationKeys } from "./queries";
import qs from "query-string";
import { QUERY_STRING_OPTIONS } from "@/lib/query-string";

export const create = async ({
  tenantId,
  values,
}: {
  tenantId: Tenant["id"];
  values: CreateInvitation;
}): Promise<Invitation> => {
  const res = await fetch(`${API_URL}/invitations`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
    body: JSON.stringify(values),
  });
  if (!res.ok) {
    throw new Error("Failed to create invitation");
  }

  return res.json();
};

export const getAllTenant = async ({
  queryKey,
}: QueryFunctionContext<ReturnType<(typeof invitationKeys)["list"]>>): Promise<
  Invitation[]
> => {
  const [, { tenantId }, , filters] = queryKey;

  const query = qs.stringify(filters, QUERY_STRING_OPTIONS);

  const url = query
    ? `${API_URL}/invitations/tenant?${query}`
    : `${API_URL}/invitations/tenant`;

  if (!tenantId) {
    throw new Error("No tenant id");
  }

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch invitations");
  }
  return res.json();
};

export const getAllUser = async ({
  queryKey,
}: QueryFunctionContext<ReturnType<(typeof invitationKeys)["list"]>>): Promise<
  Invitation[]
> => {
  const [, , , filters] = queryKey;

  const query = qs.stringify(filters, QUERY_STRING_OPTIONS);
  const url = query
    ? `${API_URL}/invitations/me?${query}`
    : `${API_URL}/invitations/me`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch invitations");
  }

  return res.json();
};

export const getOneId = async ({
  queryKey,
}: QueryFunctionContext<
  ReturnType<(typeof invitationKeys)["detail"]>
>): Promise<Invitation> => {
  const [, { tenantId }, , id] = queryKey;

  if (!tenantId) {
    throw new Error("No tenant id");
  }

  const res = await fetch(`${API_URL}/invitations/${id}`, {
    method: "GET",
    credentials: "include",
    headers: {
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch invitation");
  }

  return res.json();
};

export const getOneToken = async ({
  queryKey,
}: QueryFunctionContext<
  ReturnType<(typeof invitationKeys)["token"]>
>): Promise<Invitation> => {
  const [, , , token] = queryKey;

  const res = await fetch(`${API_URL}/invitations/${token}/token`, {
    method: "GET",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch invitation");
  }

  return res.json();
};

export const accept = async ({
  id,
}: {
  id: Invitation["id"];
}): Promise<{
  invitation: Invitation;
  tenant: Tenant;
}> => {
  const res = await fetch(`${API_URL}/invitations/${id}/accept`, {
    method: "PATCH",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to accept invitation");
  }

  return res.json();
};

export const acceptPublic = async ({
  token,
  values,
}: {
  token: Invitation["token"];
  values: AcceptInvitation;
}): Promise<Invitation> => {
  const res = await fetch(`${API_URL}/invitations/${token}/accept-public`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });
  if (!res.ok) {
    throw new Error("Failed to accept invitation");
  }

  return res.json();
};

export const reject = async ({
  id,
}: {
  id: Invitation["id"];
}): Promise<Invitation> => {
  const res = await fetch(`${API_URL}/invitations/${id}/reject`, {
    method: "PATCH",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to reject invitation");
  }

  return res.json();
};

export const remove = async ({
  tenantId,
  id,
}: {
  tenantId: Tenant["id"];
  id: Invitation["id"];
}): Promise<{
  id: Invitation["id"];
}> => {
  const res = await fetch(`${API_URL}/invitations/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to delete invitation");
  }

  return res.json();
};
