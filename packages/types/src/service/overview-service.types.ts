import { z } from "zod";

import { overviewServiceResponseSchema } from "@reservo/schemas";

export namespace IOverviewServiceSchema {
  export type GetResponse = z.infer<typeof overviewServiceResponseSchema>;
}
