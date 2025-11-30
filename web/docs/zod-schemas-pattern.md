# Zod Schemas Pattern for Frontend Forms

This document outlines how to create Zod schemas that mirror your backend DTOs for consistent validation across frontend and backend.

## Base Schema Structure

### 1. Create Base Operation Schema

```typescript
// src/schemas/base.ts
import { z } from "zod";

export const createOperationSchema = z.object({
  vehicleId: z.string().uuid(),
  odometer: z.object({
    value: z.number().positive(),
    unit: z.enum(["km", "miles"]).optional(),
  }).optional(),
});

export type CreateOperationInput = z.infer<typeof createOperationSchema>;
```

### 2. Extend for Specific Operations

```typescript
// src/schemas/fuel.ts
import { z } from "zod";
import { createOperationSchema } from "./base";

const fuelSchema = z.object({
  amount: z.number().positive(),
  pricePerUnit: z.number().positive(),
  totalCost: z.number().positive(),
  fuelType: z.enum(["gasoline", "diesel", "electric"]),
});

export const createFuelSchema = createOperationSchema.extend({
  fuel: fuelSchema,
});

export type CreateFuelInput = z.infer<typeof createFuelSchema>;
```

### 3. Other Operation Types

```typescript
// src/schemas/service.ts
export const createServiceSchema = createOperationSchema.extend({
  service: z.object({
    type: z.string(),
    description: z.string(),
    cost: z.number().positive(),
    provider: z.string().optional(),
  }),
});

// src/schemas/transaction.ts
export const createTransactionSchema = createOperationSchema.extend({
  transaction: z.object({
    amount: z.number(),
    type: z.enum(["income", "expense"]),
    category: z.string(),
    description: z.string().optional(),
  }),
});
```

## React Hook Form Integration

### Form Hook Pattern

```typescript
// src/hooks/use-fuel-form.ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFuelSchema, type CreateFuelInput } from "../schemas/fuel";

export function useFuelForm() {
  return useForm<CreateFuelInput>({
    resolver: zodResolver(createFuelSchema),
    defaultValues: {
      vehicleId: "",
      fuel: {
        amount: 0,
        pricePerUnit: 0,
        totalCost: 0,
        fuelType: "gasoline",
      },
    },
  });
}
```

### Form Component Example

```typescript
// src/components/fuel-form.tsx
import { useFuelForm } from "../hooks/use-fuel-form";

export function FuelForm() {
  const form = useFuelForm();

  const onSubmit = (data: CreateFuelInput) => {
    // Submit to API
    console.log(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

## Update Schemas

### Base Update Schema

```typescript
// src/schemas/base.ts
export const updateOperationSchema = createOperationSchema
  .omit({ vehicleId: true })
  .partial();

export type UpdateOperationInput = z.infer<typeof updateOperationSchema>;
```

### Specific Update Schemas

```typescript
// src/schemas/fuel.ts
export const updateFuelSchema = createFuelSchema
  .omit({ vehicleId: true })
  .partial();

export type UpdateFuelInput = z.infer<typeof updateFuelSchema>;

// src/schemas/service.ts
export const updateServiceSchema = createServiceSchema
  .omit({ vehicleId: true })
  .partial();

// src/schemas/transaction.ts
export const updateTransactionSchema = createTransactionSchema
  .omit({ vehicleId: true })
  .partial();
```

### Update Form Hook

```typescript
// src/hooks/use-fuel-form.ts
export function useUpdateFuelForm(initialData?: UpdateFuelInput) {
  return useForm<UpdateFuelInput>({
    resolver: zodResolver(updateFuelSchema),
    defaultValues: initialData,
  });
}
```

## Benefits

- **Type Safety**: Full TypeScript support across frontend and backend
- **Consistent Validation**: Same validation rules on both sides
- **Maintainable**: Changes to backend DTOs can be easily reflected in frontend schemas
- **Reusable**: Base schemas can be extended for different operation types
- **Update Pattern**: Mirrors backend PartialType + OmitType pattern