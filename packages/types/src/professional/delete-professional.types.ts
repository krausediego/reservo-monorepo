import { z } from "zod";

import { deleteProfessionalSchema, deleteProfessionalResponseSchema } from "@reservo/schemas";

export namespace IDeleteProfessionalSchema {
  export type GetParams  = z.infer<typeof deleteProfessionalSchema>["params"];
  export type GetResponse = z.infer<typeof deleteProfessionalResponseSchema>;
}
