import { makeLogging, makeDatabase, makeStorage } from "@/infra";

import { CreateProfessionalService, type ICreateProfessional } from ".";

export const makeCreateProfessionalService = (): ICreateProfessional => {
  return new CreateProfessionalService(
    makeLogging(),
    makeDatabase(),
    makeStorage(),
  );
};
