import { z } from "zod";

import { meResponseSchema } from "@reservo/schemas";

export namespace IMeSchema {
  export type GetResponse = z.infer<typeof meResponseSchema>;
}
