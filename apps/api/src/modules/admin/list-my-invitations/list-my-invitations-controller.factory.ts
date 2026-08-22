import type { IController } from "@/modules/shared";

import { ListMyInvitationsController, makeListMyInvitationsService } from ".";

export const makeListMyInvitationsController = (): IController => {
  return new ListMyInvitationsController(makeListMyInvitationsService);
};
