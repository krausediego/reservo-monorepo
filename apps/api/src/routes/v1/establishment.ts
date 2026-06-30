import { Router } from "express";

import { makeCreateEstablishmentController } from "@/modules/establishment/create-establishment";
import { makeGetEstablishmentController } from "@/modules/establishment/get-establishment";
import { createEstablishmentSchema } from "@reservo/schemas";

import { adaptRoute, upload } from "../handlers";
import { authAdmin, validateRequest } from "../middlewares";

export default (router: Router): void => {
  router.post(
    "/establishment",
    authAdmin,
    upload.fields([
      { name: "logo", maxCount: 1 },
      { name: "cover", maxCount: 1 },
    ]),
    validateRequest(createEstablishmentSchema),
    adaptRoute(makeCreateEstablishmentController()),
  );

  router.get(
    "/establishment",
    authAdmin,
    adaptRoute(makeGetEstablishmentController()),
  );
};
