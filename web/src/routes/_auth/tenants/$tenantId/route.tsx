import { createFileRoute, Outlet } from "@tanstack/react-router";
import { tenantQuery } from "@/features/tenant/queries";
import { queryClient } from "@/lib/utils";

export const Route = createFileRoute("/_auth/tenants/$tenantId")({
  component: RouteComponent,
  beforeLoad: ({ params: { tenantId } }) => {
    return queryClient.ensureQueryData(tenantQuery(tenantId));
  },
});

function RouteComponent() {
  return <Outlet />;
}
