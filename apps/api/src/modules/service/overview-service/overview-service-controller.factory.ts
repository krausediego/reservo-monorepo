import type { IController } from "@/modules/shared";

import { OverviewServiceController, makeOverviewServiceService } from ".";

export const makeOverviewServiceController = (): IController => {
  return new OverviewServiceController(makeOverviewServiceService);
};
