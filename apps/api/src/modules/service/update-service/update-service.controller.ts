import { getHttpError, type Http, ok } from "@/infra";
import type { IController } from "@/modules/shared";
import type { IUpdateServiceSchema } from "@reservo/types";

import type { IUpdateService } from ".";

type UpdateServiceHandler = () => IUpdateService;

export class UpdateServiceController implements IController {
  constructor(private readonly updateServiceService: UpdateServiceHandler) {}

  async handle({
    data,
    locals,
  }: Http.IRequest<IUpdateServiceSchema.GetParams>): Promise<Http.IResponse> {
    try {
      const content = await this.updateServiceService().run({
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
