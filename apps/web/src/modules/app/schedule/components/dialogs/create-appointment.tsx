import {
  DialogCloseButton,
  DialogDescription,
  DialogFooter,
  DialogForm,
  DialogHeader,
  DialogSubmitButton,
} from "@/components/ui/dialog";

export function createAppointmentDialog() {
  return (
    <DialogForm>
      <DialogHeader></DialogHeader>
      <DialogDescription></DialogDescription>

      <DialogFooter>
        <DialogCloseButton>Cancelar</DialogCloseButton>
        <DialogSubmitButton>Criar serviço</DialogSubmitButton>
      </DialogFooter>
    </DialogForm>
  );
}
