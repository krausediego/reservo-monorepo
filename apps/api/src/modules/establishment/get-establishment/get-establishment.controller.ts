import { getHttpError, type Http, ok } from "@/infra";
import type { IController } from "@/modules/shared";

import type { IGetEstablishment } from ".";

type GetEstablishmentHandler = () => IGetEstablishment;

export class GetEstablishmentController implements IController {
  constructor(
    private readonly getEstablishmentService: GetEstablishmentHandler,
  ) {}

  async handle({ locals }: Http.IRequest): Promise<Http.IResponse> {
    try {
      const content = await this.getEstablishmentService().run({
        userId: locals.user.id,
        traceId: locals.traceId,
      });

      return ok({ ...content });
    } catch (error: any) {
      return getHttpError(error);
    }
  }
}
