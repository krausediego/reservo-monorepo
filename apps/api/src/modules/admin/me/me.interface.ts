import type { IMeSchema } from "@reservo/types";

export interface IMe {
  run(params: Me.Params): Promise<Me.Response>;
}

export namespace Me {
  export type Params = {
    userId: string;
    organizationId: string;
    traceId: string;
  };

  export type Response = IMeSchema.GetResponse;

  export type GetSignedUrlParams = {
    key?: string | null;
  };
}
