import { toast } from "sonner";
import {
  useAcceptInvitation,
  useRejectInvitation,
} from "@/features/invitation/queries";
import type { Invitation } from "@/features/invitation/types";
import { Button } from "@/ui/button";

export const UserInvitationActions = ({
  invitation,
}: {
  invitation: Invitation;
}) => {
  const accept = useAcceptInvitation();
  const reject = useRejectInvitation();

  const handleAccept = () => {
    accept.mutate(
      { id: invitation.id },
      {
        onSuccess: () => {
          toast.success("Invitation accepted");
        },
        onError: () => {
          toast.error("Failed to accept invitation");
        },
      },
    );
  };
  const handleReject = () => {
    reject.mutate(
      { id: invitation.id },
      {
        onSuccess: () => {
          toast.success("Invitation rejected");
        },
        onError: () => {
          toast.error("Failed to reject invitation");
        },
      },
    );
  };

  return (
    <div className="flex gap-4">
      <Button
        type="button"
        onClick={handleAccept}
        disabled={accept.isPending || reject.isPending}
        size="sm"
        variant="outline"
      >
        {accept.isPending ? "Accepting..." : "Accept"}
      </Button>
      <Button
        type="button"
        onClick={handleReject}
        disabled={accept.isPending || reject.isPending}
        variant="ghost"
        size="sm"
      >
        {reject.isPending ? "Rejecting..." : "Reject"}
      </Button>
    </div>
  );
};
