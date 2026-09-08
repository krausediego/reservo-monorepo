import { getHttpError, type Http, ok } from "@/infra";
import type { IController } from "@/modules/shared";
import type { IRevokeMemberSchema } from "@reservo/types";

import type { IRevokeMember } from ".";

type RevokeMemberHandler = () => IRevokeMember;

export class RevokeMemberController implements IController {
  constructor(private readonly revokeMemberService: RevokeMemberHandler) {}

  async handle({
    data,
    locals,
  }: Http.IRequest<IRevokeMemberSchema.GetParams>): Promise<Http.IResponse> {
    try {
      const content = await this.revokeMemberService().run({
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
