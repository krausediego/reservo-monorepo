import { setTraceId, setDatabaseContext } from "@/helpers";
import {
  type ILoggingManager,
  type IDatabase,
  NotFoundError,
  BadRequestError,
  ConflictError,
} from "@/infra";
import { BaseDatabaseService } from "@/modules/shared";

import type { RevokeMember, IRevokeMember } from ".";

export class RevokeMemberService
  extends BaseDatabaseService
  implements IRevokeMember
{
  constructor(
    protected readonly logger: ILoggingManager,
    protected readonly database: IDatabase,
  ) {
    super(logger, database);
  }

  @setTraceId
  @setDatabaseContext
  async run(params: RevokeMember.Params): Promise<RevokeMember.Response> {
    this.log("info", "Starting process revoke-member");

    const hasMember = await this.db.members.findFirst({
      select: {
        id: true,
        userId: true,
      },
      where: {
        id: params.id,
      },
    });

    if (!hasMember) {
      this.log("warn", "Member not found", {
        id: params.id,
      });
      throw new NotFoundError("Membro não encontrado");
    }

    if (hasMember.userId === params.userId) {
      this.log("warn", "You cannot revoke your own access.");
      throw new BadRequestError("Você não pode remover seu próprio acesso");
    }

    const hasProfessionalLinked = await this.db.professionals.findFirst({
      select: {
        id: true,
      },
      where: {
        memberId: hasMember.id,
      },
    });

    if (hasProfessionalLinked) {
      const hasPendingAppointments = await this.db.appointments.count({
        where: {
          professionalId: hasProfessionalLinked.id,
          status: {
            in: ["CONFIRMED", "PENDING"],
          },
        },
      });

      if (hasPendingAppointments) {
        this.log(
          "warn",
          "This user is linked to a professional with confirmed or pending appointments; change the professional responsible for these appointments to proceed with the deactivation.",
          {
            pendingAppointmentsCount: hasPendingAppointments,
          },
        );
        throw new ConflictError(
          `Este usuário está vinculado a um profissional com ${hasPendingAppointments} agendamentos confirmados ou pendentes, altere o profissional responsável por esses agendamentos para continuar com a inativação.`,
        );
      }

      await this.db.professionals.update({
        data: {
          isActive: false,
        },
        where: {
          id: hasProfessionalLinked.id,
        },
      });
    }

    await this.db.members.delete({
      where: {
        id: hasMember.id,
      },
    });

    return {
      message: "O acesso do usuário foi revogado com sucesso",
    };
  }
}
