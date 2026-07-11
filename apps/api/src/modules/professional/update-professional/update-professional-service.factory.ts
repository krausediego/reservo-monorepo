import { makeLogging, makeDatabase, makeStorage } from "@/infra";

import { UpdateProfessionalService, type IUpdateProfessional } from ".";

export const makeUpdateProfessionalService = (): IUpdateProfessional => {
  return new UpdateProfessionalService(
    makeLogging(),
    makeDatabase(),
    makeStorage(),
  );
};
