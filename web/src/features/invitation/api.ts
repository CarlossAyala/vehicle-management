import { API_URL } from "@/lib/utils";
import type { Invitation } from "./types";

export const getInvitations = async (): Promise<Invitation[]> => {
  const response = await fetch(`${API_URL}/invitations`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch invitations");
  }

  return response.json();
};
