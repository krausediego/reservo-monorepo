import { Elysia } from "elysia";

import { MemberRole } from "@generated/prisma/enums";

import { auth } from "@/infra/auth/auth";
import { logger } from "@/infra/logger";
import { ErrorModel } from "@/shared/model";

const UNAUTHORIZED = "Unauthorized";
const UNAUTHORIZED_REDIRECT = "Redirect to client application";

type AuthSession = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;

/** Contexto entregue pelo macro `authAdmin`. */
export type AuthContext = {
  user: AuthSession["user"];
  session: AuthSession["session"];
};

const ROLE_HIERARCHY: Record<MemberRole, number> = {
  [MemberRole.OWNER]: 3,
  [MemberRole.MANAGER]: 2,
  [MemberRole.PROFESSIONAL]: 1,
};

/** Nome do security scheme do cookie de sessão no OpenAPI. */
export const SESSION_SECURITY = "sessionCookie";

/**
 * Macros de autenticação. As rotas do better-auth são montadas no `app.ts`.
 *
 * - `authAdmin: true`  → antigo `authAdmin`. Exige sessão de usuário ADMIN
 *   e injeta `user` e `session` no contexto.
 * - `role: "MANAGER"`  → antigo `validateRole`. Implica `authAdmin`.
 *
 * `response` e `detail` dos macros entram no OpenAPI de toda rota que usa o
 * macro (cadeado do cookie + resposta 401).
 */
export const authPlugin = new Elysia({ name: "auth" })
  .macro("authAdmin", {
    response: { 401: ErrorModel },
    detail: { security: [{ [SESSION_SECURITY]: [] }] },
    async resolve({ request: { headers }, status }) {
      const result = await auth.api.getSession({ headers });

      if (!result) {
        logger.warn(UNAUTHORIZED);
        return status(401, { message: UNAUTHORIZED });
      }

      if (result.user.role !== "ADMIN") {
        logger.warn(UNAUTHORIZED_REDIRECT);
        return status(401, { message: UNAUTHORIZED_REDIRECT, code: 555 });
      }

      return { user: result.user, session: result.session };
    },
  })
  .macro("role", (minimum: MemberRole) => ({
    // `as const` é necessário para o Elysia propagar o contexto do
    // `authAdmin` (user/session) até o handler da rota.
    authAdmin: true as const,
    detail: { description: `Requer papel ${minimum} ou superior.` },
    beforeHandle(context) {
      // Macros com parâmetro não herdam a tipagem dos macros dos quais
      // dependem (limitação do Elysia 1.4). Em runtime o `authAdmin` já
      // rodou aqui, então o cast é seguro.
      const { session, status } = context as typeof context & AuthContext;
      const memberRole = session.memberRole as MemberRole | null;

      if (!memberRole || ROLE_HIERARCHY[memberRole] < ROLE_HIERARCHY[minimum]) {
        logger.warn({ memberRole, minimum }, UNAUTHORIZED);
        return status(401, { message: UNAUTHORIZED });
      }

      return undefined;
    },
  }));
