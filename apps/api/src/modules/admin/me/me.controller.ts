import { getHttpError, type Http, ok } from "@/infra";
import type { IController } from "@/modules/shared";

import type { IMe } from ".";

type MeHandler = () => IMe;

export class MeController implements IController {
  constructor(private readonly meService: MeHandler) {}

  async handle({ data, locals }: Http.IRequest): Promise<Http.IResponse> {
    try {
      const content = await this.meService().run({
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
