import { makeLogging, makeDatabase } from "@/infra";

import { AcceptInvitationService, type IAcceptInvitation } from ".";

export const makeAcceptInvitationService = (): IAcceptInvitation => {
  return new AcceptInvitationService(makeLogging(), makeDatabase());
};
