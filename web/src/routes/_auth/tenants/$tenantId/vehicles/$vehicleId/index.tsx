import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  VehicleStatusesItems,
  VehicleTypesItems,
  type UpdateVehicleSchema,
} from "@/features/vehicle/types";
import { updateVehicleSchema } from "@/features/vehicle/schemas";
import {
  useUpdateVehicle,
  vehicleSuspenseQuery,
} from "@/features/vehicle/queries";
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
} from "@/ui/field";
import { Input } from "@/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Button } from "@/ui/button";
import { Separator } from "@/ui/separator";
import { queryClient } from "@/lib/utils";

export const Route = createFileRoute(
  "/_auth/tenants/$tenantId/vehicles/$vehicleId/",
)({
  component: RouteComponent,
  beforeLoad: async ({ params: { tenantId, vehicleId } }) => {
    await queryClient.ensureQueryData(
      vehicleSuspenseQuery(tenantId, vehicleId),
    );
  },
});

function RouteComponent() {
  const { tenantId, vehicleId } = Route.useParams();

  const { data: vehicle } = useSuspenseQuery(
    vehicleSuspenseQuery(tenantId, vehicleId),
  );

  const form = useForm<UpdateVehicleSchema>({
    resolver: zodResolver(updateVehicleSchema),
    defaultValues: updateVehicleSchema.parse(vehicle),
  });
  const { mutate, isPending } = useUpdateVehicle();

  const onSubmit = (values: UpdateVehicleSchema) => {
    mutate(
      { tenantId, id: vehicleId, values },
      {
        onSuccess: () => {
          toast.success("Vehicle updated successfully");
        },
        onError: () => {
          toast.error("Failed to update vehicle");
        },
      },
    );
  };

  return (
    <Page className="mx-auto max-w-xl">
      <PageHeader>
        <PageTitle>
          <h2>Vehicle Details</h2>
        </PageTitle>
        <PageDescription>
          <p>
            View and edit vehicle information including identity,
            specifications, and registration details.
          </p>
        </PageDescription>
      </PageHeader>

      <PageContent>
        <form
          id="form-vehicle-update"
          className="grid gap-10"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="space-y-8">
            <div>
              <h3 className="text-base/snug font-medium tracking-normal">
                Vehicle Identity
              </h3>
              <p className="text-muted-foreground mt-1 text-sm/snug tracking-wide">
                Give your vehicle a memorable nickname for easy identification
              </p>
            </div>

            <FieldGroup>
              <Controller
                name="nickname"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Nickname</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Storm"
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
                Vehicle Details
              </h3>
              <p className="text-muted-foreground mt-1 text-sm/snug tracking-wide">
                Specify the vehicle type and manufacturer information
              </p>
            </div>

            <FieldGroup className="grid grid-cols-2">
              <Controller
                name="type"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    orientation="vertical"
                    data-invalid={fieldState.invalid}
                    className="col-span-2"
                  >
                    <FieldContent>
                      <FieldLabel htmlFor={field.name}>Type</FieldLabel>
                      <FieldDescription>
                        Select the category that best describes this vehicle
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        className="min-w-[120px]"
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {VehicleTypesItems.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />

              <Controller
                name="brand"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Brand</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Toyota, Volkswagen, Honda, Ford, etc."
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="model"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Model</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Corolla, Golf, Civic, Focus, etc."
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="variant"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Variant</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Sedan, Hatchback, SUV, etc."
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="year"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Year</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="2023"
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
                Registration
              </h3>
              <p className="text-muted-foreground mt-1 text-sm/snug tracking-wide">
                Enter the official license plate number for this vehicle
              </p>
            </div>

            <FieldGroup>
              <Controller
                name="licensePlate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>License Plate</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="ABC-123"
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
                Availability
              </h3>
              <p className="text-muted-foreground mt-1 text-sm/snug tracking-wide">
                Set the current operational status of this vehicle
              </p>
            </div>

            <FieldGroup>
              <Controller
                name="status"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    orientation="vertical"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldContent>
                      <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        className="min-w-[120px]"
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="capitalize">
                        {VehicleStatusesItems.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          <Separator />

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </PageContent>
    </Page>
  );
}
