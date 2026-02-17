import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { fuelsQuery, fuelStatsQuery } from "@/features/fuel/queries";
import { operationStatsQuery } from "@/features/operation/queries";
import {
  odometersQuery,
  odometerStatsQuery,
} from "@/features/odometer/queries";
import { servicesQuery, serviceStatsQuery } from "@/features/service/queries";
import { transactionStatsQuery } from "@/features/transaction/queries";
import { Formatter } from "@/lib/formatter";
import { queryClient } from "@/lib/utils";
import { Page } from "@/components/page";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import { DataTable } from "@/components/data-table";
import { getFuelColumns } from "@/features/fuel/components/columns";
import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Odometer } from "@/features/odometer/types";
import { VehicleCell } from "@/features/vehicle/components/vehicle-cell";
import { UserCell } from "@/features/user/components/user-cell";
import { OperationTypeCell } from "@/features/operation/components/operation-type-cell";
import type { Service, ServiceItem } from "@/features/service/types";
import { Button } from "@/ui/button";

export const Route = createFileRoute("/_auth/tenants/$tenantId/")({
  component: RouteComponent,
  loader: ({ params: { tenantId } }) => {
    return Promise.all([
      queryClient.ensureQueryData(fuelStatsQuery(tenantId)),
      queryClient.ensureQueryData(operationStatsQuery(tenantId)),
      queryClient.ensureQueryData(odometerStatsQuery(tenantId)),
      queryClient.ensureQueryData(serviceStatsQuery(tenantId)),
      queryClient.ensureQueryData(transactionStatsQuery(tenantId)),
      queryClient.ensureQueryData(
        fuelsQuery(tenantId, {
          q: "",
          order: "DESC",
          sort: "createdAt",
          page: 1,
          limit: 10,
        }),
      ),
    ]);
  },
});

const SectionCards = () => {
  const { tenantId } = Route.useParams();

  const { data: fuel } = useSuspenseQuery(fuelStatsQuery(tenantId));
  const { data: odometer } = useSuspenseQuery(odometerStatsQuery(tenantId));
  const { data: service } = useSuspenseQuery(serviceStatsQuery(tenantId));
  const { data: transaction } = useSuspenseQuery(
    transactionStatsQuery(tenantId),
  );

  return (
    <section className="space-y-4 px-4">
      <div>
        <h2 className="text-lg font-semibold">This month</h2>
      </div>
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-5">
        <Card>
          <CardHeader>
            <CardDescription>Fuel</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {Formatter.currency(fuel.amount)}/
              {Formatter.litres(fuel.quantity)}
            </CardTitle>
          </CardHeader>
          <CardFooter className="text-sm">
            <div className="text-muted-foreground text-xs font-medium">
              <span>You filled up {fuel.count} times.</span>
            </div>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Odometer</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {Formatter.km(odometer.total)}
            </CardTitle>
          </CardHeader>
          <CardFooter className="text-sm">
            <div className="text-muted-foreground text-xs font-medium">
              <span>Total kilometers recorded across vehicles.</span>
            </div>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Services</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {Formatter.currency(service.total)}
            </CardTitle>
          </CardHeader>
          <CardFooter className="text-sm">
            <div className="text-muted-foreground text-xs font-medium">
              <span>Total spent on services.</span>
            </div>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Expenses</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {Formatter.currency(transaction.expense)}
            </CardTitle>
          </CardHeader>
          <CardFooter className="text-sm">
            <div className="text-muted-foreground text-xs font-medium">
              <span>Total expenses this month.</span>
            </div>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Incomes</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {Formatter.currency(transaction.income)}
            </CardTitle>
          </CardHeader>
          <CardFooter className="text-sm">
            <div className="text-muted-foreground text-xs font-medium">
              <span>Total incomes this month.</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
};

const FuelLatest = () => {
  const { tenantId } = Route.useParams();

  const { data: fuel } = useSuspenseQuery(
    fuelsQuery(tenantId, {
      q: "",
      order: "DESC",
      sort: "createdAt",
      page: 1,
      limit: 5,
    }),
  );

  const columns = useMemo(() => getFuelColumns(tenantId), []);

  return (
    <Card className="w-full">
      <CardHeader className="gap-0">
        <CardTitle>Latest Fuel</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <DataTable columns={columns} data={fuel.data} />
      </CardContent>
    </Card>
  );
};

const OdometerLatest = () => {
  const { tenantId } = Route.useParams();

  const { data: odometer } = useSuspenseQuery(
    odometersQuery(tenantId, {
      q: "",
      order: "DESC",
      sort: "createdAt",
      page: 1,
      limit: 5,
    }),
  );

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
    <Card className="w-full">
      <CardHeader className="gap-0">
        <CardTitle>Latest Odometer Readings</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <DataTable columns={columns} data={odometer.data} />
      </CardContent>
    </Card>
  );
};

const ServiceLatest = () => {
  const { tenantId } = Route.useParams();

  const { data: service } = useSuspenseQuery(
    servicesQuery(tenantId, {
      q: "",
      order: "DESC",
      sort: "createdAt",
      page: 1,
      limit: 5,
    }),
  );

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
    <Card className="w-full">
      <CardHeader className="gap-0">
        <CardTitle>Latest Services</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <DataTable columns={columns} data={service.data} />
      </CardContent>
    </Card>
  );
};

function RouteComponent() {
  return (
    <Page className="space-y-4">
      <SectionCards />

      <section className="grid grid-cols-2 gap-4 px-4">
        <FuelLatest />
        <OdometerLatest />
      </section>
      <section className="grid grid-cols-2 gap-4 px-4">
        <ServiceLatest />
      </section>
    </Page>
  );
}
