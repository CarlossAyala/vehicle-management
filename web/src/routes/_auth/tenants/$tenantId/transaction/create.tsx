import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type PaginationState,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateTransactionSchema } from "@/features/transaction/types";
import { createTransactionSchema } from "@/features/transaction/schemas";
import { vehiclesQuery } from "@/features/vehicle/queries";
import { categoriesQuery } from "@/features/category/queries";
import { vehicleSelectionColumns } from "@/features/vehicle/components/columns";
import type { Vehicle } from "@/features/vehicle/types";
import { useCreateTransaction } from "@/features/transaction/queries";
import { toast } from "sonner";
import {
  Page,
  PageContent,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/page";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/ui/field";
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
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  GaugeIcon,
} from "lucide-react";
import { Separator } from "@/ui/separator";
import { Textarea } from "@/ui/textarea";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/ui/input-group";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";

export const Route = createFileRoute(
  "/_auth/tenants/$tenantId/transaction/create",
)({
  component: RouteComponent,
});

/*
 * #TODO: When the operation type change, their items has to be deleted too
 * but before that, a confirmation modal should be shown to the user, but for
 * now, we will leave it as is.
 */

const fallback: Vehicle[] = [];
function RouteComponent() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { tenantId } = Route.useParams();

  const navigate = Route.useNavigate();

  const form = useForm<CreateTransactionSchema>({
    resolver: zodResolver(createTransactionSchema),
    mode: "onSubmit",
    defaultValues: {
      vehicleId: "",
      transaction: {
        type: "expense",
      },
      odometer: {
        value: 0,
        description: "",
      },
    },
  });
  const items = useFieldArray({
    control: form.control,
    name: "items",
  });

  const vehicles = useQuery(
    vehiclesQuery(tenantId, {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    }),
  );

  const type = form.watch("transaction.type");
  const categories = useQuery(categoriesQuery(tenantId, type));

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

  const { mutate, isPending } = useCreateTransaction();

  const onSubmit = (values: CreateTransactionSchema) => {
    mutate(
      { tenantId, values },
      {
        onSuccess: ({ transaction }) => {
          toast.success("Transaction created successfully");

          navigate({
            to: "/tenants/$tenantId/transaction/$transactionId",
            params: {
              tenantId,
              transactionId: transaction.id,
            },
          });
        },
        onError: () => {
          toast.error("Failed to create transaction");
        },
      },
    );
  };

  useEffect(() => {
    form.setValue("vehicleId", vehicleId);
  }, [vehicleId]);

  useEffect(() => {
    if (items.fields.length === 0) return;

    window.alert("Changing the transaction type will reset the items list.");
    items.replace([]);
  }, [type]);

  return (
    <Page className="mx-auto w-full max-w-xl">
      <PageHeader>
        <PageTitle>Create Transaction</PageTitle>
        <PageDescription>
          <p>
            Create a new transaction by selecting a vehicle and providing the
            necessary details.
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
                Transaction details
              </h3>
              <p className="text-muted-foreground mt-1 text-sm/snug tracking-wide">
                Enter the details of the transaction performed. This is a short
                description that will be displayed in the transaction list.
              </p>
            </div>

            <FieldGroup>
              <Controller
                name="transaction.type"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FieldSet data-invalid={fieldState.invalid}>
                    <FieldLegend>Type</FieldLegend>
                    <FieldDescription>
                      Select the type of transaction you are creating.
                    </FieldDescription>
                    <RadioGroup
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                      aria-invalid={fieldState.invalid}
                    >
                      {[
                        {
                          id: "expense",
                          title: "Expense",
                          description:
                            "A transaction representing money spent on services or maintenance.",
                        },
                        {
                          id: "income",
                          title: "Income",
                          description:
                            "A transaction representing money received, such as refunds or reimbursements.",
                        },
                      ].map((t) => (
                        <FieldLabel key={t.id} htmlFor={`form-type-${t.id}`}>
                          <Field
                            orientation="horizontal"
                            data-invalid={fieldState.invalid}
                          >
                            <FieldContent>
                              <FieldTitle>{t.title}</FieldTitle>
                              <FieldDescription>
                                {t.description}
                              </FieldDescription>
                            </FieldContent>
                            <RadioGroupItem
                              value={t.id}
                              id={`form-type-${t.id}`}
                              aria-invalid={fieldState.invalid}
                            />
                          </Field>
                        </FieldLabel>
                      ))}
                    </RadioGroup>
                  </FieldSet>
                )}
              />

              <Controller
                name="transaction.description"
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
                Transaction items details
              </h3>
              <p className="text-muted-foreground mt-1 text-sm/snug tracking-wide">
                Add one or more items to this transaction representing the
                services performed. Each item requires an amount and a category.
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
                        aria-label={`Remove transaction item ${index + 1}`}
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
                to="/tenants/$tenantId/transaction"
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
