import { Router } from "express";

import { makeListCustomersController } from "@/modules/customer/list-customers";
import { listCustomersSchema } from "@reservo/schemas";

import { adaptRoute } from "../handlers";
import { authAdmin, enforceAccess, validateRequest } from "../middlewares";

export default (router: Router) => {
  router.get(
    "/customers",
    authAdmin,
    enforceAccess("READ"),
    validateRequest(listCustomersSchema),
    adaptRoute(makeListCustomersController()),
  );
};
