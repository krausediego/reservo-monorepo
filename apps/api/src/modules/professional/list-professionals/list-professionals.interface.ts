import type { IListProfessionalsSchema } from "@reservo/types";

export interface IListProfessionals {
  run(params: ListProfessionals.Params): Promise<ListProfessionals.Response>;
}

export namespace ListProfessionals {
  export type Params = IListProfessionalsSchema.GetParams & {
    userId: string;
    establishmentId: string;
    traceId: string;
  };

  export type Response = IListProfessionalsSchema.GetResponse;
}
