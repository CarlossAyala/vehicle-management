import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/for-you")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_auth/for-you"!</div>;
}
