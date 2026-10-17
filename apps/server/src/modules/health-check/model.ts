import { t } from "elysia";

export const HealthCheckModel = {
  response: t.Object({
    status: t.Union([t.Literal("ok"), t.Literal("error")]),
    database: t.Union([t.Literal("up"), t.Literal("down")]),
    uptime: t.Number({ description: "Segundos desde que o processo subiu" }),
    timestamp: t.String({ format: "date-time" }),
  }),
};

export type HealthCheckResponse = typeof HealthCheckModel.response.static;
