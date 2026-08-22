import { getHttpError, type Http, ok } from "@/infra";
import type { IController } from "@/modules/shared";
import type { ISendInviteSchema } from "@reservo/types";

import type { ISendInvite } from ".";

type SendInviteHandler = () => ISendInvite;

export class SendInviteController implements IController {
  constructor(private readonly sendInviteService: SendInviteHandler) {}

  async handle({
    data,
    locals,
  }: Http.IRequest<ISendInviteSchema.GetParams>): Promise<Http.IResponse> {
    try {
      const content = await this.sendInviteService().run({
        ...data,
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
