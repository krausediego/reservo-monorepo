import { getHttpError, type Http, ok } from "@/infra";
import type { IController } from "@/modules/shared";
import type { IUpdateProfessionalServicesSchema } from "@reservo/types";

import type { IUpdateProfessionalServices } from ".";

type UpdateProfessionalServicesHandler = () => IUpdateProfessionalServices;

export class UpdateProfessionalServicesController implements IController {
  constructor(
    private readonly updateProfessionalServicesService: UpdateProfessionalServicesHandler,
  ) {}

  async handle({
    data,
    locals,
  }: Http.IRequest<IUpdateProfessionalServicesSchema.GetParams>): Promise<Http.IResponse> {
    try {
      const content = await this.updateProfessionalServicesService().run({
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
