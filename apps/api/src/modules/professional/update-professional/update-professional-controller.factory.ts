import type { IController } from "@/modules/shared";

import { UpdateProfessionalController, makeUpdateProfessionalService } from ".";

export const makeUpdateProfessionalController = (): IController => {
  return new UpdateProfessionalController(makeUpdateProfessionalService);
};
