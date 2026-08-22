import { useMutation } from "@tanstack/react-query";
import { acceptInvitationApi } from "../api";
import { toast } from "@/components/ui/toast";
import { router } from "@/main";

export function useAcceptInvitationMutation() {
  return useMutation({
    mutationFn: acceptInvitationApi,
    onSuccess: async () => {
      toast.add({
        type: "success",
        title: "Convite aceito!",
      });
      await router.navigate({ to: "/dashboard" });
    },
    onError: () => {
      toast.add({
        type: "error",
        title: "Ocorreu um problema ao aceitar o seu convite.",
      });
    },
  });
}
