import type { IController } from "@/modules/shared";

import { UpdateProfileController, makeUpdateProfileService } from ".";

export const makeUpdateProfileController = (): IController => {
  return new UpdateProfileController(makeUpdateProfileService);
};
