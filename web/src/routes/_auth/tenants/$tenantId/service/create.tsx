import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type PaginationState,
} from "@tanstack/react-table";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  GaugeIcon,
} from "lucide-react";
import type { Vehicle } from "@/features/vehicle/types";
import { vehiclesQuery } from "@/features/vehicle/queries";
import { vehicleSelectionColumns } from "@/features/vehicle/components/columns";
import { categoriesQuery } from "@/features/category/queries";
import type { CreateServiceSchema } from "@/features/service/types";
import { createServiceSchema } from "@/features/service/schemas";
import { useCreateService } from "@/features/service/queries";
import {
  Page,
  PageContent,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/page";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/ui/field";
import { Item, ItemActions, ItemContent, ItemTitle } from "@/ui/item";
import { Button } from "@/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { Label } from "@/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";

import { Separator } from "@/ui/separator";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/ui/input-group";
import { Textarea } from "@/ui/textarea";

export const Route = createFileRoute("/_auth/tenants/$tenantId/service/create")(
  {
    component: RouteComponent,
  },
);

const fallback: Vehicle[] = [];
function RouteComponent() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { tenantId } = Route.useParams();

  const navigate = Route.useNavigate();

  const form = useForm<CreateServiceSchema>({
    resolver: zodResolver(createServiceSchema),
    mode: "onSubmit",
    defaultValues: {
      vehicleId: "",
      service: {
        description: "",
      },
      items: [
        {
          amount: 0,
          description: "",
          categoryId: "",
        },
      ],
      odometer: {
        value: 0,
        description: "",
      },
    },
  });
  const items = useFieldArray({
    name: "items",
    control: form.control,
  });

  const vehicles = useQuery(
    vehiclesQuery(tenantId, {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    }),
  );

  const categories = useQuery(categoriesQuery(tenantId, "service"));

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

  const { mutate, isPending } = useCreateService();

  const onSubmit = (values: CreateServiceSchema) => {
    mutate(
      { tenantId, values },
      {
        onSuccess: ({ service }) => {
          toast.success("Service created successfully");

          navigate({
            to: "/tenants/$tenantId/service/$serviceId",
            params: {
              tenantId,
              serviceId: service.id,
            },
          });
        },
        onError: () => {
          toast.error("Failed to create service");
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
          <h2>Create service record</h2>
        </PageTitle>
        <PageDescription>
          <p>
            Add a new service entry for a vehicle. Fill the vehicle, service
            details and (optionally) the odometer reading. You can add an
            odometer record later if you want to skip it now.
          </p>
        </PageDescription>
      </PageHeader>

      <PageContent>
        <form
          id="form-create"
          className="grid gap-10"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="space-y-8">
            <div>
              <h3 className="text-base/snug font-medium tracking-normal">
                Vehicle
              </h3>
              <p className="text-muted-foreground mt-1 text-sm/snug tracking-wide">
                Select the vehicle this service record belongs to. Only one
                vehicle can be selected.
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
                Service details
              </h3>
              <p className="text-muted-foreground mt-1 text-sm/snug tracking-wide">
                Enter the details of the service performed. This is a short
                description that will be displayed in the service list.
              </p>
            </div>

            <FieldGroup>
              <Controller
                name="service.description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="col-span-2"
                  >
                    <FieldLabel htmlFor={field.name}>Notes</FieldLabel>
                    <Textarea
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="About station, pump, receipt number..."
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
                Service items details
              </h3>
              <p className="text-muted-foreground mt-1 text-sm/snug tracking-wide">
                Provide the details of the service items. You can add multiple
                items. The total amount will be calculated automatically.
              </p>
            </div>

            <div className="space-y-4">
              {items.fields.map((field, index) => (
                <FieldGroup
                  className="grid grid-cols-2 gap-4 border-l-8 py-2 pl-4"
                  key={field.id}
                >
                  <Controller
                    name={`items.${index}.amount`}
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
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                            placeholder=""
                          />
                        </InputGroup>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name={`items.${index}.categoryId`}
                    control={form.control}
                    render={({ field: controller, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={`items.${index}.categoryId`}>
                          Category
                        </FieldLabel>
                        <Select
                          name={controller.name}
                          value={controller.value}
                          onValueChange={controller.onChange}
                          disabled={categories.isPending || categories.isError}
                        >
                          <SelectTrigger
                            id={controller.name}
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
                                  <SelectItem
                                    key={category.id}
                                    value={category.id}
                                  >
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
                    name={`items.${index}.description`}
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

                  {items.fields.length > 1 ? (
                    <div className="col-span-2 flex justify-end">
                      <Button
                        type="button"
                        onClick={() => {
                          items.remove(index);
                        }}
                        variant="outline"
                        aria-label={`Remove service item ${index + 1}`}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : null}
                </FieldGroup>
              ))}

              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    items.append({
                      amount: 0,
                      categoryId: "",
                      description: "",
                    });
                  }}
                >
                  Add item
                </Button>
              </div>
            </div>
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
                    <FieldLabel htmlFor={field.name}>Reading</FieldLabel>
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
              {isPending ? "Creating..." : "Create"}
            </Button>
            <Button variant="secondary" type="button" asChild>
              <Link
                to="/tenants/$tenantId/service"
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
