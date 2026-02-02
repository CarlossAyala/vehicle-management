import { useMemo } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { Webhook } from "lucide-react";
import {
  getNonTenantNav,
  getTenantNav,
  getGeneralTenantNav,
} from "@/features/tenant/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/ui/sidebar";

export const AppSidebar = () => {
  const { tenantId } = useParams({
    strict: false,
  });

  const nav = useMemo(() => {
    return tenantId ? getTenantNav(tenantId) : getNonTenantNav();
  }, [tenantId]);

  const general = useMemo(() => {
    return tenantId ? getGeneralTenantNav(tenantId) : [];
  }, [tenantId]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="group-data-[state=collapsed]:pt-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              asChild
            >
              <Link to="/for-you">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Webhook className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Unnamed</span>
                  <span className="truncate text-xs">Carlos Ayala</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Home</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((n) => (
                <SidebarMenuItem key={n.title}>
                  <SidebarMenuButton asChild tooltip={n.title}>
                    <Link {...n}>
                      <n.icon />
                      <span>{n.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {tenantId ? (
          <SidebarGroup>
            <SidebarGroupLabel>General</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {general.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild tooltip={item.label}>
                      <Link {...item.link}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}
      </SidebarContent>
    </Sidebar>
  );
};
