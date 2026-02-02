import { NavUser } from "@/features/auth/components/nav-user";
import { SidebarTrigger } from "@/ui/sidebar";

export const AppHeader = () => {
  return (
    <header className="bg-background sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
      <SidebarTrigger />
      <NavUser />
    </header>
  );
};
