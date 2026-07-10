import { getHttpError, type Http, ok } from "@/infra";
import type { IController } from "@/modules/shared";
import type { IGetProfessionalSchema } from "@reservo/types";

import type { IGetProfessional } from ".";

type GetProfessionalHandler = () => IGetProfessional;

export class GetProfessionalController implements IController {
  constructor(
    private readonly getProfessionalService: GetProfessionalHandler,
  ) {}

  async handle({
    data,
    locals,
  }: Http.IRequest<IGetProfessionalSchema.GetParams>): Promise<Http.IResponse> {
    try {
      const content = await this.getProfessionalService().run({
        ...data,
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
