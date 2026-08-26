import { useMutation } from "@tanstack/react-query";
import { createEstablishmentApi } from "../api";
import { toast } from "@/components/ui/toast";
import { router } from "@/main";

export function useCreateEstablishmentMutation() {
  return useMutation({
    mutationFn: createEstablishmentApi,
    onSuccess: () => {
      toast.add({
        type: "success",
        title: "Estabelecimento criado com sucesso!",
      });

      router.navigate({
        to: "/dashboard",
      });
    },
    onError: () => {
      toast.add({
        type: "error",
        title: "Ocorreu um erro ao criar o estabelecimento",
      });
    },
  });
}
