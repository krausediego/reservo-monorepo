import type {
  IAcceptInvitationSchema,
  IRejectInvitationSchema,
} from "@reservo/types";
import { useAcceptInvitationMutation } from "./use-accept-invitation-mutation";
import { useRejectInvitationMutation } from "./use-reject-invitation-mutation";

export function useInvites() {
  const {
    mutateAsync: acceptInvitationFn,
    isPending: isAcceptInvitationPending,
  } = useAcceptInvitationMutation();

  const {
    mutateAsync: rejectInvitationFn,
    isPending: isRejectInvitationPending,
  } = useRejectInvitationMutation();

  const handleAcceptInvitation = async (
    params: IAcceptInvitationSchema.GetParams,
  ) => {
    await acceptInvitationFn(params);
  };

  const handleRejectInvitation = async (
    params: IRejectInvitationSchema.GetParams,
  ) => {
    await rejectInvitationFn(params);
  };

  return {
    isAcceptInvitationPending,
    isRejectInvitationPending,
    handleAcceptInvitation,
    handleRejectInvitation,
  };
}
