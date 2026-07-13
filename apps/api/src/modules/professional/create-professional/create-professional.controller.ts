import { getHttpError, type Http, ok } from "@/infra";
import type { IController } from "@/modules/shared";
import { createProfessionalSchema } from "@reservo/schemas";
import type { ICreateProfessionalSchema } from "@reservo/types";

import type { ICreateProfessional } from ".";

type CreateProfessionalHandler = () => ICreateProfessional;

export class CreateProfessionalController implements IController {
  constructor(
    private readonly createProfessionalService: CreateProfessionalHandler,
  ) {}

  async handle({
    data,
    locals,
  }: Http.IRequest<ICreateProfessionalSchema.GetParams>): Promise<Http.IResponse> {
    try {
      const content = await this.createProfessionalService().run({
        ...createProfessionalSchema.parse({ body: data }).body,
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
