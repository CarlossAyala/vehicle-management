import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { operationsQuery } from "@/features/operation/queries";
import type { Operation } from "@/features/operation/types";
import { VehicleCell } from "@/features/vehicle/components/vehicle-cell";
import { UserCell } from "@/features/user/components/user-cell";
import { OperationTypeCell } from "@/features/operation/components/operation-type-cell";
import { Page, PageContent, PageHeader, PageTitle } from "@/components/page";
import { Button } from "@/ui/button";
import { DataTable } from "@/components/data-table";

export const Route = createFileRoute("/_auth/tenants/$tenantId/operation/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { tenantId } = Route.useParams();

  const {
    isPending,
    isError,
    data: operations,
  } = useQuery(operationsQuery(tenantId));

  const columns = useMemo((): ColumnDef<Operation>[] => {
    return [
      {
        accessorKey: "vehicleId",
        header: "Vehicle",
        cell: (props) => {
          const { id } = props.row.original;

          return <VehicleCell tenantId={tenantId} operationId={id} />;
        },
      },
      {
        accessorKey: "authorId",
        header: "Author",
        cell: (props) => {
          const { id } = props.row.original;

          return <UserCell tenantId={tenantId} operationId={id} />;
        },
      },
      {
        accessorKey: "id",
        header: "Source",
        cell: (props) => {
          const { id } = props.row.original;

          // TODO: change this for the Drawer version of each operation type
          return <OperationTypeCell tenantId={tenantId} operationId={id} />;
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
            <h2>Odometer List</h2>
          </PageTitle>
          <div className="col-span-2 flex justify-end">
            <Button
              type="button"
              onClick={() => {
                alert(
                  "#TODO: Add an modal to show a grid of the operations type, where each one is a link and it's c  ontent it's his icon (sidebar) and name",
                );
              }}
            >
              Add new
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
          <DataTable columns={columns} data={operations.data} />
        )}
      </PageContent>
    </Page>
  );
}
