import type { IListAppointmentsSchema } from "@reservo/types";

export interface IListAppointments {
  run(params: ListAppointments.Params): Promise<ListAppointments.Response>;
}

export namespace ListAppointments {
  export type Params = IListAppointmentsSchema.GetParams & {
    userId: string;
    organizationId: string;
    traceId: string;
  };

  export type Response = IListAppointmentsSchema.GetResponse;
}
