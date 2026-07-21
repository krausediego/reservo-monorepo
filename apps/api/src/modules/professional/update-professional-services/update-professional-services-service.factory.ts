import { makeLogging, makeDatabase, makeStorage } from "@/infra";

import {
  UpdateProfessionalServicesService,
  type IUpdateProfessionalServices,
} from ".";

export const makeUpdateProfessionalServicesService =
  (): IUpdateProfessionalServices => {
    return new UpdateProfessionalServicesService(
      makeLogging(),
      makeDatabase(),
      makeStorage(),
    );
  };
