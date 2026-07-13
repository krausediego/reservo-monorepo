import type { IDeleteProfessionalSchema } from "@reservo/types";

export interface IDeleteProfessional {
  run(params: DeleteProfessional.Params): Promise<DeleteProfessional.Response>;
}

export namespace DeleteProfessional {
  export type Params = IDeleteProfessionalSchema.GetParams & {
    userId: string;
    organizationId: string;
    traceId: string;
  };

  export type Response = IDeleteProfessionalSchema.GetResponse;
}
