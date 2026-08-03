import { z } from "zod";

import { getServiceSchema, getServiceResponseSchema } from "@reservo/schemas";

export namespace IGetServiceSchema {
  export type GetParams = z.infer<typeof getServiceSchema>["params"];
  export type GetResponse = z.infer<typeof getServiceResponseSchema>;
}
