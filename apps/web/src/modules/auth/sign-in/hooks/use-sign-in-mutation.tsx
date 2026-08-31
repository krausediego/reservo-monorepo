import { useMutation } from "@tanstack/react-query";
import { signInApi } from "../api";
import { toast } from "sonner";
import { router } from "@/main";

export function useSignInMutation() {
  return useMutation({
    mutationFn: signInApi,
    onSuccess: () => {
      toast.success("Login realizado com sucesso!");

      router.navigate({
        to: "/dashboard",
      });
    },
    onError: () => {
      toast.error("Ocorreu um erro ao realizar o login, tente novamente.");
    },
  });
}
