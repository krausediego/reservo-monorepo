import { z } from "zod";

import { listCategoriesServiceResponseSchema } from "@reservo/schemas";

export namespace IListCategoriesServiceSchema {
  export type GetResponse = z.infer<typeof listCategoriesServiceResponseSchema>;
}
