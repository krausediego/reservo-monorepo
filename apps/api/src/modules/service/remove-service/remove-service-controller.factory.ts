import type { IController } from "@/modules/shared";

import { RemoveServiceController, makeRemoveServiceService } from ".";

export const makeRemoveServiceController = (): IController => {
  return new RemoveServiceController(makeRemoveServiceService);
};
