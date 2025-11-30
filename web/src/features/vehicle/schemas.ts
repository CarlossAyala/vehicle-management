import * as z from "zod";
import { filterSchema } from "@/lib/filters";
import { VEHICLE_SORT_FIELDS } from "./constants";

const nickname = z.string().optional();
const brand = z.string().min(1, "Brand is required");
const model = z.string().min(1, "Model is required");
const variant = z.string().optional();
const year = z.number().min(2, "Year is required");
const licensePlate = z.string().min(6, "License plate is required");
const type = z.string().min(1, "You must select a type to continue.");
const status = z.string().min(1, "You must select a status to continue.");

export const createVehicleSchema = z.object({
  nickname,
  brand,
  model,
  variant,
  year,
  licensePlate,
  type,
  status,
});
export const updateVehicleSchema = createVehicleSchema.partial();

const sort = z
  .enum(Object.values(VEHICLE_SORT_FIELDS))
  .default(VEHICLE_SORT_FIELDS.CREATED_AT)
  .catch(VEHICLE_SORT_FIELDS.CREATED_AT);

export const vehiclesFilterSchema = filterSchema
  .extend({
    sort,
  })
  .partial();
export const DEFAULT_VEHICLES_FILTERS = vehiclesFilterSchema.parse({});
