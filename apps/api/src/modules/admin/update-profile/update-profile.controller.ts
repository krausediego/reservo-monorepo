import { getHttpError, type Http, ok } from "@/infra";
import type { IController } from "@/modules/shared";
import { updateProfileSchema } from "@reservo/schemas";
import type { IUpdateProfileSchema } from "@reservo/types";

import type { IUpdateProfile } from ".";

type UpdateProfileHandler = () => IUpdateProfile;

export class UpdateProfileController implements IController {
  constructor(private readonly updateProfileService: UpdateProfileHandler) {}

  async handle({
    data,
    locals,
  }: Http.IRequest<IUpdateProfileSchema.GetParams>): Promise<Http.IResponse> {
    try {
      const content = await this.updateProfileService().run({
        ...updateProfileSchema.parse({ body: data }).body,
        userId: locals.user.id,
        organizationId: locals.session.activeOrganizationId!,
        traceId: locals.traceId,
      });

      return ok({ ...content });
    } catch (error: any) {
      return getHttpError(error);
    }
  }
}
