import { z } from "zod";

import {
  listProfessionalsSchema,
  listProfessionalsResponseSchema,
} from "@reservo/schemas";

export namespace IListProfessionalsSchema {
  export type GetParams = z.infer<typeof listProfessionalsSchema>["query"];
  export type GetResponse = z.infer<typeof listProfessionalsResponseSchema>;
}
