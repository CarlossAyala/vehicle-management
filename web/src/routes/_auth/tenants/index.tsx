import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { EllipsisIcon } from "lucide-react";
import type { Tenant } from "@/features/tenant/types";
import { tenantsQuery } from "@/features/tenant/queries";
import { DataTable } from "@/components/data-table";
import { Page, PageContent, PageHeader, PageTitle } from "@/components/page";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { CreateTenant } from "./-components/create-tenant";

export const Route = createFileRoute("/_auth/tenants/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [search, setSearch] = useState("");

  const { isPending, isError, data } = useQuery(tenantsQuery);
  const tenants = !data
    ? []
    : !search
      ? data
      : data.filter((tenant) => {
          return tenant.name.toLowerCase().includes(search.toLowerCase());
        });

  const columns = useMemo((): ColumnDef<Tenant>[] => {
    return [
      {
        accessorKey: "name",
        header: "Name",
        cell: (props) => {
          const { id, name } = props.row.original;

          return (
            <Button asChild variant="link" className="p-0">
              <Link to="/tenants/$tenantId" params={{ tenantId: id }}>
                {name}
              </Link>
            </Button>
          );
        },
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: (props) => {
          const { type } = props.row.original;

          return <span className="capitalize">{type}</span>;
        },
      },
      {
        accessorKey: "description",
        header: "About",
        cell: (props) => {
          const { description } = props.row.original;

          return (
            <div>
              <p className="text-muted-foreground line-clamp-1 text-sm">
                {description ? description : "-"}
              </p>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: () => {
          return (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                alert("#TODO: Implement tenant actions");
              }}
            >
              <EllipsisIcon />
            </Button>
          );
        },
      },
    ];
  }, []);

  return (
    <Page>
      <PageHeader>
        <div className="grid grid-cols-8 items-center">
          <PageTitle className="col-span-6 mb-0">
            <h2>Tenants List</h2>
          </PageTitle>
          <div className="col-span-2 flex justify-end">
            <CreateTenant />
          </div>
        </div>
      </PageHeader>

      <PageContent className="space-y-4">
        <Input
          placeholder="Search"
          className="max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {isPending ? (
          "Loading..."
        ) : isError ? (
          "Error "
        ) : (
          <DataTable columns={columns} data={tenants} />
        )}
      </PageContent>
    </Page>
  );
}
