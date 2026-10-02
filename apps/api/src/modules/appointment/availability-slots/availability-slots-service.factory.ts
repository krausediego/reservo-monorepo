import { makeLogging, makeDatabase } from "@/infra";

import { AvailabilitySlotsService, type IAvailabilitySlots } from ".";

export const makeAvailabilitySlotsService = (): IAvailabilitySlots => {
  return new AvailabilitySlotsService(makeLogging(), makeDatabase());
};
