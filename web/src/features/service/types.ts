import type z from "zod";
import type { Category } from "../category/types";
import type { Operation } from "../operation/types";
import type { createServiceSchema, updateServiceSchema } from "./schemas";

export interface Service {
  id: string;
  description: string;
  operationId: Operation["id"];
  createdAt: string;
  updatedAt: string;
}

export interface ServiceItem {
  id: string;
  amount: number;
  description: string;
  serviceId: Service["id"];
  categoryId: Category["id"];
  createdAt: string;
  updatedAt: string;
}

export type CreateServiceSchema = z.infer<typeof createServiceSchema>;
export type UpdateServiceSchema = z.infer<typeof updateServiceSchema>;
