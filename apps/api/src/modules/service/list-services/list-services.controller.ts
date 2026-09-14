import { getHttpError, type Http, ok } from "@/infra";
import type { IController } from "@/modules/shared";
import { listServicesSchema } from "@reservo/schemas";
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
        ...listServicesSchema.parse({ query: data }).query,
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
