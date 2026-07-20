import type { IController } from "@/modules/shared";

import { GetServiceController, makeGetServiceService } from ".";

export const makeGetServiceController = (): IController => {
  return new GetServiceController(makeGetServiceService);
};
