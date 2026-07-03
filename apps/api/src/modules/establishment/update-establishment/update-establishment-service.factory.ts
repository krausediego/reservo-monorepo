import { makeLogging, makeStorage } from "@/infra";

import { UpdateEstablishmentService, type IUpdateEstablishment } from ".";

export const makeUpdateEstablishmentService = (): IUpdateEstablishment => {
  return new UpdateEstablishmentService(makeLogging(), makeStorage());
};
