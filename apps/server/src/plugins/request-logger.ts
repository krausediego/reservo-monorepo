import { Elysia } from "elysia";

import { logger } from "@/infra/logger";

const IGNORED_PATHS = new Set(["/", "/api/v1/health-check"]);

/**
 * Substitui o middleware `trace` da API antiga: loga cada request.
 * O `traceId` vem do span do OpenTelemetry (ver `infra/logger.ts`).
 */
export const requestLogger = new Elysia({ name: "request-logger" }).onRequest(
  ({ request }) => {
    const { pathname } = new URL(request.url);

    if (IGNORED_PATHS.has(pathname) || pathname.startsWith("/openapi")) {
      return;
    }

    logger.info(
      { method: request.method, path: pathname },
      `${request.method} ${pathname}`,
    );
  },
);
