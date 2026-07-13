import { makeLogging, makeDatabase } from "@/infra";

import { DeleteProfessionalService, type IDeleteProfessional } from ".";

export const makeDeleteProfessionalService = (): IDeleteProfessional => {
  return new DeleteProfessionalService(makeLogging(), makeDatabase());
};
