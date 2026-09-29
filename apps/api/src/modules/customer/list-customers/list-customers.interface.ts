import type { IListCustomersSchema } from "@reservo/types";

export interface IListCustomers {
  run(params: ListCustomers.Params): Promise<ListCustomers.Response>;
}

export namespace ListCustomers {
  export type Params = IListCustomersSchema.GetParams & {
    userId: string;
    organizationId: string;
    traceId: string;
  };

  export type Response = IListCustomersSchema.GetResponse;
}
