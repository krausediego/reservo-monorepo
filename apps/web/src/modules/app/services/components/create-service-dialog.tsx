import { zodResolver } from "@hookform/resolvers/zod";
import { createServiceSchema } from "@reservo/schemas";
import type { ICreateServiceSchema } from "@reservo/types";
import { FormProvider, useForm } from "react-hook-form";
import { useCreateServiceMutation } from "../hooks";
import {
  DialogCloseButton,
  DialogDescription,
  DialogFooter,
  DialogForm,
  DialogHeader,
  DialogSubmitButton,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateServiceForm } from "./create-service-form";
import { CheckCircle2 } from "lucide-react";

export function CreateServiceDialog() {
  const form = useForm<ICreateServiceSchema.GetParams>({
    resolver: zodResolver(createServiceSchema.shape.body),
    defaultValues: {
      name: "",
      categoryId: "",
      description: "",
      professionals: [],
      durationMinutes: 0,
      priceCents: 0,
      isActive: true,
    },
  });

  const { mutateAsync: createServiceMutationFn } = useCreateServiceMutation();

  return (
    <DialogForm form={form} onSubmit={createServiceMutationFn}>
      <DialogHeader>
        <DialogTitle>Cadastrar novo serviço</DialogTitle>
        <DialogDescription>
          Preencha as informações do procedimento para disponibilizar no
          catálogo interno e agendamento online dos clientes
        </DialogDescription>
      </DialogHeader>

      <FormProvider {...form}>
        <CreateServiceForm />
      </FormProvider>

      <DialogFooter>
        <DialogCloseButton>Cancelar</DialogCloseButton>
        <DialogSubmitButton>
          <CheckCircle2 />
          Salvar e ativar serviço
        </DialogSubmitButton>
      </DialogFooter>
    </DialogForm>
  );
}
