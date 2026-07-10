import { z } from "zod";

import {
  getProfessionalSchema,
  getProfessionalResponseSchema,
} from "@reservo/schemas";

export namespace IGetProfessionalSchema {
  export type GetParams = z.infer<typeof getProfessionalSchema>["params"];
  export type GetResponse = z.infer<typeof getProfessionalResponseSchema>;
}
