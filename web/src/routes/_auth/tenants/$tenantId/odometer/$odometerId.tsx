import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { GaugeIcon } from "lucide-react";
import {
  odometerQuery,
  useRemoveOdometer,
  useUpdateOdometer,
} from "@/features/odometer/queries";
import { updateOdometerSchema } from "@/features/odometer/schemas";
import type { UpdateOdometerSchema } from "@/features/odometer/types";
import { VehicleInfo } from "@/features/vehicle/components/vehicle-info";
import { queryClient } from "@/lib/utils";
import {
  Page,
  PageContent,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/page";
import { Separator } from "@/ui/separator";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/ui/input-group";
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
import { Item, ItemActions, ItemContent, ItemTitle } from "@/ui/item";

export const Route = createFileRoute(
  "/_auth/tenants/$tenantId/odometer/$odometerId",
)({
  component: RouteComponent,
  beforeLoad: ({ params: { tenantId, odometerId } }) => {
    return queryClient.ensureQueryData(odometerQuery(tenantId, odometerId));
  },
});

function RouteComponent() {
  const { tenantId, odometerId } = Route.useParams();

  const navigate = useNavigate();

  const { data: odometer } = useSuspenseQuery(
    odometerQuery(tenantId, odometerId),
  );

  const form = useForm<UpdateOdometerSchema>({
    resolver: zodResolver(updateOdometerSchema),
    values: updateOdometerSchema.parse({
      odometer,
    }),
    mode: "onSubmit",
  });

  const update = useUpdateOdometer();
  const remove = useRemoveOdometer();

  const onSubmit = (values: UpdateOdometerSchema) => {
    update.mutate(
      { tenantId, id: odometerId, values },
      {
        onSuccess: () => {
          toast.success("Odometer updated successfully");
          form.reset();
        },
        onError: () => {
          toast.error("Failed to update odometer");
        },
      },
    );
  };

  const handleRemove = () => {
    remove.mutate(
      { tenantId, id: odometerId },
      {
        onSuccess: () => {
          toast.success("Odometer removed successfully");
          navigate({ to: "/tenants/$tenantId/odometer", params: { tenantId } });
        },
        onError: () => {
          toast.error("Failed to remove odometer");
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
          <h2>Edit odometer record</h2>
        </PageTitle>
        <PageDescription>
          <p>
            Update or remove this odometer reading for your vehicle. You can
            modify the reading value and add optional notes.
          </p>
        </PageDescription>
      </PageHeader>

      <PageContent>
        <form
          id="updater"
          className="grid gap-10"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="space-y-8">
            <div>
              <h3 className="text-base/snug font-medium tracking-normal">
                Vehicle
              </h3>
              <p className="text-muted-foreground mt-1 text-sm/snug tracking-wide">
                Select the vehicle this odometer record belongs to. Only one
                vehicle can be selected.
              </p>
            </div>

            <FieldGroup>
              <div className="space-y-4">
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
                  </ItemActions>
                </Item>

                <VehicleInfo
                  tenantId={tenantId}
                  operationId={odometer.operationId}
                />
              </div>
            </FieldGroup>
          </div>

          <Separator />

          <div className="space-y-8">
            <div>
              <h3 className="text-base/snug font-medium tracking-normal">
                Odometer
              </h3>
              <p className="text-muted-foreground mt-1 text-sm/snug tracking-wide">
                Enter the odometer reading for the selected vehicle.
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

          <div className="flex justify-between gap-3">
            <div>
              <Button
                type="button"
                variant="secondary"
                onClick={handleReset}
                disabled={
                  update.isPending ||
                  remove.isPending ||
                  !form.formState.isDirty
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
                type="submit"
                disabled={
                  update.isPending ||
                  remove.isPending ||
                  !form.formState.isDirty
                }
              >
                {update.isPending ? "Saving..." : "Save"}
              </Button>

              <Button variant="ghost" type="button" asChild>
                <Link
                  to="/tenants/$tenantId/odometer"
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
