import type { IController } from "@/modules/shared";

import { ListMembersController, makeListMembersService } from ".";

export const makeListMembersController = (): IController => {
  return new ListMembersController(makeListMembersService);
};
