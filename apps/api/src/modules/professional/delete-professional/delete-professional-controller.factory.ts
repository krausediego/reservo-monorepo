import type { IController } from "@/modules/shared";

import { DeleteProfessionalController, makeDeleteProfessionalService } from ".";

export const makeDeleteProfessionalController = (): IController => {
  return new DeleteProfessionalController(makeDeleteProfessionalService);
};
