import { Router } from "express";

import { makeCreateEstablishmentController } from "@/modules/establishment/create-establishment";
import { makeGetEstablishmentController } from "@/modules/establishment/get-establishment";
import { makeUpdateEstablishmentController } from "@/modules/establishment/update-establishment";
import {
  createEstablishmentSchema,
  updateEstablishmentSchema,
} from "@reservo/schemas";

import { adaptRoute, upload } from "../handlers";
import { authAdmin, validateRequest, validateRole } from "../middlewares";

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

  router.put(
    "/establishment/:id",
    authAdmin,
    validateRole("OWNER"),
    upload.fields([
      { name: "logo", maxCount: 1 },
      { name: "cover", maxCount: 1 },
    ]),
    validateRequest(updateEstablishmentSchema),
    adaptRoute(makeUpdateEstablishmentController()),
  );
};
