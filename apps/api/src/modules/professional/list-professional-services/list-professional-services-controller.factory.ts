import type { IController } from "@/modules/shared";

import {
  ListProfessionalServicesController,
  makeListProfessionalServicesService,
} from ".";

export const makeListProfessionalServicesController = (): IController => {
  return new ListProfessionalServicesController(
    makeListProfessionalServicesService,
  );
};
