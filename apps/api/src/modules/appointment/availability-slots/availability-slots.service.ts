import { setTraceId, setDatabaseContext } from "@/helpers";
import type { ILoggingManager, IDatabase } from "@/infra";
import { BaseDatabaseService } from "@/modules/shared";

import type { AvailabilitySlots, IAvailabilitySlots } from ".";

export class AvailabilitySlotsService
  extends BaseDatabaseService
  implements IAvailabilitySlots
{
  constructor(
    protected readonly logger: ILoggingManager,
    protected readonly database: IDatabase,
  ) {
    super(logger, database);
  }

  @setTraceId
  @setDatabaseContext
  async run(
    params: AvailabilitySlots.Params,
  ): Promise<AvailabilitySlots.Response> {
    this.log("info", "Starting process availability-slots");

    return {};
  }
}
