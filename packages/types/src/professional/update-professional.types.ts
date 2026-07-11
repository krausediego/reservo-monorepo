import { z } from "zod";

import {
  updateProfessionalSchema,
  updateProfessionalResponseSchema,
} from "@reservo/schemas";

export namespace IUpdateProfessionalSchema {
  export type GetParams = z.infer<typeof updateProfessionalSchema>["body"] &
    z.infer<typeof updateProfessionalSchema>["params"];
  export type GetResponse = z.infer<typeof updateProfessionalResponseSchema>;
}
