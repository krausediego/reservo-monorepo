import { useMutation } from "@tanstack/react-query";
import { signUpApi } from "../api";
import { toast } from "sonner";
import { router } from "@/main";

export function useSignUpMutation() {
  return useMutation({
    mutationFn: signUpApi,
    onSuccess: async () => {
      toast.success("Conta criada com sucesso!");
      await router.navigate({ to: "/sign-in" });
    },
    onError: () => {
      toast.error("Ocorreu um erro ao criar sua conta.");
    },
  });
}
