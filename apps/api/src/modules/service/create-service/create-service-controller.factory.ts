import type { IController } from "@/modules/shared";

import { CreateServiceController, makeCreateServiceService } from ".";

export const makeCreateServiceController = (): IController => {
  return new CreateServiceController(makeCreateServiceService);
};
