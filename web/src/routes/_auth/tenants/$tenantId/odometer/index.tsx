import { useMemo } from "react";
import {
  createFileRoute,
  Link,
  stripSearchParams,
} from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { odometersQuery } from "@/features/odometer/queries";
import { odometerFilterSchema } from "@/features/odometer/schemas";
import type { Odometer } from "@/features/odometer/types";
import { OperationTypeCell } from "@/features/operation/components/operation-type-cell";
import { UserCell } from "@/features/user/components/user-cell";
import { VehicleCell } from "@/features/vehicle/components/vehicle-cell";
import { DataTable } from "@/components/data-table";
import { Page, PageContent, PageHeader, PageTitle } from "@/components/page";
import { Button } from "@/ui/button";
import { Formatter } from "@/lib/formatter";

export const Route = createFileRoute("/_auth/tenants/$tenantId/odometer/")({
  component: RouteComponent,
  validateSearch: odometerFilterSchema,
  search: {
    middlewares: [stripSearchParams(odometerFilterSchema.parse({}))],
  },
  loaderDeps: ({ search }) => {
    const { page, limit, sort, order, q } = search;

    return {
      page,
      limit,
      sort,
      order,
      q,
    };
  },
});

function RouteComponent() {
  const { tenantId } = Route.useParams();
  const search = Route.useSearch();

  const {
    isPending,
    isError,
    data: odometers,
  } = useQuery(odometersQuery(tenantId, search));

  const columns = useMemo((): ColumnDef<Odometer>[] => {
    return [
      {
        accessorKey: "operationId",
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
        accessorKey: "value",
        header: "Reading",
        cell: (props) => {
          return (
            <h3 className="text-foreground text-sm/tight">
              {Formatter.km(props.row.original.value)}
            </h3>
          );
        },
      },
      {
        id: "source",
        header: "Source",
        cell: (props) => {
          const { operationId } = props.row.original;

          return (
            <OperationTypeCell tenantId={tenantId} operationId={operationId} />
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
            <h2>Odometer List</h2>
          </PageTitle>
          <div className="col-span-2 flex justify-end">
            <Button asChild>
              <Link
                to="/tenants/$tenantId/odometer/create"
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
          <DataTable columns={columns} data={odometers.data} />
        )}
      </PageContent>
    </Page>
  );
}
