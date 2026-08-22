import { z } from "zod";

import { sendInviteSchema, sendInviteResponseSchema } from "@reservo/schemas";

export namespace ISendInviteSchema {
  export type GetParams = z.infer<typeof sendInviteSchema>["body"];
  export type GetResponse = z.infer<typeof sendInviteResponseSchema>;
}
