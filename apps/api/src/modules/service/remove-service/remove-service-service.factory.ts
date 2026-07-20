import { makeLogging, makeDatabase } from "@/infra";

import { RemoveServiceService, type IRemoveService } from ".";

export const makeRemoveServiceService = (): IRemoveService => {
  return new RemoveServiceService(makeLogging(), makeDatabase());
};
