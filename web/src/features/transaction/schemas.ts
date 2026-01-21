import z from "zod";
import { createOperationSchema } from "../operation/schemas";

const transaction = z.object({
  type: z.enum(["income", "expense"]),
  description: z.string(),
});

const item = z.object({
  amount: z.number().min(0),
  description: z.string(),
  categoryId: z.string().min(1, "Category is required"),
});
const items = z.array(item).min(1, "At least one item is required");

export const createTransactionSchema = createOperationSchema.extend({
  transaction,
  items,
});
export const updateTransactionSchema = createTransactionSchema.omit({
  vehicleId: true,
});
