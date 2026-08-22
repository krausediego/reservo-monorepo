import { z } from "zod";

import {
  acceptInvitationSchema,
  acceptInvitationResponseSchema,
} from "@reservo/schemas";

export namespace IAcceptInvitationSchema {
  export type GetParams = z.infer<typeof acceptInvitationSchema>["params"];
  export type GetResponse = z.infer<typeof acceptInvitationResponseSchema>;
}
