#!/usr/bin/env tsx
/**
 * CLI para geração de módulos
 *
 * Uso:
 *   Módulo raiz:        tsx scripts/generate-module.ts hello-world
 *   Módulo de contexto: tsx scripts/generate-module.ts organization/create-organization
 */

import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { join } from "path";

// ─── helpers ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

if (!args[0]) {
  console.error("❌  Informe o nome do módulo.");
  console.error("    Exemplos:");
  console.error("      tsx scripts/generate-module.ts hello-world");
  console.error(
    "      tsx scripts/generate-module.ts organization/create-organization",
  );
  process.exit(1);
}

const input = args[0].replace(/\\/g, "/");
const parts = input.split("/");

// valida profundidade máxima: contexto/modulo ou apenas modulo
if (parts.length > 2) {
  console.error(
    "❌  Profundidade máxima: contexto/modulo (ex: organization/create-organization)",
  );
  process.exit(1);
}

const moduleName = parts[parts.length - 1]; // ex: create-organization
const context = parts.length === 2 ? parts[0] : null; // ex: organization

// converte kebab-case → PascalCase
const toPascal = (str: string) =>
  str
    .split("-")
    .map((s) => s[0]?.toUpperCase() + s.slice(1))
    .join("");

// converte kebab-case → camelCase
const toCamel = (str: string) => {
  const p = toPascal(str);
  return p[0]?.toLowerCase() + p.slice(1);
};

const pascal = toPascal(moduleName!); // CreateOrganization
const camel = toCamel(moduleName!); // createOrganization
const kebab = moduleName; // create-organization

// ─── caminhos ───────────────────────────────────────────────────────────────

const modulesRoot = join(process.cwd(), "src/modules");
const packagesRoot = join(process.cwd(), "../../packages");

const moduleDir = context
  ? join(modulesRoot, context, kebab!)
  : join(modulesRoot, kebab!);

// packages/schemas/src/<context>/<kebab>.schemas.ts  (ou raiz se sem contexto)
const schemasDir = context
  ? join(packagesRoot, "schemas", "src", context)
  : join(packagesRoot, "schemas", "src");

// packages/types/src/<context>/<kebab>.types.ts
const typesDir = context
  ? join(packagesRoot, "types", "src", context)
  : join(packagesRoot, "types", "src");

if (existsSync(moduleDir)) {
  console.error(`❌  O módulo já existe em: ${moduleDir}`);
  process.exit(1);
}

mkdirSync(moduleDir, { recursive: true });
mkdirSync(schemasDir, { recursive: true });
mkdirSync(typesDir, { recursive: true });

// ─── import paths para uso dentro do módulo ─────────────────────────────────

// O módulo fica em apps/api/src/modules/<context>/<kebab>/
// Os packages ficam em packages/schemas/ e packages/types/
// Assumindo path aliases @reservo/schemas e @reservo/types (ajuste se necessário)
const schemasPkgImport = `@reservo/schemas`;
const typesPkgImport = `@reservo/types`;

// ─── templates ──────────────────────────────────────────────────────────────

// Arquivo que vai para packages/schemas/<context>/<kebab>.schemas.ts
const schemasFile = `\
import { z } from "zod";

export const ${camel}Schema = z.object({
  body: z.object({}),
});

export const ${camel}ResponseSchema = z.object({});
`;

// Arquivo que vai para packages/types/<context>/<kebab>.types.ts
const typesFile = `\
import { z } from "zod";

import { ${camel}Schema, ${camel}ResponseSchema } from "${schemasPkgImport}";

export namespace I${pascal}Schema {
  export type GetParams  = z.infer<typeof ${camel}Schema>["body"];
  export type GetResponse = z.infer<typeof ${camel}ResponseSchema>;
}
`;

// Arquivos que vão para src/modules/<context>/<kebab>/
const moduleFiles: Record<string, string> = {
  // controller.factory.ts
  [`${kebab}-controller.factory.ts`]: `\
import type { IController } from "@/modules/shared";

import { ${pascal}Controller, make${pascal}Service } from ".";

export const make${pascal}Controller = (): IController => {
  return new ${pascal}Controller(make${pascal}Service);
};
`,

  // service.factory.ts
  [`${kebab}-service.factory.ts`]: `\
import { makeLogging, makeDatabase } from "@/infra";

import { ${pascal}Service, type I${pascal} } from ".";

export const make${pascal}Service = (): I${pascal} => {
  return new ${pascal}Service(makeLogging(), makeDatabase());
};
`,

  // controller.ts
  [`${kebab}.controller.ts`]: `\
import { getHttpError, type Http, ok } from "@/infra";
import type { IController } from "@/modules/shared";
import type { I${pascal}Schema } from "${typesPkgImport}";

import type { I${pascal} } from ".";

type ${pascal}Handler = () => I${pascal};

export class ${pascal}Controller implements IController {
  constructor(private readonly ${camel}Service: ${pascal}Handler) {}

  async handle({ data, locals }: Http.IRequest<I${pascal}Schema.GetParams>): Promise<Http.IResponse> {
    try {
      const content = await this.${camel}Service().run({
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
`,

  // interface.ts
  [`${kebab}.interface.ts`]: `\
import type { I${pascal}Schema } from "${typesPkgImport}";

export interface I${pascal} {
  run(params: ${pascal}.Params): Promise<${pascal}.Response>;
}

export namespace ${pascal} {
  export type Params = I${pascal}Schema.GetParams & {
    userId: string;
    organizationId: string;
    traceId: string;
  };

  export type Response = I${pascal}Schema.GetResponse;
}
`,

  // service.ts
  [`${kebab}.service.ts`]: `\
import { setTraceId, setDatabaseContext } from "@/helpers";
import type { ILoggingManager, IDatabase } from "@/infra";
import { BaseDatabaseService } from "@/modules/shared";

import type { ${pascal}, I${pascal} } from ".";

export class ${pascal}Service extends BaseDatabaseService implements I${pascal} {
  constructor(
    protected readonly logger: ILoggingManager,
    protected readonly database: IDatabase
  ) {
    super(logger, database);
  }

  @setTraceId
  @setDatabaseContext
  async run(params: ${pascal}.Params): Promise<${pascal}.Response> {
    this.log("info", "Starting process ${kebab}");

    return {};
  }
}
`,

  // index.ts (barrel) — schema e types não são exportados daqui
  [`index.ts`]: `\
export * from "./${kebab}-controller.factory";
export * from "./${kebab}-service.factory";
export * from "./${kebab}.controller";
export * from "./${kebab}.interface";
export * from "./${kebab}.service";
`,
};

// ─── helpers de barrel ──────────────────────────────────────────────────────

/**
 * Garante que `export * from "<entry>"` existe no arquivo barrel.
 * - Se o arquivo não existir, cria com o export.
 * - Se já existir mas não tiver o export, faz append.
 * - Se já tiver o export, não faz nada (idempotente).
 */
const upsertBarrel = (barrelPath: string, entry: string) => {
  const line = `export * from "${entry}";\n`;

  if (!existsSync(barrelPath)) {
    writeFileSync(barrelPath, line);
    return;
  }

  const current = readFileSync(barrelPath, "utf-8");
  if (!current.includes(line.trim())) {
    appendFileSync(barrelPath, line);
  }
};

// ─── escrita ────────────────────────────────────────────────────────────────

// packages/schemas/src/<context>/<kebab>.schemas.ts
writeFileSync(join(schemasDir, `${kebab}.schemas.ts`), schemasFile);

// packages/schemas/src/<context>/index.ts  →  re-exporta o schema criado
const schemasContextIndex = join(schemasDir, "index.ts");
const schemasContextEntry = `./${kebab}.schemas`;
upsertBarrel(schemasContextIndex, schemasContextEntry);

// packages/schemas/src/index.ts  →  re-exporta o contexto
const schemasRootIndex = join(packagesRoot, "schemas", "src", "index.ts");
const schemasRootEntry = context ? `./${context}` : `./${kebab}.schemas`;
upsertBarrel(schemasRootIndex, schemasRootEntry);

// packages/types/src/<context>/<kebab>.types.ts
writeFileSync(join(typesDir, `${kebab}.types.ts`), typesFile);

// packages/types/src/<context>/index.ts  →  re-exporta o type criado
const typesContextIndex = join(typesDir, "index.ts");
const typesContextEntry = `./${kebab}.types`;
upsertBarrel(typesContextIndex, typesContextEntry);

// packages/types/src/index.ts  →  re-exporta o contexto
const typesRootIndex = join(packagesRoot, "types", "src", "index.ts");
const typesRootEntry = context ? `./${context}` : `./${kebab}.types`;
upsertBarrel(typesRootIndex, typesRootEntry);

// src/modules/...
for (const [filename, content] of Object.entries(moduleFiles)) {
  writeFileSync(join(moduleDir, filename), content);
}

// ─── output ─────────────────────────────────────────────────────────────────

const displayModule = context
  ? `src/modules/${context}/${kebab}`
  : `src/modules/${kebab}`;

const displaySchemas = context
  ? `packages/schemas/src/${context}/${kebab}.schemas.ts`
  : `packages/schemas/src/${kebab}.schemas.ts`;

const displayTypes = context
  ? `packages/types/src/${context}/${kebab}.types.ts`
  : `packages/types/src/${kebab}.types.ts`;

console.log(`\n✅  Módulo "${pascal}" criado com sucesso!\n`);

console.log(`   📁 ${displayModule}/`);
for (const filename of Object.keys(moduleFiles)) {
  console.log(`      • ${filename}`);
}

console.log(`\n   📦 ${displaySchemas}`);
console.log(`   📦 ${displayTypes}`);
console.log("");
