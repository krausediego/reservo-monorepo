import { openapi as elysiaOpenapi } from "@elysiajs/openapi";

import { auth } from "@/infra/auth/auth";
import { env } from "@/infra/config/env";

import { SESSION_SECURITY } from "./auth";

const AUTH_PREFIX = "/api/v1/auth";

type Documentation = NonNullable<
  NonNullable<Parameters<typeof elysiaOpenapi>[0]>["documentation"]
>;

type OperationLike = { tags?: string[] };

/**
 * Busca o OpenAPI que o plugin `openAPI()` do better-auth gera e ajusta para
 * aparecer junto das nossas rotas: prefixa os paths com `/api/v1/auth` e
 * agrupa as tags como "Auth / <tag>".
 */
const getAuthDocs = async () => {
  const { paths, components } = await auth.api.generateOpenAPISchema();

  const prefixedPaths = Object.fromEntries(
    Object.entries(paths).map(([path, item]) => {
      for (const operation of Object.values(item) as OperationLike[]) {
        operation.tags = (operation.tags ?? ["Default"]).map(
          (tag) => `Auth / ${tag}`,
        );
      }
      return [`${AUTH_PREFIX}${path}`, item];
    }),
  );

  return { paths: prefixedPaths, components };
};

const enabled = env.NODE_ENV !== "production";
const authDocs = enabled ? await getAuthDocs() : null;

const documentation = {
  info: {
    title: "Reservo API",
    version: "1.0.0",
    description:
      "Para testar rotas autenticadas, faça login em " +
      "`POST /api/v1/auth/sign-in/email`: o cookie de sessão é enviado " +
      "automaticamente nas próximas chamadas.",
  },
  tags: [
    { name: "Health", description: "Disponibilidade da API" },
    { name: "Services", description: "Serviços oferecidos pelo salão" },
  ],
  components: {
    ...authDocs?.components,
    securitySchemes: {
      ...authDocs?.components.securitySchemes,
      [SESSION_SECURITY]: {
        type: "apiKey",
        in: "cookie",
        name: "better-auth.session_token",
        description: "Cookie de sessão do better-auth",
      },
    },
  },
  paths: authDocs?.paths,
};

/**
 * Documentação OpenAPI gerada a partir dos schemas TypeBox das rotas.
 *
 * - UI (Scalar): `/openapi`
 * - JSON:        `/openapi/json`
 *
 * Desligado em produção.
 */
export const openapi = elysiaOpenapi({
  enabled,
  path: "/openapi",
  // Os tipos de OpenAPI do better-auth e do `openapi-types` (usado pelo
  // plugin do Elysia) divergem em detalhes; o conteúdo é o mesmo.
  documentation: documentation as Documentation,
  exclude: { paths: ["/"] },
});
