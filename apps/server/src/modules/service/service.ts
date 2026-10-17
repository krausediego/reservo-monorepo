import type { TenantDatabase } from "@/infra/database";
import { ConflictError, NotFoundError } from "@/infra/http-errors";
import { logger } from "@/infra/logger";

import type { CreateServiceBody, UpdateServiceBody } from "./model";

/**
 * Regras de negócio de serviços.
 *
 * Todos os métodos recebem o `db` do macro `tenant`, então:
 * - toda query já vem filtrada pelo `organizationId` da sessão;
 * - todo `create`/`update`/`delete` grava um registro em `AuditLogs` com o
 *   `userId` da sessão.
 * Nada disso precisa ser feito aqui.
 */
export abstract class ServiceService {
  static async create(db: TenantDatabase, body: CreateServiceBody) {
    logger.info("Starting process create-service");

    const professionalIds = [...new Set(body.professionals)];

    // `where` vira `{ id: { in }, isActive, deleted, organizationId }`:
    // profissionais de outra organização simplesmente não são encontrados.
    const professionals = await db.professionals.findMany({
      select: { id: true },
      where: { id: { in: professionalIds }, isActive: true, deleted: false },
    });

    if (professionals.length !== professionalIds.length) {
      logger.warn("One or more informed professionals do not exist.");
      throw new ConflictError(
        "Um ou mais profissionais informados não existem",
      );
    }

    // Dentro da transaction o `tx` mantém o mesmo comportamento do `db`.
    const service = await db.$transaction(async (tx) => {
      // Sem `organizationId` no `data`: ele é injetado. O tipo
      // `TenantDatabase` deixa esse campo opcional.
      // → AuditLogs { entity: "Services", action: "create", changes: { after } }
      const created = await tx.services.create({
        data: {
          name: body.name,
          categoryId: body.categoryId,
          description: body.description,
          durationMinutes: body.durationMinutes,
          priceCents: body.priceCents,
          isActive: body.isActive ?? true,
        },
      });

      for (const { id: professionalId } of professionals) {
        // → AuditLogs { entity: "ProfessionalServices", action: "create" }
        await tx.professionalServices.create({
          data: { serviceId: created.id, professionalId },
        });
      }

      return created;
    });

    return { service };
  }

  static async update(db: TenantDatabase, id: string, body: UpdateServiceBody) {
    logger.info({ id }, "Starting process update-service");

    // Um `id` de outra organização dá `null` aqui → 404.
    const current = await db.services.findFirst({
      select: { id: true },
      where: { id, deleted: false },
    });

    if (!current) {
      logger.warn({ id }, "Service not found");
      throw new NotFoundError("Serviço não encontrado");
    }

    // → AuditLogs { action: "update", changes: { campo: { before, after } } }
    // Só os campos que mudaram entram no diff (`createdAt`/`updatedAt` ficam
    // de fora).
    const service = await db.services.update({
      data: {
        name: body.name,
        categoryId: body.categoryId,
        description: body.description,
        durationMinutes: body.durationMinutes,
        priceCents: body.priceCents,
        isActive: body.isActive,
      },
      where: { id },
    });

    return { service };
  }

  static async overview(db: TenantDatabase) {
    logger.info("Starting process overview");

    // Leitura: só recebe o filtro de `organizationId`, sem auditoria.
    const groups = await db.services.groupBy({
      by: ["isActive"],
      _count: { _all: true },
      _sum: { durationMinutes: true, priceCents: true },
    });

    let totalActiveServices = 0;
    let totalInactiveServices = 0;
    let sumDuration = 0;
    let sumPrice = 0;

    for (const group of groups) {
      if (group.isActive) {
        totalActiveServices = group._count._all;
      } else {
        totalInactiveServices = group._count._all;
      }
      sumDuration += group._sum.durationMinutes ?? 0;
      sumPrice += group._sum.priceCents ?? 0;
    }

    const totalServices = totalActiveServices + totalInactiveServices;

    return {
      totalServices,
      totalActiveServices,
      totalInactiveServices,
      avgDuration: totalServices ? Math.round(sumDuration / totalServices) : 0,
      avgPrice: totalServices ? Math.round(sumPrice / totalServices) : 0,
    };
  }
}
