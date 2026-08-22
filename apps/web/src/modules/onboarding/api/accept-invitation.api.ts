import { clientAPI } from "@/lib/axios";
import type { IAcceptInvitationSchema } from "@reservo/types";

export async function acceptInvitationApi(
  params: IAcceptInvitationSchema.GetParams,
): Promise<IAcceptInvitationSchema.GetResponse> {
  const { data } = await clientAPI.post(
    `/admin/accept-invitation/${params.id}`,
  );

  return data;
}
