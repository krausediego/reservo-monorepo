import type { IOverviewServiceSchema } from "@reservo/types";

export interface IOverviewService {
  run(params: OverviewService.Params): Promise<OverviewService.Response>;
}

export namespace OverviewService {
  export type Params = {
    userId: string;
    organizationId: string;
    traceId: string;
  };

  export type Response = IOverviewServiceSchema.GetResponse;
}
