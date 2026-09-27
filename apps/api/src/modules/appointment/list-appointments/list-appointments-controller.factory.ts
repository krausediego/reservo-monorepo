import type { IController } from "@/modules/shared";

import { ListAppointmentsController, makeListAppointmentsService } from ".";

export const makeListAppointmentsController = (): IController => {
  return new ListAppointmentsController(makeListAppointmentsService);
};
