import { makeLogging, makeDatabase } from "@/infra";

import { ListAppointmentsService, type IListAppointments } from ".";

export const makeListAppointmentsService = (): IListAppointments => {
  return new ListAppointmentsService(makeLogging(), makeDatabase());
};
