import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { transactionsQuery } from "@/features/transaction/queries";
import type {
  Transaction,
  TransactionItem,
} from "@/features/transaction/types";
import { VehicleCell } from "@/features/vehicle/components/vehicle-cell";
import { UserCell } from "@/features/user/components/user-cell";
import { Button } from "@/ui/button";
import { Formatter } from "@/lib/formatter";
import { Page, PageContent, PageHeader, PageTitle } from "@/components/page";
import { DataTable } from "@/components/data-table";
import clsx from "clsx";

export const Route = createFileRoute("/_auth/tenants/$tenantId/transaction/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { tenantId } = Route.useParams();

  const {
    isPending,
    isError,
    data: transactions,
  } = useQuery(transactionsQuery(tenantId));

  const columns = useMemo((): ColumnDef<
    Transaction & {
      items: TransactionItem[];
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
          const { id, type, items } = props.row.original;

          const total = items.reduce((acc, item) => acc + item.amount, 0);

          return (
            <Button
              asChild
              variant="link"
              className={clsx(
                "p-0",
                type === "expense" ? "text-red-600" : "text-green-600",
              )}
            >
              <Link
                to="/tenants/$tenantId/transaction/$transactionId"
                params={{
                  tenantId,
                  transactionId: id,
                }}
              >
                {type === "expense" ? "- " : "+ "}
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
            <h2>Transaction List</h2>
          </PageTitle>
          <div className="col-span-2 flex justify-end">
            <Button asChild>
              <Link
                to="/tenants/$tenantId/transaction/create"
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
          <DataTable columns={columns} data={transactions.data} />
        )}
      </PageContent>
    </Page>
  );
}
