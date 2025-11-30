import type { ColumnDef } from "@tanstack/react-table";
import { UserCell } from "@/features/user/components/user-cell";
import type { Tenant } from "@/features/tenant/types";
import { CategoryCell } from "@/features/category/components/category-cell";
import { VehicleCell } from "@/features/vehicle/components/vehicle-cell";
import type { Fuel } from "../types";
import { Formatter } from "@/lib/formatter";
import { MoveUpRightIcon } from "lucide-react";
import { Button } from "@/ui/button";
import { Link } from "@tanstack/react-router";

export const getFuelColumns = (tenantId: Tenant["id"]): ColumnDef<Fuel>[] => {
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
      accessorKey: "quantity",
      header: "Qty",
      cell: (props) => (
        <h3 className="text-foreground text-sm/tight">
          {Formatter.litres(props.row.original.quantity)}
        </h3>
      ),
    },
    {
      accessorKey: "amount",
      header: "Total",
      cell: (props) => (
        <h3 className="text-foreground text-sm/tight">
          {Formatter.currency(props.row.original.amount)}
        </h3>
      ),
    },
    {
      accessorKey: "categoryId",
      header: "Type",
      cell: (props) => {
        const { categoryId } = props.row.original;

        return <CategoryCell tenantId={tenantId} categoryId={categoryId} />;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date",
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
    {
      id: "actions",
      cell: (props) => {
        return (
          <div className="flex justify-end gap-2">
            <Button asChild variant="ghost" size="icon">
              <Link
                to="/tenants/$tenantId/fuel/$fuelId"
                params={{
                  tenantId,
                  fuelId: props.row.original.id,
                }}
                target="_blank"
              >
                <MoveUpRightIcon className="size-4" />
              </Link>
            </Button>
          </div>
        );
      },
    },
  ];
};
