import { useSuspenseQuery } from "@tanstack/react-query";
import { listMyInvitationsApi } from "../api";
import { onboardingInvitationsKeys } from "../onboarding-invitations.keys";

export function useListMyInvitationsQuery() {
  return useSuspenseQuery({
    queryFn: listMyInvitationsApi,
    queryKey: onboardingInvitationsKeys.invitations(),
  });
}
