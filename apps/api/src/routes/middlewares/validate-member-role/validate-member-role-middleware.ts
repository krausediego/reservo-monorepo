import { MemberRole } from "generated/prisma/enums";

import {
  AppSession,
  getHttpError,
  Http,
  ILoggingManager,
  ok,
  UnauthorizedError,
} from "@/infra";

import { IMiddleware } from "../middleware";

const UNAUTHORIZED = "Unauthorized";

const ROLE_HIERARCHY: Record<MemberRole, number> = {
  [MemberRole.OWNER]: 3,
  [MemberRole.MANAGER]: 2,
  [MemberRole.PROFESSIONAL]: 1,
};

export class ValidateMemberRoleMiddleware implements IMiddleware {
  constructor(
    private readonly logger: ILoggingManager,
    private readonly minimum: MemberRole,
  ) {}

  async handle({ locals }: Http.IRequest): Promise<Http.IResponse> {
    const { traceId } = locals;

    const session = locals.session as AppSession["session"];

    const memberRole = session?.memberRole as MemberRole | null;

    if (!memberRole) {
      this.logger.warn({ traceId }, UNAUTHORIZED);
      return getHttpError(new UnauthorizedError(UNAUTHORIZED));
    }

    const hasAccess =
      ROLE_HIERARCHY[memberRole] >= ROLE_HIERARCHY[this.minimum];

    if (!hasAccess) {
      this.logger.warn({ traceId }, UNAUTHORIZED);
      return getHttpError(new UnauthorizedError(UNAUTHORIZED));
    }

    return ok({ role: "accepted" });
  }
}
