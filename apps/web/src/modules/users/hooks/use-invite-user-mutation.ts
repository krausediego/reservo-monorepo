import { useMutation } from "@tanstack/react-query";
import { inviteUserApi } from "../api";
import { toast } from "sonner";

export function useInviteUserMutation() {
  return useMutation({
    mutationFn: inviteUserApi,
    onSuccess: () => {
      toast.success("Convite enviado com sucesso!");
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });
}
