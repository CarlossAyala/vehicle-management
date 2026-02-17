import z from "zod";

const name = z.string().min(1, "Name is required");
const description = z.string();
const type = z.string().min(1, "You must select a type tenant to continue.");

export const createTenantSchema = z.object({
  name,
  description,
  type,
});

export const updateTenantSchema = z.object({
  name,
  description,
});

export const updateRolesSchema = z.object({
  roles: z.array(z.string()).min(1, "At least one role is required"),
});
