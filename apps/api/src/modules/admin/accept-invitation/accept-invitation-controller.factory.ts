import type { IController } from "@/modules/shared";

import { AcceptInvitationController, makeAcceptInvitationService } from ".";

export const makeAcceptInvitationController = (): IController => {
  return new AcceptInvitationController(makeAcceptInvitationService);
};
