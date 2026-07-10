import type { IGetProfessionalSchema } from "@reservo/types";

export interface IGetProfessional {
  run(params: GetProfessional.Params): Promise<GetProfessional.Response>;
}

export namespace GetProfessional {
  export type Params = IGetProfessionalSchema.GetParams & {
    userId: string;
    establishmentId: string;
    traceId: string;
  };

  export type Response = IGetProfessionalSchema.GetResponse;
}
