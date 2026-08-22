import type { IController } from "@/modules/shared";

import { SendInviteController, makeSendInviteService } from ".";

export const makeSendInviteController = (): IController => {
  return new SendInviteController(makeSendInviteService);
};
