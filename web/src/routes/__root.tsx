import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TailwindDevtools } from "@/components/tailwind-devtools";
import { ThemeProvider } from "@/theme/providers/theme-provider";
import { Toaster } from "@/ui/sonner";

const RootLayout = () => {
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
});
