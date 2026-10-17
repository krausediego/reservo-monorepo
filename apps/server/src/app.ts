import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

import { auth } from "@/infra/auth/auth";
import { env } from "@/infra/config/env";
import { healthCheck } from "@/modules/health-check";
import { serviceModule } from "@/modules/service";
import { errorHandler } from "@/plugins/error-handler";
import { openapi } from "@/plugins/openapi";
import { requestLogger } from "@/plugins/request-logger";
import { telemetry } from "@/plugins/telemetry";

export const app = new Elysia({ name: "reservo-server" })
  .use(telemetry)
  .use(
    cors({
      origin: env.CORS_ORIGIN,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    }),
  )
  .use(requestLogger)
  .use(errorHandler)
  .use(openapi)
  .get("/", () => "ok")
  .group("/api/v1", (v1) =>
    v1
      .all("/auth/*", ({ request }) => auth.handler(request), {
        parse: "none",
        detail: { hide: true },
      })
      .use(healthCheck)
      .use(serviceModule),
  );

export type App = typeof app;
