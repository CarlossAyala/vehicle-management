import { queryOptions } from "@tanstack/react-query";
import type { Invitation } from "./types";
import { getInvitations } from "./api";

export const invitationKeys = {
  key: () => ["invitations"] as const,
  list: () => [...invitationKeys.key(), "list"] as const,
  detail: (id: Invitation["id"]) => {
    return [...invitationKeys.key(), "detail", id] as const;
  },
};

export const invitationsQuery = queryOptions({
  queryKey: invitationKeys.list(),
  queryFn: getInvitations,
});
