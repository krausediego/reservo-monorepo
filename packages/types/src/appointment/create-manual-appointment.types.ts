import { z } from "zod";

import {
  createManualAppointmentSchema,
  createManualAppointmentResponseSchema,
} from "@reservo/schemas";

export namespace ICreateManualAppointmentSchema {
  export type GetParams = z.infer<typeof createManualAppointmentSchema>["body"];
  export type GetResponse = z.infer<
    typeof createManualAppointmentResponseSchema
  >;

  export type GetInput = z.input<typeof createManualAppointmentSchema>["body"];
}
