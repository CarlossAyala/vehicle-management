import { createFileRoute, redirect } from "@tanstack/react-router";
import { tenantsQuery } from "@/features/tenant/queries";
import { getOnboardingStep } from "@/features/onboarding/utils";
import { invitationsQuery } from "@/features/invitation/queries";
import { queryClient } from "@/lib/utils";
import { CreateTenantForm } from "./-components/create-tenant-form";

export const Route = createFileRoute("/_auth/onboarding/create-tenant")({
  component: RouteComponent,
  beforeLoad: async () => {
    console.log("beforeLoad: /_auth/onboarding/create-tenant");

    const [invitations, tenants] = await Promise.all([
      queryClient.ensureQueryData(invitationsQuery),
      queryClient.ensureQueryData(tenantsQuery),
    ]);

    const step = getOnboardingStep(invitations, tenants);
    if (step !== "new-user") {
      throw redirect({
        to: "/",
      });
    }
  },
});

function RouteComponent() {
  console.log("Component: /_auth/onboarding/create-tenant");

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <CreateTenantForm />
      </div>
    </div>
  );
}
