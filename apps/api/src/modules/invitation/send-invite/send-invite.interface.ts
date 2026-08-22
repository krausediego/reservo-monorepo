import type { ISendInviteSchema } from "@reservo/types";

export interface ISendInvite {
  run(params: SendInvite.Params): Promise<SendInvite.Response>;
}

export namespace SendInvite {
  export type Params = ISendInviteSchema.GetParams & {
    userId: string;
    organizationId: string;
    traceId: string;
  };

  export type Response = ISendInviteSchema.GetResponse;
}
