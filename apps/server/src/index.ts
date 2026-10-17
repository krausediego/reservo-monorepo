import { env } from "@/infra/config/env";
import { prisma } from "@/infra/database";
import { logger } from "@/infra/logger";
import { otelSdk } from "@/plugins/telemetry";

import { app } from "./app";

app.listen(env.PORT, ({ url }) => {
  logger.info(`⚡️ Server listening on ${url}`);
});

let shuttingDown = false;

const shutdown = async (signal: NodeJS.Signals) => {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;

  logger.info({ signal }, "Initializing graceful shutdown...");

  await app.stop();
  await prisma.$disconnect();
  await otelSdk.shutdown();

  logger.info("Finished graceful shutdown");
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
