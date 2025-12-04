import z from "zod";
import { createOperationSchema } from "../operation/schemas";

const service = z.object({
  description: z.string(),
});

const item = z.object({
  amount: z.number().int().nonnegative(),
  description: z.string(),
  categoryId: z.string().min(1, "Category is required"),
});

const items = z.array(item).min(1, "At least one item is required");

export const createServiceSchema = createOperationSchema.extend({
  service,
  items,
});
export const updateServiceSchema = createOperationSchema
  .extend({
    service,
  })
  .omit({
    vehicleId: true,
  })
  .partial();
export const serviceItemSchema = item;
