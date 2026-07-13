import type { IUpdateEstablishmentSchema } from "@reservo/types";

export interface IUpdateEstablishment {
  run(
    params: UpdateEstablishment.Params,
  ): Promise<UpdateEstablishment.Response | undefined>;
}

export namespace UpdateEstablishment {
  export type Params = IUpdateEstablishmentSchema.GetParams & {
    userId: string;
    organizationId: string;
    traceId: string;
  };

  export type Response = IUpdateEstablishmentSchema.GetResponse;

  export type UploadImageParams = {
    organizationId: string;
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
