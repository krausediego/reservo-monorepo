import type { IUpdateProfessionalSchema } from "@reservo/types";

export interface IUpdateProfessional {
  run(params: UpdateProfessional.Params): Promise<UpdateProfessional.Response>;
}

export namespace UpdateProfessional {
  export type Params = IUpdateProfessionalSchema.GetParams & {
    userId: string;
    establishmentId: string;
    traceId: string;
  };

  export type Response = IUpdateProfessionalSchema.GetResponse;

  export type GetSignedUrlParams = {
    key: string | null;
  };

  export type UploadImageParams = {
    establishmentId: string;
    professionalId: string;
    image?: File;
  };
}
