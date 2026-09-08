import { z } from "zod";

import {
  revokeMemberSchema,
  revokeMemberResponseSchema,
} from "@reservo/schemas";

export namespace IRevokeMemberSchema {
  export type GetParams = z.infer<typeof revokeMemberSchema>["params"];
  export type GetResponse = z.infer<typeof revokeMemberResponseSchema>;
}
