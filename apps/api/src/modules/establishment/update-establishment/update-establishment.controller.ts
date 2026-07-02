import { getHttpError, type Http, ok } from "@/infra";
import type { IController } from "@/modules/shared";
import { updateEstablishmentSchema } from "@reservo/schemas";
import type { IUpdateEstablishmentSchema } from "@reservo/types";

import type { IUpdateEstablishment } from ".";

type UpdateEstablishmentHandler = () => IUpdateEstablishment;

export class UpdateEstablishmentController implements IController {
  constructor(
    private readonly updateEstablishmentService: UpdateEstablishmentHandler,
  ) {}

  async handle({
    data,
    locals,
  }: Http.IRequest<IUpdateEstablishmentSchema.GetParams>): Promise<Http.IResponse> {
    try {
      const content = await this.updateEstablishmentService().run({
        ...updateEstablishmentSchema.parse({ body: data }).body,
        id: data.id,
        userId: locals.user.id,
        organizationId: locals.session.activeOrganizationId as string,
        traceId: locals.traceId,
      });

      return ok({ ...content });
    } catch (error: any) {
      return getHttpError(error);
    }
  }
}
