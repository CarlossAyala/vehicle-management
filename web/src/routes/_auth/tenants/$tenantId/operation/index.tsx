import { useMemo } from "react";
import { createFileRoute, Link, linkOptions } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { FuelIcon, NavigationIcon } from "lucide-react";
import { operationsQuery } from "@/features/operation/queries";
import type { Operation } from "@/features/operation/types";
import { VehicleCell } from "@/features/vehicle/components/vehicle-cell";
import { UserCell } from "@/features/user/components/user-cell";
import { OperationTypeCell } from "@/features/operation/components/operation-type-cell";
import { Page, PageContent, PageHeader, PageTitle } from "@/components/page";
import { DataTable } from "@/components/data-table";
import { Button } from "@/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";

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
        accessorKey: "type",
        header: "Type",
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
            <h2>Operation List</h2>
          </PageTitle>
          <div className="col-span-2 flex justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button type="button">Add new</Button>
              </DialogTrigger>
              <DialogContent className="gap-6">
                <DialogHeader>
                  <DialogTitle>Choose an operation type</DialogTitle>
                  <DialogDescription>
                    Start by selecting the type of operation you want to create.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      label: "Fuel",
                      link: linkOptions({
                        to: "/tenants/$tenantId/fuel/create",
                        params: { tenantId },
                        search: {
                          from: "operation",
                        },
                      }),
                      icon: FuelIcon,
                    },
                    {
                      label: "Odometer",
                      link: linkOptions({
                        to: "/tenants/$tenantId/odometer/create",
                        params: { tenantId },
                        search: {
                          from: "operation",
                        },
                      }),
                      icon: NavigationIcon,
                    },
                  ].map((item) => (
                    <Link {...item.link} className="rounded-xl">
                      <Card className="hover:bg-card/80 gap-2">
                        <CardHeader>
                          <item.icon className="size-10 stroke-1" />
                        </CardHeader>
                        <CardContent>
                          <CardTitle className="font-normal">
                            {item.label}
                          </CardTitle>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
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
