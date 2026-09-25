import type { IController } from "@/modules/shared";

import {
  CreateManualAppointmentController,
  makeCreateManualAppointmentService,
} from ".";

export const makeCreateManualAppointmentController = (): IController => {
  return new CreateManualAppointmentController(
    makeCreateManualAppointmentService,
  );
};
