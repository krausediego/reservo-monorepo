import type { IListProfessionalServicesSchema } from "@reservo/types";

export interface IListProfessionalServices {
  run(
    params: ListProfessionalServices.Params,
  ): Promise<ListProfessionalServices.Response>;
}

export namespace ListProfessionalServices {
  export type Params = IListProfessionalServicesSchema.GetParams & {
    userId: string;
    organizationId: string;
    traceId: string;
  };

  export type Response = IListProfessionalServicesSchema.GetResponse;
}
