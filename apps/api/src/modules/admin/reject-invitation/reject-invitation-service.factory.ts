import { makeLogging, makeDatabase } from "@/infra";

import { RejectInvitationService, type IRejectInvitation } from ".";

export const makeRejectInvitationService = (): IRejectInvitation => {
  return new RejectInvitationService(makeLogging(), makeDatabase());
};
