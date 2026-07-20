import { makeLogging, makeDatabase } from "@/infra";

import { ListServicesService, type IListServices } from ".";

export const makeListServicesService = (): IListServices => {
  return new ListServicesService(makeLogging(), makeDatabase());
};
