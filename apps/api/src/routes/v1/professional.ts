import { Router } from "express";

import { makeCreateProfessionalController } from "@/modules/professional/create-professional";
import { makeGetProfessionalController } from "@/modules/professional/get-professional";
import { makeListProfessionalsController } from "@/modules/professional/list-professionals";
import { adaptRoute, upload } from "@/routes/handlers";
import {
  authAdmin,
  enforceAccess,
  enforceLimit,
  validateRequest,
} from "@/routes/middlewares";
import {
  createProfessionalSchema,
  getProfessionalSchema,
  listProfessionalsSchema,
} from "@reservo/schemas";

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

  router.get(
    "/professionals",
    authAdmin,
    enforceAccess("READ"),
    validateRequest(listProfessionalsSchema),
    adaptRoute(makeListProfessionalsController()),
  );

  router.get(
    "/professional/:id",
    authAdmin,
    enforceAccess("READ"),
    validateRequest(getProfessionalSchema),
    adaptRoute(makeGetProfessionalController()),
  );
};
