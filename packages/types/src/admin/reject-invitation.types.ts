import { z } from "zod";

import {
  rejectInvitationSchema,
  rejectInvitationResponseSchema,
} from "@reservo/schemas";

export namespace IRejectInvitationSchema {
  export type GetParams = z.infer<typeof rejectInvitationSchema>["params"];
  export type GetResponse = z.infer<typeof rejectInvitationResponseSchema>;
}
