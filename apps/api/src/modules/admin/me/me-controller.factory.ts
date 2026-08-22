import type { IController } from "@/modules/shared";

import { MeController, makeMeService } from ".";

export const makeMeController = (): IController => {
  return new MeController(makeMeService);
};
