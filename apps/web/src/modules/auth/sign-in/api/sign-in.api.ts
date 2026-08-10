import { clientAPI } from "@/lib/axios";
import type { ISignInSchema } from "@reservo/types";

export async function signInApi(
  params: ISignInSchema.GetParams,
): Promise<ISignInSchema.GetResponse> {
  const { data } = await clientAPI.post<ISignInSchema.GetResponse>(
    "/auth/sign-in/email",
    { ...params },
  );

  return data;
}
