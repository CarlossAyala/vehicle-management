import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import {
  tenantSuspenseQuery,
  useRemoveTenant,
  useUpdateTenant,
} from "@/features/tenant/queries";
import { updateTenantSchema } from "@/features/tenant/schemas";
import type { UpdateTenant } from "@/features/tenant/types";
import { TenantTypeValues } from "@/features/tenant/utils";
import {
  Page,
  PageContent,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/page";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/ui/alert-dialog";
import { Button } from "@/ui/button";
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
import { Input } from "@/ui/input";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";
import { Separator } from "@/ui/separator";
import { Textarea } from "@/ui/textarea";
import { useState } from "react";

export const Route = createFileRoute("/_auth/tenants/$tenantId/settings")({
  component: RouteComponent,
});

const UpdateTenantForm = () => {
  const { tenantId } = Route.useParams();

  const { data: tenant } = useSuspenseQuery(tenantSuspenseQuery(tenantId));

  const form = useForm<UpdateTenant>({
    resolver: zodResolver(updateTenantSchema),
    values: tenant,
    mode: "onSubmit",
  });

  const { mutate, isPending } = useUpdateTenant();

  const onSubmit = (values: UpdateTenant) => {
    mutate(
      {
        tenantId,
        values,
      },
      {
        onSuccess: () => {
          toast.success("Tenant updated successfully");
        },
        onError: () => {
          toast.error("Failed to update tenant");
        },
      },
    );
  };

  return (
    <form
      id="form-update"
      className="space-y-10"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Name</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Tenant name"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Description (optional)
              </FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Tell us about your organization"
                className="min-h-24 resize-none"
              />
              <FieldDescription>
                Tell us more about tenant. This will be used to help others
                identify it.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <FieldSet>
          <FieldLegend variant="label">Type</FieldLegend>
          <FieldDescription>
            Helps categorize your organization and may affect available
            features. This cannot be changed.
          </FieldDescription>
          <RadioGroup defaultValue={tenant.type} disabled>
            {TenantTypeValues.map((t) => (
              <FieldLabel key={t.value} htmlFor={t.value}>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>{t.label}</FieldTitle>
                    <FieldDescription>{t.description}</FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value={t.value} className="sr-only" />
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
        </FieldSet>
      </FieldGroup>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={() => form.reset()}>
          Reset
        </Button>
        <Button type="submit" disabled={isPending || !form.formState.isDirty}>
          {isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
};

const RemoveTenantForm = () => {
  const [open, setOpen] = useState<boolean>(false);

  const { tenantId } = Route.useParams();
  const navigate = Route.useNavigate();

  const { mutate, isPending } = useRemoveTenant();

  const handler = () => {
    mutate(
      { tenantId },
      {
        onSuccess: () => {
          toast.success("Tenant deleted successfully");

          navigate({ to: "/tenants" });
        },
        onError: () => {
          toast.error("Failed to delete tenant");
        },
      },
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="destructive" className="w-full">
          Delete Tenant
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete Tenant?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this tenant? All data will be
            permanently removed. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" disabled={isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPending}
            onClick={handler}
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

function RouteComponent() {
  return (
    <Page className="mx-auto w-full max-w-xl">
      <PageHeader>
        <PageTitle>
          <h1>Settings</h1>
        </PageTitle>
        <PageDescription>
          <p>
            Update your tenant's settings and configuration. These changes will
            affect all users within this tenant.
          </p>
        </PageDescription>
      </PageHeader>

      <PageContent className="grid gap-6">
        <Separator className="mt-6" />

        <section className="space-y-8">
          <div>
            <h3 className="text-base/snug font-medium tracking-normal">
              Tenant Information
            </h3>
            <p className="text-muted-foreground mt-1 text-sm/snug tracking-wide">
              This information is visible to all members of the tenant.
            </p>
          </div>

          <UpdateTenantForm />
        </section>

        <Separator />

        <section className="text-destructive space-y-8">
          <div>
            <h3 className="text-base/snug font-medium tracking-normal">
              Delete Tenant
            </h3>
            <p className="text-muted-foreground mt-1 text-sm/snug tracking-wide">
              This action is irreversible and will remove all data associated
              with this tenant.
            </p>
          </div>

          <RemoveTenantForm />
        </section>
      </PageContent>
    </Page>
  );
}
