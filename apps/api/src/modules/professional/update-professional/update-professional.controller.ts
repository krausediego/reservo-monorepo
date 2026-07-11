import { getHttpError, type Http, ok } from "@/infra";
import type { IController } from "@/modules/shared";
import { updateProfessionalSchema } from "@reservo/schemas";
import type { IUpdateProfessionalSchema } from "@reservo/types";

import type { IUpdateProfessional } from ".";

type UpdateProfessionalHandler = () => IUpdateProfessional;

export class UpdateProfessionalController implements IController {
  constructor(
    private readonly updateProfessionalService: UpdateProfessionalHandler,
  ) {}

  async handle({
    data,
    locals,
  }: Http.IRequest<IUpdateProfessionalSchema.GetParams>): Promise<Http.IResponse> {
    try {
      const content = await this.updateProfessionalService().run({
        ...updateProfessionalSchema.parse({ body: data }).body,
        ...updateProfessionalSchema.parse({ params: data.id }).params,
        userId: locals.user.id,
        establishmentId: locals.session.activeEstablishmentId!,
        traceId: locals.traceId,
      });

      return ok({ ...content });
    } catch (error: any) {
      return getHttpError(error);
    }
  }
}
