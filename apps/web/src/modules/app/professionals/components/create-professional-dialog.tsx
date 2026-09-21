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
import { createProfessionalSchema } from "@reservo/schemas";
import type { ICreateProfessionalSchema } from "@reservo/types";
import { FormProvider, useForm } from "react-hook-form";
import { useCreateProfessionalMutation } from "../hooks";
import { CreateProfessionalForm } from "./create-professional-form";

export function CreateProfessionalDialog() {
  const form = useForm<ICreateProfessionalSchema.GetParams>({
    resolver: zodResolver(createProfessionalSchema.shape.body),
    defaultValues: {
      name: "",
      bio: "",
      memberId: "",
      servicesIds: [],
      avatar: undefined,
    },
  });

  const { mutateAsync: createProfessionalMutationFn } =
    useCreateProfessionalMutation();

  return (
    <DialogForm form={form} onSubmit={createProfessionalMutationFn}>
      <DialogHeader>
        <DialogTitle>Criar um novo profissional</DialogTitle>
        <DialogDescription>
          Crie seus profissionais, atribuindo-os a serviços e usuários e comece
          a disponibilizar horários de agendamento
        </DialogDescription>
      </DialogHeader>

      <FormProvider {...form}>
        <CreateProfessionalForm />
      </FormProvider>

      <DialogFooter>
        <DialogCloseButton>Cancelar</DialogCloseButton>
        <DialogSubmitButton>Criar profissional</DialogSubmitButton>
      </DialogFooter>
    </DialogForm>
  );
}
