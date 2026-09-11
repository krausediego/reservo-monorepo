import { clientAPI } from "@/lib/axios";
import type { ISendInviteSchema } from "@reservo/types";

export async function inviteUserApi(
  params: ISendInviteSchema.GetParams,
): Promise<ISendInviteSchema.GetResponse> {
  const { data } = await clientAPI.post<ISendInviteSchema.GetResponse>(
    "/invitation",
    params,
  );

  return data;
}
