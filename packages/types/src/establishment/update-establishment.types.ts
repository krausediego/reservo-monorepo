import { z } from "zod";

import {
  updateEstablishmentSchema,
  updateEstablishmentResponseSchema,
} from "@reservo/schemas";

export namespace IUpdateEstablishmentSchema {
  export type GetParams = z.infer<typeof updateEstablishmentSchema>["body"] &
    z.infer<typeof updateEstablishmentSchema>["params"];
  export type GetResponse = z.infer<typeof updateEstablishmentResponseSchema>;
}
