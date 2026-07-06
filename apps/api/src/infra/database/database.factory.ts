import { PrismaClient } from "generated/prisma/client";

import { makeLogging } from "@/infra";
import { PrismaPg } from "@prisma/adapter-pg";

import { IDatabase, PrismaService } from ".";
import { DatabaseEnv } from "../config";

const adapter = new PrismaPg({
  connectionString: DatabaseEnv.connectionString,
});

export const basePrisma = new PrismaClient({ adapter });

export const makeDatabase = (): IDatabase => {
  return new PrismaService(makeLogging(), basePrisma, {
    skipTenant: new Set([
      "AuditLogs",
      "Users",
      "Organizations",
      "Establishments",
      "Members",
    ]),
    skipAudit: new Set(["AuditLogs"]),
  });
};
