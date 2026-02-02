import { toast } from "sonner";
import { useRemoveInvitation } from "@/features/invitation/queries";
import type { Invitation } from "@/features/invitation/types";
import { Button } from "@/ui/button";

export const TenantInvitationActions = ({
  invitation,
}: {
  invitation: Invitation;
}) => {
  const { mutate, isPending } = useRemoveInvitation();

  const handler = () => {
    mutate(
      { tenantId: invitation.tenantId, id: invitation.id },
      {
        onSuccess: () => {
          toast.success("Invitation removed");
        },
        onError: () => {
          toast.error("Failed to remove invitation");
        },
      },
    );
  };

  return (
    <Button
      type="button"
      onClick={handler}
      disabled={isPending || isPending}
      size="sm"
      variant="outline"
    >
      {isPending ? "Removing..." : "Remove"}
    </Button>
  );
};
