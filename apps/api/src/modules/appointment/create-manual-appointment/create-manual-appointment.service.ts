import { addMinutes } from "date-fns";

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
            serviceId: true,
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
        priceCents: true,
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

    const establishmentAvailabilities =
      await this.db.establishmentAvailabilities.findMany();

    const professionalAvailabilities =
      await this.db.professionalAvailabilities.findMany({
        where: {
          professionalId: hasProfessional.id,
        },
      });

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

    const member = await this.db.members.findFirst({
      select: {
        id: true,
      },
      where: {
        userId: params.userId,
        organizationId: params.organizationId,
      },
    });

    if (!member) {
      this.log("warn", "Member not found", {
        userId: params.userId,
        organizationId: params.organizationId,
      });
      throw new NotFoundError("Usuário não encontrado");
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

    if (
      !isWithinWorkingHours({
        startsAt,
        endsAt,
        timezone: establishment.timezone,
        hours: professionalAvailabilities,
      })
    ) {
      this.log(
        "warn",
        "The day/time of the service is outside the professional's opening hours",
      );
      throw new ConflictError(
        "O dia/horário do serviço está fora do horário de funcionamento do profissional",
      );
    }

    const hasAppointmentConflict = await this.db.appointments.findFirst({
      select: {
        id: true,
      },
      where: {
        professionalId: hasProfessional.id,
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
        startsAt: {
          lt: endsAt,
        },
        endsAt: {
          gt: startsAt,
        },
      },
    });

    if (hasAppointmentConflict) {
      this.log(
        "warn",
        "O profissional já possui um agendamento pendente ou confirmado neste período",
        {
          appointmentId: hasAppointmentConflict.id,
        },
      );
      throw new ConflictError(
        "O profissional já possui um agendamento pendente ou confirmado neste período",
      );
    }

    const customerId = await this.createOrGetCustomer({
      customer: params.customer,
    });

    await this.db.appointments.create({
      data: {
        professionalId: hasProfessional.id,
        customerId,
        serviceId: hasService.id,
        startsAt,
        endsAt,
        origin: "DASH",
        durationMin: hasService.durationMinutes,
        priceCents: hasService.priceCents,
        createdById: member.id,
        notes: params.notes,
        internalNotes: params.internalNotes,
      },
    });

    return {
      message: "Agendamento criado com sucesso!",
    };
  }

  private async createOrGetCustomer({
    customer,
  }: {
    customer:
      | {
          type: "existing";
          customerId: string;
        }
      | {
          type: "new";
          name: string;
          phone?: string | undefined;
          email?: string | undefined;
        };
  }): Promise<string> {
    if (customer.type === "new") {
      const existing = await this.db.customers.findFirst({
        select: {
          id: true,
        },
        where: {
          phone: customer.phone,
        },
      });

      if (existing) {
        return existing.id;
      }

      const customerCreated = await this.db.customers.create({
        data: {
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          source: "WALK_IN",
        },
      });

      return customerCreated.id;
    }

    const hasCustomer = await this.db.customers.findFirst({
      select: {
        id: true,
      },
      where: {
        id: customer.customerId,
      },
    });

    if (!hasCustomer) {
      this.log("warn", "The customer provided as existing was not found.", {
        customerId: customer.customerId,
      });
      throw new NotFoundError(
        "O cliente fornecido como existente não foi encontrado.",
      );
    }

    return hasCustomer.id;
  }
}
