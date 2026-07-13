import type { ICreateEstablishmentSchema } from "@reservo/types";

export interface ICreateEstablishment {
  run(
    params: CreateEstablishment.Params,
  ): Promise<CreateEstablishment.Response | undefined>;
}

export namespace CreateEstablishment {
  export type Params = ICreateEstablishmentSchema.GetParams & {
    userId: string;
    organizationId: string;
    traceId: string;
  };

  export type Response = ICreateEstablishmentSchema.GetResponse;

  export type UploadImageParams = {
    establishmentId: string;
    organizationId: string;
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
