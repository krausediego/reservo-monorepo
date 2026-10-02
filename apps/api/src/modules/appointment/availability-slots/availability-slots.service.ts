import { addMinutes } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

import {
  setTraceId,
  setDatabaseContext,
  computeAvailableSlots,
} from "@/helpers";
import {
  type ILoggingManager,
  type IDatabase,
  NotFoundError,
  ConflictError,
} from "@/infra";
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

    const hasProfessional = await this.db.professionals.findFirst({
      select: {
        id: true,
        professionalServices: true,
        professionalAvailabilities: true,
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
      });
      throw new NotFoundError("Profissional não encontrado");
    }

    const hasService = await this.db.services.findFirst({
      select: {
        id: true,
        priceCents: true,
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
      });
      throw new NotFoundError("Serviço não encontrado");
    }

    if (
      !hasProfessional.professionalServices.some(
        (service) => service.serviceId === hasService.id,
      )
    ) {
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

    const establishment = await this.db.establishments.findFirst({
      select: {
        timezone: true,
        establishmentAvailabilities: true,
      },
      where: {
        organizationId: params.organizationId,
      },
    });

    if (!establishment) {
      this.log("warn", "Establishment not found", {
        organizationId: params.organizationId,
      });
      throw new NotFoundError("Estabelecimento não encontrado");
    }

    const dayStart = fromZonedTime(
      `${params.date}T00:00:00`,
      establishment.timezone,
    );
    const dayEnd = addMinutes(dayStart, 24 * 60);

    const appointments = await this.db.appointments.findMany({
      where: {
        professionalId: hasProfessional.id,
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
        startsAt: {
          lt: dayEnd,
        },
        endsAt: {
          gt: dayStart,
        },
      },
    });

    const slots = computeAvailableSlots({
      dayStart,
      dayEnd,
      timezone: establishment.timezone,
      durationMin: hasService.durationMinutes,
      establishmentHours: establishment.establishmentAvailabilities,
      professionalHours: hasProfessional.professionalAvailabilities,
      busy: appointments,
      step: 15,
    });

    return {
      date: params.date,
      timezone: establishment.timezone,
      durationMin: hasService.durationMinutes,
      slots: slots.map((s) => s.toISOString()),
    };
  }
}
