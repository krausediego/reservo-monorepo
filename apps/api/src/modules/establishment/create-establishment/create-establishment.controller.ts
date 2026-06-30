import { getHttpError, type Http, ok } from "@/infra";
import type { IController } from "@/modules/shared";
import type { CreateEstablishment } from "@reservo/types";

import type { ICreateEstablishment } from ".";

type CreateEstablishmentHandler = () => ICreateEstablishment;

export class CreateEstablishmentController implements IController {
  constructor(
    private readonly createEstablishmentService: CreateEstablishmentHandler,
  ) {}

  async handle({
    data,
    locals,
  }: Http.IRequest<CreateEstablishment.GetParams>): Promise<Http.IResponse> {
    try {
      const content = await this.createEstablishmentService().run({
        ...data,
        userId: locals.user.id,
        traceId: locals.traceId,
      });

      return ok({ ...content });
    } catch (error: any) {
      return getHttpError(error);
    }
  }
}
