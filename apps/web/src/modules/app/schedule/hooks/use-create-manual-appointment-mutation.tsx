import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createManualAppointmentApi } from "../api";
import { toast } from "sonner";

export function useCreateManualAppointmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createManualAppointmentApi,
    onSuccess: () => {
      toast.success("Agendamento criado com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });
}
