import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServiceApi } from "../api";
import { toast } from "sonner";
import { servicesKeys } from "../services.keys";

export function useCreateServiceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createServiceApi,
    onSuccess: () => {
      toast.success("Serviço criado com sucesso");

      queryClient.resetQueries({ queryKey: servicesKeys.all() });
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });
}
