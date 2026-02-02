import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { profileQuery } from "@/features/auth/queries";
import { TailwindDevtools } from "@/components/tailwind-devtools";
import { ThemeProvider } from "@/theme/providers/theme-provider";
import { queryClient } from "@/lib/utils";
import { Toaster } from "@/ui/sonner";

export const Route = createRootRoute({
  component: RootLayout,
  beforeLoad: async () => {
    await queryClient.ensureQueryData(profileQuery);
  },
});

function RootLayout() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Outlet />
      <Toaster position="top-center" />
      <ReactQueryDevtools initialIsOpen={false} />
      <TanStackRouterDevtools />
      <TailwindDevtools />
    </ThemeProvider>
  );
}
