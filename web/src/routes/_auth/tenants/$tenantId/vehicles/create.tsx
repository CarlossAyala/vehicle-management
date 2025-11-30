import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createVehicleSchema } from "@/features/vehicle/schemas";
import {
  VehicleTypesItems,
  VehicleStatusesItems,
  type CreateVehicleSchema,
} from "@/features/vehicle/types";
import { useCreateVehicle } from "@/features/vehicle/queries";
import {
  Page,
  PageHeader,
  PageTitle,
  PageDescription,
  PageContent,
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
import { Separator } from "@/ui/separator";
import { Button } from "@/ui/button";

export const Route = createFileRoute(
  "/_auth/tenants/$tenantId/vehicles/create",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { tenantId } = Route.useParams();
  const navigate = useNavigate();

  const form = useForm<CreateVehicleSchema>({
    resolver: zodResolver(createVehicleSchema),
    defaultValues: {
      nickname: "Bird",
      brand: "Ford",
      model: "Ranger",
      variant: "",
      year: 2005,
      licensePlate: "ABC-123-DE",
      type: "car",
      status: "available",
    },
    mode: "onSubmit",
  });

  const { mutate, isPending } = useCreateVehicle();

  const onSubmit = (values: CreateVehicleSchema) => {
    mutate(
      { tenantId, values },
      {
        onSuccess: () => {
          toast.success("Vehicle created successfully");
          navigate({
            to: "/tenants/$tenantId/vehicles",
            params: {
              tenantId,
            },
          });
        },
        onError: () => {
          toast.error("Failed to create vehicle");
        },
      },
    );
  };

  return (
    <Page className="mx-auto max-w-xl">
      <PageHeader>
        <PageTitle>
          <h2>Add New Vehicle</h2>
        </PageTitle>
        <PageDescription>
          <p>
            Create a new vehicle record and add it to your fleet. Fill in the
            vehicle details below.
          </p>
        </PageDescription>
      </PageHeader>

      <PageContent>
        <form
          id="form-vehicle-create"
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

          <div className="flex justify-end gap-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create vehicle"}
            </Button>
            <Button variant="secondary" type="button" asChild>
              <Link
                to="/tenants/$tenantId/vehicles"
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
