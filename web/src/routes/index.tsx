import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="grid gap-4">
      <div>Hello "/"!</div>

      <ul className="list-disc">
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/tenants">Tenants</Link>
        </li>
      </ul>
    </section>
  );
}
