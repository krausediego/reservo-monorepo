import { getHttpError, type Http, ok } from "@/infra";
import type { IController } from "@/modules/shared";
import type { IListProfessionalsSchema } from "@reservo/types";

import type { IListProfessionals } from ".";

type ListProfessionalsHandler = () => IListProfessionals;

export class ListProfessionalsController implements IController {
  constructor(
    private readonly listProfessionalsService: ListProfessionalsHandler,
  ) {}

  async handle({
    data,
    locals,
  }: Http.IRequest<IListProfessionalsSchema.GetParams>): Promise<Http.IResponse> {
    try {
      const content = await this.listProfessionalsService().run({
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
