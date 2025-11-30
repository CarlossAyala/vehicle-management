import { createRootRoute, Outlet, redirect } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { profileQuery } from "@/features/auth/queries";
import { tenantsQuery } from "@/features/tenant/queries";
import { invitationsQuery } from "@/features/invitation/queries";
import { getOnboardingStep } from "@/features/onboarding/utils";
import { OnboardingSteps } from "@/features/onboarding/types";
import { TailwindDevtools } from "@/components/tailwind-devtools";
import { ThemeProvider } from "@/theme/providers/theme-provider";
import { queryClient } from "@/lib/utils";
import { Toaster } from "@/ui/sonner";

const RootLayout = () => {
  console.log("Component: __root");

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Outlet />
      <Toaster position="top-center" />
      <ReactQueryDevtools initialIsOpen={false} />
      <TanStackRouterDevtools />
      <TailwindDevtools />
    </ThemeProvider>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
  beforeLoad: async ({ location }) => {
    console.log("beforeLoad: __root");

    const user = await queryClient.ensureQueryData(profileQuery);

    if (user) {
      // setup onboarding
      const [invitations, tenants] = await Promise.all([
        queryClient.ensureQueryData(invitationsQuery),
        queryClient.ensureQueryData(tenantsQuery),
      ]);
      const step = getOnboardingStep(invitations, tenants);
      if (
        !location.pathname.startsWith("/onboarding") ||
        location.pathname === "/onboarding"
      ) {
        switch (step) {
          case OnboardingSteps.NEW_USER:
            throw redirect({
              to: "/onboarding/create-tenant",
            });
          case OnboardingSteps.INVITED_USER:
            throw redirect({
              to: "/onboarding/invitation",
            });
        }
      }
    }
  },
});
