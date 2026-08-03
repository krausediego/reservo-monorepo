import type { IListMembersSchema } from "@reservo/types";

export interface IListMembers {
  run(params: ListMembers.Params): Promise<ListMembers.Response>;
}

export namespace ListMembers {
  export type Params = IListMembersSchema.GetParams & {
    userId: string;
    organizationId: string;
    traceId: string;
  };

  export type Response = IListMembersSchema.GetResponse;
}
