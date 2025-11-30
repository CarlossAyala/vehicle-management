import { createFileRoute } from "@tanstack/react-router";
import { tenantQuery } from "@/features/tenant/queries";
import { queryClient } from "@/lib/utils";
import { Page, PageHeader, PageTitle } from "@/components/page";

export const Route = createFileRoute("/_auth/tenants/$tenantId/")({
  component: RouteComponent,
  beforeLoad: async ({ params: { tenantId } }) => {
    console.log("beforeLoad: /_auth/tenants/$tenantId");

    await queryClient.ensureQueryData(tenantQuery(tenantId));
  },
});

function RouteComponent() {
  return (
    <Page>
      <PageHeader>
        <PageTitle>Dashboard</PageTitle>
      </PageHeader>
    </Page>
  );
}
