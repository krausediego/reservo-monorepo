import { setTraceId, setDatabaseContext } from "@/helpers";
import { type ILoggingManager, type IDatabase, NotFoundError } from "@/infra";
import { BaseDatabaseService } from "@/modules/shared";

import type { ListProfessionalServices, IListProfessionalServices } from ".";

export class ListProfessionalServicesService
  extends BaseDatabaseService
  implements IListProfessionalServices
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
    params: ListProfessionalServices.Params,
  ): Promise<ListProfessionalServices.Response> {
    this.log("info", "Starting process list-professional-services");

    const hasProfessional = await this.db.professionals.findFirst({
      select: {
        id: true,
      },
      where: {
        id: params.id,
        isActive: true,
      },
    });

    if (!hasProfessional) {
      this.log("warn", "Professional not found", {
        id: params.id,
      });
      throw new NotFoundError("Professional not found");
    }

    const services = await this.db.services.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        professionalServices: {
          some: { professionalId: hasProfessional.id },
        },
      },
    });

    return { services };
  }
}
