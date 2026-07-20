import { setTraceId, setDatabaseContext } from "@/helpers";
import type { ILoggingManager, IDatabase } from "@/infra";
import { BaseDatabaseService } from "@/modules/shared";

import type { CreateService, ICreateService } from ".";

export class CreateServiceService
  extends BaseDatabaseService
  implements ICreateService
{
  constructor(
    protected readonly logger: ILoggingManager,
    protected readonly database: IDatabase,
  ) {
    super(logger, database);
  }

  @setTraceId
  @setDatabaseContext
  async run(params: CreateService.Params): Promise<CreateService.Response> {
    this.log("info", "Starting process create-service");

    const service = await this.db.services.create({
      data: {
        name: params.name,
        description: params.description,
        durationMinutes: params.durationInMinutes,
        priceCents: params.priceCents,
      },
    });

    return { service };
  }
}
