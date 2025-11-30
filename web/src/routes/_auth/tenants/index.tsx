import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { tenantsQuery } from "@/features/tenant/queries";
import { CardTenant } from "@/features/tenant/components/card-tenant";
import { Input } from "@/ui/input";
import { Page, PageContent, PageHeader, PageTitle } from "@/components/page";

export const Route = createFileRoute("/_auth/tenants/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [search, setSearch] = useState("");

  const { data } = useSuspenseQuery(tenantsQuery);
  const tenants = !search
    ? data
    : data.filter((tenant) => {
        return tenant.name.toLowerCase().includes(search.toLowerCase());
      });

  return (
    <Page>
      <PageHeader>
        <PageTitle>Tenants List</PageTitle>
      </PageHeader>

      <PageContent>
        <Input
          placeholder="Search"
          className="max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {tenants.length ? (
          <ul className="grid gap-5 sm:grid-cols-2 md:flex md:flex-wrap">
            {tenants.map((tenant) => (
              <li key={tenant.id} className="inline-grid">
                <CardTenant tenant={tenant} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="max-w-md">
            <p className="text-muted-foreground text-sm">
              No tenants found matching "
              <code className="text-pretty whitespace-break-spaces">
                <span className="font-medium">{search}</span>
              </code>
              ".
            </p>
          </div>
        )}
      </PageContent>
    </Page>
  );
}
