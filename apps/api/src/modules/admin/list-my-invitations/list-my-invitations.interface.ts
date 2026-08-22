import type { IListMyInvitationsSchema } from "@reservo/types";

export interface IListMyInvitations {
  run(params: ListMyInvitations.Params): Promise<ListMyInvitations.Response>;
}

export namespace ListMyInvitations {
  export type Params = {
    userId: string;
    organizationId: string;
    traceId: string;
  };

  export type Response = IListMyInvitationsSchema.GetResponse;

  export type GetSignedUrlParams = {
    key?: string | null;
  };
}
