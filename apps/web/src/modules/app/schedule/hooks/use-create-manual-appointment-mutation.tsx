import { useMutation } from "@tanstack/react-query";
import { createManualAppointmentApi } from "../api";
import { toast } from "sonner";

export function useCreateManualAppointmentMutation() {
  return useMutation({
    mutationFn: createManualAppointmentApi,
    onSuccess: () => {
      toast.success("Agendamento criado com sucesso.");
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });
}
