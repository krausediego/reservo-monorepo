import { getHttpError, type Http, ok } from "@/infra";
import type { IController } from "@/modules/shared";
import type { IAcceptInvitationSchema } from "@reservo/types";

import type { IAcceptInvitation } from ".";

type AcceptInvitationHandler = () => IAcceptInvitation;

export class AcceptInvitationController implements IController {
  constructor(
    private readonly acceptInvitationService: AcceptInvitationHandler,
  ) {}

  async handle({
    data,
    locals,
  }: Http.IRequest<IAcceptInvitationSchema.GetParams>): Promise<Http.IResponse> {
    try {
      const content = await this.acceptInvitationService().run({
        ...data,
        userId: locals.user.id,
        organizationId: locals.session.activeOrganizationId!,
        token: locals.session.token,
        traceId: locals.traceId,
      });

      return ok({ ...content });
    } catch (error: any) {
      return getHttpError(error);
    }
  }
}
