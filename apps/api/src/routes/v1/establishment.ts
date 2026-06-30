import { Router } from "express";

import { makeCreateEstablishmentController } from "@/modules/establishment/create-establishment";
import { createEstablishmentSchema } from "@reservo/schemas";

import { adaptRoute } from "../handlers";
import { authAdmin, validateRequest } from "../middlewares";

export default (router: Router): void => {
  router.post(
    "/establishment",
    authAdmin,
    validateRequest(createEstablishmentSchema),
    adaptRoute(makeCreateEstablishmentController()),
  );
};
