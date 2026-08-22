import type { IController } from "@/modules/shared";

import { RejectInvitationController, makeRejectInvitationService } from ".";

export const makeRejectInvitationController = (): IController => {
  return new RejectInvitationController(makeRejectInvitationService);
};
