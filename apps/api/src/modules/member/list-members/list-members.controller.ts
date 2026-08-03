import { getHttpError, type Http, ok } from "@/infra";
import type { IController } from "@/modules/shared";
import type { IListMembersSchema } from "@reservo/types";

import type { IListMembers } from ".";

type ListMembersHandler = () => IListMembers;

export class ListMembersController implements IController {
  constructor(private readonly listMembersService: ListMembersHandler) {}

  async handle({
    data,
    locals,
  }: Http.IRequest<IListMembersSchema.GetParams>): Promise<Http.IResponse> {
    try {
      const content = await this.listMembersService().run({
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
