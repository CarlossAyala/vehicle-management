import * as z from "zod";
import type { Category } from "../category/types";
import type {
  Operation,
  OperationWithOdometerResponse,
} from "../operation/types";
import type { Tenant } from "../tenant/types";
import type { Odometer } from "../odometer/types";
import type {
  createFuelSchema,
  fuelFilterSchema,
  updateFuelSchema,
} from "./schemas";

export interface Fuel {
  id: string;
  quantity: number;
  amount: number;
  description: string;
  operationId: Operation["id"];
  categoryId: Category["id"];
  createdAt: string;
  updatedAt: string;
}

export type CreateFuelSchema = z.infer<typeof createFuelSchema>;
export type UpdateFuelSchema = z.infer<typeof updateFuelSchema>;

export interface BaseFuelProps {
  tenantId: Tenant["id"];
  id: Fuel["id"];
}

export type CreateFuelProps = Omit<BaseFuelProps, "id"> & {
  values: CreateFuelSchema;
};

export type UpdateFuelProps = BaseFuelProps & {
  values: UpdateFuelSchema;
};
export interface RemoveFuelProps extends BaseFuelProps {}

export interface FuelResponse extends OperationWithOdometerResponse {
  fuel: Fuel;
}
export interface FuelRemoveResponse {
  operationId: Operation["id"];
  id: Fuel["id"];
  odometerId?: Odometer["id"];
}

export type FuelFilters = z.infer<typeof fuelFilterSchema>;
