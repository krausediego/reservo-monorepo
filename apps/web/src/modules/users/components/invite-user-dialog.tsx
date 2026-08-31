import {
  DialogCloseButton,
  DialogDescription,
  DialogFooter,
  DialogForm,
  DialogHeader,
  DialogSubmitButton,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormProvider, useForm } from "react-hook-form";
import { InviteUserForm } from "./invite-user-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendInviteSchema } from "@reservo/schemas";
import type { ISendInviteSchema } from "@reservo/types";
import { useInviteUserMutation } from "../hooks";

export function InviteUserDialog() {
  const form = useForm<ISendInviteSchema.GetParams>({
    resolver: zodResolver(sendInviteSchema.shape.body),
    defaultValues: {
      email: "",
      role: "PROFESSIONAL",
    },
  });

  const { mutateAsync: inviteUserFn } = useInviteUserMutation();

  return (
    <DialogForm form={form} onSubmit={inviteUserFn}>
      <DialogHeader>
        <DialogTitle>Convidar um novo usuário</DialogTitle>
        <DialogDescription>
          Convide um usuário para ter acesso ao sistema
        </DialogDescription>
      </DialogHeader>

      <FormProvider {...form}>
        <InviteUserForm />
      </FormProvider>

      <DialogFooter>
        <DialogCloseButton>Cancelar</DialogCloseButton>
        <DialogSubmitButton>Enviar convite</DialogSubmitButton>
      </DialogFooter>
    </DialogForm>
  );
}
