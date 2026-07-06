import { Router } from "express";

import { makeCreateProfessionalController } from "@/modules/professional/create-professional";
import { adaptRoute, upload } from "@/routes/handlers";
import {
  authAdmin,
  enforceAccess,
  enforceLimit,
  validateRequest,
} from "@/routes/middlewares";
import { createProfessionalSchema } from "@reservo/schemas";

export default (router: Router) => {
  router.post(
    "/professional",
    authAdmin,
    upload.single("avatar"),
    enforceAccess("WRITE"),
    enforceLimit("professionals"),
    validateRequest(createProfessionalSchema),
    adaptRoute(makeCreateProfessionalController()),
  );
};
