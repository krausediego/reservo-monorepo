import { Router } from "express";

import { makeAcceptInvitationController } from "@/modules/admin/accept-invitation";
import { makeListMyInvitationsController } from "@/modules/admin/list-my-invitations";
import { makeMeController } from "@/modules/admin/me";
import { makeRejectInvitationController } from "@/modules/admin/reject-invitation";
import {
  acceptInvitationSchema,
  rejectInvitationSchema,
} from "@reservo/schemas";

import { adaptRoute } from "../handlers";
import { authAdmin, validateRequest } from "../middlewares";

export default (router: Router): void => {
  router.get("/admin/me", authAdmin, adaptRoute(makeMeController()));

  router.get(
    "/admin/list-my-invitations",
    authAdmin,
    adaptRoute(makeListMyInvitationsController()),
  );

  router.post(
    "/admin/accept-invitation/:id",
    authAdmin,
    validateRequest(acceptInvitationSchema),
    adaptRoute(makeAcceptInvitationController()),
  );

  router.post(
    "/admin/reject-invitation/:id",
    authAdmin,
    validateRequest(rejectInvitationSchema),
    adaptRoute(makeRejectInvitationController()),
  );
};
