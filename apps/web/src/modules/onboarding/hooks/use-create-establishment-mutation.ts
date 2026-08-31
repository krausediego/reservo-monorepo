import { useMutation } from "@tanstack/react-query";
import { createEstablishmentApi } from "../api";
import { toast } from "sonner";
import { router } from "@/main";

export function useCreateEstablishmentMutation() {
  return useMutation({
    mutationFn: createEstablishmentApi,
    onSuccess: () => {
      toast.success("Estabelecimento criado com sucesso!");

      router.navigate({
        to: "/dashboard",
      });
    },
    onError: () => {
      toast.error("Ocorreu um erro ao criar o estabelecimento");
    },
  });
}
