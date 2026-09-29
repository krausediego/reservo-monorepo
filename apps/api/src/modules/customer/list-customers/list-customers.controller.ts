import { getHttpError, type Http, ok } from "@/infra";
import type { IController } from "@/modules/shared";
import type { IListCustomersSchema } from "@reservo/types";

import type { IListCustomers } from ".";

type ListCustomersHandler = () => IListCustomers;

export class ListCustomersController implements IController {
  constructor(private readonly listCustomersService: ListCustomersHandler) {}

  async handle({ data, locals }: Http.IRequest<IListCustomersSchema.GetParams>): Promise<Http.IResponse> {
    try {
      const content = await this.listCustomersService().run({
        ...data,
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
