import type { IAvailabilitySlotsSchema } from "@reservo/types";

export interface IAvailabilitySlots {
  run(params: AvailabilitySlots.Params): Promise<AvailabilitySlots.Response>;
}

export namespace AvailabilitySlots {
  export type Params = IAvailabilitySlotsSchema.GetParams & {
    userId: string;
    organizationId: string;
    traceId: string;
  };

  export type Response = IAvailabilitySlotsSchema.GetResponse;
}
