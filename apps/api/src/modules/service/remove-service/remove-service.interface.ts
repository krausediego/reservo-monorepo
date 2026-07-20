import type { IRemoveServiceSchema } from "@reservo/types";

export interface IRemoveService {
  run(params: RemoveService.Params): Promise<RemoveService.Response>;
}

export namespace RemoveService {
  export type Params = IRemoveServiceSchema.GetParams & {
    userId: string;
    organizationId: string;
    traceId: string;
  };

  export type Response = IRemoveServiceSchema.GetResponse;
}
