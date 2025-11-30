import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { profileQuery } from "@/features/auth/queries";
import { queryClient } from "@/lib/utils";

export const Route = createFileRoute("/_guest")({
  component: RouteComponent,
  beforeLoad: () => {
    console.log("beforeLoad: /_guest");

    const user = queryClient.getQueryData(profileQuery.queryKey);

    if (user) {
      throw redirect({
        to: "/",
      });
    }
  },
});

function RouteComponent() {
  console.log("Component: /_guest");

  return <Outlet />;
}
