import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { vehiclesColumns } from "@/features/vehicle/components/columns";
import { vehiclesQuery } from "@/features/vehicle/queries";
import { DataTable } from "@/components/data-table";
import { Page, PageContent, PageHeader, PageTitle } from "@/components/page";
import { Button } from "@/ui/button";
import { queryClient } from "@/lib/utils";

export const Route = createFileRoute("/_auth/tenants/$tenantId/vehicles/")({
  component: RouteComponent,
  beforeLoad: async ({ params: { tenantId } }) => {
    await queryClient.ensureQueryData(vehiclesQuery(tenantId));
  },
});

function RouteComponent() {
  console.log("Component: /_auth/tenants/$tenantId/vehicles/");

  const { tenantId } = Route.useParams();

  const { data: vehicles } = useSuspenseQuery(vehiclesQuery(tenantId));

  return (
    <Page>
      <PageHeader>
        <div className="grid grid-cols-8 items-center">
          <PageTitle className="col-span-6 mb-0">
            <h2>Vehicles List</h2>
          </PageTitle>
          <div className="col-span-2 flex justify-end">
            <Button asChild>
              <Link
                to="/tenants/$tenantId/vehicles/create"
                params={{ tenantId }}
              >
                Add Vehicle
              </Link>
            </Button>
          </div>
        </div>
      </PageHeader>

      <PageContent className="flex-1">
        <DataTable columns={vehiclesColumns} data={vehicles.data} />
      </PageContent>
    </Page>
  );
}
