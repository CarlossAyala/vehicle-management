import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { Tenant } from "@/features/tenant/types";
import { Button } from "@/ui/button";
import { operationEntityQuery } from "../queries";
import type { Operation } from "../types";

interface Props {
  tenantId: Tenant["id"];
  operationId: Operation["id"];
}

export const OperationTypeCell = ({ tenantId, operationId }: Props) => {
  const { isPending, isError, data } = useQuery(
    operationEntityQuery(tenantId, operationId),
  );

  return isPending ? (
    "Loading..."
  ) : isError ? (
    "Error"
  ) : (
    <Button variant="link" className="text-foreground w-fit p-0" asChild>
      {data.operation.type === "fuel" ? (
        <Link
          to="/tenants/$tenantId/fuel/$fuelId"
          params={{
            tenantId,
            fuelId: data.entity.id,
          }}
          search={{
            from: "odometer",
          }}
        >
          Fuel
        </Link>
      ) : data.operation.type === "odometer" ? (
        <Link
          to="/tenants/$tenantId/odometer/$odometerId"
          params={{
            tenantId,
            odometerId: data.entity.id,
          }}
        >
          Odometer
        </Link>
      ) : (
        // "#TODO: add others operation types
        "Unknown"
      )}
    </Button>
  );
};
