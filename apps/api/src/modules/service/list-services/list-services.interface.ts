import type { IListServicesSchema } from "@reservo/types";

export interface IListServices {
  run(params: ListServices.Params): Promise<ListServices.Response>;
}

export namespace ListServices {
  export type Params = IListServicesSchema.GetParams & {
    userId: string;
    organizationId: string;
    traceId: string;
  };

  export type Response = IListServicesSchema.GetResponse;
}
