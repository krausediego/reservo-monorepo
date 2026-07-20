import { makeLogging, makeDatabase } from "@/infra";

import { GetServiceService, type IGetService } from ".";

export const makeGetServiceService = (): IGetService => {
  return new GetServiceService(makeLogging(), makeDatabase());
};
