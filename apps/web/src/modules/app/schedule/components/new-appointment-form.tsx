import { AsyncCombobox } from "@/components/ui/async-combobox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import type { ICreateManualAppointmentSchema } from "@reservo/types";
import { Controller, useFormContext } from "react-hook-form";
import type { Customer } from "./dialogs/create-appointment-dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { addDays, format, isSameDay, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { InputMask } from "@/helpers";
import { useAppointment } from "../hooks";
import { Calendar } from "@/components/ui/calendar";

export function NewAppointmentForm() {
  const form = useFormContext<ICreateManualAppointmentSchema.GetInput>();

  const today = new Date();

  const {
    comboboxValue,
    setSelectedCustomer,
    setSelectedDate,
    selectedDate,
    setSearch,
    customers,
    isCustomersFetching,
    isCustomersError,
    customersRefetch,
    isNew,
    professionals,
    services,
    slots,
    professionalId,
    serviceId,
  } = useAppointment({ form });

  const masked = new InputMask();

  return (
    <>
      <FieldGroup>
        <Controller
          name="customer.customerId"
          control={form.control}
          render={({ fieldState }) => (
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
                    form.setValue("customer.phone", v.item.phone ?? "");
                    form.setValue("customer.email", v.item.email ?? "");
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
                options={customers?.data ?? []}
                isLoading={isCustomersFetching}
                isError={isCustomersError}
                onRetry={customersRefetch}
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
        <>
          <FieldGroup className="grid grid-cols-2">
            <FieldGroup className="grid col-span-2 grid-cols-2 bg-muted border rounded-md p-4">
              <Controller
                name="customer.phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="customer.phone">Telefone</FieldLabel>
                    <Input
                      {...field}
                      id="customer.phone"
                      value={field.value && masked.celPhone(field.value)}
                      aria-invalid={fieldState.invalid}
                      disabled={!isNew}
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
                    <FieldLabel htmlFor="customer.email">
                      E-mail
                      {isNew && (
                        <span className="text-muted-foreground text-xs">
                          · opcional
                        </span>
                      )}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="customer.email"
                      aria-invalid={fieldState.invalid}
                      disabled={!isNew}
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

              {isNew && (
                <span className="col-span-2 text-xs text-muted-foreground">
                  Usamos o telefone para reconhecer essa pessoa quando ela
                  agendar pelo app.
                </span>
              )}
            </FieldGroup>

            <Controller
              name="professionalId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="professional">Profissional</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!professionals?.data?.length}
                  >
                    <SelectTrigger
                      id="professional"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Profissional" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {professionals?.data?.map(({ professional }) => (
                        <SelectItem
                          key={professional.id}
                          value={professional.id}
                        >
                          {professional.name}
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
              name="serviceId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="service">Serviço</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!professionalId || !services?.data?.length}
                  >
                    <SelectTrigger
                      id="service"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Serviço" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {services?.data?.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
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
          </FieldGroup>

          {!!professionalId && (
            <>
              <Separator />

              <div className="flex w-full gap-2">
                <Button
                  className="border-input"
                  variant="secondary"
                  onClick={() => {
                    setSelectedDate((prev) => subDays(prev, 1));
                  }}
                >
                  <ChevronLeft />
                </Button>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      className="flex-1 border-input justify-between"
                      variant="secondary"
                    >
                      <span className="flex items-center gap-2">
                        <CalendarIcon />
                        {format(selectedDate, "EEE, dd 'de' LLLL", {
                          locale: ptBR,
                        })}
                      </span>
                      {isSameDay(selectedDate, today) && (
                        <span className="text-muted-foreground text-xs">
                          Hoje
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      required
                      selected={selectedDate}
                      defaultMonth={selectedDate}
                      onSelect={setSelectedDate}
                    />
                  </PopoverContent>
                </Popover>

                <Button
                  className="border-input"
                  variant="secondary"
                  onClick={() => {
                    setSelectedDate((prev) => addDays(prev, 1));
                  }}
                >
                  <ChevronRight />
                </Button>
              </div>

              <Controller
                name="startsAt"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Horário</FieldLabel>
                    {!serviceId ? (
                      <div className="text-muted-foreground w-full h-32 gap-1.5 rounded-md border border-dashed flex flex-col justify-center items-center">
                        <Clock className="size-4" />
                        <h3 className="font-medium">Escolha um serviço</h3>
                        <p className="text-xs">
                          A duração do serviço define quais horários ficam
                          livres neste dia.
                        </p>
                      </div>
                    ) : (
                      <ToggleGroup
                        type="single"
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex flex-wrap"
                      >
                        <div className="grid grid-cols-6 lg:grid-cols-8 gap-2">
                          {slots?.map((s) => (
                            <ToggleGroupItem
                              key={s.iso}
                              value={s.iso}
                              variant="outline"
                            >
                              {s.label}
                            </ToggleGroupItem>
                          ))}
                        </div>
                      </ToggleGroup>
                    )}
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </>
          )}
        </>
      )}

      {/* <Controller
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
          /> */}
    </>
  );
}
