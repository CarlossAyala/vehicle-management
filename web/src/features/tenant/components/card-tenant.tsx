import { Link } from "@tanstack/react-router";
import { ArrowRight as ArrowRightIcon } from "lucide-react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import { cn } from "@/lib/utils";
import type { Tenant } from "../types";
import { getTenantIcon } from "../utils";

export const CardTenant = ({ tenant }: { tenant: Tenant }) => {
  const TenantTypeIcon = getTenantIcon(tenant.type);

  return (
    <Link
      to="/tenants/$tenantId"
      params={{
        tenantId: tenant.id,
      }}
      className="group rounded-xl md:min-w-72"
    >
      <Card className="group-hover:bg-accent">
        <CardHeader>
          <CardTitle className="line-clamp-1">{tenant.name}</CardTitle>
          <CardDescription
            className={cn(tenant.description ? "line-clamp-2" : "italic")}
          >
            {tenant.description ? tenant.description : "No description"}
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-between">
          <TenantTypeIcon className="size-5" />
          <ArrowRightIcon className="text-primary size-5" />
        </CardFooter>
      </Card>
    </Link>
  );
};
