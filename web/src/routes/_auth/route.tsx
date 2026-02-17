import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { profileQuery } from "@/features/auth/queries";
import { queryClient } from "@/lib/utils";
import { SidebarProvider } from "@/ui/sidebar";
import { AppSidebar } from "./-components/app-sidebar";
import { AppHeader } from "./-components/app-header";

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
  beforeLoad: async ({ location }) => {
    const user = queryClient.getQueryData(profileQuery.queryKey);

    if (!user) {
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
  return (
    <div className="flex min-h-dvh w-full">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <AppHeader />
          <Outlet />
        </div>
      </SidebarProvider>
    </div>
  );
}
