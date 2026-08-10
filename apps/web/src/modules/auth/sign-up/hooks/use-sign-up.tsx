import { useMutation } from "@tanstack/react-query";
import { signUpApi } from "../api";
import { toast } from "@/components/ui/toast";
import { router } from "@/main";

export function useSignUp() {
  return useMutation({
    mutationFn: signUpApi,
    onSuccess: async () => {
      toast.add({
        type: "success",
        title: "Conta criada com sucesso!",
      });
      await router.navigate({ to: "/sign-in" });
    },
    onError: () => {
      toast.add({
        type: "error",
        title: "Ocorreu um erro ao criar sua conta.",
      });
    },
  });
}
