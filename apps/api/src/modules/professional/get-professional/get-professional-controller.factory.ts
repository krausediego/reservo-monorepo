import type { IController } from "@/modules/shared";

import { GetProfessionalController, makeGetProfessionalService } from ".";

export const makeGetProfessionalController = (): IController => {
  return new GetProfessionalController(makeGetProfessionalService);
};
