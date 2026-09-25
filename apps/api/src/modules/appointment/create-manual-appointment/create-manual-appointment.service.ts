import { addMinutes, getDay } from "date-fns";

import {
  setTraceId,
  setDatabaseContext,
  isWithinWorkingHours,
} from "@/helpers";
import {
  type ILoggingManager,
  type IDatabase,
  NotFoundError,
  ConflictError,
} from "@/infra";
import { BaseDatabaseService } from "@/modules/shared";

import type { CreateManualAppointment, ICreateManualAppointment } from ".";

export class CreateManualAppointmentService
  extends BaseDatabaseService
  implements ICreateManualAppointment
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
    params: CreateManualAppointment.Params,
  ): Promise<CreateManualAppointment.Response> {
    this.log("info", "Starting process create-manual-appointment");

    const hasProfessional = await this.db.professionals.findFirst({
      select: {
        id: true,
        professionalServices: {
          select: {
            id: true,
          },
        },
      },
      where: {
        id: params.professionalId,
        isActive: true,
        deleted: false,
      },
    });

    if (!hasProfessional) {
      this.log("warn", "Professional not found", {
        professionalId: params.professionalId,
        organizationId: params.organizationId,
      });
      throw new NotFoundError("Profissional não encontrado");
    }

    const hasService = await this.db.services.findFirst({
      select: {
        id: true,
        durationMinutes: true,
      },
      where: {
        id: params.serviceId,
        isActive: true,
        deleted: false,
      },
    });

    if (!hasService) {
      this.log("warn", "Service not found", {
        serviceId: params.serviceId,
        organizationId: params.organizationId,
      });
      throw new NotFoundError("Serviço não encontrado");
    }

    if (!hasProfessional.professionalServices.includes({ id: hasService.id })) {
      this.log(
        "warn",
        "This professional not accept this service, choose another valid service",
        {
          professionalId: hasProfessional.id,
          serviceId: hasService.id,
        },
      );
      throw new ConflictError(
        "O profissional escolhido não presta o serviço vinculado ao agendamento, por favor, escolha outro serviço",
      );
    }

    const establishmentAvailabilities =
      await this.db.establishmentAvailabilities.findMany();

    const establishment = await this.db.establishments.findFirst({
      select: {
        timezone: true,
      },
      where: {
        organizationId: params.organizationId,
        isActive: true,
      },
    });

    if (!establishment) {
      this.log("warn", "Establishment not found", {
        organizationId: params.organizationId,
      });
      throw new NotFoundError("Estabelecimento não encontrado");
    }

    const { startsAt } = params;
    const endsAt = addMinutes(startsAt, hasService.durationMinutes);

    if (
      !isWithinWorkingHours({
        startsAt,
        endsAt,
        timezone: establishment.timezone,
        hours: establishmentAvailabilities,
      })
    ) {
      this.log(
        "warn",
        "The day/time of the service is outside the establishment's opening hours",
      );
      throw new ConflictError(
        "O dia/horário do serviço está fora do horário de funcionamento do estabelecimento",
      );
    }
    return {};
  }
}
