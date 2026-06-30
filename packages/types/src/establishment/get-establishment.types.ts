import { z } from "zod";

import { getEstablishmentResponseSchema } from "@reservo/schemas";

export namespace IGetEstablishmentSchema {
  export type GetResponse = z.infer<typeof getEstablishmentResponseSchema>;
}
