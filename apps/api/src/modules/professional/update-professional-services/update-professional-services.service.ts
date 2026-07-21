import { setTraceId, setDatabaseContext } from "@/helpers";
import {
  type ILoggingManager,
  type IDatabase,
  NotFoundError,
  IStorage,
} from "@/infra";
import { BaseDatabaseService } from "@/modules/shared";

import type {
  UpdateProfessionalServices,
  IUpdateProfessionalServices,
} from ".";

export class UpdateProfessionalServicesService
  extends BaseDatabaseService
  implements IUpdateProfessionalServices
{
  constructor(
    protected readonly logger: ILoggingManager,
    protected readonly database: IDatabase,
    private readonly storage: IStorage,
  ) {
    super(logger, database);
  }

  @setTraceId
  @setDatabaseContext
  async run(
    params: UpdateProfessionalServices.Params,
  ): Promise<UpdateProfessionalServices.Response> {
    this.log("info", "Starting process update-professional-services");

    const hasProfessional = await this.db.professionals.findFirst({
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

    const incomingIds = [...new Set(params.services)];

    const hasServices = await this.db.services.findMany({
      select: {
        id: true,
      },
      where: {
        id: { in: incomingIds },
        isActive: true,
      },
    });

    if (hasServices.length !== incomingIds.length) {
      this.log("warn", "One or more services not found");
      throw new NotFoundError("One or more services not found");
    }

    const currentProfessionalServices =
      await this.db.professionalServices.findMany({
        select: {
          serviceId: true,
        },
        where: {
          professionalId: hasProfessional.id,
        },
      });

    const currentIds = new Set(
      currentProfessionalServices.map((r) => r.serviceId),
    );
    const desiredIds = new Set(params.services);

    const toRemove = [...currentIds].filter((id) => !desiredIds.has(id));
    const toAdd = [...desiredIds].filter((id) => !currentIds.has(id));

    await this.db.$transaction([
      this.db.professionalServices.deleteMany({
        where: {
          professionalId: hasProfessional.id,
          serviceId: { in: toRemove },
        },
      }),
      this.db.professionalServices.createMany({
        data: toAdd.map((serviceId) => ({
          professionalId: hasProfessional.id,
          serviceId,
        })),
      }),
    ]);

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

    const avatarUrl = await this.getSignedUrl({
      key: hasProfessional.avatarStorageKey,
    });

    return {
      professional: {
        ...hasProfessional,
        avatarUrl,
      },
      services,
    };
  }

  private async getSignedUrl(
    params: UpdateProfessionalServices.GetSignedUrlParams,
  ): Promise<string | null> {
    if (!params.key) {
      return null;
    }

    return this.storage.getSignedUrl({ key: params.key });
  }
}
