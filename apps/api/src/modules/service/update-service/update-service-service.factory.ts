import { makeLogging, makeDatabase } from "@/infra";

import { UpdateServiceService, type IUpdateService } from ".";

export const makeUpdateServiceService = (): IUpdateService => {
  return new UpdateServiceService(makeLogging(), makeDatabase());
};
