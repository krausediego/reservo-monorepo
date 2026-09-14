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

export function CreateServiceDialog() {
  const form = useForm<ICreateServiceSchema.GetParams>({
    resolver: zodResolver(createServiceSchema.shape.body),
    defaultValues: {
      name: "",
      description: "",
      durationInMinutes: 10,
      priceCents: 0,
    },
  });

  const { mutateAsync: createServiceMutationFn } = useCreateServiceMutation();

  return (
    <DialogForm form={form} onSubmit={createServiceMutationFn}>
      <DialogHeader>
        <DialogTitle>Criar um novo serviço</DialogTitle>
        <DialogDescription>
          Crie um novo serviço e atribua-o a um profissional
        </DialogDescription>
      </DialogHeader>

      <FormProvider {...form}>
        <CreateServiceForm />
      </FormProvider>

      <DialogFooter>
        <DialogCloseButton>Cancelar</DialogCloseButton>
        <DialogSubmitButton>Criar serviço</DialogSubmitButton>
      </DialogFooter>
    </DialogForm>
  );
}
