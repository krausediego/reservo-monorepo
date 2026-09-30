import {
  DialogCloseButton,
  DialogDescription,
  DialogFooter,
  DialogForm,
  DialogHeader,
  DialogSubmitButton,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { createManualAppointmentSchema } from "@reservo/schemas";
import type {
  ICreateManualAppointmentSchema,
  IListCustomersSchema,
} from "@reservo/types";
import { Controller, useForm } from "react-hook-form";
import { useCreateManualAppointmentMutation } from "../../hooks";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  AsyncCombobox,
  type AsyncComboboxValue,
} from "@/components/ui/async-combobox";
import { useListCustomersQuery } from "@/modules/app/customers/hooks";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Customer = IListCustomersSchema.GetResponse["data"][number];

export function CreateAppointmentDialog() {
  const form = useForm<ICreateManualAppointmentSchema.GetInput>({
    resolver: zodResolver(createManualAppointmentSchema.shape.body, undefined, {
      raw: true,
    }),
    defaultValues: {
      professionalId: "",
      serviceId: "",
      customer: {
        type: "new",
        name: "",
        phone: "",
        email: "",
      },
      startsAt: "",
      notes: "",
      internalNotes: "",
    },
  });
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  const customer = form.watch("customer");
  const isNew = customer.type === "new";

  const comboboxValue: AsyncComboboxValue<Customer> | null =
    customer.type === "existing"
      ? selectedCustomer && { type: "existing", item: selectedCustomer } // objeto guardado em state pra ter o label
      : customer.name
        ? { type: "new", name: customer.name }
        : null;

  const { mutateAsync: createManualAppointmentFn } =
    useCreateManualAppointmentMutation();

  const { data, isFetching, isError, refetch } = useListCustomersQuery({
    page: 1,
    limit: 100,
    name: search,
    orderBy: "asc",
  });

  return (
    <DialogForm form={form} onSubmit={createManualAppointmentFn}>
      <DialogHeader>
        <DialogTitle>Criar agendamento</DialogTitle>
        <DialogDescription>Crie um agendamento manual</DialogDescription>
      </DialogHeader>

      <FieldGroup>
        <Controller
          name="customer.customerId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="customer">Cliente</FieldLabel>
              <AsyncCombobox<Customer>
                value={comboboxValue}
                onChange={(v) => {
                  if (!v) {
                    setSelectedCustomer(null);
                    form.setValue("customer", {
                      type: "new",
                      name: "",
                      phone: "",
                      email: "",
                    });
                  } else if (v.type === "existing") {
                    setSelectedCustomer(v.item);
                    form.setValue("customer", {
                      type: "existing",
                      customerId: v.item.id,
                    });
                  } else {
                    setSelectedCustomer(null);
                    form.setValue("customer", {
                      type: "new",
                      name: v.name,
                      phone: "",
                      email: "",
                    });
                  }
                  form.trigger("customer");
                }}
                onSearchChange={setSearch}
                options={data?.data ?? []}
                isLoading={isFetching}
                isError={isError}
                onRetry={refetch}
                getValue={(c) => c.id}
                getLabel={(c) => c.name}
                renderOption={(c) => (
                  <div className="flex flex-col">
                    <span>{c.name}</span>
                    {c.phone && (
                      <span className="text-xs text-muted-foreground">
                        {c.phone}
                      </span>
                    )}
                  </div>
                )}
                createLabel={(name) => `Novo cliente "${name}"`}
                placeholder="Buscar cliente"
                searchPlaceholder="Nome ou telefone"
                minChars={2}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      {comboboxValue && (
        <FieldGroup className="grid grid-cols-2">
          <Controller
            name="customer.phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="customer.phone">Telefone</FieldLabel>
                <Input
                  {...field}
                  id="customer.phone"
                  aria-invalid={fieldState.invalid}
                  placeholder="Número de telefone"
                  type="tel"
                  autoComplete="off"
                  autoCapitalize="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="customer.email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="customer.email">E-mail</FieldLabel>
                <Input
                  {...field}
                  id="customer.email"
                  aria-invalid={fieldState.invalid}
                  placeholder="Número de telefone"
                  type="email"
                  autoComplete="off"
                  autoCapitalize="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="notes"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-2">
                <FieldLabel htmlFor="notes">Observações</FieldLabel>
                <Textarea
                  {...field}
                  id="notes"
                  aria-invalid={fieldState.invalid}
                  placeholder="Observações"
                  autoComplete="off"
                  autoCapitalize="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      )}

      <DialogFooter>
        <DialogCloseButton>Cancelar</DialogCloseButton>
        <DialogSubmitButton>Criar serviço</DialogSubmitButton>
      </DialogFooter>
    </DialogForm>
  );
}
