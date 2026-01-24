import { createFileRoute, redirect } from "@tanstack/react-router";
import { profileQuery } from "@/features/auth/queries";
import { queryClient } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  beforeLoad: async ({ location }) => {
    const user = await queryClient.ensureQueryData(profileQuery);

    if (user && location.pathname === "/") {
      throw redirect({
        to: "/tenants",
      });
    }
  },
});

function RouteComponent() {
  return <div>Hello "/"!</div>;
}
