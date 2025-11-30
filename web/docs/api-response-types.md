# API Response Types Pattern

This document outlines how to type API responses for operations that return different combinations of operation, entity, and optional odometer.

## Base Response Types

### Core Response Interface

```typescript
// src/types/api-responses.ts
import type { Operation } from "../features/operation/types";
import type { Odometer } from "../features/odometer/types";

export interface BaseOperationResponse {
  operation: Operation;
}

export interface OperationWithOdometerResponse extends BaseOperationResponse {
  odometer?: Odometer;
}
```

## Entity-Specific Response Types

### Fuel Response

```typescript
// src/features/fuel/types.ts
import type { OperationWithOdometerResponse } from "../../types/api-responses";

export interface Fuel {
  id: string;
  amount: number;
  pricePerUnit: number;
  totalCost: number;
  fuelType: string;
  operationId: string;
}

export interface FuelResponse extends OperationWithOdometerResponse {
  fuel: Fuel;
}
```

### Service Response

```typescript
// src/features/service/types.ts
import type { OperationWithOdometerResponse } from "../../types/api-responses";

export interface Service {
  id: string;
  type: string;
  description: string;
  cost: number;
  operationId: string;
}

export interface ServiceItem {
  id: string;
  categoryId: string;
  description: string;
  cost: number;
  serviceId: string;
}

export interface ServiceResponse extends OperationWithOdometerResponse {
  service: Service;
  items: ServiceItem[];
}
```

### Transaction Response

```typescript
// src/features/transaction/types.ts
import type { OperationWithOdometerResponse } from "../../types/api-responses";

export interface Transaction {
  id: string;
  amount: number;
  type: "income" | "expense";
  operationId: string;
}

export interface TransactionItem {
  id: string;
  categoryId: string;
  description: string;
  amount: number;
  transactionId: string;
}

export interface TransactionResponse extends OperationWithOdometerResponse {
  transaction: Transaction;
  items: TransactionItem[];
}
```

### Odometer Response (Special Case)

```typescript
// src/features/odometer/types.ts
import type { BaseOperationResponse } from "../../types/api-responses";

export interface Odometer {
  id: string;
  value: number;
  unit: string;
  operationId: string;
}

// Odometer doesn't extend OperationWithOdometerResponse since it IS the odometer
export interface OdometerResponse extends BaseOperationResponse {
  odometer: Odometer;
}
```

## Usage in API Calls

### Typed API Functions

```typescript
// src/api/fuel.ts
import type { FuelResponse } from "../features/fuel/types";
import type { CreateFuelInput, UpdateFuelInput } from "../schemas/fuel";

export async function createFuel(data: CreateFuelInput): Promise<FuelResponse> {
  // API call implementation
}

export async function updateFuel(id: string, data: UpdateFuelInput): Promise<FuelResponse> {
  // API call implementation
}
```

### React Query Integration

```typescript
// src/features/fuel/hooks/use-fuel-mutations.ts
import { useMutation } from "@tanstack/react-query";
import type { FuelResponse } from "../types";
import { createFuel } from "../../../api/fuel";

export function useCreateFuel() {
  return useMutation<FuelResponse, Error, CreateFuelInput>({
    mutationFn: createFuel,
  });
}
```

## Pattern Summary

- **BaseOperationResponse**: Contains only `operation`
- **OperationWithOdometerResponse**: Extends base with optional `odometer`
- **Entity Responses**: Extend `OperationWithOdometerResponse` and add entity-specific data
- **OdometerResponse**: Special case that extends `BaseOperationResponse` with required `odometer`

This pattern ensures type safety while reflecting your backend's response structure where most operations can optionally include odometer data, except when creating odometer records directly.