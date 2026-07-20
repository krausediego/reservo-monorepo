import { getHttpError, type Http, ok } from "@/infra";
import type { IController } from "@/modules/shared";
import type { IGetServiceSchema } from "@reservo/types";

import type { IGetService } from ".";

type GetServiceHandler = () => IGetService;

export class GetServiceController implements IController {
  constructor(private readonly getServiceService: GetServiceHandler) {}

  async handle({
    data,
    locals,
  }: Http.IRequest<IGetServiceSchema.GetParams>): Promise<Http.IResponse> {
    try {
      const content = await this.getServiceService().run({
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
