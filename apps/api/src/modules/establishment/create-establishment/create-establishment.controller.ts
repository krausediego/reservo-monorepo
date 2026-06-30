import { getHttpError, type Http, ok } from "@/infra";
import type { IController } from "@/modules/shared";
import { createEstablishmentSchema } from "@reservo/schemas";
import type { ICreateEstablishmentSchema } from "@reservo/types";

import type { ICreateEstablishment } from ".";

type CreateEstablishmentHandler = () => ICreateEstablishment;

export class CreateEstablishmentController implements IController {
  constructor(
    private readonly createEstablishmentService: CreateEstablishmentHandler,
  ) {}

  async handle({
    data,
    locals,
  }: Http.IRequest<ICreateEstablishmentSchema.GetParams>): Promise<Http.IResponse> {
    try {
      const content = await this.createEstablishmentService().run({
        ...createEstablishmentSchema.parse({ body: data }).body,
        userId: locals.user.id,
        traceId: locals.traceId,
      });

      return ok({ ...content });
    } catch (error: any) {
      return getHttpError(error);
    }
  }
}
