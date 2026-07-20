import { getHttpError, type Http, ok } from "@/infra";
import type { IController } from "@/modules/shared";
import type { IListServicesSchema } from "@reservo/types";

import type { IListServices } from ".";

type ListServicesHandler = () => IListServices;

export class ListServicesController implements IController {
  constructor(private readonly listServicesService: ListServicesHandler) {}

  async handle({
    data,
    locals,
  }: Http.IRequest<IListServicesSchema.GetParams>): Promise<Http.IResponse> {
    try {
      const content = await this.listServicesService().run({
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
