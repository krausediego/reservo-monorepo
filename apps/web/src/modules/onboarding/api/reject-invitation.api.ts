import { clientAPI } from "@/lib/axios";
import type { IRejectInvitationSchema } from "@reservo/types";

export async function rejectInvitationApi(
  params: IRejectInvitationSchema.GetParams,
): Promise<IRejectInvitationSchema.GetResponse> {
  const { data } = await clientAPI.post<IRejectInvitationSchema.GetResponse>(
    `/admin/reject-invitation/${params.id}`,
  );

  return data;
}
