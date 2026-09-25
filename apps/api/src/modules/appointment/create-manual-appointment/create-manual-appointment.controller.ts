import { getHttpError, type Http, ok } from "@/infra";
import type { IController } from "@/modules/shared";
import { createManualAppointmentSchema } from "@reservo/schemas";
import type { ICreateManualAppointmentSchema } from "@reservo/types";

import type { ICreateManualAppointment } from ".";

type CreateManualAppointmentHandler = () => ICreateManualAppointment;

export class CreateManualAppointmentController implements IController {
  constructor(
    private readonly createManualAppointmentService: CreateManualAppointmentHandler,
  ) {}

  async handle({
    data,
    locals,
  }: Http.IRequest<ICreateManualAppointmentSchema.GetParams>): Promise<Http.IResponse> {
    try {
      const content = await this.createManualAppointmentService().run({
        ...createManualAppointmentSchema.parse({ body: data }).body,
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
