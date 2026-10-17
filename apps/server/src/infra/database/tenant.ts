/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Prisma } from "@generated/prisma/client";

import { prisma } from "./prisma";
import type { AuditAction, TenantContext, TenantDatabase } from "./types";

/** Models globais: não recebem `organizationId` automaticamente. */
const SKIP_TENANT = new Set([
  "AuditLogs",
  "Users",
  "Organizations",
  "Establishments",
  "Members",
  "Invitations",
  "Sessions",
  "ServiceCategories",
]);

/** Models que não geram registro em `AuditLogs`. */
const SKIP_AUDIT = new Set(["AuditLogs", "Invitations", "Members", "Sessions"]);

const WRITE_OPS = new Set([
  "create",
  "createMany",
  "update",
  "updateMany",
  "delete",
  "deleteMany",
  "upsert",
]);

const READ_OR_FILTERED_OPS = new Set([
  "findUnique",
  "findUniqueOrThrow",
  "findFirst",
  "findFirstOrThrow",
  "findMany",
  "count",
  "aggregate",
  "groupBy",
  "update",
  "updateMany",
  "delete",
  "deleteMany",
]);

const lowerFirst = (value: string) =>
  value.charAt(0).toLowerCase() + value.slice(1);

const actionFor = (operation: string): AuditAction | null => {
  if (operation === "create" || operation === "createMany") {
    return "create";
  }
  if (
    operation === "update" ||
    operation === "updateMany" ||
    operation === "upsert"
  ) {
    return "update";
  }
  if (operation === "delete" || operation === "deleteMany") {
    return "delete";
  }
  return null;
};

const injectTenant = (
  operation: string,
  args: any,
  organizationId: string,
): void => {
  if (READ_OR_FILTERED_OPS.has(operation)) {
    args.where = { ...(args.where ?? {}), organizationId };
    return;
  }

  if (operation === "create") {
    args.data = { ...(args.data ?? {}), organizationId };
    return;
  }

  if (operation === "createMany" && Array.isArray(args.data)) {
    args.data = args.data.map((data: any) => ({ ...data, organizationId }));
    return;
  }

  if (operation === "upsert") {
    args.where = { ...(args.where ?? {}), organizationId };
    args.create = { ...(args.create ?? {}), organizationId };
  }
};

const diff = (before: Record<string, any>, after: Record<string, any>) => {
  const changes: Record<string, { before: any; after: any }> = {};
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);

  for (const key of keys) {
    if (key === "updatedAt" || key === "createdAt") {
      continue;
    }

    const previous = before[key];
    const next = after[key];

    if (JSON.stringify(previous) !== JSON.stringify(next)) {
      changes[key] = { before: previous ?? null, after: next ?? null };
    }
  }

  return changes;
};

type RunAuditedParams = TenantContext & {
  model: string;
  operation: string;
  action: AuditAction;
  args: any;
  query: (args: any) => Promise<unknown>;
  client: any;
};

const runAudited = async ({
  model,
  operation,
  action,
  args,
  query,
  userId,
  organizationId,
  client,
}: RunAuditedParams): Promise<unknown> => {
  const isSingle =
    operation === "update" || operation === "delete" || operation === "upsert";
  const recordId = args?.where?.id ?? null;

  let before: Record<string, any> | null = null;

  if (isSingle && recordId) {
    before = await client[lowerFirst(model)].findUnique({
      where: { id: recordId },
    });
  }

  const result = await query(args);

  const after = action === "delete" ? before : (result as Record<string, any>);

  let changes: Record<string, unknown>;
  if (action === "create") {
    changes = { after };
  } else if (action === "update" && before) {
    changes = diff(before, after ?? {});
  } else {
    changes = { before };
  }

  await client.auditLogs.create({
    data: {
      entity: model,
      entityId: after?.id ?? recordId ?? "(bulk)",
      action,
      userId,
      organizationId,
      changes: changes as Prisma.InputJsonValue,
    },
  });

  return result;
};

/**
 * Cria um client do Prisma com escopo de tenant.
 *
 * - injeta `organizationId` em todo `where`/`data` (exceto `SKIP_TENANT`);
 * - grava `AuditLogs` nas escritas (exceto `SKIP_AUDIT`), inclusive dentro
 *   de `$transaction` interativa.
 *
 * O contexto é explícito: quem chama passa `organizationId`/`userId`. Nas
 * rotas isso é feito pelo macro `tenant` (ver `plugins/tenant.ts`).
 */
export const createTenantDatabase = ({
  organizationId,
  userId,
}: TenantContext): TenantDatabase => {
  const extended = prisma.$extends({
    query: {
      $allModels: {
        $allOperations: async ({ model, operation, args, query, ...rest }) => {
          if (!SKIP_TENANT.has(model)) {
            injectTenant(operation, args, organizationId);
          }

          const isWrite = WRITE_OPS.has(operation);
          const data = (args as { data?: Record<string, unknown> })?.data;
          const isSoftDelete =
            (operation === "update" || operation === "updateMany") &&
            data?.deletedAt != null;
          const action = isSoftDelete ? "delete" : actionFor(operation);

          if (SKIP_AUDIT.has(model) || !isWrite || !action) {
            return query(args);
          }

          // Usa o client amarrado à transaction interativa atual, se houver.
          const txInfo = (rest as any)?.__internalParams?.transaction;
          const client =
            txInfo?.kind === "itx"
              ? (prisma as any)._createItxClient(txInfo)
              : prisma;

          return runAudited({
            model,
            operation,
            action,
            args,
            query,
            userId,
            organizationId,
            client,
          });
        },
      },
    },
  });

  return extended as unknown as TenantDatabase;
};
