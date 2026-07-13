import { getHttpError, type Http, ok } from "@/infra";
import type { IController } from "@/modules/shared";
import type { IDeleteProfessionalSchema } from "@reservo/types";

import type { IDeleteProfessional } from ".";

type DeleteProfessionalHandler = () => IDeleteProfessional;

export class DeleteProfessionalController implements IController {
  constructor(
    private readonly deleteProfessionalService: DeleteProfessionalHandler,
  ) {}

  async handle({
    data,
    locals,
  }: Http.IRequest<IDeleteProfessionalSchema.GetParams>): Promise<Http.IResponse> {
    try {
      const content = await this.deleteProfessionalService().run({
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
