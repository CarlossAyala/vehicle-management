import { useEffect, useState } from "react";
import {
  createFileRoute,
  Link,
  stripSearchParams,
  useNavigate,
} from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type PaginationState,
} from "@tanstack/react-table";
import z from "zod";
import { toast } from "sonner";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  GaugeIcon,
} from "lucide-react";
import { fuelCategoriesQuery } from "@/features/category/queries";
import { vehiclesQuery } from "@/features/vehicle/queries";
import type { Vehicle } from "@/features/vehicle/types";
import { vehicleSelectionColumns } from "@/features/vehicle/components/columns";
import type { CreateFuelSchema } from "@/features/fuel/types";
import { createFuelSchema } from "@/features/fuel/schemas";
import { useCreateFuel } from "@/features/fuel/queries";
import {
  Page,
  PageHeader,
  PageTitle,
  PageDescription,
  PageContent,
} from "@/components/page";
import { Button } from "@/ui/button";
import { Separator } from "@/ui/separator";
import { Field, FieldLabel, FieldGroup, FieldError } from "@/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/ui/input-group";
import { Textarea } from "@/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { Label } from "@/ui/label";
import { Item, ItemActions, ItemContent, ItemTitle } from "@/ui/item";

const searchSchema = z.object({
  from: z.enum(["operation", "fuel"]).default("fuel").catch("fuel"),
});

export const Route = createFileRoute("/_auth/tenants/$tenantId/fuel/create")({
  component: RouteComponent,
  validateSearch: searchSchema,
  search: {
    middlewares: [stripSearchParams(searchSchema.parse({}))],
  },
});

const fallback: Vehicle[] = [];
function RouteComponent() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const search = Route.useSearch();
  const { tenantId } = Route.useParams();
  const navigate = useNavigate();

  const form = useForm<CreateFuelSchema>({
    resolver: zodResolver(createFuelSchema),
    defaultValues: {
      vehicleId: "",
      fuel: {
        categoryId: "",
        quantity: 0,
        amount: 0,
        description: "",
      },
      odometer: {
        value: 0,
        description: "",
      },
    },
    mode: "onSubmit",
  });

  const vehicles = useQuery(
    vehiclesQuery(tenantId, {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    }),
  );
  const categories = useQuery(fuelCategoriesQuery(tenantId));

  const table = useReactTable({
    data: vehicles.isSuccess ? vehicles.data.data : fallback,
    columns: vehicleSelectionColumns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableMultiRowSelection: false,
    getRowId: (row) => row.id,
    manualPagination: true,
    rowCount: vehicles.data?.meta.count,
    pageCount: vehicles.data?.meta.pages.total,
  });

  const selection = table.getState().rowSelection;
  const rows = Object.keys(selection);

  const vehicleId = rows.length > 0 ? rows[0] : "";

  const { mutate, isPending } = useCreateFuel();

  const onSubmit = (values: CreateFuelSchema) => {
    if (!values.odometer?.value) values.odometer = undefined;

    mutate(
      { tenantId, values },
      {
        onSuccess: ({ fuel }) => {
          toast.success("Fuel created successfully");

          switch (search.from) {
            case "operation":
              navigate({
                to: "/tenants/$tenantId/operation",
                params: { tenantId },
              });
              break;
            default:
              navigate({
                to: "/tenants/$tenantId/fuel/$fuelId",
                params: {
                  tenantId,
                  fuelId: fuel.id,
                },
              });
          }
        },
        onError: () => {
          toast.error("Failed to create fuel");
        },
      },
    );
  };

  useEffect(() => {
    form.setValue("vehicleId", vehicleId);
  }, [vehicleId]);

  return (
    <Page className="mx-auto w-full max-w-xl">
      <PageHeader>
        <PageTitle>
          <h2>Create fuel record</h2>
        </PageTitle>
        <PageDescription>
          <p>
            Add a new fuel entry for a vehicle. Fill the vehicle, fuel details
            and (optionally) the odometer reading. You can add an odometer
            record later if you skip it now.
          </p>
        </PageDescription>
      </PageHeader>

      <PageContent>
        <form
          id="form-fuel-create"
          className="grid gap-10"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="space-y-8">
            <div>
              <h3 className="text-base/snug font-medium tracking-normal">
                Vehicle
              </h3>
              <p className="text-muted-foreground mt-1 text-sm/snug tracking-wide">
                Select the vehicle this fuel record belongs to. Only one vehicle
                can be selected.
              </p>
            </div>

            <FieldGroup>
              <div className="space-y-4">
                {vehicleId ? (
                  <Item variant="outline">
                    <ItemContent>
                      <ItemTitle>1 vehicle selected</ItemTitle>
                    </ItemContent>
                    <ItemActions>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          alert("#TODO: Implement the drawer to view vehicle!");
                        }}
                      >
                        View
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          table.resetRowSelection(true);
                        }}
                      >
                        Remove
                      </Button>
                    </ItemActions>
                  </Item>
                ) : null}
                <div className="overflow-hidden rounded-md border">
                  <Table>
                    <TableHeader>
                      {table.getHeaderGroups().map((group) => (
                        <TableRow key={group.id}>
                          {group.headers.map((header) => {
                            return (
                              <TableHead
                                key={header.id}
                                colSpan={header.colSpan}
                              >
                                {header.isPlaceholder
                                  ? null
                                  : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext(),
                                    )}
                              </TableHead>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() ? "selected" : null}
                          onClick={row.getToggleSelectedHandler()}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex w-full justify-between gap-8">
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="rows-per-page"
                      className="text-sm/snug font-medium"
                    >
                      Rows
                    </Label>
                    <Select
                      value={`${table.getState().pagination.pageSize}`}
                      onValueChange={(value) => {
                        table.setPageSize(Number(value));
                      }}
                    >
                      <SelectTrigger
                        id="rows-per-page"
                        size="sm"
                        className="tabular-nums"
                      >
                        <SelectValue
                          placeholder={table.getState().pagination.pageSize}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                          <SelectItem key={pageSize} value={`${pageSize}`}>
                            {pageSize}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex w-fit items-center justify-center text-sm/snug font-medium">
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                  </div>
                  <div className="ml-auto flex items-center gap-2 lg:ml-0">
                    <Button
                      variant="outline"
                      className="hidden h-8 w-8 p-0 lg:flex"
                      onClick={() => table.setPageIndex(0)}
                      disabled={!table.getCanPreviousPage()}
                    >
                      <span className="sr-only">Go to first page</span>
                      <ChevronsLeftIcon />
                    </Button>
                    <Button
                      variant="outline"
                      className="size-8"
                      size="icon"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      <span className="sr-only">Go to previous page</span>
                      <ChevronLeftIcon />
                    </Button>
                    <Button
                      variant="outline"
                      className="size-8"
                      size="icon"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      <span className="sr-only">Go to next page</span>
                      <ChevronRightIcon />
                    </Button>
                    <Button
                      variant="outline"
                      className="hidden size-8 lg:flex"
                      size="icon"
                      onClick={() =>
                        table.setPageIndex(table.getPageCount() - 1)
                      }
                      disabled={!table.getCanNextPage()}
                    >
                      <span className="sr-only">Go to last page</span>
                      <ChevronsRightIcon />
                    </Button>
                  </div>
                </div>
              </div>

              <Controller
                name="vehicleId"
                control={form.control}
                render={({ fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          <Separator />

          <div className="space-y-8">
            <div>
              <h3 className="text-base/snug font-medium tracking-normal">
                Fuel details
              </h3>
              <p className="text-muted-foreground mt-1 text-sm/snug tracking-wide">
                Enter the category, quantity and price for this refill. Add an
                optional description (station, pump number, notes).
              </p>
            </div>

            <FieldGroup className="grid grid-cols-2 gap-4">
              <Controller
                name="fuel.categoryId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="col-span-2"
                  >
                    <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={categories.isPending || categories.isError}
                    >
                      <SelectTrigger
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                      >
                        {categories.isPending ? (
                          "Loading..."
                        ) : categories.isError ? (
                          "Error"
                        ) : (
                          <SelectValue placeholder="Select" />
                        )}
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        {categories.isSuccess
                          ? categories.data.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))
                          : null}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="fuel.quantity"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Quantity (L)</FieldLabel>
                    <InputGroup>
                      <InputGroupAddon>
                        <InputGroupText>L</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        type="number"
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        placeholder="e.g. 45.5"
                      />
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="fuel.amount"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Amount</FieldLabel>
                    <InputGroup>
                      <InputGroupAddon>
                        <InputGroupText>$</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        type="number"
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        placeholder="e.g. 60.00"
                      />
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="fuel.description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="col-span-2"
                  >
                    <FieldLabel htmlFor={field.name}>
                      Notes (optional)
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Optional note (station, pump, receipt number...)"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          <Separator />

          <div className="space-y-8">
            <div>
              <h3 className="text-base/snug font-medium tracking-normal">
                Odometer (optional)
              </h3>
              <p className="text-muted-foreground mt-1 text-sm/snug tracking-wide">
                Provide the odometer reading at the time of refuelling. If left
                empty, no odometer record will be created now — you can add it
                later.
              </p>
            </div>

            <FieldGroup>
              <Controller
                name="odometer.value"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Odometer reading
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        type="number"
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        placeholder="e.g. 15342"
                      />
                      <InputGroupAddon>
                        <GaugeIcon />
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="odometer.description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="col-span-2"
                  >
                    <FieldLabel htmlFor={field.name}>
                      Notes (optional)
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Where/when the reading was taken (optional)"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          <Separator />

          <div className="flex justify-end gap-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create fuel"}
            </Button>
            <Button variant="secondary" type="button" asChild>
              <Link
                to={
                  search.from === "operation"
                    ? "/tenants/$tenantId/operation"
                    : "/tenants/$tenantId/fuel"
                }
                params={{
                  tenantId,
                }}
              >
                Cancel
              </Link>
            </Button>
          </div>
        </form>
      </PageContent>
    </Page>
  );
}
