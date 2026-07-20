import { makeLogging, makeDatabase } from "@/infra";

import { CreateServiceService, type ICreateService } from ".";

export const makeCreateServiceService = (): ICreateService => {
  return new CreateServiceService(makeLogging(), makeDatabase());
};
