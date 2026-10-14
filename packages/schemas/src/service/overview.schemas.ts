import { z } from "zod";

export const overviewServiceResponseSchema = z.object({
  totalServices: z.number(),
  totalActiveServices: z.number(),
  totalInactiveServices: z.number(),
  avgDuration: z.number(),
  avgPrice: z.number(),
});
