import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { invitationsUserQuery } from "@/features/invitation/queries";
import type { Invitation } from "@/features/invitation/types";
import { getRoleLabel } from "@/features/tenant/utils";
import { Input } from "@/ui/input";
import { Page, PageContent, PageHeader, PageTitle } from "@/components/page";
import { DataTable } from "@/components/data-table";
import { UserInvitationActions } from "@/components/user-invitation-actions";

export const Route = createFileRoute("/_auth/invitations/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isPending, isError, data } = useQuery(invitationsUserQuery({}));

  const columns = useMemo((): ColumnDef<Invitation>[] => {
    return [
      {
        accessorKey: "tenantId",
        header: "Tenant",
        cell: (props) => {
          const { tenant } = props.row.original;

          return tenant?.name;
        },
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: (props) => {
          const { role } = props.row.original;

          return getRoleLabel(role);
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: (props) => {
          return <UserInvitationActions invitation={props.row.original} />;
        },
      },
    ];
  }, []);

  return (
    <Page>
      <PageHeader>
        <PageTitle className="col-span-6 mb-0">
          <h2>Invitations List</h2>
        </PageTitle>
      </PageHeader>

      <PageContent className="space-y-4">
        <Input
          placeholder="Search"
          className="max-w-sm"
          onChange={() => alert("#TODO: Add this feature")}
        />

        {isPending ? (
          "Loading..."
        ) : isError ? (
          "Error "
        ) : (
          <DataTable columns={columns} data={data} />
        )}
      </PageContent>
    </Page>
  );
}
