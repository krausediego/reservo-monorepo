import type { IController } from "@/modules/shared";

import { GetEstablishmentController, makeGetEstablishmentService } from ".";

export const makeGetEstablishmentController = (): IController => {
  return new GetEstablishmentController(makeGetEstablishmentService);
};
