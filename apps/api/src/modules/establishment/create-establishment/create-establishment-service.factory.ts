import { makeLogging } from "@/infra";

import { CreateEstablishmentService, type ICreateEstablishment } from ".";

export const makeCreateEstablishmentService = (): ICreateEstablishment => {
  return new CreateEstablishmentService(makeLogging());
};
