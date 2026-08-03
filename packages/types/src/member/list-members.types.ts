import { z } from "zod";

import { listMembersSchema, listMembersResponseSchema } from "@reservo/schemas";

export namespace IListMembersSchema {
  export type GetParams = z.infer<typeof listMembersSchema>["query"];
  export type GetResponse = z.infer<typeof listMembersResponseSchema>;
}
