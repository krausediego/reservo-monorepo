import {
  basePrisma,
  getHttpError,
  Http,
  ILoggingManager,
  NotFoundError,
  ok,
  PaymentRequiredError,
  UnauthorizedError,
} from "@/infra";
import { IMiddleware } from "@/routes/middlewares";

const UNAUTHORIZED = "Unauthorized";
const ORGANIZATION_NOT_FOUND = "Organization not found";

const GRACE_DAYS = 15;

export class EnforceAccessMiddleware implements IMiddleware {
  constructor(
    private readonly logger: ILoggingManager,
    private readonly mode: "READ" | "WRITE",
  ) {}

  async handle({ locals }: Http.IRequest): Promise<Http.IResponse> {
    const { traceId } = locals;

    try {
      const organizationId = locals.session.activeOrganizationId;

      if (!organizationId) {
        this.logger.warn({ traceId }, UNAUTHORIZED);
        return getHttpError(new UnauthorizedError(UNAUTHORIZED));
      }

      const organization = await basePrisma.organizations.findUnique({
        select: {
          accessState: true,
          gracePausedAt: true,
        },
        where: {
          id: organizationId,
        },
      });

      if (!organization) {
        this.logger.warn({ traceId }, ORGANIZATION_NOT_FOUND);
        return getHttpError(new NotFoundError(ORGANIZATION_NOT_FOUND));
      }

      if (organization.accessState === "ACTIVE") {
        return ok({
          access: {
            state: "active",
            graceEndsAt: null,
            readOnly: false,
          },
        });
      }

      if (organization.accessState === "GRACE" && organization.gracePausedAt) {
        const graceEndsAt = new Date(organization.gracePausedAt);
        graceEndsAt.setDate(graceEndsAt.getDate() + GRACE_DAYS);
        const withinGrace = new Date() < graceEndsAt;

        if (withinGrace) {
          if (this.mode === "READ") {
            return ok({
              access: {
                state: "grace",
                graceEndsAt,
                readOnly: true,
              },
            });
          }

          this.logger.warn({ traceId }, "Subscription was paused");
          return getHttpError(
            new PaymentRequiredError(
              "Sua assinatura está pausada, Adicione um método de pagamento para continuar",
            ),
          );
        }
      }

      this.logger.warn({ traceId }, "Access expired");
      return getHttpError(
        new PaymentRequiredError(
          "Acesso expirado, Reative sua assinatura para continuar.",
        ),
      );
    } catch (error: any) {
      this.logger.warn({ traceId }, error.message);
      return getHttpError(error);
    }
  }
}
