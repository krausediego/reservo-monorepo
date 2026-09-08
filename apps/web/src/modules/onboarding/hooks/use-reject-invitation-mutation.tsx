import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectInvitationApi } from "../api";
import { toast } from "sonner";
import { onboardingInvitationsKeys } from "../onboarding-invitations.keys";
import type { IListMyInvitationsSchema } from "@reservo/types";

export function useRejectInvitationMutation() {
  const queryClient = useQueryClient();
  const key = onboardingInvitationsKeys.invitations();

  return useMutation({
    mutationFn: rejectInvitationApi,
    onSuccess: (_, { id }) => {
      toast.success("Convite rejeitado!");

      queryClient.setQueryData(
        key,
        (old: IListMyInvitationsSchema.GetResponse) =>
          old?.filter((i) => i.id !== id),
      );
    },
    onError: ({ message }) => {
      toast.error(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: key,
      });
    },
  });
}
