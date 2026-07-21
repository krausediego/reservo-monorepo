import { getHttpError, type Http, ok } from "@/infra";
import type { IController } from "@/modules/shared";
import type { IListProfessionalServicesSchema } from "@reservo/types";

import type { IListProfessionalServices } from ".";

type ListProfessionalServicesHandler = () => IListProfessionalServices;

export class ListProfessionalServicesController implements IController {
  constructor(
    private readonly listProfessionalServicesService: ListProfessionalServicesHandler,
  ) {}

  async handle({
    data,
    locals,
  }: Http.IRequest<IListProfessionalServicesSchema.GetParams>): Promise<Http.IResponse> {
    try {
      const content = await this.listProfessionalServicesService().run({
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
