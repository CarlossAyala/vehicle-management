import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ChevronsUpDown as ChevronsUpDownIcon,
  Circle as CircleIcon,
  Plus as PlusIcon,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { tenantsQuery } from "../queries";
import { getTenantIcon } from "../utils";
import type { Tenant } from "../types";

export const TenantSwitcher = ({ tenantId }: { tenantId: Tenant["id"] }) => {
  console.log("Component: TenantSwitcher");

  const { data: tenants } = useSuspenseQuery(tenantsQuery);

  const { isMobile } = useSidebar();

  const tenant = tenants.find((t) => t.id === tenantId)!;
  const TenantIcon = getTenantIcon(tenant.type);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <TenantIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{tenant.name}</span>
                <span className="truncate text-xs capitalize">
                  {tenant.type}
                </span>
              </div>
              <ChevronsUpDownIcon className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "top" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Tenants
            </DropdownMenuLabel>
            {tenants.map((t) => {
              const Icon = getTenantIcon(t.type);
              return (
                <DropdownMenuItem key={t.name} className="gap-2 p-2" asChild>
                  <Link
                    to="/tenants/$tenantId"
                    params={{
                      tenantId: t.id,
                    }}
                  >
                    <div className="flex size-6 items-center justify-center rounded-md border">
                      <Icon className="size-3.5 shrink-0" />
                    </div>
                    {t.name}
                    {t.id === tenantId ? (
                      <CircleIcon className="fill-primary ml-auto size-2" />
                    ) : null}
                  </Link>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                // TODO: Implement this
                throw new Error("Not implemented");
              }}
              className="gap-2 p-2"
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <PlusIcon className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">
                Create tenant
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
