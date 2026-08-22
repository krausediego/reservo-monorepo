import type { IAcceptInvitationSchema } from "@reservo/types";

export interface IAcceptInvitation {
  run(params: AcceptInvitation.Params): Promise<AcceptInvitation.Response>;
}

export namespace AcceptInvitation {
  export type Params = IAcceptInvitationSchema.GetParams & {
    userId: string;
    organizationId: string;
    token: string;
    traceId: string;
  };

  export type Response = IAcceptInvitationSchema.GetResponse;
}
