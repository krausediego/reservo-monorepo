import type { ICreateManualAppointmentSchema } from "@reservo/types";

export interface ICreateManualAppointment {
  run(
    params: CreateManualAppointment.Params,
  ): Promise<CreateManualAppointment.Response>;
}

export namespace CreateManualAppointment {
  export type Params = ICreateManualAppointmentSchema.GetParams & {
    userId: string;
    organizationId: string;
    traceId: string;
  };

  export type Response = ICreateManualAppointmentSchema.GetResponse;
}
