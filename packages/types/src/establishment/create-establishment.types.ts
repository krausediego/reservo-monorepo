import { z } from "zod";

import {
  createEstablishmentSchema,
  createEstablishmentResponseSchema,
} from "@reservo/schemas";

export namespace CreateEstablishment {
  export type GetParams = z.infer<typeof createEstablishmentSchema>;
  export type GetResponse = z.infer<typeof createEstablishmentResponseSchema>;
}
