import {
  professionalSchema,
  professionalAvailabilitiesSchema,
} from "@reservo/schemas";
import z from "zod";

export namespace IProfessionalSchema {
  export type ProfessionalParams = z.infer<typeof professionalSchema>;

  export type ProfessionalAvailabilitiesParams = z.infer<
    typeof professionalAvailabilitiesSchema
  >;
}
