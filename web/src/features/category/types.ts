import type { OperationType } from "../operation/types";
import type { Tenant } from "../tenant/types";

// TODO: move this to features/operation

export interface Category {
  id: string;
  name: string;
  source: OperationType;
  tenantId: Tenant["id"];
  createdAt: string;
  updatedAt: string;
}
