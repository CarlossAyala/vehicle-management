import { useSuspenseQuery } from "@tanstack/react-query";
import { BadgeCheck, Bell, CreditCard, LogOut, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Spinner } from "@/ui/spinner";
import { profileQuery, useLogout } from "../queries";

export const NavUser = () => {
  const { data } = useSuspenseQuery(profileQuery);
  const { mutate, isPending } = useLogout();

  const handleLogout = (e: Event) => {
    e.preventDefault();
    mutate(undefined);
  };

  const user = data!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="h-10 w-10 rounded">
          {/* TODO: add user avatar */}
          {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
          <AvatarImage src={undefined} alt={user.firstName} />
          <AvatarFallback className="rounded-lg">
            {user.initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-10 w-10 rounded-lg">
              {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
              <AvatarImage src={undefined} alt={user.firstName} />
              <AvatarFallback className="rounded-lg">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.firstName}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Sparkles />
            Upgrade to Pro
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheck />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={isPending} onSelect={handleLogout}>
          <LogOut />
          {isPending ? "Logging out..." : "Log out"}

          {isPending ? (
            <div className="ml-auto">
              <Spinner />
            </div>
          ) : null}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
