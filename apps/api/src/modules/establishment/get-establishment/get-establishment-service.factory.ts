import { makeLogging, makeStorage } from "@/infra";

import { GetEstablishmentService, type IGetEstablishment } from ".";

export const makeGetEstablishmentService = (): IGetEstablishment => {
  return new GetEstablishmentService(makeLogging(), makeStorage());
};
