import { setTraceId, setDatabaseContext } from "@/helpers";
import { type ILoggingManager, type IDatabase, NotFoundError } from "@/infra";
import { BaseDatabaseService } from "@/modules/shared";

import type { GetService, IGetService } from ".";

export class GetServiceService
  extends BaseDatabaseService
  implements IGetService
{
  constructor(
    protected readonly logger: ILoggingManager,
    protected readonly database: IDatabase,
  ) {
    super(logger, database);
  }

  @setTraceId
  @setDatabaseContext
  async run(params: GetService.Params): Promise<GetService.Response> {
    this.log("info", "Starting process get-service");

    const service = await this.db.services.findFirst({
      where: {
        id: params.id,
        isActive: true,
      },
    });

    if (!service) {
      this.log("warn", "Service not found", {
        id: params.id,
      });
      throw new NotFoundError("Service not found");
    }

    return {
      service,
    };
  }
}
