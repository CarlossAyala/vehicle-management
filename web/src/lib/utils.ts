import { QueryClient } from "@tanstack/react-query";
import {
  type LinkOptions,
  type RegisteredRouter,
} from "@tanstack/react-router";
import { clsx, type ClassValue } from "clsx";
import { type LucideIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const queryClient = new QueryClient();

export const API_URL = import.meta.env.VITE_API_URL;
export const AUTH_HEADER_TENANT_ID_NAME = "x-tenant-id";

export type RouteItem<TRouter extends RegisteredRouter = RegisteredRouter> =
  LinkOptions<TRouter> & {
    title: string;
    icon: LucideIcon;
  };
