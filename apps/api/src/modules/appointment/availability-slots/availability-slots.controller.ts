import { getHttpError, type Http, ok } from "@/infra";
import type { IController } from "@/modules/shared";
import { availabilitySlotsSchema } from "@reservo/schemas";
import type { IAvailabilitySlotsSchema } from "@reservo/types";

import type { IAvailabilitySlots } from ".";

type AvailabilitySlotsHandler = () => IAvailabilitySlots;

export class AvailabilitySlotsController implements IController {
  constructor(
    private readonly availabilitySlotsService: AvailabilitySlotsHandler,
  ) {}

  async handle({
    data,
    locals,
  }: Http.IRequest<IAvailabilitySlotsSchema.GetParams>): Promise<Http.IResponse> {
    try {
      const content = await this.availabilitySlotsService().run({
        ...availabilitySlotsSchema.parse({ query: data }).query,
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
