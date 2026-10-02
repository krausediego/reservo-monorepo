import z from "zod";

import {
  establishmentSchema,
  establishmentAvailabilitiesSchema,
} from "@reservo/schemas";

export namespace IEstablishmentSchema {
  export type EstablishmentParams = z.infer<typeof establishmentSchema>;

  export type EstablishmentAvailabilitiesParams = z.infer<
    typeof establishmentAvailabilitiesSchema
  >;
}
