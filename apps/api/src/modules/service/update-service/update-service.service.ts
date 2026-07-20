import { setTraceId, setDatabaseContext } from "@/helpers";
import { type ILoggingManager, type IDatabase, NotFoundError } from "@/infra";
import { BaseDatabaseService } from "@/modules/shared";

import type { UpdateService, IUpdateService } from ".";

export class UpdateServiceService
  extends BaseDatabaseService
  implements IUpdateService
{
  constructor(
    protected readonly logger: ILoggingManager,
    protected readonly database: IDatabase,
  ) {
    super(logger, database);
  }

  @setTraceId
  @setDatabaseContext
  async run(params: UpdateService.Params): Promise<UpdateService.Response> {
    this.log("info", "Starting process update-service");

    const hasService = await this.db.services.findFirst({
      select: {
        id: true,
      },
      where: {
        id: params.id,
        isActive: true,
      },
    });

    if (!hasService) {
      this.log("warn", "Service not found");
      throw new NotFoundError("Service not found");
    }

    const service = await this.db.services.update({
      data: {
        name: params.name,
        description: params.description,
        durationMinutes: params.durationInMinutes,
        priceCents: params.priceCents,
      },
      where: {
        id: params.id,
      },
    });

    return { service };
  }
}
