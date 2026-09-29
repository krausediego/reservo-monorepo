import { makeLogging, makeDatabase } from "@/infra";

import { ListCustomersService, type IListCustomers } from ".";

export const makeListCustomersService = (): IListCustomers => {
  return new ListCustomersService(makeLogging(), makeDatabase());
};
