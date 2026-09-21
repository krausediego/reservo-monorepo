import { clientAPI } from "@/lib/axios";
import type { ICreateProfessionalSchema } from "@reservo/types";

export async function createProfessionalApi(
  params: ICreateProfessionalSchema.GetParams,
): Promise<ICreateProfessionalSchema.GetResponse> {
  const formData = new FormData();

  const { servicesIds, ...rest } = params;

  for (const [key, value] of Object.entries(rest)) {
    if (value == null) continue;
    formData.append(key, value);
  }

  formData.append("servicesIds", JSON.stringify(servicesIds));

  const { data } = await clientAPI.post<ICreateProfessionalSchema.GetResponse>(
    "/professional",
    formData,
  );

  return data;
}
