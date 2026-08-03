import { z } from "zod";

import {
  updateServiceSchema,
  updateServiceResponseSchema,
} from "@reservo/schemas";

export namespace IUpdateServiceSchema {
  export type GetParams = z.infer<typeof updateServiceSchema>["params"] &
    z.infer<typeof updateServiceSchema>["body"];
  export type GetResponse = z.infer<typeof updateServiceResponseSchema>;
}
