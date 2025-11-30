import * as z from "zod";

export const odometerSchema = z.object({
  value: z.number().int().nonnegative().optional(),
  description: z.string().optional(),
});

const vehicleId = z.string().min(1, "Vehicle is required");

export const createOperationSchema = z.object({
  vehicleId,
  odometer: odometerSchema.optional().catch({ value: 0, description: "" }),
});
