import { Elysia } from "elysia";

import { HealthCheckModel } from "./model";
import { HealthCheckService } from "./service";

export const healthCheck = new Elysia({
  name: "health-check",
  tags: ["Health"],
}).get(
  "/health-check",
  async ({ status }) => {
    const health = await HealthCheckService.check();

    if (health.status === "error") {
      return status(503, health);
    }

    return health;
  },
  {
    response: {
      200: HealthCheckModel.response,
      503: HealthCheckModel.response,
    },
    detail: { summary: "Health check (API + banco)" },
  },
);
