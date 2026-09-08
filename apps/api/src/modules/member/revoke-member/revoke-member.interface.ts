import type { IRevokeMemberSchema } from "@reservo/types";

export interface IRevokeMember {
  run(params: RevokeMember.Params): Promise<RevokeMember.Response>;
}

export namespace RevokeMember {
  export type Params = IRevokeMemberSchema.GetParams & {
    userId: string;
    organizationId: string;
    traceId: string;
  };

  export type Response = IRevokeMemberSchema.GetResponse;
}
