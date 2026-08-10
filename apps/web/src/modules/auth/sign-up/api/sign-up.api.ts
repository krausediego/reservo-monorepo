import { clientAPI } from "@/lib/axios";
import type { ISignUpSchema } from "@reservo/types";

export async function signUpApi(
  params: ISignUpSchema.GetParams,
): Promise<ISignUpSchema.GetResponse> {
  const { data } = await clientAPI.post<ISignUpSchema.GetResponse>(
    "/auth/sign-up/email",
    { ...params },
  );

  return data;
}
