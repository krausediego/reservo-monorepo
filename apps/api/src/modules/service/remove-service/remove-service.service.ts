import { setTraceId, setDatabaseContext } from "@/helpers";
import {
  type ILoggingManager,
  type IDatabase,
  NotFoundError,
  ConflictError,
} from "@/infra";
import { BaseDatabaseService } from "@/modules/shared";

import type { RemoveService, IRemoveService } from ".";

export class RemoveServiceService
  extends BaseDatabaseService
  implements IRemoveService
{
  constructor(
    protected readonly logger: ILoggingManager,
    protected readonly database: IDatabase,
  ) {
    super(logger, database);
  }

  @setTraceId
  @setDatabaseContext
  async run(params: RemoveService.Params): Promise<RemoveService.Response> {
    this.log("info", "Starting process remove-service");

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
      this.log("warn", "Service not found", {
        id: params.id,
      });
      throw new NotFoundError("Service not found");
    }

    const hasFutureAppointmentsWithService = await this.db.appointments.count({
      where: {
        serviceId: hasService.id,
        status: {
          in: ["PENDING", "NO_SHOW"],
        },
      },
    });

    if (hasFutureAppointmentsWithService > 0) {
      this.log(
        "warn",
        `This service has ${hasFutureAppointmentsWithService} linked appointments; switch to another service or remove them to proceed with removing the service.`,
        {
          serviceId: hasService.id,
        },
      );
      throw new ConflictError(
        `This service has ${hasFutureAppointmentsWithService} linked appointments; switch to another service or remove them to proceed with removing the service.`,
      );
    }

    const service = await this.db.services.update({
      data: {
        isActive: false,
      },
      where: {
        id: hasService.id,
      },
    });

    return { service };
  }
}
