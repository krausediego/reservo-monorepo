import { z } from "zod";

import { createProfessionalSchema, createProfessionalResponseSchema } from "@reservo/schemas";

export namespace ICreateProfessionalSchema {
  export type GetParams  = z.infer<typeof createProfessionalSchema>["body"];
  export type GetResponse = z.infer<typeof createProfessionalResponseSchema>;
}
