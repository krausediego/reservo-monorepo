import { prisma } from "@/infra/database";
import { logger } from "@/infra/logger";

import type { HealthCheckResponse } from "./model";

export abstract class HealthCheckService {
  static async check(): Promise<HealthCheckResponse> {
    const database = await HealthCheckService.pingDatabase();

    return {
      status: database === "up" ? "ok" : "error",
      database,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }

  private static async pingDatabase(): Promise<"up" | "down"> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return "up";
    } catch (error) {
      logger.error({ err: error }, "Health check: database unreachable");
      return "down";
    }
  }
}
