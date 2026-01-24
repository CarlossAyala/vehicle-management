import { useNavigate } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useCreateTenant } from "@/features/tenant/queries";
import { createTenantSchema } from "@/features/tenant/schemas";
import type { CreateTenantDto } from "@/features/tenant/types";
import { TenantTypeValues } from "@/features/tenant/utils";
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
import { Textarea } from "@/ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog";

export const CreateTenant = () => {
  const navigate = useNavigate();

  const form = useForm<CreateTenantDto>({
    resolver: zodResolver(createTenantSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "personal",
    },
    mode: "onSubmit",
  });

  const { mutate, isPending } = useCreateTenant();

  const onSubmit = (values: CreateTenantDto) => {
    mutate(values, {
      onSuccess: ({ tenant }) => {
        toast.success("Tenant created successfully");

        navigate({
          to: "/tenants/$tenantId",
          params: { tenantId: tenant.id },
        });
      },
      onError: () => {
        toast.error("Failed to create tenant");
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button">Add Tenant</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Tenant</DialogTitle>
          <DialogDescription>
            Personalize the details for the new tenant. The tenant type cannot
            be changed after creation.
          </DialogDescription>
        </DialogHeader>

        <form id="form-create" onSubmit={form.handleSubmit(onSubmit)}>
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
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="Garage"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    rows={5}
                    placeholder="Description"
                    className="resize-none"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <FieldGroup>
              <Controller
                name="type"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FieldSet data-invalid={fieldState.invalid}>
                    <FieldLegend>Type</FieldLegend>
                    <FieldDescription>
                      Choose the type of your tenant. Please note that tenant
                      type cannot be changed after creation.
                    </FieldDescription>
                    <RadioGroup
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                      aria-invalid={fieldState.invalid}
                    >
                      {TenantTypeValues.map((type) => (
                        <FieldLabel key={type.value} htmlFor={type.value}>
                          <Field
                            orientation="horizontal"
                            data-invalid={fieldState.invalid}
                          >
                            <FieldContent>
                              <FieldTitle>{type.label}</FieldTitle>
                              <FieldDescription>
                                {type.description}
                              </FieldDescription>
                            </FieldContent>
                            <RadioGroupItem
                              id={type.value}
                              value={type.value}
                              aria-invalid={fieldState.invalid}
                            />
                          </Field>
                        </FieldLabel>
                      ))}
                    </RadioGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldSet>
                )}
              />
            </FieldGroup>
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button form="form-create" type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
