import { makeLogging } from "@/infra";

import { UpdateEstablishmentService, type IUpdateEstablishment } from ".";

export const makeUpdateEstablishmentService = (): IUpdateEstablishment => {
  return new UpdateEstablishmentService(makeLogging());
};
