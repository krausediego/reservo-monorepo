import { z } from "zod";

import {
  listProfessionalServicesSchema,
  listProfessionalServicesResponseSchema,
} from "@reservo/schemas";

export namespace IListProfessionalServicesSchema {
  export type GetParams = z.infer<
    typeof listProfessionalServicesSchema
  >["params"];
  export type GetResponse = z.infer<
    typeof listProfessionalServicesResponseSchema
  >;
}
