import type { ICreateProfessionalSchema } from "@reservo/types";

export interface ICreateProfessional {
  run(params: CreateProfessional.Params): Promise<CreateProfessional.Response>;
}

export namespace CreateProfessional {
  export type Params = ICreateProfessionalSchema.GetParams & {
    userId: string;
    establishmentId: string;
    traceId: string;
  };

  export type Response = ICreateProfessionalSchema.GetResponse;

  export type UploadImageParams = {
    establishmentId: string;
    professionalId: string;
    image?: File;
  };

  export type RemoveImageParams = {
    key: string;
  };

  export type GetSignedUrlParams = {
    key: string | null;
  };
}
