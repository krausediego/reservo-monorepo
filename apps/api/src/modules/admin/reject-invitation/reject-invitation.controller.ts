import { getHttpError, type Http, ok } from "@/infra";
import type { IController } from "@/modules/shared";
import type { IRejectInvitationSchema } from "@reservo/types";

import type { IRejectInvitation } from ".";

type RejectInvitationHandler = () => IRejectInvitation;

export class RejectInvitationController implements IController {
  constructor(
    private readonly rejectInvitationService: RejectInvitationHandler,
  ) {}

  async handle({
    data,
    locals,
  }: Http.IRequest<IRejectInvitationSchema.GetParams>): Promise<Http.IResponse> {
    try {
      const content = await this.rejectInvitationService().run({
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
