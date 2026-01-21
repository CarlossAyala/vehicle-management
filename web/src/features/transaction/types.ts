import type { Operation } from "../operation/types";
import type { Category } from "../category/types";
import type z from "zod";
import type {
  createTransactionSchema,
  updateTransactionSchema,
} from "./schemas";

export interface Transaction {
  id: string;
  type: "income" | "expense";
  description: string;
  operationId: Operation["id"];
  createdAt: string;
  updatedAt: string;
}

export interface TransactionItem {
  id: string;
  amount: number;
  description: string;
  transactionId: Transaction["id"];
  categoryId: Category["id"];
  createdAt: string;
  updatedAt: string;
}

export type CreateTransactionSchema = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionSchema = z.infer<typeof updateTransactionSchema>;
