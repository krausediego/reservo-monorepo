import type { IController } from "@/modules/shared";

import { RevokeMemberController, makeRevokeMemberService } from ".";

export const makeRevokeMemberController = (): IController => {
  return new RevokeMemberController(makeRevokeMemberService);
};
