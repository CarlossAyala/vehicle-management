import * as z from "zod";
import type { BaseOperationResponse, Operation } from "../operation/types";
import type { Tenant } from "../tenant/types";
import type {
  createOdometerSchema,
  odometerFilterSchema,
  updateOdometerSchema,
} from "./schemas";

export interface Odometer {
  id: string;
  value: number;
  description: string;
  operationId: Operation["id"];
  createdAt: string;
  updatedAt: string;
}

export type CreateOdometerSchema = z.infer<typeof createOdometerSchema>;
export type UpdateOdometerSchema = z.infer<typeof updateOdometerSchema>;

export interface BaseOdometerProps {
  tenantId: Tenant["id"];
  id: Odometer["id"];
}

export type CreateOdometerProps = Omit<BaseOdometerProps, "id"> & {
  values: CreateOdometerSchema;
};
export type UpdateOdometerProps = BaseOdometerProps & {
  values: UpdateOdometerSchema;
};
export interface RemoveOdometerProps extends BaseOdometerProps {}

export interface OdometerResponse extends BaseOperationResponse {
  odometer: Odometer;
}

export type OdometerFilters = z.infer<typeof odometerFilterSchema>;
