import { z } from "zod";

import {
  listAppointmentsSchema,
  listAppointmentsResponseSchema,
} from "@reservo/schemas";

export namespace IListAppointmentsSchema {
  export type GetParams = z.infer<typeof listAppointmentsSchema>["query"];
  export type GetResponse = z.infer<typeof listAppointmentsResponseSchema>;
}
