import { clientAPI } from "@/lib/axios";
import type { IListCategoriesServiceSchema } from "@reservo/types";

export async function listCategoriesServiceApi(): Promise<IListCategoriesServiceSchema.GetResponse> {
  const { data } =
    await clientAPI.get<IListCategoriesServiceSchema.GetResponse>(
      "/service-categories",
    );

  return data;
}
