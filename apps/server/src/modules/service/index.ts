import { Elysia } from "elysia";

import { tenantPlugin } from "@/plugins/tenant";
import { ErrorModel, ValidationErrorModel } from "@/shared/model";

import { ServiceModel } from "./model";
import { ServiceService } from "./service";

/**
 * Cada macro liga suas dependências:
 *
 *   authAdmin → sessão ADMIN               → injeta `user`, `session`
 *   tenant    → authAdmin + org ativa      → injeta `organizationId`, `db`
 *   role      → authAdmin + papel mínimo
 *   access    → tenant + assinatura ok     → injeta `access`
 *   limit     → tenant + limite do plano
 *
 * Então `{ access: "WRITE" }` já autentica e entrega o `db`, sem precisar
 * escrever `authAdmin: true, tenant: true`.
 *
 * Os macros também documentam no OpenAPI os status que podem devolver
 * (401/402/404) e o cookie de sessão. Na rota, liste só o que é dela.
 */
export const serviceModule = new Elysia({ tags: ["Services"] })
  .use(tenantPlugin)
  .post("/service", ({ db, body }) => ServiceService.create(db, body), {
    role: "MANAGER",
    access: "WRITE",
    limit: "services",
    body: ServiceModel.createBody,
    response: {
      200: ServiceModel.serviceResponse,
      400: ValidationErrorModel,
      409: ErrorModel,
    },
    detail: { summary: "Cria um serviço" },
  })
  .put(
    "/service/:id",
    ({ db, params, body }) => ServiceService.update(db, params.id, body),
    {
      role: "MANAGER",
      access: "WRITE",
      params: ServiceModel.idParams,
      body: ServiceModel.updateBody,
      response: {
        200: ServiceModel.serviceResponse,
        400: ValidationErrorModel,
        404: ErrorModel,
      },
      detail: { summary: "Atualiza um serviço" },
    },
  )
  .get("/service-overview", ({ db }) => ServiceService.overview(db), {
    tenant: true,
    response: { 200: ServiceModel.overviewResponse },
    detail: { summary: "Resumo dos serviços da organização" },
  });
