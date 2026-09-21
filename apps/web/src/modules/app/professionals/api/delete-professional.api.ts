import { clientAPI } from "@/lib/axios";
import type { IDeleteProfessionalSchema } from "@reservo/types";

export async function deleteProfessionalApi(
  params: IDeleteProfessionalSchema.GetParams,
): Promise<IDeleteProfessionalSchema.GetResponse> {
  const { data } =
    await clientAPI.delete<IDeleteProfessionalSchema.GetResponse>(
      `/professional/${params.id}`,
    );

  return data;
}
