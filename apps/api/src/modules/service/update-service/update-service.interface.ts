import type { IUpdateServiceSchema } from "@reservo/types";

export interface IUpdateService {
  run(params: UpdateService.Params): Promise<UpdateService.Response>;
}

export namespace UpdateService {
  export type Params = IUpdateServiceSchema.GetParams & {
    userId: string;
    organizationId: string;
    traceId: string;
  };

  export type Response = IUpdateServiceSchema.GetResponse;
}
