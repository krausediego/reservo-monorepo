import type { IGetEstablishmentSchema } from "@reservo/types";

export interface IGetEstablishment {
  run(params: GetEstablishment.Params): Promise<GetEstablishment.Response>;
}

export namespace GetEstablishment {
  export type Params = {
    userId: string;
    traceId: string;
  };

  export type Response = IGetEstablishmentSchema.GetResponse;

  export type GetSignedUrlParams = {
    key?: string | null;
  };
}
