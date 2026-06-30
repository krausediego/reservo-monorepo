import { z } from "zod";

import {
  createEstablishmentSchema,
  createEstablishmentResponseSchema,
} from "@reservo/schemas";

export namespace ICreateEstablishmentSchema {
  export type GetParams = z.infer<typeof createEstablishmentSchema>["body"];
  export type GetResponse = z.infer<typeof createEstablishmentResponseSchema>;
}
