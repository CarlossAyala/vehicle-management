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

      <ul className="list-disc">
        <li>
          Now this is a story all about how, my life got flipped-turned upside
          down
        </li>
      </ul>
    </section>
  );
}
