import { opentelemetry } from "@elysiajs/opentelemetry";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { NodeSDK, tracing } from "@opentelemetry/sdk-node";
import { PrismaInstrumentation } from "@prisma/instrumentation";

import { env } from "@/infra/config/env";

/**
 * SDK do OpenTelemetry.
 *
 * Iniciamos o SDK aqui (e não dentro do plugin) para poder dar `shutdown()`
 * no graceful shutdown e não perder os spans que ainda estão no buffer.
 *
 * - O exporter OTLP lê `OTEL_EXPORTER_OTLP_ENDPOINT` (padrão
 *   `http://localhost:4318`). `OTEL_SDK_DISABLED=true` desliga o SDK.
 * - `PrismaInstrumentation` adiciona as queries do Prisma como spans.
 */
export const otelSdk = new NodeSDK({
  serviceName: env.OTEL_SERVICE_NAME,
  spanProcessors: [new tracing.BatchSpanProcessor(new OTLPTraceExporter())],
  instrumentations: [new PrismaInstrumentation()],
});

otelSdk.start();

/**
 * Cada request vira um span `METHOD /rota` com spans filhos por etapa do
 * ciclo de vida do Elysia (Request, Parse, BeforeHandle, Handle...).
 * Como o SDK já está registrado, o plugin reaproveita o provider global.
 */
export const telemetry = opentelemetry({
  serviceName: env.OTEL_SERVICE_NAME,
});
