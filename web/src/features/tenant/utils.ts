import {
  CarIcon,
  FuelIcon,
  HexagonIcon,
  HomeIcon,
  ListTreeIcon,
  NavigationIcon,
  UserIcon,
  WrenchIcon,
} from "lucide-react";
import type { RouteItem } from "@/lib/utils";
import type { Tenant } from "./types";

// TODO: Change the description
export const TenantTypeValues = [
  {
    label: "Personal",
    description: "Run GPU workloads on a single machine.",
    value: "personal",
  },
  {
    label: "Fleet",
    description: "Run GPU workloads on a single machine.",
    value: "fleet",
  },
] as const;

export const getTenantIcon = (type: Tenant["type"]) => {
  return type === "personal" ? UserIcon : HexagonIcon;
};

export const getTenantItems = (tenantId: string): RouteItem[] => [
  {
    title: "Dashboard",
    to: "/tenants/$tenantId",
    params: {
      tenantId,
    },
    icon: HomeIcon,
  },
  {
    title: "Vehicles",
    to: "/tenants/$tenantId/vehicles",
    params: {
      tenantId,
    },
    icon: CarIcon,
  },
  {
    title: "Fuel",
    to: "/tenants/$tenantId/fuel",
    params: {
      tenantId,
    },
    icon: FuelIcon,
  },
  {
    title: "Odometer",
    to: "/tenants/$tenantId/odometer",
    params: {
      tenantId,
    },
    icon: NavigationIcon,
  },
  {
    title: "Operation",
    to: "/tenants/$tenantId/operation",
    params: {
      tenantId,
    },
    icon: ListTreeIcon,
  },
  {
    title: "Services",
    to: "/tenants/$tenantId/service",
    params: {
      tenantId,
    },
    icon: WrenchIcon,
  },
];

export const getTenantRootItems = (): RouteItem[] => [
  {
    title: "Tenants",
    to: "/tenants",
    icon: HomeIcon,
  },
];
