import {
  CarIcon,
  DollarSignIcon,
  FuelIcon,
  HomeIcon,
  ListTreeIcon,
  MailIcon,
  NavigationIcon,
  UsersIcon,
  WrenchIcon,
} from "lucide-react";
import type { RouteItem } from "@/lib/utils";
import type { Tenant, TenantRole } from "./types";
import { linkOptions } from "@tanstack/react-router";

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

export const ROLES_LABEL = {
  owner: "Owner",
  admin: "Admin",
  fleet_manager: "Fleet Manager",
  driver: "Driver",
  member: "Member",
};
export const getRoleLabel = (role: TenantRole): string => {
  return ROLES_LABEL[role];
};

export const getHomeTenantNav = (tenantId: Tenant["id"]): RouteItem[] => [
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
  {
    title: "Transactions",
    to: "/tenants/$tenantId/transaction",
    params: {
      tenantId,
    },
    icon: DollarSignIcon,
  },
];

export const getHomeNonTenantNav = (): RouteItem[] => [
  {
    title: "Tenants",
    to: "/tenants",
    icon: HomeIcon,
  },
  {
    title: "Invitations",
    to: "/invitations",
    icon: MailIcon,
  },
];

export const getSettingsTenantNav = (tenantId: Tenant["id"]) => [
  {
    label: "Members",
    icon: UsersIcon,
    link: linkOptions({
      to: "/tenants/$tenantId/members",
      params: {
        tenantId,
      },
    }),
  },
];
