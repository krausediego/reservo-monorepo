import type { IUpdateEstablishmentSchema } from "@reservo/types";

export interface IUpdateEstablishment {
  run(
    params: UpdateEstablishment.Params,
  ): Promise<UpdateEstablishment.Response>;
}

export namespace UpdateEstablishment {
  export type Params = IUpdateEstablishmentSchema.GetParams & {
    userId: string;
    traceId: string;
  };

  export type Response = IUpdateEstablishmentSchema.GetResponse;
}
