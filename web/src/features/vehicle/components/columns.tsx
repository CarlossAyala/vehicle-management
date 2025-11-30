import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical, MoveUpRightIcon } from "lucide-react";
import { EmptyCell } from "@/components/empty-cell";
import { Button } from "@/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import type { Vehicle } from "../types";
import { VehicleCell } from "./vehicle-cell";
import { Checkbox } from "@/ui/checkbox";

export const vehiclesColumns: ColumnDef<Vehicle>[] = [
  {
    accessorKey: "fullName",
    header: "Name",
    cell: (props) => {
      const vehicle = props.row.original;

      return (
        <Button
          asChild
          variant="link"
          className="text-foreground w-fit px-0 text-left"
        >
          <Link
            to="/tenants/$tenantId/vehicles/$vehicleId"
            params={{
              tenantId: vehicle.tenantId,
              vehicleId: vehicle.id,
            }}
          >
            {vehicle.fullName}
          </Link>
        </Button>
      );
    },
    footer: (props) => props.column.id,
  },
  {
    accessorKey: "nickname",
    header: "Nickname",
    cell: (props) => <EmptyCell value={props.getValue()} />,
  },
  {
    accessorKey: "licensePlate",
    header: "License Plate",
    cell: (props) => props.getValue(),
    footer: (props) => props.column.id,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: (props) => props.getValue(),
    footer: (props) => props.column.id,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (props) => props.getValue(),
    footer: (props) => props.column.id,
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <EllipsisVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Make a copy</DropdownMenuItem>
          <DropdownMenuItem>Favorite</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export const vehicleSelectionColumns: ColumnDef<Vehicle>[] = [
  {
    id: "select",
    header: undefined,
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={row.getToggleSelectedHandler()}
      />
    ),
  },
  {
    accessorKey: "id",
    header: "Vehicle",
    cell: (props) => {
      const vehicle = props.row.original;

      return <VehicleCell tenantId={vehicle.tenantId} vehicleId={vehicle.id} />;
    },
    footer: (props) => props.column.id,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: (props) => props.getValue(),
    footer: (props) => props.column.id,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (props) => props.getValue(),
    footer: (props) => props.column.id,
  },
];

export const vehicleInfoColumns: ColumnDef<Vehicle>[] = [
  {
    accessorKey: "nickname",
    header: "Nickname",
    cell: (props) => <EmptyCell value={props.getValue()} />,
  },
  {
    accessorKey: "brand",
    header: "Brand",
    cell: (props) => props.getValue(),
  },
  {
    accessorKey: "model",
    header: "Model",
    cell: (props) => props.getValue(),
  },
  {
    accessorKey: "variant",
    header: "Variant",
    cell: (props) => <EmptyCell value={props.getValue()} />,
  },
  {
    accessorKey: "year",
    header: "Year",
    cell: (props) => props.getValue(),
  },
  {
    accessorKey: "licensePlate",
    header: "License Plate",
    cell: (props) => props.getValue(),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: (props) => props.getValue(),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (props) => props.getValue(),
  },
  {
    id: "actions",
    cell: (props) => {
      return (
        <Button asChild variant="ghost" size="icon">
          <Link
            to="/tenants/$tenantId/vehicles/$vehicleId"
            params={{
              tenantId: props.row.original.tenantId,
              vehicleId: props.row.original.id,
            }}
            target="_blank"
          >
            <MoveUpRightIcon className="size-4" />
          </Link>
        </Button>
      );
    },
  },
];
