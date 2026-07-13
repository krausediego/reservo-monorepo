import {
  auth,
  basePrisma,
  getHttpError,
  Http,
  ILoggingManager,
  noContent,
  ok,
  PaymentRequiredError,
  UnauthorizedError,
} from "@/infra";
import { IMiddleware } from "@/routes/middlewares";

import { LimitMiddleware } from ".";

const UNAUTHORIZED = "Unauthorized";

const usageCounters: Record<
  LimitMiddleware.LimitKey,
  (organizationId: string) => Promise<number>
> = {
  professionals: (organizationId) =>
    basePrisma.professionals.count({
      where: { organizationId, isActive: true },
    }),
  services: (organizationId) =>
    basePrisma.services.count({
      where: { organizationId, isActive: true },
    }),
  // products: (organizationId) => ,
  members: (organizationId) =>
    basePrisma.members.count({ where: { organizationId } }),
};

export class EnforceLimitMiddleware implements IMiddleware {
  constructor(
    private readonly logger: ILoggingManager,
    private readonly key: LimitMiddleware.LimitKey,
  ) {}

  async handle({ data, locals }: Http.IRequest): Promise<Http.IResponse> {
    const { traceId } = locals;

    try {
      const organizationId = locals.session.activeOrganizationId;

      if (!organizationId) {
        this.logger.warn({ traceId }, UNAUTHORIZED);
        return getHttpError(new UnauthorizedError(UNAUTHORIZED));
      }

      const limits = await this.getActiveLimits({
        organizationId,
        headers: data.headers,
      });

      if (!limits) {
        this.logger.warn(
          { traceId, organizationId },
          "Without subscription active",
        );
        return getHttpError(
          new PaymentRequiredError(
            "Nenhuma assinatura ativa. Escolha um plano para continuar.",
          ),
        );
      }

      const limit = limits[this.key];

      if (limit === -1) {
        return noContent();
      }

      const establishment = await basePrisma.establishments.findFirst({
        select: {
          id: true,
        },
        where: {
          organizationId,
        },
      });

      if (!establishment) {
        this.logger.warn({ traceId }, UNAUTHORIZED);
        return getHttpError(new UnauthorizedError(UNAUTHORIZED));
      }

      const current = await usageCounters[this.key](organizationId);

      if (current >= limit) {
        this.logger.warn(
          { traceId, key: this.key, limit, current, upgrade: true },
          "Limit reached",
        );
        return getHttpError(
          new PaymentRequiredError(`Limite do plano atingido para ${this.key}`),
        );
      }

      return ok({
        limitCheck: {
          key: this.key,
          limit,
          current,
          remaining: limit - current,
        },
      });
    } catch (error: any) {
      return getHttpError(error);
    }
  }

  private async getActiveLimits(
    params: LimitMiddleware.GetActiveLimitsParams,
  ): Promise<LimitMiddleware.GetActiveLimitsResponse> {
    const subscriptions = await auth.api.listActiveSubscriptions({
      query: {
        referenceId: params.organizationId,
        customerType: "organization",
      },
      headers: params.headers,
    });

    const active = subscriptions.find(
      ({ status }) => status === "active" || status === "trialing",
    );

    if (!active) {
      return null;
    }

    return active.limits as Record<LimitMiddleware.LimitKey, number>;
  }
}
