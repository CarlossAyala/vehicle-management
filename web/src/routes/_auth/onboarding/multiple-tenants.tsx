import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/onboarding/multiple-tenants")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_auth/onboarding/multiple-tenants"!</div>;
}
