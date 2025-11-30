import z from "zod";
import { filterSchema } from "@/lib/filters";
import { createOperationSchema, odometerSchema } from "../operation/schemas";
import { ODOMETER_SORT_FIELDS } from "./constants";

const sort = z
  .enum(Object.values(ODOMETER_SORT_FIELDS))
  .default(ODOMETER_SORT_FIELDS.CREATED_AT)
  .catch(ODOMETER_SORT_FIELDS.CREATED_AT);

export const createOdometerSchema = createOperationSchema
  .omit({
    odometer: true,
  })
  .extend({
    odometer: odometerSchema,
  });
export const updateOdometerSchema = createOdometerSchema
  .omit({ vehicleId: true })
  .partial();

export const odometerFilterSchema = filterSchema
  .extend({
    sort,
  })
  .partial();
