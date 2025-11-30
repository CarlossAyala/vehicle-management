import { CookieOptions } from "express";

export const AUTH_COOKIE_NAME = "sid";
export const AUTH_COOKIE_CONFIG: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: undefined,
  domain: undefined,
  path: "/",
};

export const SKIP_AUTH_KEY = "SKIP_AUTH";
export const SKIP_AUTH_TENANT_KEY = "SKIP_AUTH_TENANT";
export const SKIP_AUTH_ROLES_KEY = "SKIP_AUTH_ROLES";

export const AUTH_HEADER_TENANT_NAME = "x-tenant-id";

export const AUTH_TENANT_ROLES_KEY = "AUTH_TENANT_ROLES";
