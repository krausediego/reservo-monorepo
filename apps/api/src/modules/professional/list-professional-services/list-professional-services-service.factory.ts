import { makeLogging, makeDatabase } from "@/infra";

import {
  ListProfessionalServicesService,
  type IListProfessionalServices,
} from ".";

export const makeListProfessionalServicesService =
  (): IListProfessionalServices => {
    return new ListProfessionalServicesService(makeLogging(), makeDatabase());
  };
