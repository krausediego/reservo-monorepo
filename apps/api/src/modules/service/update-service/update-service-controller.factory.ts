import type { IController } from "@/modules/shared";

import { UpdateServiceController, makeUpdateServiceService } from ".";

export const makeUpdateServiceController = (): IController => {
  return new UpdateServiceController(makeUpdateServiceService);
};
