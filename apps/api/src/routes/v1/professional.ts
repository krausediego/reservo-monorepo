import { Router } from "express";

import { makeCreateProfessionalController } from "@/modules/professional/create-professional";
import { makeDeleteProfessionalController } from "@/modules/professional/delete-professional";
import { makeGetProfessionalController } from "@/modules/professional/get-professional";
import { makeListProfessionalServicesController } from "@/modules/professional/list-professional-services";
import { makeListProfessionalsController } from "@/modules/professional/list-professionals";
import { makeUpdateProfessionalController } from "@/modules/professional/update-professional";
import { makeUpdateProfessionalServicesController } from "@/modules/professional/update-professional-services";
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
  listProfessionalServicesSchema,
  listProfessionalsSchema,
  updateProfessionalSchema,
  updateProfessionalServicesSchema,
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

  router.get(
    "/professional/:id/services",
    authAdmin,
    enforceAccess("READ"),
    validateRequest(listProfessionalServicesSchema),
    adaptRoute(makeListProfessionalServicesController()),
  );

  router.put(
    "/professional/:id/services",
    authAdmin,
    validateRole("MANAGER"),
    enforceAccess("WRITE"),
    validateRequest(updateProfessionalServicesSchema),
    adaptRoute(makeUpdateProfessionalServicesController()),
  );
};
