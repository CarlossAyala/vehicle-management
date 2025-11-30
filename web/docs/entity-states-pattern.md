# Entity States Pattern

## Overview

This document outlines the standardized approach for implementing entities with state properties (status, type, category, etc.) that need consistent rendering across forms, tables, and UI components.

## Pattern Structure

### 1. Define State Configuration

In your entity's `types.ts` file, create configuration objects that serve as the single source of truth:

```tsx
// src/features/[entity]/types.ts

export const EntityStatusConfig = {
  active: { label: "Active", variant: "default" as const },
  pending: { label: "Pending", variant: "secondary" as const },
  suspended: { label: "Suspended", variant: "destructive" as const },
  archived: { label: "Archived", variant: "outline" as const },
} as const;

export const EntityTypeConfig = {
  premium: { label: "Premium", variant: "default" as const },
  standard: { label: "Standard", variant: "secondary" as const },
  basic: { label: "Basic", variant: "outline" as const },
} as const;
```

### 2. Generate Derived Constants

Create the constants needed for schemas and forms:

```tsx
// Derived constants for schemas (ESLint compatible)
export const EntityStatuses = {
  ACTIVE: "active",
  PENDING: "pending", 
  SUSPENDED: "suspended",
  ARCHIVED: "archived",
} as const;

export const EntityTypes = {
  PREMIUM: "premium",
  STANDARD: "standard",
  BASIC: "basic",
} as const;

// Auto-generated items for forms
export const EntityStatusesItems = Object.entries(EntityStatusConfig).map(([value, config]) => ({
  label: config.label,
  value: value as EntityStatus,
}));

export const EntityTypesItems = Object.entries(EntityTypeConfig).map(([value, config]) => ({
  label: config.label,
  value: value as EntityType,
}));
```

### 3. Define Types

```tsx
export type EntityStatus = keyof typeof EntityStatusConfig;
export type EntityType = keyof typeof EntityTypeConfig;
```

### 4. Create Badge Components

Create semantic badge components in `src/components/`:

```tsx
// src/components/entity-status-badge.tsx
import { Badge } from "@/ui/badge";
import { EntityStatusConfig, type EntityStatus } from "@/features/entity/types";

interface EntityStatusBadgeProps {
  status: EntityStatus;
}

export const EntityStatusBadge = ({ status }: EntityStatusBadgeProps) => {
  const config = EntityStatusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
};
```

```tsx
// src/components/entity-type-badge.tsx
import { Badge } from "@/ui/badge";
import { EntityTypeConfig, type EntityType } from "@/features/entity/types";

interface EntityTypeBadgeProps {
  type: EntityType;
}

export const EntityTypeBadge = ({ type }: EntityTypeBadgeProps) => {
  const config = EntityTypeConfig[type];
  return <Badge variant={config.variant}>{config.label}</Badge>;
};
```

## Usage Examples

### In Forms

```tsx
import { EntityStatusesItems, EntityTypesItems } from "@/features/entity/types";

// Select component
<Select>
  <SelectContent>
    {EntityStatusesItems.map((item) => (
      <SelectItem key={item.value} value={item.value}>
        {item.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

### In Tables

```tsx
import { EntityStatusBadge, EntityTypeBadge } from "@/components/entity-status-badge";

const columns = [
  columnHelper.accessor("status", {
    header: "Status",
    cell: (props) => <EntityStatusBadge status={props.getValue()} />,
  }),
  columnHelper.accessor("type", {
    header: "Type", 
    cell: (props) => <EntityTypeBadge type={props.getValue()} />,
  }),
];
```

### In Schemas

```tsx
import { EntityStatuses, EntityTypes } from "@/features/entity/types";

export const createEntitySchema = z.object({
  name: z.string(),
  status: z.enum([
    EntityStatuses.ACTIVE,
    EntityStatuses.PENDING,
    EntityStatuses.SUSPENDED,
    EntityStatuses.ARCHIVED,
  ]),
  type: z.enum([
    EntityTypes.PREMIUM,
    EntityTypes.STANDARD,
    EntityTypes.BASIC,
  ]),
});
```

## File Structure

```
src/
├── features/
│   └── [entity]/
│       ├── types.ts              # Config + derived constants + types
│       └── schemas.ts            # Uses EntityStatuses/EntityTypes
├── components/
│   ├── entity-status-badge.tsx   # Status badge component
│   └── entity-type-badge.tsx     # Type badge component
└── routes/
    └── [entity]/
        ├── index.tsx             # Table uses badge components
        └── create.tsx            # Form uses Items arrays
```

## Badge Variant Guidelines

Choose badge variants based on semantic meaning:

- **`default`** (primary blue): Active, primary, or positive states
- **`secondary`** (gray): Neutral, standard, or informational states  
- **`destructive`** (red): Error, warning, or attention-needed states
- **`outline`** (border only): Inactive, disabled, or archived states

## Benefits

1. **Single Source of Truth**: Change labels/colors in one place
2. **Type Safety**: TypeScript ensures valid states
3. **Consistency**: Same state always looks the same
4. **Maintainability**: Easy to add/remove/modify states
5. **Reusability**: Components work across the entire app
6. **ESLint Compatible**: Separate constants for schema validation

## Real-World Example: User Entity

```tsx
// src/features/user/types.ts
export const UserStatusConfig = {
  active: { label: "Active", variant: "default" as const },
  inactive: { label: "Inactive", variant: "outline" as const },
  suspended: { label: "Suspended", variant: "destructive" as const },
  pending_verification: { label: "Pending Verification", variant: "secondary" as const },
} as const;

export const UserRoleConfig = {
  admin: { label: "Administrator", variant: "destructive" as const },
  manager: { label: "Manager", variant: "default" as const },
  user: { label: "User", variant: "secondary" as const },
  guest: { label: "Guest", variant: "outline" as const },
} as const;

// Derived constants...
export const UserStatuses = {
  ACTIVE: "active",
  INACTIVE: "inactive", 
  SUSPENDED: "suspended",
  PENDING_VERIFICATION: "pending_verification",
} as const;

// Auto-generated items...
export const UserStatusesItems = Object.entries(UserStatusConfig).map(([value, config]) => ({
  label: config.label,
  value: value as UserStatus,
}));

// Types...
export type UserStatus = keyof typeof UserStatusConfig;
export type UserRole = keyof typeof UserRoleConfig;
```

## Migration Checklist

When implementing this pattern for a new entity:

- [ ] Create `[Entity]StatusConfig` and `[Entity]TypeConfig` in types.ts
- [ ] Generate derived constants (`[Entity]Statuses`, `[Entity]Types`)
- [ ] Create auto-generated items arrays (`[Entity]StatusesItems`)
- [ ] Define TypeScript types (`EntityStatus`, `EntityType`)
- [ ] Create badge components (`[Entity]StatusBadge`, `[Entity]TypeBadge`)
- [ ] Update forms to use Items arrays
- [ ] Update tables to use badge components
- [ ] Update schemas to use derived constants
- [ ] Test all states render correctly

This pattern ensures consistency, maintainability, and type safety across your entire application.