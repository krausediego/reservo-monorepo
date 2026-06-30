import type { ICreateEstablishmentSchema } from "@reservo/types";

export interface ICreateEstablishment {
  run(
    params: CreateEstablishment.Params,
  ): Promise<CreateEstablishment.Response | undefined>;
}

export namespace CreateEstablishment {
  export type Params = ICreateEstablishmentSchema.GetParams & {
    userId: string;
    traceId: string;
  };

  export type Response = ICreateEstablishmentSchema.GetResponse;

  export type UploadImageParams = {
    establishmentId: string;
    context: string;
    image?: File;
  };

  export type RemoveImageParams = {
    key: string;
  };

  export type GetSignedUrlParams = {
    key: string | null;
  };
}
