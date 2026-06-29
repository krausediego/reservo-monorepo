import type { IController } from "@/modules/shared";

import { CreateEstablishmentController, makeCreateEstablishmentService } from ".";

export const makeCreateEstablishmentController = (): IController => {
  return new CreateEstablishmentController(makeCreateEstablishmentService);
};
