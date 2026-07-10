import { makeLogging, makeDatabase, makeStorage } from "@/infra";

import { GetProfessionalService, type IGetProfessional } from ".";

export const makeGetProfessionalService = (): IGetProfessional => {
  return new GetProfessionalService(
    makeLogging(),
    makeDatabase(),
    makeStorage(),
  );
};
