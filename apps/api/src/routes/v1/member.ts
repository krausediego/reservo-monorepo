import { Router } from "express";

import { makeListMembersController } from "@/modules/member/list-members";
import { makeRevokeMemberController } from "@/modules/member/revoke-member";
import { listMembersSchema, revokeMemberSchema } from "@reservo/schemas";

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

  router.delete(
    "/member/:id",
    authAdmin,
    enforceAccess("WRITE"),
    validateRequest(revokeMemberSchema),
    adaptRoute(makeRevokeMemberController()),
  );
};
