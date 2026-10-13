import { clientAPI } from "@/lib/axios";
import type { IOverviewServiceSchema } from "@reservo/types";

export async function overviewServiceApi(): Promise<IOverviewServiceSchema.GetResponse> {
  const { data } =
    await clientAPI.get<IOverviewServiceSchema.GetResponse>(
      "/service-overview",
    );

  return data;
}
