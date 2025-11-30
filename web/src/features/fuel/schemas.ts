import * as z from "zod";
import { filterSchema } from "@/lib/filters";
import { createOperationSchema } from "../operation/schemas";
import { FUEL_SORT_FIELDS } from "./constants";

const quantity = z.number().min(0.01);
const amount = z.number().min(0.01);
const description = z.string().optional();
const categoryId = z.string().min(1, "Category is required");

const sort = z
  .enum(Object.values(FUEL_SORT_FIELDS))
  .default(FUEL_SORT_FIELDS.CREATED_AT)
  .catch(FUEL_SORT_FIELDS.CREATED_AT);

export const fuelSchema = z.object({
  quantity,
  amount,
  description,
  categoryId,
});

export const createFuelSchema = createOperationSchema.extend({
  fuel: fuelSchema,
});

export const updateFuelSchema = createFuelSchema
  .partial()
  .omit({ vehicleId: true });

export const fuelFilterSchema = filterSchema.extend({
  sort,
});
