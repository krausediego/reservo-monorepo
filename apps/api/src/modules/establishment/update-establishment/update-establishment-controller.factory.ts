import type { IController } from "@/modules/shared";

import {
  UpdateEstablishmentController,
  makeUpdateEstablishmentService,
} from ".";

export const makeUpdateEstablishmentController = (): IController => {
  return new UpdateEstablishmentController(makeUpdateEstablishmentService);
};
