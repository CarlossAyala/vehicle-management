import { useQuery } from "@tanstack/react-query";
import type { Tenant } from "@/features/tenant/types";
import { operationQuery } from "@/features/operation/queries";
import type { Operation } from "@/features/operation/types";
import { DataTable } from "@/components/data-table";
import type { Vehicle } from "../types";
import { vehicleQuery } from "../queries";
import { vehicleInfoColumns } from "./columns";

interface VehicleCardProps {
  tenantId: Tenant["id"];
  operationId?: Operation["id"];
  vehicleId?: Vehicle["id"];
}

export const VehicleInfo = ({
  tenantId,
  operationId,
  vehicleId,
}: VehicleCardProps) => {
  const operation = useQuery(operationQuery(tenantId, operationId));
  const vehicle = useQuery(
    vehicleQuery(tenantId, vehicleId ? vehicleId : operation.data?.vehicleId),
  );

  return vehicle.isPending ? (
    "Loading..."
  ) : vehicle.isError ? (
    "Error"
  ) : (
    <DataTable columns={vehicleInfoColumns} data={[vehicle.data]} />
  );
};
