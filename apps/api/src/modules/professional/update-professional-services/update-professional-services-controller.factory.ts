import type { IController } from "@/modules/shared";

import {
  UpdateProfessionalServicesController,
  makeUpdateProfessionalServicesService,
} from ".";

export const makeUpdateProfessionalServicesController = (): IController => {
  return new UpdateProfessionalServicesController(
    makeUpdateProfessionalServicesService,
  );
};
