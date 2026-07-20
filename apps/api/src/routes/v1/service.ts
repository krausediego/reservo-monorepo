import { Router } from "express";

import { makeCreateServiceController } from "@/modules/service/create-service";
import { makeGetServiceController } from "@/modules/service/get-service";
import { makeListServicesController } from "@/modules/service/list-services";
import { makeRemoveServiceController } from "@/modules/service/remove-service";
import { makeUpdateServiceController } from "@/modules/service/update-service";
import {
  createServiceSchema,
  getServiceSchema,
  listServicesSchema,
  removeServiceSchema,
  updateServiceSchema,
} from "@reservo/schemas";

import { adaptRoute } from "../handlers";
import {
  authAdmin,
  enforceAccess,
  enforceLimit,
  validateRequest,
  validateRole,
} from "../middlewares";

export default (router: Router) => {
  router.post(
    "/service",
    authAdmin,
    validateRole("MANAGER"),
    enforceAccess("WRITE"),
    enforceLimit("services"),
    validateRequest(createServiceSchema),
    adaptRoute(makeCreateServiceController()),
  );

  router.get(
    "/services",
    authAdmin,
    enforceAccess("READ"),
    validateRequest(listServicesSchema),
    adaptRoute(makeListServicesController()),
  );

  router.get(
    "/service/:id",
    authAdmin,
    enforceAccess("READ"),
    validateRequest(getServiceSchema),
    adaptRoute(makeGetServiceController()),
  );

  router.put(
    "/service/:id",
    authAdmin,
    validateRole("MANAGER"),
    enforceAccess("WRITE"),
    validateRequest(updateServiceSchema),
    adaptRoute(makeUpdateServiceController()),
  );

  router.delete(
    "/service/:id",
    authAdmin,
    validateRole("MANAGER"),
    enforceAccess("WRITE"),
    validateRequest(removeServiceSchema),
    adaptRoute(makeRemoveServiceController()),
  );
};
