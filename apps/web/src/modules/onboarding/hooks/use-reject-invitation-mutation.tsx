import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectInvitationApi } from "../api";
import { toast } from "@/components/ui/toast";
import { onboardingInvitationsKeys } from "../onboarding-invitations.keys";
import type { IListMyInvitationsSchema } from "@reservo/types";

export function useRejectInvitationMutation() {
  const queryClient = useQueryClient();
  const key = onboardingInvitationsKeys.invitations();

  return useMutation({
    mutationFn: rejectInvitationApi,
    onSuccess: (_, { id }) => {
      toast.add({
        type: "success",
        title: "Convite rejeitado!",
      });

      queryClient.setQueryData(
        key,
        (old: IListMyInvitationsSchema.GetResponse) =>
          old?.filter((i) => i.id !== id),
      );
    },
    onError: () => {
      toast.add({
        type: "error",
        title: "Ocorreu um erro ao rejeitar o convite",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: key,
      });
    },
  });
}
