import { z } from "zod";

import {
  removeServiceSchema,
  removeServiceResponseSchema,
} from "@reservo/schemas";

export namespace IRemoveServiceSchema {
  export type GetParams = z.infer<typeof removeServiceSchema>["params"];
  export type GetResponse = z.infer<typeof removeServiceResponseSchema>;
}
