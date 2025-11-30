import {
  createFileRoute,
  Link,
  stripSearchParams,
  useNavigate,
} from "@tanstack/react-router";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { GaugeIcon } from "lucide-react";
import { operationQuery } from "@/features/operation/queries";
import { odometerByOperationQuery } from "@/features/odometer/queries";
import { fuelCategoriesQuery } from "@/features/category/queries";
import { VehicleInfo } from "@/features/vehicle/components/vehicle-info";
import type { UpdateFuelSchema } from "@/features/fuel/types";
import { updateFuelSchema } from "@/features/fuel/schemas";
import {
  fuelQuery,
  fuelSuspenseQuery,
  useRemoveFuel,
  useUpdateFuel,
} from "@/features/fuel/queries";
import { queryClient } from "@/lib/utils";
import {
  Page,
  PageContent,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/page";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/ui/field";
import { Separator } from "@/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/ui/input-group";
import { Textarea } from "@/ui/textarea";
import { Button } from "@/ui/button";
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

const searchSchema = z.object({
  from: z.enum(["odometer", "fuel"]).default("fuel").catch("fuel"),
});

export const Route = createFileRoute("/_auth/tenants/$tenantId/fuel/$fuelId")({
  component: RouteComponent,
  validateSearch: searchSchema,
  search: {
    middlewares: [stripSearchParams(searchSchema.parse({}))],
  },
  beforeLoad: async ({ params: { tenantId, fuelId } }) => {
    const fuel = await queryClient.ensureQueryData(
      fuelSuspenseQuery(tenantId, fuelId),
    );

    await Promise.all([
      queryClient.ensureQueryData(operationQuery(tenantId, fuel.operationId)),
      queryClient.ensureQueryData(
        odometerByOperationQuery(tenantId, fuel.operationId),
      ),
    ]);
  },
});

function RouteComponent() {
  const { tenantId, fuelId } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate();

  const { data: fuel } = useSuspenseQuery(fuelQuery(tenantId, fuelId));
  const { data: odometer } = useSuspenseQuery(
    odometerByOperationQuery(tenantId, fuel.operationId),
  );

  const form = useForm<UpdateFuelSchema>({
    resolver: zodResolver(updateFuelSchema),
    defaultValues: updateFuelSchema.parse({
      fuel,
      odometer,
    }),
  });

  const { mutate, isPending } = useUpdateFuel();
  const remove = useRemoveFuel();

  const categories = useQuery(fuelCategoriesQuery(tenantId));

  const onSubmit = (values: UpdateFuelSchema) => {
    if (!values.odometer?.value) values.odometer = undefined;

    mutate(
      { tenantId, id: fuelId, values },
      {
        onSuccess: () => {
          toast.success("Fuel updated successfully");
        },
        onError: () => {
          toast.error("Failed to update fuel");
        },
      },
    );
  };

  const handleRemove = () => {
    remove.mutate(
      { tenantId, id: fuelId },
      {
        onSuccess: () => {
          toast.success("Fuel removed successfully");

          switch (search.from) {
            case "odometer":
              navigate({
                to: "/tenants/$tenantId/odometer",
                params: { tenantId },
              });
              break;
            default:
              navigate({ to: "/tenants/$tenantId/fuel", params: { tenantId } });
          }
        },
        onError: () => {
          toast.error("Failed to remove fuel");
        },
      },
    );
  };

  const handleReset = () => {
    form.reset();
  };

  return (
    <Page className="mx-auto w-full max-w-xl">
      <PageHeader>
        <PageTitle>
          <h2>Edit fuel record</h2>
        </PageTitle>
        <PageDescription>
          <p>
            View and edit this fuel entry. Update the category, quantity,
            amount, or notes. The associated vehicle is shown below and cannot
            be changed. You can add or modify the odometer reading if needed.
          </p>
        </PageDescription>
      </PageHeader>

      <PageContent>
        <form
          id="form-fuel-update"
          className="grid gap-10"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="space-y-8">
            <div>
              <h3 className="text-base/snug font-medium tracking-normal">
                Vehicle
              </h3>
              <p className="text-muted-foreground mt-1 text-sm/snug tracking-wide">
                Vehicle associated with this fuel record (read-only on this
                page).
              </p>
            </div>

            <VehicleInfo tenantId={tenantId} operationId={fuel.operationId} />
          </div>

          <Separator />

          <div className="space-y-8">
            <div>
              <h3 className="text-base/snug font-medium tracking-normal">
                Fuel details
              </h3>
              <p className="text-muted-foreground mt-1 text-sm/snug tracking-wide">
                Update the category, quantity and amount for this refill. Edit
                the optional description (station, pump number, notes).
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
                Enter an odometer reading to create a new record, or leave
                empty/zero to remove any existing reading. The odometer reading
                will be created if provided, or deleted if blank/zero.
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

          <div className="flex justify-between gap-3">
            <div>
              <Button
                type="button"
                variant="secondary"
                onClick={handleReset}
                disabled={
                  isPending || remove.isPending || !form.formState.isDirty
                }
              >
                Reset
              </Button>
            </div>

            <div className="flex justify-end gap-3">
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
                      This action cannot be undone. This preset will no longer
                      be accessible by you or others you&apos;ve shared it with.
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
                type="submit"
                disabled={
                  isPending || remove.isPending || !form.formState.isDirty
                }
              >
                {isPending ? "Saving..." : "Save"}
              </Button>

              <Button variant="ghost" type="button" asChild>
                <Link
                  to={
                    search.from === "odometer"
                      ? "/tenants/$tenantId/odometer"
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
          </div>
        </form>
      </PageContent>
    </Page>
  );
}
