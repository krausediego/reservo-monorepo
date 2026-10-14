import { makeLogging, makeDatabase } from "@/infra";

import { OverviewServiceService, type IOverviewService } from ".";

export const makeOverviewServiceService = (): IOverviewService => {
  return new OverviewServiceService(makeLogging(), makeDatabase());
};
