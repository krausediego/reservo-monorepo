import { z } from "zod";

export const listCustomersSchema = z.object({
  body: z.object({}),
});

export const listCustomersResponseSchema = z.object({});
