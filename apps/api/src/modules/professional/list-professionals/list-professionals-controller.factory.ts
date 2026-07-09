import type { IController } from "@/modules/shared";

import { ListProfessionalsController, makeListProfessionalsService } from ".";

export const makeListProfessionalsController = (): IController => {
  return new ListProfessionalsController(makeListProfessionalsService);
};
