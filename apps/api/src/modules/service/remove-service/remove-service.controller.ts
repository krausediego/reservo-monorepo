import { getHttpError, type Http, ok } from "@/infra";
import type { IController } from "@/modules/shared";
import type { IRemoveServiceSchema } from "@reservo/types";

import type { IRemoveService } from ".";

type RemoveServiceHandler = () => IRemoveService;

export class RemoveServiceController implements IController {
  constructor(private readonly removeServiceService: RemoveServiceHandler) {}

  async handle({
    data,
    locals,
  }: Http.IRequest<IRemoveServiceSchema.GetParams>): Promise<Http.IResponse> {
    try {
      const content = await this.removeServiceService().run({
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
