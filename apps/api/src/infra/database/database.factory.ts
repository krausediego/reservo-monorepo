import { PrismaClient } from "generated/prisma/client";

import { PrismaPg } from "@prisma/adapter-pg";

import { DatabaseEnv } from "../config";

const adapter = new PrismaPg({
  connectionString: DatabaseEnv.connectionString,
});

export const basePrisma = new PrismaClient({ adapter });
