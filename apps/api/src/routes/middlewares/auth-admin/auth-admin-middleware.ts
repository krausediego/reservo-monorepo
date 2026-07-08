import {
  auth,
  getHttpError,
  Http,
  ILoggingManager,
  ok,
  UnauthorizedError,
} from "@/infra";
import { IMiddleware } from "@/routes/middlewares";

const UNAUTHORIZED_REDIRECT = "Redirect to client application";
const UNAUTHORIZED = "Unauthorized";

export class AuthAdminMiddleware implements IMiddleware {
  constructor(private readonly logger: ILoggingManager) {}

  async handle({ data, locals }: Http.IRequest): Promise<Http.IResponse> {
    const { traceId } = locals;

    const session = await auth.api.getSession({
      headers: data.headers,
    });

    if (!session) {
      this.logger.warn({ traceId }, UNAUTHORIZED);
      return getHttpError(new UnauthorizedError(UNAUTHORIZED));
    }

    if (session.user.role !== "ADMIN") {
      this.logger.warn({ traceId }, UNAUTHORIZED_REDIRECT);
      return getHttpError(new UnauthorizedError(UNAUTHORIZED_REDIRECT, 555));
    }

    return ok({ ...session });
  }
}
