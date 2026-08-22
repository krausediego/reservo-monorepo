import { z } from "zod";

import { listMyInvitationsResponseSchema } from "@reservo/schemas";

export namespace IListMyInvitationsSchema {
  export type GetResponse = z.infer<typeof listMyInvitationsResponseSchema>;
}
