import type { ICreateServiceSchema } from "@reservo/types";

export interface ICreateService {
  run(params: CreateService.Params): Promise<CreateService.Response>;
}

export namespace CreateService {
  export type Params = ICreateServiceSchema.GetParams & {
    userId: string;
    organizationId: string;
    traceId: string;
  };

  export type Response = ICreateServiceSchema.GetResponse;
}
