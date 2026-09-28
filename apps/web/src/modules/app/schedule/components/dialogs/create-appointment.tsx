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
import type { ICreateManualAppointmentSchema } from "@reservo/types";
import { Controller, useForm } from "react-hook-form";
import { useCreateManualAppointmentMutation } from "../../hooks";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

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

  const { mutateAsync: createManualAppointmentFn } =
    useCreateManualAppointmentMutation();

  return (
    <DialogForm form={form} onSubmit={createManualAppointmentFn}>
      <DialogHeader>
        <DialogTitle>Criar agendamento</DialogTitle>
        <DialogDescription>Crie um agendamento manual</DialogDescription>
      </DialogHeader>

      <FieldGroup>
        <Controller
          name="customer.name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="customer">Cliente</FieldLabel>
              <Input
                {...field}
                id="customer"
                aria-invalid={fieldState.invalid}
                placeholder=""
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <DialogFooter>
        <DialogCloseButton>Cancelar</DialogCloseButton>
        <DialogSubmitButton>Criar serviço</DialogSubmitButton>
      </DialogFooter>
    </DialogForm>
  );
}
