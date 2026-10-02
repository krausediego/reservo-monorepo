import { Router } from "express";

import { makeAvailabilitySlotsController } from "@/modules/appointment/availability-slots";
import { makeCreateManualAppointmentController } from "@/modules/appointment/create-manual-appointment";
import { makeListAppointmentsController } from "@/modules/appointment/list-appointments";
import {
  availabilitySlotsSchema,
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

  router.get(
    "/availability-slots",
    authAdmin,
    validateRequest(availabilitySlotsSchema),
    adaptRoute(makeAvailabilitySlotsController()),
  );
};
