import { z } from "zod";

import {
  availabilitySlotsSchema,
  availabilitySlotsResponseSchema,
} from "@reservo/schemas";

export namespace IAvailabilitySlotsSchema {
  export type GetParams = z.infer<typeof availabilitySlotsSchema>["query"];
  export type GetResponse = z.infer<typeof availabilitySlotsResponseSchema>;
}
