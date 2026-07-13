import { Router } from "express";

import { makeCreateProfessionalController } from "@/modules/professional/create-professional";
import { makeDeleteProfessionalController } from "@/modules/professional/delete-professional";
import { makeGetProfessionalController } from "@/modules/professional/get-professional";
import { makeListProfessionalsController } from "@/modules/professional/list-professionals";
import { makeUpdateProfessionalController } from "@/modules/professional/update-professional";
import { adaptRoute, upload } from "@/routes/handlers";
import {
  authAdmin,
  enforceAccess,
  enforceLimit,
  validateRequest,
  validateRole,
} from "@/routes/middlewares";
import {
  createProfessionalSchema,
  deleteProfessionalSchema,
  getProfessionalSchema,
  listProfessionalsSchema,
  updateProfessionalSchema,
} from "@reservo/schemas";

export default (router: Router) => {
  router.post(
    "/professional",
    authAdmin,
    validateRole("MANAGER"),
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

  router.put(
    "/professional/:id",
    authAdmin,
    validateRole("MANAGER"),
    upload.single("avatar"),
    enforceAccess("WRITE"),
    validateRequest(updateProfessionalSchema),
    adaptRoute(makeUpdateProfessionalController()),
  );

  router.delete(
    "/professional/:id",
    authAdmin,
    validateRole("MANAGER"),
    enforceAccess("WRITE"),
    validateRequest(deleteProfessionalSchema),
    adaptRoute(makeDeleteProfessionalController()),
  );
};
