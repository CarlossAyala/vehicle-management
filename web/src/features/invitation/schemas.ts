import z from "zod";

export const createInvitationSchema = z.object({
  email: z.email(),
  role: z.string().min(1, "Role is required."),
});

export const acceptInvitationSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  password: z.string().min(8),
});
