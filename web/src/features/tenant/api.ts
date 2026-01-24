import { API_URL } from "@/lib/utils";
import type { CreateTenantDto, Tenant, UserTenant } from "./types";

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
