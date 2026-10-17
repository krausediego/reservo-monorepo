import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@generated/prisma/client";

import { env } from "@/infra/config/env";

/**
 * Client "cru", sem escopo de tenant nem auditoria.
 *
 * Use apenas para dados globais (better-auth, organizations, members...)
 * ou em macros que rodam antes do tenant existir. Dentro de rotas de
 * tenant prefira o `db` entregue pelo macro `tenant`.
 */
export const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: env.DATABASE_URL }),
});
