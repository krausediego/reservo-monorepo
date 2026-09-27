import { Router } from "express";

import { makeCreateManualAppointmentController } from "@/modules/appointment/create-manual-appointment";
import { makeListAppointmentsController } from "@/modules/appointment/list-appointments";
import {
  createManualAppointmentSchema,
  listAppointmentsSchema,
} from "@reservo/schemas";

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

  router.get(
    "/appointments",
    authAdmin,
    enforceAccess("READ"),
    validateRequest(listAppointmentsSchema),
    adaptRoute(makeListAppointmentsController()),
  );
};
