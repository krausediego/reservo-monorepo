import type { IController } from "@/modules/shared";

import { CreateProfessionalController, makeCreateProfessionalService } from ".";

export const makeCreateProfessionalController = (): IController => {
  return new CreateProfessionalController(makeCreateProfessionalService);
};
