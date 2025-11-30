import * as z from "zod";
import type { Tenant } from "../tenant/types";
import type {
  createVehicleSchema,
  updateVehicleSchema,
  vehiclesFilterSchema,
} from "./schemas";

export const VehicleTypeConfig = {
  car: { label: "Car", variant: "secondary" as const },
  truck: { label: "Truck", variant: "secondary" as const },
  motorcycle: { label: "Motorcycle", variant: "secondary" as const },
  van: { label: "Van", variant: "secondary" as const },
} as const;

export const VehicleStatusConfig = {
  in_use: { label: "In Use", variant: "default" as const },
  available: { label: "Available", variant: "secondary" as const },
  maintenance: { label: "Maintenance", variant: "destructive" as const },
  inactive: { label: "Inactive", variant: "outline" as const },
} as const;

// Derived constants
export const VehicleTypes = {
  CAR: "car",
  TRUCK: "truck",
  MOTORCYCLE: "motorcycle",
  VAN: "van",
} as const;

export const VehicleStatuses = {
  IN_USE: "in_use",
  AVAILABLE: "available",
  MAINTENANCE: "maintenance",
  INACTIVE: "inactive",
} as const;

export type VehicleType = keyof typeof VehicleTypeConfig;
export type VehicleStatus = keyof typeof VehicleStatusConfig;

export const VehicleTypesItems = Object.entries(VehicleTypeConfig).map(
  ([value, config]) => ({
    label: config.label,
    value: value as VehicleType,
  }),
);

export const VehicleStatusesItems = Object.entries(VehicleStatusConfig).map(
  ([value, config]) => ({
    label: config.label,
    value: value as VehicleStatus,
  }),
);

export interface Vehicle {
  id: string;
  nickname: string;
  brand: string;
  model: string;
  variant: string;
  year: number;
  licensePlate: string;
  type: VehicleType;
  status: VehicleStatus;
  fullName: string;
  tenantId: Tenant["id"];
  createdAt: string;
  updatedAt: string;
}

export type CreateVehicleSchema = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleSchema = z.infer<typeof updateVehicleSchema>;

export interface CreateVehicleProps {
  tenantId: Tenant["id"];
  values: CreateVehicleSchema;
}
export interface UpdateVehicleProps {
  tenantId: Tenant["id"];
  id: Vehicle["id"];
  values: UpdateVehicleSchema;
}
export interface VehicleProps {
  tenantId: Tenant["id"];
  id: Vehicle["id"];
}

export type VehicleFilter = z.infer<typeof vehiclesFilterSchema>;
