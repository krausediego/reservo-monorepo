# @reservo/server

Nova API do Reservo em **Bun + Elysia**. Substitui aos poucos o `apps/api`
(Express + Node). Por enquanto tem a rota `GET /api/v1/health-check`, o módulo
de exemplo `service` (ver [Como migrar uma rota](#como-migrar-uma-rota)) e a
infraestrutura que as próximas rotas vão usar: auth, macros, banco com tenant e
auditoria, validação com TypeBox, OpenAPI, OpenTelemetry e tratamento de erros.

## Stack

| Camada      | Antes (`apps/api`)                      | Agora (`apps/server`)                             |
| ----------- | --------------------------------------- | ------------------------------------------------- |
| Runtime     | Node + `tsx`                            | Bun (roda TypeScript direto)                      |
| HTTP        | Express 5                               | Elysia 1.4                                        |
| Validação   | middleware `validateRequest` + Zod      | schema nativo da rota com TypeBox (`t` do Elysia) |
| Middlewares | classes + factories + `adaptMiddleware` | macros do Elysia                                  |
| Rotas       | `globSync` em `routes/v*`               | import direto no `app.ts`                         |
| Upload      | `multer` + `normalizeFiles`             | multipart nativo do Elysia + `t.File()`           |
| Env         | `dotenv` + `env-var`                    | Bun carrega o `.env` + validação com TypeBox      |
| Docs        | —                                       | OpenAPI gerado dos schemas (`@elysiajs/openapi`)  |
| Trace       | `traceId` aleatório repassado à mão     | OpenTelemetry, com `traceId` em todo log          |
| Banco       | `BaseDatabaseService` + decorators      | `createTenantDatabase()` + macro `tenant`         |

## Rodando localmente

Pré-requisitos: [Bun](https://bun.sh) ≥ 1.2, pnpm e Docker.

```bash
# na raiz do monorepo (o pnpm continua sendo o gerenciador de pacotes)
pnpm install

cd apps/server
cp .env.example .env          # preencha STRIPE_* e o BETTER_AUTH_SECRET
bun run docker:up             # postgres (5433) + jaeger (16686)
bun run prisma:generate
bun run prisma:migrate:deploy
bun run dev                   # http://localhost:3333
```

- Health check: `curl localhost:3333/api/v1/health-check`
- Documentação (Scalar): <http://localhost:3333/openapi> (JSON em `/openapi/json`)
- Traces: <http://localhost:16686> (service `reservo-server`)

> **Convivência com o `apps/api`.** O server sobe na porta **3333** para não
> conflitar com a API antiga (3000). O Postgres do `docker-compose.yml` usa a
> mesma porta 5433 da API. Se o container `postgres` do `apps/api` já estiver
> rodando, suba só o Jaeger (`docker compose up -d jaeger`) e aponte o
> `DATABASE_URL` para o banco existente. Os dois apps podem usar o mesmo banco
> e o mesmo `BETTER_AUTH_SECRET`: a sessão do better-auth vale para os dois.

### Scripts

| Script                          | O que faz                                               |
| ------------------------------- | ------------------------------------------------------- |
| `bun run dev`                   | `bun --watch` + `pino-pretty`                           |
| `bun run start`                 | sobe em modo produção                                   |
| `bun run check`                 | `typecheck` + `lint` + `format` (o que o CI deve rodar) |
| `bun run fix`                   | `lint:fix` + `format:fix`                               |
| `bun run typecheck`             | `tsc --noEmit` (alias `check-types`, usado pelo turbo)  |
| `bun run lint` / `lint:fix`     | ESLint (flat config, typescript-eslint)                 |
| `bun run format` / `format:fix` | Prettier                                                |
| `bun run prisma:generate`       | gera o client em `generated/prisma`                     |
| `bun run prisma:migrate`        | `prisma migrate dev`                                    |
| `bun run prisma:migrate:deploy` | `prisma migrate deploy`                                 |
| `bun run prisma:studio`         | Prisma Studio                                           |
| `bun run docker:up` / `down`    | sobe/derruba postgres + jaeger                          |

Os scripts do Prisma usam `bun --env-file=.env --bun prisma ...`. O shim do
pnpm em `node_modules/.bin` chama `node`, que não carrega o `.env`
sozinho, então o arquivo é passado explicitamente.

### Variáveis de ambiente

Todas são validadas com TypeBox em `src/infra/config/env.ts`. Se faltar alguma, o
processo sai com uma mensagem que diz qual.

| Variável                      | Padrão                  | Observação                                                              |
| ----------------------------- | ----------------------- | ----------------------------------------------------------------------- |
| `PORT`                        | `3333`                  |                                                                         |
| `NODE_ENV`                    | `development`           | em `production` o OpenAPI é desligado                                   |
| `LOG_LEVEL`                   | `debug`                 |                                                                         |
| `DATABASE_URL`                | —                       |                                                                         |
| `BETTER_AUTH_SECRET`          | —                       | mínimo 32 caracteres                                                    |
| `BETTER_AUTH_URL`             | —                       | era `baseURL` fixo no código                                            |
| `CORS_ORIGIN`                 | `http://localhost:5173` | lista separada por vírgula; também vira `trustedOrigins` do better-auth |
| `STRIPE_SECRET_KEY`           | —                       |                                                                         |
| `STRIPE_WEBHOOK_SECRET`       | —                       |                                                                         |
| `OTEL_SERVICE_NAME`           | `reservo-server`        |                                                                         |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | `http://localhost:4318` | lida direto pelo SDK do OpenTelemetry                                   |
| `OTEL_SDK_DISABLED`           | `false`                 | `true` desliga o tracing                                                |

As variáveis `R2_*` não existem aqui porque o storage ainda não foi migrado.

## Estrutura

```
apps/server
├── docker-compose.yml        # postgres + jaeger
├── prisma/                   # schema + migrations (copiados do apps/api)
├── generated/prisma/         # client gerado (gitignored)
└── src/
    ├── index.ts              # entrypoint: listen + graceful shutdown
    ├── app.ts                # monta o app: plugins globais + rotas (imports diretos)
    ├── infra/                # código sem dependência do Elysia
    │   ├── config/env.ts     # env validado com TypeBox
    │   ├── auth/             # better-auth (+ plugin do Stripe)
    │   ├── database/
    │   │   ├── prisma.ts     # client "cru" (antigo basePrisma)
    │   │   ├── tenant.ts     # createTenantDatabase(): tenant + auditoria
    │   │   └── types.ts      # TenantDatabase e afins
    │   ├── http-errors.ts    # HttpError, BadRequestError, NotFoundError...
    │   └── logger.ts         # pino com traceId/spanId do OpenTelemetry
    ├── plugins/              # plugins Elysia
    │   ├── telemetry.ts      # OpenTelemetry (SDK + @elysiajs/opentelemetry)
    │   ├── request-logger.ts # antigo middleware `trace`
    │   ├── error-handler.ts  # onError global
    │   ├── openapi.ts        # documentação (rotas + better-auth)
    │   ├── auth.ts           # macros `authAdmin` e `role`
    │   └── tenant.ts         # macros `tenant`, `access` e `limit`
    ├── shared/
    │   └── model.ts          # ErrorModel, ValidationErrorModel, Id()
    └── modules/
        ├── health-check/
        └── service/
            ├── index.ts      # "controller": instância Elysia com as rotas
            ├── service.ts    # regra de negócio, sem dependência do Elysia
            └── model.ts      # schemas TypeBox (body, params, response)
```

A organização segue o
[guia de boas práticas do Elysia](https://elysiajs.com/essential/best-practice).
Cada **feature** é uma pasta em `modules/` com três arquivos:

- **`index.ts` (controller)** é uma instância do Elysia. Não use classe:
  o tipo das rotas sai do encadeamento de métodos, e uma classe quebraria
  isso.
- **`service.ts`** guarda a regra de negócio, como `abstract class` com métodos
  `static`. Recebe só o que precisa (`db`, dados validados) e não conhece o
  `Context` do Elysia.
- **`model.ts`** fica com os schemas TypeBox da rota: `body`, `query`,
  `params` e `response`. Eles validam a request, limpam a resposta, geram os
  tipos e alimentam o OpenAPI.

Não há factories nem interfaces `IController`/`IService`. Os adapters
`adaptRoute`/`adaptMiddleware` também saíram: o handler devolve o objeto
direto e o Elysia infere o tipo da resposta.

### Ciclo de vida de uma request

```
telemetry (span raiz) → cors → request-logger → validação → [macros da rota] → handler
                                                                        ↘ error-handler (onError)
```

1. `telemetry` abre o span `METHOD /rota`. A partir daí `trace.getActiveSpan()`
   funciona em qualquer camada.
2. `cors` responde o preflight (`OPTIONS`) antes do roteamento.
3. `request-logger` loga `METHOD /path`. O `traceId` vem do span, não de um
   UUID gerado no middleware.
4. Elysia valida `body`/`query`/`params` com os schemas TypeBox.
5. Os macros da rota rodam em ordem de dependência
   (`authAdmin → tenant → access/limit`).
6. O handler roda e o retorno vira a resposta.

> **Diferença para o Express:** no Elysia o `resolve` dos macros roda **depois**
> da validação. Uma request sem sessão e com body inválido recebe `400`, e não
> `401` como na API antiga. Com body válido, o `401` continua igual.

## Macros (antigos middlewares)

Os macros ficam em `plugins/auth.ts` e `plugins/tenant.ts`. Um macro é uma
opção da rota; quando ela vale `true` (ou recebe um parâmetro), os hooks do
macro rodam e o que ele retorna em `resolve` entra no contexto do handler **com
tipo**.

| Middleware antigo                    | Macro                                | Implica     | Injeta no contexto              |
| ------------------------------------ | ------------------------------------ | ----------- | ------------------------------- |
| `trace`                              | plugin `requestLogger`               | —           | (traceId no logger)             |
| `authAdmin`                          | `authAdmin: true`                    | —           | `user`, `session`               |
| `validateRole("MANAGER")`            | `role: "MANAGER"`                    | `authAdmin` | —                               |
| (era feito no controller)            | `tenant: true`                       | `authAdmin` | `organizationId`, `db`          |
| `enforceAccess("WRITE")`             | `access: "WRITE"`                    | `tenant`    | `access`                        |
| `enforceLimit("services")`           | `limit: "services"`                  | `tenant`    | —                               |
| `validateRequest(schema)`            | `body`/`query`/`params` da rota      | —           | `body`/`query`/`params` tipados |
| `upload` (multer) + `normalizeFiles` | `body: t.Object({ logo: t.File() })` | —           | `File` web padrão               |

Como um macro já liga suas dependências, `{ access: "WRITE" }` sozinho já
autentica, resolve o tenant e checa a assinatura. Pode combinar à vontade:
`{ role: "MANAGER", access: "WRITE", limit: "services" }`.

Para usar os macros num módulo, registre o plugin no próprio controller:
`.use(tenantPlugin)`, ou `.use(authPlugin)` se só precisar de `authAdmin`/`role`.
Os plugins têm `name`, então o Elysia registra cada um uma vez só.

As respostas de erro dos macros continuam iguais às da API antiga (inclusive o
`401` com `code: 555` para usuário não ADMIN).

### Criando um macro novo

```ts
export const meuPlugin = new Elysia({ name: "meu-plugin" })
  .use(tenantPlugin)
  // sem parâmetro: forma de objeto, o contexto das dependências já vem tipado
  .macro("establishment", {
    tenant: true,
    response: { 404: ErrorModel },
    async resolve({ organizationId, status }) {
      // Establishments está no SKIP_TENANT: filtre o organizationId na mão
      const establishment = await prisma.establishments.findFirst({
        where: { organizationId },
      });
      if (!establishment) {
        return status(404, { message: "Establishment not found" });
      }
      return { establishment };
    },
  })
  // com parâmetro: forma de função
  .macro("feature", (flag: string) => ({
    tenant: true as const, // `as const` para propagar o contexto até o handler
    response: { 403: ErrorModel },
    async beforeHandle(context) {
      // Macros com parâmetro não recebem o contexto das dependências tipado
      // (limitação do Elysia 1.4), daí o cast. Em runtime ele existe.
      const { organizationId, status } = context as typeof context &
        TenantContext;

      if (!(await isFeatureEnabled(organizationId, flag))) {
        return status(403, { message: "Feature indisponível" });
      }
    },
  }));
```

- Use `resolve` quando o macro injeta algo no contexto. Use `beforeHandle`
  quando ele só valida.
- Declare no macro o `response` dos status que ele devolve
  (`response: { 404: ErrorModel }`) e, se exigir sessão,
  `detail: { security: [...] }`. Os dois são mesclados em toda rota que usa o
  macro, então o OpenAPI de cada rota já sai com esses status e o cadeado.
- Para interromper a request, **retorne** `status(código, corpo)`. Assim o
  status entra no tipo da rota, o que um `throw` não faz.

## Como migrar uma rota

O módulo `src/modules/service/` é um exemplo real já migrado. Ele usa os
macros de auth e tenant e o `db` com `organizationId` e `AuditLogs`
automáticos:

| Rota                    | Macros                                                    | O que mostra                                                            |
| ----------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------- |
| `POST /service`         | `role: "MANAGER"`, `access: "WRITE"`, `limit: "services"` | `create` sem `organizationId` no `data`, transação, AuditLog `create`   |
| `PUT /service/:id`      | `role: "MANAGER"`, `access: "WRITE"`                      | `where` filtrado pelo tenant (id de outra org → 404), AuditLog com diff |
| `GET /service-overview` | `tenant: true`                                            | leitura agregada (`groupBy`) só da organização da sessão                |

### Antes (7 arquivos por rota)

```
routes/v1/service.ts
modules/service/create-service/
  ├── create-service-controller.factory.ts
  ├── create-service-service.factory.ts
  ├── create-service.controller.ts
  ├── create-service.interface.ts
  ├── create-service.service.ts
  └── index.ts
```

```ts
// routes/v1/service.ts
router.post(
  "/service",
  authAdmin,
  validateRole("MANAGER"),
  enforceAccess("WRITE"),
  enforceLimit("services"),
  validateRequest(createServiceSchema),
  adaptRoute(makeCreateServiceController()),
);

// create-service.service.ts
export class CreateServiceService extends BaseDatabaseService implements ICreateService {
  @setTraceId
  @setDatabaseContext
  async run(params: CreateService.Params) {
    this.log("info", "Starting process create-service");
    const professionals = await this.db.professionals.findMany({ ... });
    ...
  }
}
```

### Depois (3 arquivos por módulo)

```ts
// src/modules/service/model.ts — schemas TypeBox
export const ServiceModel = {
  createBody: t.Object({
    name: t.String({ minLength: 4, maxLength: 256, error: "O nome deve conter entre 4 e 256 caracteres" }),
    professionals: t.Array(Id("O profissional é obrigatório"), { minItems: 1, error: "..." }),
    ...
  }),
  serviceResponse: t.Object({ service }),
};

export type CreateServiceBody = typeof ServiceModel.createBody.static;
```

```ts
// src/modules/service/index.ts — "controller"
export const serviceModule = new Elysia({ tags: ["Services"] })
  .use(tenantPlugin) // registra os macros authAdmin/role/tenant/access/limit
  .post("/service", ({ db, body }) => ServiceService.create(db, body), {
    role: "MANAGER",
    access: "WRITE",
    limit: "services",
    body: ServiceModel.createBody,
    response: {
      200: ServiceModel.serviceResponse,
      400: ValidationErrorModel,
      409: ErrorModel, // 401/402 já vêm dos macros
    },
    detail: { summary: "Cria um serviço" },
  })
  .get("/service-overview", ({ db }) => ServiceService.overview(db), {
    tenant: true,
    response: { 200: ServiceModel.overviewResponse },
  });
```

```ts
// src/modules/service/service.ts — regra de negócio
export abstract class ServiceService {
  static async create(db: TenantDatabase, body: CreateServiceBody) {
    // where recebe organizationId → profissional de outra org não é achado
    const professionals = await db.professionals.findMany({ ... });

    return db.$transaction(async (tx) => {
      // sem organizationId no data: é injetado + grava AuditLogs
      const created = await tx.services.create({ data: { name: body.name, ... } });
      ...
    });
  }
}
```

```ts
// src/app.ts — import direto, sem glob
  .group("/api/v1", (v1) =>
    v1
      .all("/auth/*", ...)
      .use(healthCheck)
      .use(serviceModule),
  );
```

### O que o handler recebe

O tipo de cada propriedade do contexto vem dos macros ligados na rota:

| Na rota                 | Disponível no handler                                |
| ----------------------- | ---------------------------------------------------- |
| `authAdmin: true`       | `user`, `session`                                    |
| `role: "MANAGER"`       | `user`, `session`                                    |
| `tenant: true`          | `user`, `session`, `organizationId`, `db`            |
| `access: "READ"`        | `user`, `session`, `organizationId`, `db`, `access`  |
| `limit: "services"`     | `user`, `session`, `organizationId`, `db`            |
| `body`/`query`/`params` | `body`/`query`/`params` já validados e transformados |

Usar `db` numa rota sem `tenant`/`access`/`limit` é erro de compilação.

### O que acontece no banco

Resultado de um teste com as rotas acima, com duas organizações (A, da sessão,
e B). O body do `POST` não tem `organizationId`:

```
POST /service                         → 200  service.organizationId = <org A>
POST /service (profissional da org B) → 409  "Um ou mais profissionais informados não existem"
PUT  /service/:id                     → 200
PUT  /service/<id da org B>           → 404  "Serviço não encontrado"
GET  /service-overview                → 200  totalServices: 1  (o serviço da org B não entra)
GET  /service-overview (sem sessão)   → 401
```

`AuditLogs` gravados automaticamente, todos com o `userId` da sessão e o
`organizationId` da org A:

```
Services              create  changes: { after: { ...registro criado } }
ProfessionalServices  create  changes: { after: { ...registro criado } }
Services              update  changes: {
                                name:       { before: "Corte degradê", after: "Corte degradê navalhado" },
                                priceCents: { before: 5000, after: 6500 },
                                isActive:   { before: true, after: false } }
```

Para ver os logs no seu banco: `bun run prisma:studio` → tabela `audit_logs`.

### Checklist

1. **Rota**: o array de middlewares vira opções da rota (tabela de macros
   acima). Registre o módulo no `app.ts` com import direto.
2. **Validação**: reescreva o schema zod de `@reservo/schemas` em TypeBox no
   `model.ts` do módulo e use em `body`/`query`/`params`. Veja
   [Validação com TypeBox](#validação-com-typebox).
   - Coerção de query (`?page=2` → `2`), `default` e `t.Transform` já chegam
     aplicados no handler. O `listServicesSchema.parse({ query: data })` que
     alguns controllers faziam não é mais necessário.
   - Declare também o `response`: ele vira o tipo da resposta, remove campos
     que não estão no schema e documenta a rota no OpenAPI.
3. **Controller**: some. O handler chama o service e retorna o resultado.
   - `ok(data)` → `return data` (200)
   - `created(data)` → `return status(201, data)`
   - `noContent()` → `return status(204)`
   - `getHttpError(error)` → `throw new XxxError(...)` de `@/infra/http-errors`.
     O `error-handler` devolve `{ message, code }` como antes.
4. **Factories e interfaces** (`make*`, `I*`, `namespace X { Params; Response }`):
   apague. O tipo dos params vem do schema (`typeof Model.x.static`) e o da
   resposta é inferido do retorno.
5. **Service**: troque a classe com `BaseDatabaseService` por
   `abstract class` com métodos `static`. Receba `db` por parâmetro.
6. **Decorators** `@setTraceId` e `@setDatabaseContext`: remova. Não passe mais
   `traceId`, `organizationId` nem `userId` dentro do `params`: o `db` já sabe
   o tenant e o logger já sabe o trace.
7. **Log**: `this.log("info", msg, obj)` → `logger.info(obj, msg)` (pino:
   objeto primeiro, mensagem depois).
8. **`locals`**: `locals.user`, `locals.session` e
   `locals.session.activeOrganizationId` viram `user`, `session` e
   `organizationId` no contexto do handler.
9. **Upload**: tire o `upload.single(...)` e o `normalizeFiles()`. O Elysia faz
   o parse de `multipart/form-data` sozinho; valide com
   `t.File({ type: ["image/jpeg", "image/png", "image/webp"], maxSize: "10m" })`.
   O `type` confere o conteúdo real do arquivo (não só a extensão) e o valor
   já é um `File` web.
10. **Helpers**: não foram migrados. Traga só os que a rota usa, para
    `src/shared/` (ou para dentro do módulo, se só ele usa), sem barrel
    `index.ts` global.
11. **Docs**: dê `tags` ao módulo (`new Elysia({ tags: ["Services"] })`) e um
    `detail.summary` a cada rota. Confira em `/openapi`.
12. **Bruno**: troque a porta para `3333` nas requests da rota migrada.

## Validação com TypeBox

O server não usa zod: todos os schemas são TypeBox, via o `t` do Elysia
(`import { t } from "elysia"`). Fora do Elysia (ex.: `infra/config/env.ts`)
use o `Type` do `@sinclair/typebox`, que é o mesmo TypeBox sem as extensões
HTTP.

O `@reservo/schemas` (zod) continua existindo para o `apps/web`. Ao migrar uma
rota, o schema é reescrito em TypeBox no `model.ts` do módulo; mantenha as
mensagens iguais às do front.

| zod                                  | TypeBox                                                   |
| ------------------------------------ | --------------------------------------------------------- |
| `z.object({ ... })`                  | `t.Object({ ... })`                                       |
| `z.string().min(4).max(256)`         | `t.String({ minLength: 4, maxLength: 256 })`              |
| `z.number().int().positive().max(n)` | `t.Integer({ minimum: 1, maximum: n })`                   |
| `z.boolean().optional()`             | `t.Optional(t.Boolean())`                                 |
| `z.array(x).min(1)`                  | `t.Array(x, { minItems: 1 })`                             |
| `z.enum(["A", "B"])`                 | `t.Union([t.Literal("A"), t.Literal("B")])`               |
| `z.cuid2()`                          | `Id("mensagem")` (`@/shared/model`)                       |
| `.transform(fn)`                     | `t.Transform(schema).Decode(fn).Encode((v) => v)`         |
| `z.coerce.number()` (query)          | `t.Integer()` / `t.Number()` (o Elysia converte na query) |
| `z.file().mime([...])`               | `t.File({ type: [...], maxSize: "10m" })`                 |
| `{ error: "..." }` em cada regra     | `{ error: "..." }` no campo                               |
| `z.infer<typeof schema>`             | `typeof schema.static`                                    |

**Mensagens de erro.** No TypeBox a mensagem é por **campo**, não por regra:
o `error` do campo é usado quando ele falha por qualquer motivo (ausente, tipo
errado ou fora dos limites). Por isso as mensagens juntam as regras, ex.:
`"O nome deve conter entre 4 e 256 caracteres"`. Campo sem `error` cai na
mensagem padrão do TypeBox (em inglês).

```json
// POST /api/v1/service com body inválido → 400
{
  "message": "O nome deve conter entre 4 e 256 caracteres",
  "issues": [
    {
      "path": "name",
      "message": "O nome deve conter entre 4 e 256 caracteres"
    },
    { "path": "professionals.0", "message": "O profissional é obrigatório" }
  ]
}
```

> `t.Integer` do Elysia também aceita string numérica (`"40"`), por isso o
> OpenAPI mostra `integer | string`. É o que permite a coerção na query.

## OpenAPI

`src/plugins/openapi.ts` registra o `@elysiajs/openapi`:

- **UI** (Scalar): <http://localhost:3333/openapi>
- **JSON**: <http://localhost:3333/openapi/json>
- Desligado quando `NODE_ENV=production`.

O que entra no documento:

- **Nossas rotas**, geradas dos schemas TypeBox: `body`, `params`, `query` e
  `response` de cada status, com as restrições (`minLength`, `maximum`...) e
  as `description`/`examples` dos campos.
- **Tags e resumo**: `tags` vem da instância do módulo
  (`new Elysia({ tags: ["Services"] })`) e `detail.summary` de cada rota.
- **Status dos macros**: `authAdmin` adiciona `401` e o cadeado do cookie de
  sessão; `access` adiciona `402`/`404`; `limit`, `401`/`402`; `role` adiciona
  a descrição do papel mínimo. Na rota, declare só os status que ela mesma
  devolve (ex.: `409` do `ConflictError`).
- **Rotas do better-auth** (`/api/v1/auth/*`), vindas do
  `auth.api.generateOpenAPISchema()` e agrupadas em `Auth / ...`.

Para testar uma rota autenticada pela UI: chame
`POST /api/v1/auth/sign-in/email`. O cookie de sessão fica no navegador e vai
nas próximas chamadas.

Para esconder uma rota da documentação: `detail: { hide: true }`.

## O que mudou no uso do banco

### Clients

| Antes                                              | Agora                                              |
| -------------------------------------------------- | -------------------------------------------------- |
| `basePrisma`                                       | `prisma` (`@/infra/database`)                      |
| `makeDatabase()` + `this.db` (getter)              | `db` no contexto da rota (macro `tenant`)          |
| `PrismaService.create({ organizationId, userId })` | `createTenantDatabase({ organizationId, userId })` |
| `Database.Response`                                | `TenantDatabase`                                   |
| `import ... from "generated/prisma/client"`        | `import ... from "@generated/prisma/client"`       |

- **`prisma`** é o client cru, sem filtro de tenant e sem auditoria. Use para
  dados globais (users, organizations, members, sessions), no better-auth e nos
  macros, que rodam antes do tenant existir.
- **`db`** é o client com escopo de tenant. As regras são as mesmas de antes:
  - `organizationId` é injetado em todo `where`/`data` (exceto nos models de
    `SKIP_TENANT`: `Users`, `Organizations`, `Establishments`, `Members`,
    `Invitations`, `Sessions`, `ServiceCategories`, `AuditLogs`);
  - toda escrita gera um registro em `AuditLogs` com o `userId` da sessão
    (exceto nos models de `SKIP_AUDIT`), com diff de `before`/`after` nos
    updates e soft delete (`deletedAt`) contado como `delete`;
  - funciona dentro de `db.$transaction(async (tx) => ...)`;
  - os campos `organizationId`, `createdBy`, `updatedBy` e `deletedBy` ficam
    opcionais nos `data` (tipo `TenantDatabase`).

### Contexto explícito, sem decorators

Antes, o contexto do tenant chegava por **estado mutável na instância**:

```ts
// antes
@setTraceId          // copiava params.traceId para this.traceId
@setDatabaseContext  // copiava params.organizationId/userId para this.*
async run(params) {
  await this.db.services.findMany(); // getter: chamava $extends a cada acesso
}
```

Isso dependia de uma instância nova por request (as factories) e não tinha
tipo: esquecer o decorator compilava e quebrava em runtime.

Agora o macro `tenant` cria o client **uma vez por request** com o
`organizationId` e o `userId` da sessão, e entrega `db` no contexto. O service
recebe `db` por parâmetro. Uma rota sem `tenant`/`access`/`limit` não tem `db`
no contexto, e isso é erro de compilação, não de runtime.

Fora de uma request (scripts, jobs), crie o client na mão:

```ts
const db = createTenantDatabase({ organizationId, userId });
```

### Prisma no Bun

- O generator usa `runtime = "bun"` e `moduleFormat = "esm"`
  (`prisma/schema.prisma`).
- O schema e as migrations foram **copiados** do `apps/api`. Os dois apps usam
  o mesmo banco, então até o `apps/api` ser removido mantenha
  `prisma/schema.prisma` e `prisma/migrations/` iguais nos dois: crie a
  migration em um, copie a pasta para o outro, e rode `migrate deploy` a
  partir de um lugar só.
- As queries aparecem como spans no Jaeger (`prisma:client:operation`,
  `prisma:client:db_query`...) via `@prisma/instrumentation`.

## Observabilidade

- `src/plugins/telemetry.ts` inicia o `NodeSDK` do OpenTelemetry com exporter
  OTLP (protobuf) e registra o `@elysiajs/opentelemetry`. Cada request gera um
  span raiz com filhos por etapa do lifecycle (`Request`, `BeforeHandle`,
  `Handle`...), mais os spans do Prisma e do better-auth.
- Traces propagados (`traceparent`) são respeitados: o span da request vira
  filho do span de quem chamou.
- O logger (`src/infra/logger.ts`) inclui `traceId`/`spanId` do span ativo em
  **todo** log, então dá para ir do log ao trace no Jaeger.
- No shutdown, `otelSdk.shutdown()` envia os spans que ainda estão no buffer.
- Para criar spans próprios num trecho de código:

```ts
import { record } from "@elysiajs/opentelemetry";

const result = await record("calcular-comissao", async () => calcular());
```

- Em produção, aponte `OTEL_EXPORTER_OTLP_ENDPOINT` para o collector
  (Cloud Trace, Grafana Tempo, etc.).

## Erros

- Para erros de domínio, lance as classes de `@/infra/http-errors`
  (`BadRequestError`, `NotFoundError`, `ConflictError`, `PaymentRequiredError`...).
  Elas têm `toResponse()` e devolvem `{ message, code }` com o status certo.
- Em handlers e macros, `return status(404, { message })` também funciona e
  entra no tipo da rota (útil para o Eden).
- Erros inesperados viram `500 { message: "Internal Server Error" }` e são
  logados com stack.
- **Mudança de contrato na validação**: antes, um body inválido devolvia
  `400 { message: <array de issues do zod> }`. Agora devolve
  `400 { message: "<primeira mensagem>", issues: [{ path, message }] }`. O
  `error.response.data.message` do front passa a ser uma string legível.
  Arquivo com tipo inválido (`t.File`) segue o mesmo formato.
- Resposta que não bate com o `response` declarado é bug do server: vira
  `500` e é logada, em vez de devolver `400` ao cliente.
- Rota inexistente: `404 { message: "Not Found" }`.
- O mapeamento de severity do logger foi corrigido: `error` agora sai como
  `ERROR` (antes saía `FATAL`, que não é uma severity válida do Cloud Logging).

## Tipagem ponta a ponta

`src/app.ts` exporta `type App = typeof app`. Com isso o front pode usar o
[Eden Treaty](https://elysiajs.com/eden/treaty/overview) e ter request e
response tipados sem gerar código (`treaty<App>("localhost:3333")`).

Isso ainda não foi configurado. Antes, resolva um conflito: o `apps/web` e o
server usam o mesmo alias `@/*` para pastas diferentes. Quando o TypeScript do
web abrir os tipos do server, os imports `@/infra/...` vão apontar para o
`src` do web. Uma saída é dar um alias próprio ao server (ex.: `@server/*`).

Para a inferência continuar funcionando:

- encadeie os métodos (`new Elysia().use().get()...`) em vez de chamar
  `app.get()` em linhas separadas;
- não use classe como controller;
- retorne os dados no handler (sem `res.json`) e use `status()` para os demais
  códigos.

## Ficou de fora (por enquanto)

- Helpers e o resto dos módulos de negócio. Do `service`, só `POST /service`,
  `PUT /service/:id` e `GET /service-overview` foram migrados.
- Storage R2 (`infra/storage`), que entra junto com a primeira rota de upload.
- Husky, lint-staged e commitlint. Hoje estão no `apps/api`; como o git hook é
  um só por repositório, devem ir para a raiz do monorepo quando o `apps/api`
  sair.
- Dockerfile de produção.

## Dependências que pedem atenção

- **`exact-mirror` fixado em `^0.2.7`**: o Elysia 1.4 depende dessa versão,
  mas também a declara como peer, e o pnpm resolvia o peer para a `1.x`, que
  mudou a API. O sintoma era o warning
  `[exact-mirror] TypeBox's TypeCompiler is required to use Union` e a
  limpeza da resposta não funcionava em schemas com união (`t.Date`,
  `t.Integer`). Não remova essa dependência do `package.json`.
- **`@sinclair/typebox`** fica na mesma versão que o Elysia usa (`0.34.x`).
