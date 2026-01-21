import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { categoriesQuery } from "@/features/category/queries";
import { odometerOperationQuery } from "@/features/odometer/queries";
import {
  transactionQuery,
  useRemoveTransaction,
  useUpdateTransaction,
} from "@/features/transaction/queries";
import type { UpdateTransactionSchema } from "@/features/transaction/types";
import { updateTransactionSchema } from "@/features/transaction/schemas";
import { queryClient } from "@/lib/utils";
import {
  Page,
  PageContent,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/page";
import { VehicleInfo } from "@/features/vehicle/components/vehicle-info";
import { Separator } from "@/ui/separator";
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
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";
import { Textarea } from "@/ui/textarea";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Button } from "@/ui/button";
import { GaugeIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/ui/alert-dialog";
import { useEffect } from "react";

export const Route = createFileRoute(
  "/_auth/tenants/$tenantId/transaction/$transactionId",
)({
  component: RouteComponent,
  beforeLoad: async ({ params: { tenantId, transactionId } }) => {
    const transaction = await queryClient.ensureQueryData(
      transactionQuery(tenantId, transactionId),
    );

    return Promise.all([
      queryClient.ensureQueryData(
        odometerOperationQuery(tenantId, transaction.operationId),
      ),
      queryClient.ensureQueryData(categoriesQuery(tenantId)),
    ]);
  },
});

function RouteComponent() {
  const { tenantId, transactionId } = Route.useParams();

  const navigate = Route.useNavigate();

  const { data: transaction } = useSuspenseQuery(
    transactionQuery(tenantId, transactionId),
  );
  const { data: odometer } = useSuspenseQuery(
    odometerOperationQuery(tenantId, transaction.operationId),
  );

  const form = useForm<UpdateTransactionSchema>({
    resolver: zodResolver(updateTransactionSchema),
    values: updateTransactionSchema.parse({
      transaction: {
        type: transaction.type,
        description: transaction.description,
      },
      items: transaction.items,
      odometer,
    }),
  });
  const items = useFieldArray({
    control: form.control,
    name: "items",
  });

  const type = form.watch("transaction.type");
  const { data: categories } = useSuspenseQuery(
    categoriesQuery(tenantId, type),
  );

  const update = useUpdateTransaction();
  const remove = useRemoveTransaction();

  const onSubmit = (values: UpdateTransactionSchema) => {
    if (!values.odometer) delete values.odometer;

    update.mutate(
      { tenantId, id: transactionId, values },
      {
        onSuccess: () => {
          toast.success("Transaction updated successfully");
        },
        onError: () => {
          toast.error("Failed to update transaction");
        },
      },
    );
  };

  const handleRemove = () => {
    remove.mutate(
      { tenantId, id: transactionId },
      {
        onSuccess: () => {
          toast.success("Transaction removed successfully");
          navigate({
            to: "/tenants/$tenantId/transaction",
            params: { tenantId },
          });
        },
        onError: () => {
          toast.error("Failed to remove transaction");
        },
      },
    );
  };

  useEffect(() => {
    if (items.fields.length === 0) return;
    if (type === transaction.type) return;

    window.alert("Changing the transaction type will reset the items list.");
    items.replace([]);
  }, [type]);

  return (
    <Page className="mx-auto w-full max-w-xl">
      <PageHeader>
        <PageTitle>
          <h2>Edit Transaction</h2>
        </PageTitle>
        <PageDescription>
          <p>Modify the details of the transaction and save the changes.</p>
        </PageDescription>
      </PageHeader>

      <PageContent>
        <form
          id="form-update"
          className="grid gap-10"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="space-y-8">
            <div>
              <h3 className="text-base/snug font-medium tracking-normal">
                Vehicle
              </h3>
              <p className="text-muted-foreground mt-1 text-sm/snug tracking-wide">
                Select the vehicle this transaction belongs to.
              </p>
            </div>

            <VehicleInfo
              tenantId={tenantId}
              operationId={transaction.operationId}
            />
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
                        >
                          <SelectTrigger
                            id={controller.name}
                            aria-invalid={fieldState.invalid}
                          >
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent position="item-aligned">
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
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

          <div className="flex justify-between gap-4">
            <div>
              <Button
                type="button"
                variant="secondary"
                onClick={() => form.reset()}
                disabled={
                  update.isPending ||
                  remove.isPending ||
                  !form.formState.isDirty
                }
              >
                Reset
              </Button>
            </div>

            <div className="flex justify-end gap-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive">
                    Remove
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This resource will no longer
                      be accessible.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                      variant="destructive"
                      onClick={handleRemove}
                      disabled={remove.isPending}
                    >
                      {remove.isPending ? "Removing..." : "Remove"}
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button
                form="form-update"
                type="submit"
                disabled={!form.formState.isDirty || update.isPending}
              >
                {update.isPending ? "Saving..." : "Save"}
              </Button>

              <Button variant="ghost" type="button" asChild>
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
          </div>
        </form>
      </PageContent>
    </Page>
  );
}
