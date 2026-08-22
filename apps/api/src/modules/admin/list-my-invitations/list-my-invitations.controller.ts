import { getHttpError, type Http, ok } from "@/infra";
import type { IController } from "@/modules/shared";

import type { IListMyInvitations } from ".";

type ListMyInvitationsHandler = () => IListMyInvitations;

export class ListMyInvitationsController implements IController {
  constructor(
    private readonly listMyInvitationsService: ListMyInvitationsHandler,
  ) {}

  async handle({ data, locals }: Http.IRequest): Promise<Http.IResponse> {
    try {
      const content = await this.listMyInvitationsService().run({
        ...data,
        userId: locals.user.id,
        organizationId: locals.session.activeOrganizationId!,
        traceId: locals.traceId,
      });

      return ok(content);
    } catch (error: any) {
      return getHttpError(error);
    }
  }
}
