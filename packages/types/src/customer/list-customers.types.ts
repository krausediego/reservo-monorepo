import { z } from "zod";

import { listCustomersSchema, listCustomersResponseSchema } from "@reservo/schemas";

export namespace IListCustomersSchema {
  export type GetParams  = z.infer<typeof listCustomersSchema>["body"];
  export type GetResponse = z.infer<typeof listCustomersResponseSchema>;
}
