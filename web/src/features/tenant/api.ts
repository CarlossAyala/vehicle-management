import { API_URL, AUTH_HEADER_TENANT_ID_NAME } from "@/lib/utils";
import type { CreateTenantDto, Tenant, UpdateRoles, UserTenant } from "./types";
import type { User } from "../user/types";
import type { QueryFunctionContext } from "@tanstack/react-query";
import type { tenantKeys } from "./queries";

export const create = async (
  values: CreateTenantDto,
): Promise<{
  tenant: Tenant;
  userTenant: UserTenant;
}> => {
  const res = await fetch(`${API_URL}/tenants`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });
  if (!res.ok) {
    throw new Error("Failed to create tenant");
  }

  return res.json();
};

export const getAll = async (): Promise<Tenant[]> => {
  const res = await fetch(`${API_URL}/tenants`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch tenants");
  }

  return res.json();
};

export const getOne = async (id: Tenant["id"]): Promise<Tenant> => {
  const res = await fetch(`${API_URL}/tenants/${id}`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch tenant");
  }

  return res.json();
};

export const getMembers = async ({
  queryKey,
}: QueryFunctionContext<ReturnType<(typeof tenantKeys)["members"]>>): Promise<
  User[]
> => {
  const [, { tenantId }] = queryKey;

  if (!tenantId) {
    throw new Error("No tenantId provided to fetch tenant members");
  }

  const res = await fetch(`${API_URL}/tenants/members`, {
    credentials: "include",
    headers: {
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch tenant members");
  }

  return res.json();
};

export const getUserTenant = async (
  id: UserTenant["id"],
): Promise<UserTenant> => {
  const res = await fetch(`${API_URL}/users-tenants/${id}`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch user tenant");
  }

  return res.json();
};

export const getUserTenants = async (): Promise<UserTenant[]> => {
  const res = await fetch(`${API_URL}/users-tenants`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch user tenants");
  }

  return res.json();
};

export const updateRoles = async ({
  tenantId,
  userId,
  values,
}: {
  tenantId: Tenant["id"];
  userId: User["id"];
  values: UpdateRoles;
}): Promise<UserTenant[]> => {
  const res = await fetch(`${API_URL}/tenants/members/${userId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
    body: JSON.stringify(values),
  });
  if (!res.ok) {
    throw new Error("Failed to update roles");
  }

  return res.json();
};

export const removeMember = async ({
  tenantId,
  userId,
}: {
  tenantId: Tenant["id"];
  userId: User["id"];
}): Promise<void> => {
  const res = await fetch(`${API_URL}/tenants/members/${userId}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      [AUTH_HEADER_TENANT_ID_NAME]: tenantId,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to remove member");
  }
};
