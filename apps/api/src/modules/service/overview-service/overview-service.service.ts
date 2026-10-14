import { setTraceId, setDatabaseContext } from "@/helpers";
import type { ILoggingManager, IDatabase } from "@/infra";
import { BaseDatabaseService } from "@/modules/shared";

import type { OverviewService, IOverviewService } from ".";

export class OverviewServiceService
  extends BaseDatabaseService
  implements IOverviewService
{
  constructor(
    protected readonly logger: ILoggingManager,
    protected readonly database: IDatabase,
  ) {
    super(logger, database);
  }

  @setTraceId
  @setDatabaseContext
  async run(): Promise<OverviewService.Response> {
    this.log("info", "Starting process overview");

    const groups = await this.db.services.groupBy({
      by: ["isActive"],
      _count: { _all: true },
      _sum: { durationMinutes: true, priceCents: true },
    });

    let totalActiveServices = 0;
    let totalInactiveServices = 0;
    let sumDuration = 0;
    let sumPrice = 0;

    for (const group of groups) {
      if (group.isActive) {
        totalActiveServices = group._count._all;
      } else {
        totalInactiveServices = group._count._all;
      }

      sumDuration += group._sum.durationMinutes ?? 0;
      sumPrice += group._sum.priceCents ?? 0;
    }

    const totalServices = totalActiveServices + totalInactiveServices;

    return {
      totalServices,
      totalActiveServices,
      totalInactiveServices,
      avgDuration: totalServices ? Math.round(sumDuration / totalServices) : 0,
      avgPrice: totalServices ? Math.round(sumPrice / totalServices) : 0,
    };
  }
}
