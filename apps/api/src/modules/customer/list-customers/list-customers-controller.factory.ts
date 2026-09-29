import type { IController } from "@/modules/shared";

import { ListCustomersController, makeListCustomersService } from ".";

export const makeListCustomersController = (): IController => {
  return new ListCustomersController(makeListCustomersService);
};
