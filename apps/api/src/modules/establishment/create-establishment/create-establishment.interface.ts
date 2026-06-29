import type { CreateEstablishmentSchema } from "@reservo/types";

export interface ICreateEstablishment {
  run(params: CreateEstablishment.Params): Promise<CreateEstablishment.Response>;
}

export namespace CreateEstablishment {
  export type Params = CreateEstablishmentSchema.GetParams & {
    traceId: string;
  };

  export type Response = CreateEstablishmentSchema.GetResponse;
}
