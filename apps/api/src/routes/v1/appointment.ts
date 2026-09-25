import { Router } from "express";

import { makeCreateManualAppointmentController } from "@/modules/appointment/create-manual-appointment";
import { createManualAppointmentSchema } from "@reservo/schemas";

import { adaptRoute } from "../handlers";
import {
  authAdmin,
  enforceAccess,
  validateRequest,
  validateRole,
} from "../middlewares";

export default (router: Router) => {
  router.post(
    "/manual-appointment",
    authAdmin,
    validateRole("PROFESSIONAL"),
    enforceAccess("WRITE"),
    validateRequest(createManualAppointmentSchema),
    adaptRoute(makeCreateManualAppointmentController()),
  );
};
