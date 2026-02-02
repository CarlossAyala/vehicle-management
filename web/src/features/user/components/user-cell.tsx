import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import type { Tenant } from "@/features/tenant/types";
import { operationQuery } from "@/features/operation/queries";
import type { Operation } from "@/features/operation/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Button } from "@/ui/button";
import type { User } from "../types";
import { userQuery } from "../queries";
import { profileQuery } from "@/features/auth/queries";

// TODO: add a section to view tenant members and member details
export const UserCell = ({
  tenantId,
  operationId,
  userId,
}: {
  tenantId: Tenant["id"];
  operationId?: Operation["id"];
  userId?: User["id"];
}) => {
  const { data: auth } = useSuspenseQuery(profileQuery);

  const operation = useQuery(operationQuery(tenantId, operationId));
  const user = useQuery(
    userQuery(tenantId, userId ? userId : operation.data?.authorId),
  );

  return user.isPending ? (
    "Loading..."
  ) : user.isError ? (
    "Error"
  ) : (
    <Button
      variant="ghost"
      className="text-foreground -ml-1 w-fit pl-1"
      onClick={() => alert("#TODO: Add link to member details")}
    >
      <div className="flex items-center gap-2">
        <Avatar className="border">
          <AvatarImage src={undefined} alt="Avatar" />
          <AvatarFallback>{user.data.initials}</AvatarFallback>
        </Avatar>
        <div className="text-left">
          <p className="text-sm/tight font-medium">
            {user.data.fullName}
            {auth?.id === user.data.id ? (
              <span className="ml-2">{"(You)"}</span>
            ) : null}
          </p>
          <p className="text-muted-foreground text-sm/tight">
            {user.data.email}
          </p>
        </div>
      </div>
    </Button>
  );
};
