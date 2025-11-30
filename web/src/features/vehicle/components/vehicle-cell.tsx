import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { Tenant } from "@/features/tenant/types";
import type { Operation } from "@/features/operation/types";
import { operationQuery } from "@/features/operation/queries";
import { Button } from "@/ui/button";
import { vehicleQuery } from "../queries";
import type { Vehicle } from "../types";

export const VehicleCell = ({
  tenantId,
  operationId,
  vehicleId,
}: {
  tenantId: Tenant["id"];
  operationId?: Operation["id"];
  vehicleId?: Vehicle["id"];
}) => {
  const operation = useQuery(operationQuery(tenantId, operationId));
  const vehicle = useQuery(
    vehicleQuery(tenantId, vehicleId ? vehicleId : operation.data?.vehicleId),
  );

  return vehicle.isPending ? (
    "Loading..."
  ) : vehicle.isError ? (
    "Error"
  ) : (
    <Button
      asChild
      variant="ghost"
      className="text-foreground -ml-1 w-fit pl-1"
    >
      <Link
        to="/tenants/$tenantId/vehicles/$vehicleId"
        params={{
          tenantId,
          vehicleId: vehicle.data.id,
        }}
      >
        <div>
          <h3 className="text-sm/tight">
            {vehicle.data.nickname
              ? [vehicle.data.nickname, vehicle.data.fullName].join(" - ")
              : vehicle.data.fullName}
          </h3>
          <h4 className="text-muted-foreground text-sm/tight">
            {vehicle.data.licensePlate}
          </h4>
        </div>
      </Link>
    </Button>
  );
};
