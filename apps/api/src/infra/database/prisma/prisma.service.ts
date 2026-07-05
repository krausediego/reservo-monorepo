/* eslint-disable no-nested-ternary */
/* eslint-disable no-continue */
/* eslint-disable default-case */
/* eslint-disable no-param-reassign */
import { Prisma, PrismaClient } from "generated/prisma/client";

import { ILoggingManager } from "@/infra/logging";
import { BaseService } from "@/modules/shared";

import { Database, IDatabase } from "..";

export class PrismaService extends BaseService implements IDatabase {
  private static readonly WRITE_OPS = new Set([
    "create",
    "createMany",
    "update",
    "updateMany",
    "delete",
    "deleteMany",
    "upsert",
  ]);

  private readonly skipTenant: Set<string>;

  private readonly skipAudit: Set<string>;

  constructor(
    protected readonly logger: ILoggingManager,
    private readonly basePrisma: PrismaClient,
    options: Database.Options = {},
  ) {
    super(logger);
    this.skipTenant = options.skipTenant ?? new Set(["AuditLog"]);
    this.skipAudit = options.skipAudit ?? new Set(["AuditLog"]);
  }

  create({ userId, establishmentId }: Database.Params): Database.Response {
    const extended = this.basePrisma.$extends({
      query: {
        $allModels: {
          $allOperations: async ({ model, operation, args, query }) => {
            const isWrite = PrismaService.WRITE_OPS.has(operation);

            if (!this.skipTenant.has(model)) {
              this.injectTenant({ operation, args, establishmentId });
            }
            // this.injectActor({ operation, args, userId });

            const isSoftDelete =
              (operation === "update" || operation === "updateMany") &&
              this.hasData({ args, key: "deletedAt" });

            const action = isSoftDelete
              ? "delete"
              : this.actionFor({ operation });
            if (this.skipAudit.has(model) || !isWrite || !action) {
              return query(args);
            }

            return this.runAudited({
              model,
              operation,
              action,
              args,
              query,
              userId,
              establishmentId,
            });
          },
        },
      },
    });

    return extended as unknown as Database.Response;
  }

  private async runAudited({
    model,
    operation,
    action,
    args,
    query,
    userId,
    establishmentId,
  }: Database.RunAuditedParams): Promise<unknown> {
    const isSingle =
      operation === "update" ||
      operation === "delete" ||
      operation === "upsert";
    const recordId = args?.where?.id ?? null;

    let before: Record<string, any> | null = null;

    if (isSingle && recordId) {
      before = await (this.basePrisma as any)[
        this.lowerFirst(model)
      ].findUnique({
        where: { id: recordId },
      });
    }

    const result = await query(args);

    try {
      const after =
        action === "delete" ? before : (result as Record<string, any>);

      const changes =
        action === "create"
          ? { after }
          : action === "update" && before
            ? this.diff({ before, after: after! })
            : { before };

      await this.basePrisma.auditLogs.create({
        data: {
          entity: model,
          entityId: (after as any)?.id ?? recordId ?? "(bulk)",
          action,
          userId,
          establishmentId,
          changes: changes as Prisma.InputJsonValue,
        },
      });
    } catch {
      this.log("error", "Failed to write audit log");
    }

    return result;
  }

  private diff({ before, after }: Database.DiffParams): Database.DiffResponse {
    const changes: Record<string, { before: any; after: any }> = {};
    const keys = new Set([
      ...Object.keys(before ?? {}),
      ...Object.keys(after ?? {}),
    ]);
    for (const key of keys) {
      if (key === "updatedAt" || key === "createdAt") {
        continue;
      }
      const b = before?.[key];
      const a = after?.[key];
      if (JSON.stringify(b) !== JSON.stringify(a)) {
        changes[key] = { before: b ?? null, after: a ?? null };
      }
    }
    return changes;
  }

  private actionFor({
    operation,
  }: Database.ActionForParams): Database.Action | null {
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
  }

  private injectTenant({
    operation,
    args,
    establishmentId,
  }: Database.InjectTenantParams): void {
    switch (operation) {
      case "findUnique":
      case "findUniqueOrThrow":
      case "findFirst":
      case "findFirstOrThrow":
      case "findMany":
      case "count":
      case "aggregate":
      case "groupBy":
      case "update":
      case "updateMany":
      case "delete":
      case "deleteMany":
        args.where = { ...(args.where ?? {}), establishmentId };
        break;
      case "create":
        args.data = { ...(args.data ?? {}), establishmentId };
        break;
      case "createMany":
        if (Array.isArray(args.data)) {
          args.data = args.data.map((d: any) => ({
            ...d,
            establishmentId,
          }));
        }
        break;
      case "upsert":
        args.where = { ...(args.where ?? {}), establishmentId };
        args.create = { ...(args.create ?? {}), establishmentId };
        break;
    }
  }

  private hasData(params: Database.HasDataParams): boolean {
    const data = (params.args as { data?: Record<string, unknown> })?.data;
    return Boolean(data && data[params.key] != null);
  }

  private lowerFirst(s: string): string {
    return s.charAt(0).toLowerCase() + s.slice(1);
  }
}
