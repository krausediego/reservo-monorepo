import type { IListCategoriesServiceSchema } from "@reservo/types";

export interface IListCategoriesService {
  run(
    params: ListCategoriesService.Params,
  ): Promise<ListCategoriesService.Response>;
}

export namespace ListCategoriesService {
  export type Params = {
    userId: string;
    organizationId: string;
    traceId: string;
  };

  export type Response = IListCategoriesServiceSchema.GetResponse;
}
