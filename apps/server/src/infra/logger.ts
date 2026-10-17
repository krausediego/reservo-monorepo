import { trace } from "@opentelemetry/api";
import pino from "pino";

import { env } from "@/infra/config/env";

const SEVERITY: Record<string, string> = {
  trace: "DEBUG",
  debug: "DEBUG",
  info: "INFO",
  warn: "WARNING",
  error: "ERROR",
  fatal: "CRITICAL",
};

/**
 * Logger único da aplicação.
 *
 * O `mixin` anexa o `traceId`/`spanId` do span ativo do OpenTelemetry em
 * todo log, então não é mais preciso repassar `traceId` entre camadas.
 */
export const logger = pino({
  messageKey: "message",
  level: env.LOG_LEVEL,
  timestamp: false,
  formatters: {
    level: (label, level) => ({
      severity: SEVERITY[label] ?? "DEFAULT",
      level,
    }),
  },
  mixin() {
    const span = trace.getActiveSpan();

    if (!span) {
      return {};
    }

    const { traceId, spanId } = span.spanContext();
    return { traceId, spanId };
  },
});
