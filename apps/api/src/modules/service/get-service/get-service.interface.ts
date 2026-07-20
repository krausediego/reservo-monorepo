import type { IGetServiceSchema } from "@reservo/types";

export interface IGetService {
  run(params: GetService.Params): Promise<GetService.Response>;
}

export namespace GetService {
  export type Params = IGetServiceSchema.GetParams & {
    userId: string;
    organizationId: string;
    traceId: string;
  };

  export type Response = IGetServiceSchema.GetResponse;
}
