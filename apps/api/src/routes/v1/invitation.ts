import { Router } from "express";

import { makeSendInviteController } from "@/modules/invitation/send-invite";
import { sendInviteSchema } from "@reservo/schemas";

import { adaptRoute } from "../handlers";
import {
  authAdmin,
  enforceAccess,
  enforceLimit,
  validateRequest,
  validateRole,
} from "../middlewares";

export default (router: Router): void => {
  router.post(
    "/invitation",
    authAdmin,
    validateRole("MANAGER"),
    enforceAccess("WRITE"),
    enforceLimit("members"),
    validateRequest(sendInviteSchema),
    adaptRoute(makeSendInviteController()),
  );
};
