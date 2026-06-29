import { getHttpError, type Http, ok } from "@/infra";
import type { IController } from "@/modules/shared";
import type { CreateEstablishmentSchema } from "@reservo/types";

import type { ICreateEstablishment } from ".";

type CreateEstablishmentHandler = () => ICreateEstablishment;

export class CreateEstablishmentController implements IController {
  constructor(private readonly createEstablishmentService: CreateEstablishmentHandler) {}

  async handle({ data, locals }: Http.IRequest<CreateEstablishmentSchema.GetParams>): Promise<Http.IResponse> {
    try {
      const content = await this.createEstablishmentService().run({
        ...data,
        traceId: locals?.traceId,
      });

      return ok({ ...content });
    } catch (error: any) {
      return getHttpError(error);
    }
  }
}
