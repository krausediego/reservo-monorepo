import { Elysia } from "elysia";

import { auth } from "@/infra/auth/auth";
import { createTenantDatabase, prisma } from "@/infra/database";
import type { TenantDatabase } from "@/infra/database";
import { logger } from "@/infra/logger";
import { ErrorModel } from "@/shared/model";

import { authPlugin } from "./auth";

const UNAUTHORIZED = "Unauthorized";
const ORGANIZATION_NOT_FOUND = "Organization not found";
const GRACE_DAYS = 15;

export type AccessMode = "READ" | "WRITE";

export type LimitKey = "professionals" | "services" | "members";

/** Estado de acesso entregue pelo macro `access`. */
export type Access = {
  state: "active" | "grace";
  graceEndsAt: Date | null;
  readOnly: boolean;
};

/** Contexto entregue pelo macro `tenant`. */
export type TenantContext = {
  organizationId: string;
  db: TenantDatabase;
};

const usageCounters: Record<
  LimitKey,
  (organizationId: string) => Promise<number>
> = {
  professionals: (organizationId) =>
    prisma.professionals.count({ where: { organizationId, isActive: true } }),
  services: (organizationId) =>
    prisma.services.count({ where: { organizationId, isActive: true } }),
  members: (organizationId) =>
    prisma.members.count({ where: { organizationId } }),
};

const getActiveLimits = async (organizationId: string, headers: Headers) => {
  const subscriptions = await auth.api.listActiveSubscriptions({
    query: { referenceId: organizationId, customerType: "organization" },
    headers,
  });

  const active = subscriptions.find(
    ({ status }) => status === "active" || status === "trialing",
  );

  return (active?.limits as Record<LimitKey, number> | undefined) ?? null;
};

/**
 * Macros de tenant (organização ativa) e de assinatura.
 *
 * - `tenant: true`        → exige organização ativa e injeta
 *   `organizationId` e `db` (Prisma com escopo de tenant + auditoria).
 * - `access: "READ"`      → antigo `enforceAccess`. Implica `tenant`.
 * - `limit: "services"`   → antigo `enforceLimit`. Implica `tenant`.
 */
export const tenantPlugin = new Elysia({ name: "tenant" })
  .use(authPlugin)
  .macro("tenant", {
    authAdmin: true,
    response: { 401: ErrorModel },
    resolve({ user, session, status }) {
      const organizationId = session.activeOrganizationId;

      if (!organizationId) {
        logger.warn(UNAUTHORIZED);
        return status(401, { message: UNAUTHORIZED });
      }

      return {
        organizationId,
        db: createTenantDatabase({ organizationId, userId: user.id }),
      };
    },
  })
  .macro("access", (mode: AccessMode) => ({
    tenant: true as const,
    response: { 402: ErrorModel, 404: ErrorModel },
    async resolve(context) {
      // Ver comentário em `plugins/auth.ts` sobre o cast.
      const { organizationId, status } = context as typeof context &
        TenantContext;

      const organization = await prisma.organizations.findUnique({
        select: { accessState: true, gracePausedAt: true },
        where: { id: organizationId },
      });

      if (!organization) {
        logger.warn(ORGANIZATION_NOT_FOUND);
        return status(404, { message: ORGANIZATION_NOT_FOUND });
      }

      if (organization.accessState === "ACTIVE") {
        const access: Access = {
          state: "active",
          graceEndsAt: null,
          readOnly: false,
        };
        return { access };
      }

      if (organization.accessState === "GRACE" && organization.gracePausedAt) {
        const graceEndsAt = new Date(organization.gracePausedAt);
        graceEndsAt.setDate(graceEndsAt.getDate() + GRACE_DAYS);

        if (new Date() < graceEndsAt) {
          if (mode === "READ") {
            const access: Access = {
              state: "grace",
              graceEndsAt,
              readOnly: true,
            };
            return { access };
          }

          logger.warn("Subscription was paused");
          return status(402, {
            message:
              "Sua assinatura está pausada, Adicione um método de pagamento para continuar",
          });
        }
      }

      logger.warn("Access expired");
      return status(402, {
        message: "Acesso expirado, Reative sua assinatura para continuar.",
      });
    },
  }))
  .macro("limit", (key: LimitKey) => ({
    tenant: true as const,
    response: { 401: ErrorModel, 402: ErrorModel },
    async beforeHandle(context) {
      // Ver comentário em `plugins/auth.ts` sobre o cast.
      const { organizationId, request, status } = context as typeof context &
        TenantContext;

      const limits = await getActiveLimits(organizationId, request.headers);

      if (!limits) {
        logger.warn({ organizationId }, "Without subscription active");
        return status(402, {
          message: "Nenhuma assinatura ativa. Escolha um plano para continuar.",
        });
      }

      const limit = limits[key];

      if (limit === -1) {
        return undefined;
      }

      const establishment = await prisma.establishments.findFirst({
        select: { id: true },
        where: { organizationId },
      });

      if (!establishment) {
        logger.warn(UNAUTHORIZED);
        return status(401, { message: UNAUTHORIZED });
      }

      const current = await usageCounters[key](organizationId);

      if (current >= limit) {
        logger.warn({ key, limit, current, upgrade: true }, "Limit reached");
        return status(402, {
          message: `Limite do plano atingido para ${key}`,
        });
      }

      return undefined;
    },
  }));
