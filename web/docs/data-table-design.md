# Advanced DataTable Component Design

## Overview

This document outlines the design and implementation strategy for creating a comprehensive, composable DataTable component system inspired by Carbon Design System but built with shadcn/ui philosophy.

## Philosophy

- **Composable over Monolithic**: Small, focused components that can be combined
- **Headless Logic**: Leverage TanStack Table for state management
- **Shadcn Approach**: Copy-paste friendly, customizable components
- **Carbon UX**: User experience patterns from IBM Carbon Design System

## Architecture

### Core Components

```
src/components/data-table/
├── data-table.tsx           # Main table component
├── data-table-toolbar.tsx   # Search, filters, actions bar
├── data-table-skeleton.tsx  # Loading state
├── data-table-pagination.tsx # Pagination controls
├── data-table-batch-actions.tsx # Bulk operations
├── data-table-row-actions.tsx   # Per-row actions
└── hooks/
    ├── use-table-selection.ts
    ├── use-table-sorting.ts
    ├── use-table-filtering.ts
    └── use-table-expansion.ts
```

## Component Variants

### 1. Basic Table
```tsx
<DataTable data={vehicles} columns={columns} />
```

### 2. With Toolbar
```tsx
<DataTable data={vehicles} columns={columns}>
  <DataTableToolbar>
    <DataTableSearch placeholder="Search vehicles..." />
    <DataTableFilters />
    <Button>Add Vehicle</Button>
  </DataTableToolbar>
</DataTable>
```

### 3. With Selection & Batch Actions
```tsx
<DataTable 
  data={vehicles} 
  columns={columns}
  features={{ selection: true }}
>
  <DataTableBatchActions>
    <Button variant="destructive">Delete Selected</Button>
    <Button variant="outline">Export Selected</Button>
  </DataTableBatchActions>
</DataTable>
```

### 4. With Expansion
```tsx
<DataTable 
  data={vehicles} 
  columns={columns}
  features={{ expansion: true }}
  renderSubComponent={({ row }) => <VehicleDetails vehicle={row.original} />}
/>
```

### 5. Full Featured
```tsx
<DataTable 
  data={vehicles} 
  columns={columns}
  features={{ 
    selection: true, 
    sorting: true, 
    filtering: true,
    expansion: true,
    pagination: true 
  }}
>
  <DataTableToolbar>
    <DataTableSearch />
    <DataTableFilters />
    <DataTableViewOptions />
  </DataTableToolbar>
  <DataTableBatchActions />
  <DataTablePagination />
</DataTable>
```

## Implementation Details

### 1. Core DataTable Component

```tsx
interface DataTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData>[]
  features?: {
    selection?: boolean
    sorting?: boolean
    filtering?: boolean
    expansion?: boolean
    pagination?: boolean
  }
  renderSubComponent?: (props: { row: Row<TData> }) => React.ReactElement
  children?: React.ReactNode
}

export function DataTable<TData>({ 
  data, 
  columns, 
  features = {},
  renderSubComponent,
  children 
}: DataTableProps<TData>) {
  // TanStack Table setup with conditional features
  // Render table with children components
}
```

### 2. Feature Hooks

#### Selection Hook
```tsx
export function useTableSelection<TData>() {
  const [rowSelection, setRowSelection] = useState({})
  
  const selectionColumn: ColumnDef<TData> = {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
  }

  return {
    rowSelection,
    setRowSelection,
    selectionColumn,
  }
}
```

#### Sorting Hook
```tsx
export function useTableSorting() {
  const [sorting, setSorting] = useState<SortingState>([])
  
  return {
    sorting,
    setSorting,
    getSortedRowModel: getSortedRowModel(),
  }
}
```

#### Filtering Hook
```tsx
export function useTableFiltering() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  
  return {
    columnFilters,
    setColumnFilters,
    globalFilter,
    setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
  }
}
```

### 3. Toolbar Components

#### Search Component
```tsx
interface DataTableSearchProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
}

export function DataTableSearch({ placeholder, value, onChange }: DataTableSearchProps) {
  return (
    <div className="flex items-center space-x-2">
      <Search className="h-4 w-4" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-8 w-[150px] lg:w-[250px]"
      />
    </div>
  )
}
```

#### Filters Component
```tsx
export function DataTableFilters<TData>({ 
  table, 
  filters 
}: { 
  table: Table<TData>
  filters: FilterConfig[]
}) {
  return (
    <div className="flex items-center space-x-2">
      {filters.map((filter) => (
        <DataTableFacetedFilter
          key={filter.column}
          column={table.getColumn(filter.column)}
          title={filter.title}
          options={filter.options}
        />
      ))}
    </div>
  )
}
```

### 4. Batch Actions Component

```tsx
interface DataTableBatchActionsProps {
  selectedCount: number
  children: React.ReactNode
}

export function DataTableBatchActions({ selectedCount, children }: DataTableBatchActionsProps) {
  if (selectedCount === 0) return null

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1 text-sm text-muted-foreground">
        {selectedCount} of {totalCount} row(s) selected.
      </div>
      <div className="flex items-center space-x-2">
        {children}
      </div>
    </div>
  )
}
```

### 5. Row Actions Component

```tsx
interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  actions: RowAction<TData>[]
}

export function DataTableRowActions<TData>({ row, actions }: DataTableRowActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map((action) => (
          <DropdownMenuItem
            key={action.label}
            onClick={() => action.onClick(row.original)}
          >
            {action.icon && <action.icon className="mr-2 h-4 w-4" />}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### 6. Skeleton Component

```tsx
export function DataTableSkeleton({ 
  columnCount = 5, 
  rowCount = 10 
}: { 
  columnCount?: number
  rowCount?: number 
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: columnCount }).map((_, i) => (
              <TableHead key={i}>
                <Skeleton className="h-4 w-[100px]" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rowCount }).map((_, i) => (
            <TableRow key={i}>
              {Array.from({ length: columnCount }).map((_, j) => (
                <TableCell key={j}>
                  <Skeleton className="h-4 w-[80px]" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
```

## Usage Examples

### Vehicle Management Table

```tsx
const vehicleColumns: ColumnDef<Vehicle>[] = [
  {
    accessorKey: "nickname",
    header: "Nickname",
  },
  {
    accessorKey: "brand",
    header: "Brand",
  },
  {
    accessorKey: "variant",
    header: "Variant",
    cell: ({ row }) => <EmptyCell value={row.getValue("variant")} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        actions={[
          {
            label: "Edit",
            icon: Edit,
            onClick: (vehicle) => navigate(`/vehicles/${vehicle.id}/edit`),
          },
          {
            label: "Delete",
            icon: Trash,
            onClick: (vehicle) => deleteVehicle(vehicle.id),
          },
        ]}
      />
    ),
  },
]

function VehiclesPage() {
  const { data: vehicles, isLoading } = useVehicles()

  if (isLoading) {
    return <DataTableSkeleton />
  }

  return (
    <DataTable 
      data={vehicles} 
      columns={vehicleColumns}
      features={{ 
        selection: true, 
        sorting: true, 
        filtering: true 
      }}
    >
      <DataTableToolbar>
        <DataTableSearch placeholder="Search vehicles..." />
        <DataTableFilters
          filters={[
            {
              column: "status",
              title: "Status",
              options: statusOptions,
            },
            {
              column: "brand",
              title: "Brand",
              options: brandOptions,
            },
          ]}
        />
        <Button asChild>
          <Link to="/vehicles/create">Add Vehicle</Link>
        </Button>
      </DataTableToolbar>
      
      <DataTableBatchActions>
        <Button variant="destructive">Delete Selected</Button>
        <Button variant="outline">Export Selected</Button>
      </DataTableBatchActions>
    </DataTable>
  )
}
```

## Benefits

1. **Flexibility**: Mix and match features as needed
2. **Reusability**: Components work across different data types
3. **Maintainability**: Each feature is isolated and testable
4. **Performance**: Only load features you use
5. **Consistency**: Unified UX patterns across the app
6. **Developer Experience**: Intuitive API, great TypeScript support

## Migration Strategy

1. **Phase 1**: Create core DataTable component
2. **Phase 2**: Add selection and batch actions
3. **Phase 3**: Implement sorting and filtering
4. **Phase 4**: Add expansion and advanced features
5. **Phase 5**: Create specialized variants (TreeTable, etc.)

## Future Enhancements

- **Virtual scrolling** for large datasets
- **Column resizing** and reordering
- **Export functionality** (CSV, Excel, PDF)
- **Advanced filtering** (date ranges, multi-select)
- **Saved views** and user preferences
- **Real-time updates** with optimistic UI
- **Accessibility improvements** (ARIA labels, keyboard navigation)

This design provides a solid foundation for building sophisticated data tables while maintaining the simplicity and flexibility that makes shadcn/ui so appealing.