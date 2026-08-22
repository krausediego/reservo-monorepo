import type { IRejectInvitationSchema } from "@reservo/types";

export interface IRejectInvitation {
  run(params: RejectInvitation.Params): Promise<RejectInvitation.Response>;
}

export namespace RejectInvitation {
  export type Params = IRejectInvitationSchema.GetParams & {
    userId: string;
    organizationId: string;
    traceId: string;
  };

  export type Response = IRejectInvitationSchema.GetResponse;
}
