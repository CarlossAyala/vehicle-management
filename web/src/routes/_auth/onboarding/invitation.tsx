import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/onboarding/invitation")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_auth/onboarding/invitation"!</div>;
}
