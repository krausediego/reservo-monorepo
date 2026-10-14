import { setTraceId, setDatabaseContext } from "@/helpers";
import { type ILoggingManager, type IDatabase, ConflictError } from "@/infra";
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

    const allProfessionalExists = await this.db.professionals.findMany({
      select: {
        id: true,
      },
      where: {
        id: {
          in: params.professionals,
        },
        isActive: true,
        deleted: false,
      },
    });

    if (allProfessionalExists.length !== params.professionals.length) {
      this.log("warn", "One or more informed professionals do not exist.");
      throw new ConflictError(
        "Um ou mais profissionais informados não existem",
      );
    }

    const service = await this.db.$transaction(async (tx) => {
      const serviceCreated = await tx.services.create({
        data: {
          name: params.name,
          categoryId: params.categoryId,
          description: params.description,
          durationMinutes: params.durationMinutes,
          priceCents: params.priceCents,
          isActive: params.isActive ?? true,
        },
      });

      for (const { id: professionalId } of allProfessionalExists) {
        await tx.professionalServices.create({
          data: {
            serviceId: serviceCreated.id,
            professionalId,
          },
        });
      }

      return serviceCreated;
    });

    return { service };
  }
}
