import { z } from "zod";

import {
  updateProfileSchema,
  updateProfileResponseSchema,
} from "@reservo/schemas";

export namespace IUpdateProfileSchema {
  export type GetParams = z.infer<typeof updateProfileSchema>["body"];
  export type GetResponse = z.infer<typeof updateProfileResponseSchema>;
}
