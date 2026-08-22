import { useMutation } from "@tanstack/react-query";
import { signInApi } from "../api";
import { toast } from "@/components/ui/toast";
import { router } from "@/main";

export function useSignInMutation() {
  return useMutation({
    mutationFn: signInApi,
    onSuccess: () => {
      toast.add({
        type: "success",
        title: "Login realizado com sucesso!",
      });

      router.navigate({
        to: "/dashboard",
      });
    },
    onError: () => {
      toast.add({
        type: "error",
        title: "Ocorreu um erro ao realizar o login, tente novamente.",
      });
    },
  });
}
