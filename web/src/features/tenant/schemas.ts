import * as z from "zod";

const name = z.string().min(1, "Name is required");
const description = z.string();
const type = z.string().min(1, "You must select a type tenant to continue.");

export const createTenantSchema = z.object({
  name,
  description,
  type,
});
