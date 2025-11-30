# Vehicle Filtering Implementation

## Overview
This document outlines how to implement refined filtering for the `findAll` vehicles endpoint based on operation data.

## Current Implementation
Currently, the `findAll` endpoint only filters by `tenantId`:

```typescript
async findAll(tenantId: Tenant["id"]): Promise<Vehicle[]> {
  return this.repository.find({
    where: { tenantId }
  });
}
```

## Proposed Filter Options

### 1. Filter by Operation Type
Filter vehicles that have specific operation types:

```typescript
// Query: GET /vehicles?operationType=FUEL,SERVICE
async findAll(tenantId: Tenant["id"], operationType?: OperationType[]): Promise<Vehicle[]> {
  const queryBuilder = this.repository.createQueryBuilder('vehicle')
    .where('vehicle.tenantId = :tenantId', { tenantId });

  if (operationType?.length) {
    queryBuilder
      .innerJoin('vehicle.operations', 'operation')
      .andWhere('operation.type IN (:...operationType)', { operationType });
  }

  return queryBuilder.getMany();
}
```

### 2. Filter by Recent Activity
Filter vehicles with operations within a date range:

```typescript
// Query: GET /vehicles?hasActivitySince=2024-01-01
async findAll(
  tenantId: Tenant["id"], 
  hasActivitySince?: Date
): Promise<Vehicle[]> {
  const queryBuilder = this.repository.createQueryBuilder('vehicle')
    .where('vehicle.tenantId = :tenantId', { tenantId });

  if (hasActivitySince) {
    queryBuilder
      .innerJoin('vehicle.operations', 'operation')
      .andWhere('operation.createdAt >= :hasActivitySince', { hasActivitySince });
  }

  return queryBuilder.getMany();
}
```

### 3. Filter by Operation Author
Filter vehicles operated by specific users:

```typescript
// Query: GET /vehicles?authorId=uuid
async findAll(
  tenantId: Tenant["id"], 
  authorId?: string
): Promise<Vehicle[]> {
  const queryBuilder = this.repository.createQueryBuilder('vehicle')
    .where('vehicle.tenantId = :tenantId', { tenantId });

  if (authorId) {
    queryBuilder
      .innerJoin('vehicle.operations', 'operation')
      .andWhere('operation.authorId = :authorId', { authorId });
  }

  return queryBuilder.getMany();
}
```

### 4. Combined Filter DTO
Create a filter DTO for clean implementation:

```typescript
// dto/vehicle-filter.dto.ts
export class VehicleFilterDto {
  @IsOptional()
  @IsEnum(OperationType, { each: true })
  operationType?: OperationType[];

  @IsOptional()
  @IsDateString()
  hasActivitySince?: string;

  @IsOptional()
  @IsUUID()
  authorId?: string;

  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;

  @IsOptional()
  @IsEnum(VehicleType)
  type?: VehicleType;
}
```

## Implementation Steps

### 1. Update Controller
```typescript
@Get()
findAll(
  @GetAuth() auth: AuthData,
  @Query() filters: VehicleFilterDto
): Promise<Vehicle[]> {
  return this.service.findAll(auth.tenantId!, filters);
}
```

### 2. Update Service
```typescript
async findAll(
  tenantId: Tenant["id"], 
  filters: VehicleFilterDto = {}
): Promise<Vehicle[]> {
  const queryBuilder = this.repository.createQueryBuilder('vehicle')
    .where('vehicle.tenantId = :tenantId', { tenantId });

  // Filter by vehicle properties
  if (filters.status) {
    queryBuilder.andWhere('vehicle.status = :status', { status: filters.status });
  }

  if (filters.type) {
    queryBuilder.andWhere('vehicle.type = :type', { type: filters.type });
  }

  // Filter by operations
  if (filters.operationType?.length || filters.hasActivitySince || filters.authorId) {
    queryBuilder.innerJoin('vehicle.operations', 'operation');

    if (filters.operationType?.length) {
      queryBuilder.andWhere('operation.type IN (:...operationType)', { 
        operationType: filters.operationType 
      });
    }

    if (filters.hasActivitySince) {
      queryBuilder.andWhere('operation.createdAt >= :hasActivitySince', { 
        hasActivitySince: new Date(filters.hasActivitySince) 
      });
    }

    if (filters.authorId) {
      queryBuilder.andWhere('operation.authorId = :authorId', { 
        authorId: filters.authorId 
      });
    }
  }

  return queryBuilder.distinct(true).getMany();
}
```

## Usage Examples

```bash
# Get all vehicles
GET /vehicles

# Get vehicles with fuel operations
GET /vehicles?operationType=FUEL

# Get vehicles with recent activity
GET /vehicles?hasActivitySince=2024-01-01

# Get available cars with service operations
GET /vehicles?status=AVAILABLE&type=CAR&operationType=SERVICE

# Get vehicles operated by specific user
GET /vehicles?authorId=uuid-here
```

## Notes
- Use `distinct(true)` to avoid duplicate vehicles when joining operations
- Consider pagination for large datasets
- Add indexes on frequently queried operation fields
- Validate date formats in the DTO