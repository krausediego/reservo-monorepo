import type { IUpdateProfessionalServicesSchema } from "@reservo/types";

export interface IUpdateProfessionalServices {
  run(
    params: UpdateProfessionalServices.Params,
  ): Promise<UpdateProfessionalServices.Response>;
}

export namespace UpdateProfessionalServices {
  export type Params = IUpdateProfessionalServicesSchema.GetParams & {
    userId: string;
    organizationId: string;
    traceId: string;
  };

  export type Response = IUpdateProfessionalServicesSchema.GetResponse;

  export type GetSignedUrlParams = {
    key: string | null;
  };
}
