import React, { Children, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  invitationsTenantQuery,
  useCreateInvitation,
} from "@/features/invitation/queries";
import { createInvitationSchema } from "@/features/invitation/schemas";
import type { CreateInvitation, Invitation } from "@/features/invitation/types";
import type { Tenant, TenantRole, UpdateRoles } from "@/features/tenant/types";
import {
  membersQuery,
  useRemoveMember,
  useUpdateRoles,
} from "@/features/tenant/queries";
import { UserCell } from "@/features/user/components/user-cell";
import type { User } from "@/features/user/types";
import { getRoleLabel } from "@/features/tenant/utils";
import { EllipsisIcon } from "lucide-react";
import { Button } from "@/ui/button";
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
import { Page, PageContent, PageHeader, PageTitle } from "@/components/page";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/ui/field";
import { Input } from "@/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { DataTable } from "@/components/data-table";
import { TenantInvitationActions } from "@/components/tenant-invitation-actions";
import { Badge } from "@/ui/badge";
import { updateRolesSchema } from "@/features/tenant/schemas";
import { Checkbox } from "@/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { profileQuery } from "@/features/auth/queries";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/ui/alert-dialog";

export const Route = createFileRoute("/_auth/tenants/$tenantId/members/")({
  component: RouteComponent,
});

const ROLES: {
  name: string;
  role: TenantRole;
}[] = [
  {
    name: "Owner",
    role: "owner",
  },
  {
    name: "Admin",
    role: "admin",
  },
  {
    name: "Fleet Manager",
    role: "fleet_manager",
  },
  {
    name: "Driver",
    role: "driver",
  },
  {
    name: "Member",
    role: "member",
  },
];

const MembersActions = ({
  tenantId,
  user,
}: {
  tenantId: Tenant["id"];
  user: User;
}) => {
  const { data: auth } = useSuspenseQuery(profileQuery);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" aria-label="Actions">
          <EllipsisIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Member</DropdownMenuLabel>
          <RemoveMember tenantId={tenantId} userId={user.id}>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
              }}
            >
              {auth?.id === user.id ? "Leave" : "Remove"}
            </DropdownMenuItem>
          </RemoveMember>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Roles</DropdownMenuLabel>
          <EditRoles tenantId={tenantId} user={user}>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
              }}
            >
              Edit
            </DropdownMenuItem>
          </EditRoles>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const RemoveMember = ({
  tenantId,
  userId,
  children,
}: {
  tenantId: Tenant["id"];
  userId: User["id"];
  children: React.ReactNode;
}) => {
  const { data: auth } = useSuspenseQuery(profileQuery);

  const { mutate, isPending } = useRemoveMember();

  const isAuthUser = auth?.id === userId;

  const onSubmit = () => {
    mutate(
      {
        tenantId,
        userId,
      },
      {
        onSuccess: () => {
          toast.success(
            isAuthUser ? "You have left the tenant." : "Member removed.",
          );
        },
        onError: () => {
          toast.error(
            isAuthUser
              ? "Failed to leave the tenant."
              : "Failed to remove member.",
          );
        },
      },
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {isAuthUser
              ? "You will be removed from the tenant."
              : "This member will be removed from the tenant."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onSubmit} variant="destructive">
            {isPending
              ? isAuthUser
                ? "Leaving..."
                : "Removing..."
              : isAuthUser
                ? "Leave"
                : "Remove"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const AddPeople = ({ tenantId }: { tenantId: Tenant["id"] }) => {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<CreateInvitation>({
    resolver: zodResolver(createInvitationSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
    mode: "onSubmit",
  });

  const { mutate, isPending } = useCreateInvitation();

  const onSubmit = (values: CreateInvitation) => {
    mutate(
      {
        tenantId,
        values,
      },
      {
        onSuccess: () => {
          toast.success("Invitation sent!");
          setOpen(false);
          form.reset();
        },
        onError: () => {
          toast.error("Failed to send invitation.");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">Add People</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to tenant</DialogTitle>
          <DialogDescription>
            Add people to your tenant by entering their email address and role.
          </DialogDescription>
        </DialogHeader>

        <form id="form-invite" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="flex flex-row items-baseline gap-3">
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="w-full">
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter email address"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="role"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="vertical"
                  data-invalid={fieldState.invalid}
                  className="flex-1"
                >
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>Role</FieldLabel>
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
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      {ROLES.map((r) => (
                        <SelectItem key={r.role} value={r.role}>
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="form-invite" disabled={isPending}>
            {isPending ? "Sending..." : "Send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EditRoles = ({
  tenantId,
  user,
  children,
}: {
  tenantId: Tenant["id"];
  user: User;
  children: React.ReactNode;
}) => {
  const form = useForm<UpdateRoles>({
    resolver: zodResolver(updateRolesSchema),
    values: {
      roles: user.roles?.map((r) => r.role) as string[],
    },
    mode: "onSubmit",
  });

  const { mutate, isPending } = useUpdateRoles();

  const onSubmit = (values: UpdateRoles) => {
    mutate(
      {
        tenantId,
        userId: user.id,
        values,
      },
      {
        onSuccess: () => {
          toast.success("Roles updated!");
        },
        onError: () => {
          toast.error("Failed to update roles.");
        },
      },
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit member roles</DialogTitle>
          <DialogDescription>
            Update the roles for this member.
          </DialogDescription>
        </DialogHeader>

        <form id="form-update-roles" onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name="roles"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldSet>
                <FieldLegend variant="label">Roles</FieldLegend>
                <FieldGroup data-slot="checkbox-group">
                  {ROLES.map((r) => (
                    <Field
                      key={r.role}
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <Checkbox
                        id={`checkbox-${r.role}`}
                        name={field.name}
                        aria-invalid={fieldState.invalid}
                        checked={field.value.includes(r.role)}
                        onCheckedChange={(checked) => {
                          const newValue = checked
                            ? [...field.value, r.role]
                            : field.value.filter((value) => value !== r.role);
                          field.onChange(newValue);
                        }}
                      />
                      <FieldLabel
                        htmlFor={`checkbox-${r.role}`}
                        className="font-normal"
                      >
                        {r.name}
                      </FieldLabel>
                    </Field>
                  ))}
                </FieldGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldSet>
            )}
          />
        </form>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="form-update-roles" disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

function RouteComponent() {
  const { tenantId } = Route.useParams();

  const members = useQuery(membersQuery(tenantId));
  const invitations = useQuery(invitationsTenantQuery(tenantId, {}));

  const columnsM = useMemo((): ColumnDef<User>[] => {
    return [
      {
        id: "member",
        header: "Member",
        cell: (props) => {
          const { id } = props.row.original;

          return <UserCell tenantId={tenantId} userId={id} />;
        },
      },
      {
        id: "Roles",
        header: "Roles",
        cell: (props) => {
          const { roles } = props.row.original;
          if (!roles) return;

          return (
            <div className="flex flex-wrap gap-2">
              {roles.map((r) => (
                <Badge key={r.id} variant="outline">
                  {getRoleLabel(r.role)}
                </Badge>
              ))}
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: (props) => {
          return (
            <MembersActions tenantId={tenantId} user={props.row.original} />
          );
        },
      },
    ];
  }, [tenantId]);

  const columnsI = useMemo((): ColumnDef<Invitation>[] => {
    return [
      {
        id: "email",
        header: "Email",
        cell: (props) => {
          const { email } = props.row.original;

          return email;
        },
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: (props) => {
          const { role } = props.row.original;

          return getRoleLabel(role);
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: (props) => {
          return <TenantInvitationActions invitation={props.row.original} />;
        },
      },
    ];
  }, [tenantId]);

  return (
    <Page>
      <PageHeader>
        <div className="grid grid-cols-8 items-center">
          <PageTitle className="col-span-6 mb-0">
            <h2>Members List</h2>
          </PageTitle>
          <div className="col-span-2 flex justify-end">
            <AddPeople tenantId={tenantId} />
          </div>
        </div>
      </PageHeader>

      <PageContent className="flex-1">
        <Tabs defaultValue="members">
          <TabsList>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="invitations">Invitations</TabsTrigger>
          </TabsList>
          <TabsContent value="members">
            {members.isPending ? (
              "Loading..."
            ) : members.isError ? (
              "Error"
            ) : (
              <DataTable columns={columnsM} data={members.data} />
            )}
          </TabsContent>
          <TabsContent value="invitations">
            {invitations.isPending ? (
              "Loading..."
            ) : invitations.isError ? (
              "Error"
            ) : (
              <DataTable columns={columnsI} data={invitations.data} />
            )}
          </TabsContent>
        </Tabs>
      </PageContent>
    </Page>
  );
}
