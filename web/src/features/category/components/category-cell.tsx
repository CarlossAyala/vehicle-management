import { useQuery } from "@tanstack/react-query";
import type { Tenant } from "@/features/tenant/types";
import { Button } from "@/ui/button";
import type { Category } from "../types";
import { categoryQuery } from "../queries";
// import { Link } from "@tanstack/react-router";

// TODO: Add link to category info
export const CategoryCell = ({
  tenantId,
  categoryId,
}: {
  tenantId: Tenant["id"];
  categoryId: Category["id"];
}) => {
  const category = useQuery(categoryQuery(tenantId, categoryId));

  return category.isPending ? (
    "Loading..."
  ) : category.isError ? (
    "Error"
  ) : (
    <Button
      variant="link"
      className="text-foreground w-fit px-0"
      onClick={() => alert("TODO: Add link to category info")}
    >
      {/* <Link
        to="/tenants/$tenantId/vehicles/$vehicleId"
        params={{
          tenantId,
          vehicleId: vehicle.data.id,
        }}
      > */}
      <div>
        <h3 className="text-sm/tight">{category.data.name}</h3>
      </div>
      {/* </Link> */}
    </Button>
  );
};
