import { z } from "zod";

export const listCategoriesServiceResponseSchema = z.object({
  groups: z.array(
    z.object({
      key: z.string(),
      label: z.string(),
      categories: z
        .array(
          z.object({
            id: z.string(),
            slug: z.string(),
            name: z.string(),
            group: z.string(),
            icon: z.string().nullable(),
          }),
        )
        .optional(),
    }),
  ),
});
