import { getHttpError, type Http, ok } from "@/infra";
import type { IController } from "@/modules/shared";

import type { IOverviewService } from ".";

type OverviewServiceHandler = () => IOverviewService;

export class OverviewServiceController implements IController {
  constructor(private readonly overviewService: OverviewServiceHandler) {}

  async handle({ locals }: Http.IRequest): Promise<Http.IResponse> {
    try {
      const content = await this.overviewService().run({
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
