import type { User } from "../user/types";
import type { Tenant } from "../tenant/types";
import type { Vehicle } from "../vehicle/types";
import type { Odometer } from "../odometer/types";

export const OperationTypes = {
  FUEL: "fuel",
  ODOMETER: "odometer",
  SERVICE: "service",
  TRANSACTION: "transaction",
  EXPENSE: "expense",
  INCOME: "income",
  VEHICLE_LIFECYCLE: "vehicle_lifecycle",
  DRIVER_ASSIGNMENT: "driver_assignment",
  REMINDER: "reminder",
  CHECKLIST: "checklist",
  ROUTE: "route",
} as const;

export type OperationType =
  (typeof OperationTypes)[keyof typeof OperationTypes];

export interface Operation {
  id: string;
  type: OperationType;
  tenantId: Tenant["id"];
  vehicleId: Vehicle["id"];
  authorId: User["id"];
  createdAt: string;
  updatedAt: string;
}

export interface BaseOperationResponse {
  operation: Operation;
}
export interface OperationWithOdometerResponse extends BaseOperationResponse {
  odometer?: Odometer;
}
