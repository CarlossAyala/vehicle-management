import { useMemo } from "react";
import {
  createFileRoute,
  Link,
  stripSearchParams,
} from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { fuelFilterSchema } from "@/features/fuel/schemas";
import { fuelsQuery } from "@/features/fuel/queries";
import { getFuelColumns } from "@/features/fuel/components/columns";
import { DataTable } from "@/components/data-table";
import { Page, PageContent, PageHeader, PageTitle } from "@/components/page";
import { Button } from "@/ui/button";
import { queryClient } from "@/lib/utils";

export const Route = createFileRoute("/_auth/tenants/$tenantId/fuel/")({
  component: RouteComponent,
  validateSearch: fuelFilterSchema,
  search: {
    middlewares: [stripSearchParams(fuelFilterSchema.parse({}))],
  },
  loaderDeps: ({ search }) => {
    const { page, limit, sort, order, q } = search;

    return {
      page,
      limit,
      sort,
      order,
      q,
    };
  },
  beforeLoad: async ({ params, search }) => {
    return queryClient.ensureQueryData(fuelsQuery(params.tenantId, search));
  },
});

function RouteComponent() {
  const { tenantId } = Route.useParams();
  const search = Route.useSearch();

  const { data: fuels } = useSuspenseQuery(fuelsQuery(tenantId, search));

  const fuelColumns = useMemo(() => getFuelColumns(tenantId), []);

  return (
    <Page>
      <PageHeader>
        <div className="grid grid-cols-8 items-center">
          <PageTitle className="col-span-6 mb-0">
            <h2>Fuel List</h2>
          </PageTitle>
          <div className="col-span-2 flex justify-end">
            <Button asChild>
              <Link to="/tenants/$tenantId/fuel/create" params={{ tenantId }}>
                Add new
              </Link>
            </Button>
          </div>
        </div>
      </PageHeader>

      <PageContent className="flex-1">
        <DataTable columns={fuelColumns} data={fuels.data} />
      </PageContent>
    </Page>
  );
}
