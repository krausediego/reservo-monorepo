import { professionalSchema } from "@reservo/schemas";
import z from "zod";

export namespace IProfessionalSchema {
  export type ProfessionalParams = z.infer<typeof professionalSchema>;
}
