import { makeLogging, makeDatabase } from "@/infra";

import {
  CreateManualAppointmentService,
  type ICreateManualAppointment,
} from ".";

export const makeCreateManualAppointmentService =
  (): ICreateManualAppointment => {
    return new CreateManualAppointmentService(makeLogging(), makeDatabase());
  };
