import type { IController } from "@/modules/shared";

import { ListServicesController, makeListServicesService } from ".";

export const makeListServicesController = (): IController => {
  return new ListServicesController(makeListServicesService);
};
