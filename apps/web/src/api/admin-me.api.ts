import { clientAPI } from "@/lib/axios";
import type { IMeSchema } from "@reservo/types";

export async function adminMeApi(): Promise<IMeSchema.GetResponse> {
  const { data } = await clientAPI.get<IMeSchema.GetResponse>("/admin/me");

  return data;
}
