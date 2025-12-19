import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import type { Service, ServiceItem } from "@/features/service/types";
import { servicesQuery } from "@/features/service/queries";
import { VehicleCell } from "@/features/vehicle/components/vehicle-cell";
import { UserCell } from "@/features/user/components/user-cell";
import { Formatter } from "@/lib/formatter";
import { Page, PageContent, PageHeader, PageTitle } from "@/components/page";
import { Button } from "@/ui/button";
import { DataTable } from "@/components/data-table";

export const Route = createFileRoute("/_auth/tenants/$tenantId/service/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { tenantId } = Route.useParams();

  const {
    isPending,
    isError,
    data: service,
  } = useQuery(servicesQuery(tenantId));

  const columns = useMemo((): ColumnDef<
    Service & {
      items: ServiceItem[];
    }
  >[] => {
    return [
      {
        id: "vehicle",
        header: "Vehicle",
        cell: (props) => {
          const { operationId } = props.row.original;

          return <VehicleCell tenantId={tenantId} operationId={operationId} />;
        },
      },
      {
        id: "author",
        header: "Author",
        cell: (props) => {
          const { operationId } = props.row.original;

          return <UserCell tenantId={tenantId} operationId={operationId} />;
        },
      },
      {
        id: "amount",
        header: "Total",
        cell: (props) => {
          const { id, items } = props.row.original;

          const total = items.reduce((acc, item) => acc + item.amount, 0);

          return (
            <Button asChild variant="link" className="p-0">
              <Link
                to="/tenants/$tenantId/service/$serviceId"
                params={{
                  tenantId,
                  serviceId: id,
                }}
              >
                {Formatter.currency(total)}
              </Link>
            </Button>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: (props) => {
          const { createdAt } = props.row.original;

          const date = new Intl.DateTimeFormat("en-US", {
            dateStyle: "short",
          }).format(new Date(createdAt));

          const time = new Intl.DateTimeFormat("en-US", {
            timeStyle: "medium",
          }).format(new Date(createdAt));

          return date + " " + time;
        },
      },
    ];
  }, []);

  return (
    <Page>
      <PageHeader>
        <div className="grid grid-cols-8 items-center">
          <PageTitle className="col-span-6 mb-0">
            <h2>Service List</h2>
          </PageTitle>
          <div className="col-span-2 flex justify-end">
            <Button asChild>
              <Link
                to="/tenants/$tenantId/service/create"
                params={{ tenantId }}
              >
                Add new
              </Link>
            </Button>
          </div>
        </div>
      </PageHeader>

      <PageContent className="flex-1">
        {isPending ? (
          "Loading..."
        ) : isError ? (
          "Error"
        ) : (
          <DataTable columns={columns} data={service.data} />
        )}
      </PageContent>
    </Page>
  );
}
