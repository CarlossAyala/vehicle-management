import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useParams,
} from "@tanstack/react-router";
import { profileQuery } from "@/features/auth/queries";
import { queryClient } from "@/lib/utils";
import { Webhook } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/ui/sidebar";
import { TenantSwitcher } from "@/features/tenant/components/tenants-switcher";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/ui/breadcrumb";
import { NavUser } from "@/features/auth/components/nav-user";
import { getTenantItems, getTenantRootItems } from "@/features/tenant/utils";

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
  beforeLoad: async ({ location }) => {
    console.log("beforeLoad: /_auth");

    const user = queryClient.getQueryData(profileQuery.queryKey);

    if (!user) {
      console.log("-", location.pathname);

      throw redirect({
        to: "/login",
        search: {
          redirect: location.pathname,
        },
      });
    }
  },
});

function RouteComponent() {
  console.log("Component: /_auth");

  const { tenantId } = useParams({ strict: false });

  const items = tenantId ? getTenantItems(tenantId) : getTenantRootItems();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="group-data-[state=collapsed]:pt-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                asChild
              >
                <Link to="/">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Webhook className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Garage</span>
                    <span className="truncate text-xs">Carlos Ayala</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <Link {...item}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          {tenantId ? <TenantSwitcher tenantId={tenantId} /> : null}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="bg-background sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div>
            <NavUser />
          </div>
        </header>
        {/* <div className="flex flex-1 flex-col gap-4 px-6 pt-4 pb-6"> */}
        <Outlet />
        {/* </div> */}
      </SidebarInset>
    </SidebarProvider>
  );
}
