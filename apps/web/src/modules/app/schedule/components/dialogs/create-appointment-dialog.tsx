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
import { FormProvider, useForm } from "react-hook-form";
import { useCreateManualAppointmentMutation } from "../../hooks";
import { NewAppointmentForm } from "../new-appointment-form";

export type Customer = IListCustomersSchema.GetResponse["data"][number];

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
        <DialogTitle>Novo agendamento</DialogTitle>
        <DialogDescription>
          Preencha os dados e escolha um horário livre
        </DialogDescription>
      </DialogHeader>

      <FormProvider {...form}>
        <NewAppointmentForm />
      </FormProvider>

      <DialogFooter>
        <DialogCloseButton>Cancelar</DialogCloseButton>
        <DialogSubmitButton>Criar agendamento</DialogSubmitButton>
      </DialogFooter>
    </DialogForm>
  );
}
