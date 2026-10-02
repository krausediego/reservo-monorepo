import type { IController } from "@/modules/shared";

import { AvailabilitySlotsController, makeAvailabilitySlotsService } from ".";

export const makeAvailabilitySlotsController = (): IController => {
  return new AvailabilitySlotsController(makeAvailabilitySlotsService);
};
