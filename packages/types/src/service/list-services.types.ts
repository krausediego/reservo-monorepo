import { z } from "zod";

import {
  listServicesSchema,
  listServicesResponseSchema,
} from "@reservo/schemas";

export namespace IListServicesSchema {
  export type GetParams = z.infer<typeof listServicesSchema>["query"];
  export type GetResponse = z.infer<typeof listServicesResponseSchema>;
}
