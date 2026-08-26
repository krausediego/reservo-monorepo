import { clientAPI } from "@/lib/axios";
import type { ICreateEstablishmentSchema } from "@reservo/types";

export async function createEstablishmentApi(
  params: ICreateEstablishmentSchema.GetParams,
): Promise<ICreateEstablishmentSchema.GetResponse> {
  const formData = new FormData();

  const { logo, cover, establishmentAvailabilities, ...rest } = params;

  for (const [key, value] of Object.entries(rest)) {
    if (value == null) continue;
    formData.append(key, String(value));
  }

  formData.append(
    "establishmentAvailabilities",
    JSON.stringify(establishmentAvailabilities),
  );

  if (logo) formData.append("logo", logo);
  if (cover) formData.append("cover", cover);

  const { data } = await clientAPI.post("/establishment", formData);

  return data;
}
