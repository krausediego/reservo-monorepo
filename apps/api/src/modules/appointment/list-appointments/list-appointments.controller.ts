import { getHttpError, type Http, ok } from "@/infra";
import type { IController } from "@/modules/shared";
import { listAppointmentsSchema } from "@reservo/schemas";
import type { IListAppointmentsSchema } from "@reservo/types";

import type { IListAppointments } from ".";

type ListAppointmentsHandler = () => IListAppointments;

export class ListAppointmentsController implements IController {
  constructor(
    private readonly listAppointmentsService: ListAppointmentsHandler,
  ) {}

  async handle({
    data,
    locals,
  }: Http.IRequest<IListAppointmentsSchema.GetParams>): Promise<Http.IResponse> {
    try {
      const content = await this.listAppointmentsService().run({
        ...listAppointmentsSchema.parse({ query: data }).query,
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
