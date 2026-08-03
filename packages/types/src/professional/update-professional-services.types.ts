import { z } from "zod";

import {
  updateProfessionalServicesSchema,
  updateProfessionalServicesResponseSchema,
} from "@reservo/schemas";

export namespace IUpdateProfessionalServicesSchema {
  export type GetParams = z.infer<
    typeof updateProfessionalServicesSchema
  >["body"] &
    z.infer<typeof updateProfessionalServicesSchema>["params"];
  export type GetResponse = z.infer<
    typeof updateProfessionalServicesResponseSchema
  >;
}
