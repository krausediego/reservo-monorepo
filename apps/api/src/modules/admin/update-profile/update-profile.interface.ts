import type { IUpdateProfileSchema } from "@reservo/types";

export interface IUpdateProfile {
  run(params: UpdateProfile.Params): Promise<UpdateProfile.Response>;
}

export namespace UpdateProfile {
  export type Params = IUpdateProfileSchema.GetParams & {
    userId: string;
    organizationId: string;
    traceId: string;
  };

  export type Response = IUpdateProfileSchema.GetResponse;

  export type UploadImageParams = {
    userId: string;
    context: string;
    image?: File;
  };

  export type RemoveImageParams = {
    key: string;
  };

  export type GetSignedUrlParams = {
    key?: string | null;
  };
}
