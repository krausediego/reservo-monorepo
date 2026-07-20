import { getHttpError, type Http, ok } from "@/infra";
import type { IController } from "@/modules/shared";
import type { ICreateServiceSchema } from "@reservo/types";

import type { ICreateService } from ".";

type CreateServiceHandler = () => ICreateService;

export class CreateServiceController implements IController {
  constructor(private readonly createServiceService: CreateServiceHandler) {}

  async handle({
    data,
    locals,
  }: Http.IRequest<ICreateServiceSchema.GetParams>): Promise<Http.IResponse> {
    try {
      const content = await this.createServiceService().run({
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
