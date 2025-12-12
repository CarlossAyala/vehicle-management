import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { categoriesQuery } from "@/features/category/queries";
import { odometerOperationQuery } from "@/features/odometer/queries";
import type { UpdateServiceSchema } from "@/features/service/types";
import { updateServiceSchema } from "@/features/service/schemas";
import {
  serviceQuery,
  useRemoveService,
  useUpdateService,
} from "@/features/service/queries";
import { queryClient } from "@/lib/utils";
import {
  Page,
  PageContent,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/page";
import { Button } from "@/ui/button";
import { Separator } from "@/ui/separator";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/ui/input-group";
import { GaugeIcon } from "lucide-react";
import { Textarea } from "@/ui/textarea";
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
import { VehicleInfo } from "@/features/vehicle/components/vehicle-info";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";

export const Route = createFileRoute(
  "/_auth/tenants/$tenantId/service/$serviceId",
)({
  component: RouteComponent,
  beforeLoad: async ({ params: { tenantId, serviceId } }) => {
    const service = await queryClient.ensureQueryData(
      serviceQuery(tenantId, serviceId),
    );

    return Promise.all([
      queryClient.ensureQueryData(
        odometerOperationQuery(tenantId, service.operationId),
      ),
      queryClient.ensureQueryData(categoriesQuery(tenantId)),
    ]);
  },
});

function RouteComponent() {
  const { tenantId, serviceId } = Route.useParams();

  const navigate = Route.useNavigate();

  const { data: service } = useSuspenseQuery(serviceQuery(tenantId, serviceId));
  const { data: odometer } = useSuspenseQuery(
    odometerOperationQuery(tenantId, service.operationId),
  );
  const { data: categories } = useSuspenseQuery(
    categoriesQuery(tenantId, "service"),
  );

  const form = useForm<UpdateServiceSchema>({
    resolver: zodResolver(updateServiceSchema),
    values: updateServiceSchema.parse({
      service: {
        description: service.description,
      },
      items: service.items,
      odometer,
    }),
    mode: "onSubmit",
  });
  const items = useFieldArray({
    name: "items",
    control: form.control,
  });

  const update = useUpdateService();
  const remove = useRemoveService();

  const onSubmit = (values: UpdateServiceSchema) => {
    if (!values.odometer?.value) values.odometer = undefined;

    update.mutate(
      { tenantId, id: serviceId, values },
      {
        onSuccess: () => {
          toast.success("Service updated successfully");
        },
        onError: () => {
          toast.error("Failed to update service");
        },
      },
    );
  };

  const handleRemove = () => {
    remove.mutate(
      { tenantId, id: serviceId },
      {
        onSuccess: () => {
          toast.success("Service removed successfully");
          navigate({ to: "/tenants/$tenantId/service", params: { tenantId } });
        },
        onError: () => {
          toast.error("Failed to remove service");
        },
      },
    );
  };

  return (
    <Page className="mx-auto w-full max-w-xl">
      <PageHeader>
        <PageTitle>
          <h2>Edit service record</h2>
        </PageTitle>
        <PageDescription>
          <p>
            View and edit this service entry. Fill the vehicle, service details
            and (optionally) the odometer reading. You can update the odometer
            record later if you want to skip it now.
          </p>
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
                Select the vehicle this service record belongs to. Only one
                vehicle can be selected.
              </p>
            </div>

            <VehicleInfo
              tenantId={tenantId}
              operationId={service.operationId}
            />
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
                        >
                          <SelectTrigger
                            id={controller.name}
                            aria-invalid={fieldState.invalid}
                          >
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent position="item-aligned">
                            {categories.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.name}
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
                Provide the odometer reading at the time of service. If left
                empty, no odometer record will be created — you can add it
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
                  to="/tenants/$tenantId/service"
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
