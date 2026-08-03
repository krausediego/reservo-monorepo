import { Router } from "express";

import { makeListMembersController } from "@/modules/member/list-members";
import { listMembersSchema } from "@reservo/schemas";

import { adaptRoute } from "../handlers";
import { authAdmin, enforceAccess, validateRequest } from "../middlewares";

export default (router: Router) => {
  router.get(
    "/members",
    authAdmin,
    enforceAccess("READ"),
    validateRequest(listMembersSchema),
    adaptRoute(makeListMembersController()),
  );
};
