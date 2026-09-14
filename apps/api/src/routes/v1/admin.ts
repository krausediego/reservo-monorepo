import { Router } from "express";

import { makeAcceptInvitationController } from "@/modules/admin/accept-invitation";
import { makeListMyInvitationsController } from "@/modules/admin/list-my-invitations";
import { makeMeController } from "@/modules/admin/me";
import { makeRejectInvitationController } from "@/modules/admin/reject-invitation";
import { makeUpdateProfileController } from "@/modules/admin/update-profile";
import {
  acceptInvitationSchema,
  rejectInvitationSchema,
  updateProfileSchema,
} from "@reservo/schemas";

import { adaptRoute, upload } from "../handlers";
import { authAdmin, normalizeFiles, validateRequest } from "../middlewares";

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

  router.put(
    "/admin/update-profile",
    authAdmin,
    upload.single("image"),
    normalizeFiles(),
    validateRequest(updateProfileSchema),
    adaptRoute(makeUpdateProfileController()),
  );
};
