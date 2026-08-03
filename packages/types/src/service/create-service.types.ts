import { z } from "zod";

import { createServiceSchema, createServiceResponseSchema } from "@reservo/schemas";

export namespace ICreateServiceSchema {
  export type GetParams  = z.infer<typeof createServiceSchema>["body"];
  export type GetResponse = z.infer<typeof createServiceResponseSchema>;
}
