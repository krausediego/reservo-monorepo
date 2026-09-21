import { clientAPI } from "@/lib/axios";
import type { IUpdateProfileSchema } from "@reservo/types";

export async function updateProfileApi(params: IUpdateProfileSchema.GetParams) {
  const formData = new FormData();

  for (const [key, value] of Object.entries(params)) {
    if (value == null) continue;
    formData.append(key, value);
  }

  const { data } = await clientAPI.put<IUpdateProfileSchema.GetResponse>(
    "/admin/update-profile",
    formData,
  );

  return data;
}
