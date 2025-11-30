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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card";
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

export const CreateTenantForm = () => {
  const navigate = useNavigate();

  const form = useForm<CreateTenantDto>({
    resolver: zodResolver(createTenantSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "",
    },
    mode: "onSubmit",
  });

  const { mutate, isPending } = useCreateTenant();

  const onSubmit = (values: CreateTenantDto) => {
    mutate(values, {
      onSuccess: () => {
        toast.success("Tenant created successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create tenant</CardTitle>
        <CardDescription>
          Personalize and configure your new tenant
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="create-tenant-form" onSubmit={form.handleSubmit(onSubmit)}>
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
            <div className="w-full max-w-md">
              <FieldGroup>
                <Controller
                  name="type"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FieldSet data-invalid={fieldState.invalid}>
                      <FieldLegend>Tenant type</FieldLegend>
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
            </div>
            <Field className="mb-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Tenant"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};
