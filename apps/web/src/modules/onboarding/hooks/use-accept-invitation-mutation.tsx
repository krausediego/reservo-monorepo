import { useMutation } from "@tanstack/react-query";
import { acceptInvitationApi } from "../api";
import { toast } from "sonner";
import { router } from "@/main";

export function useAcceptInvitationMutation() {
  return useMutation({
    mutationFn: acceptInvitationApi,
    onSuccess: async () => {
      toast.success("Convite aceito!");
      await router.navigate({ to: "/dashboard" });
    },
    onError: () => {
      toast.error("Ocorreu um problema ao aceitar o seu convite.");
    },
  });
}
