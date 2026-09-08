import { setTraceId, setDatabaseContext } from "@/helpers";
import {
  type ILoggingManager,
  type IDatabase,
  BadRequestError,
  ConflictError,
} from "@/infra";
import { BaseDatabaseService } from "@/modules/shared";

import type { DeleteProfessional, IDeleteProfessional } from ".";

export class DeleteProfessionalService
  extends BaseDatabaseService
  implements IDeleteProfessional
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
    params: DeleteProfessional.Params,
  ): Promise<DeleteProfessional.Response> {
    this.log("info", "Starting process delete-professional");

    const hasProfessional = await this.db.professionals.findFirst({
      select: {
        id: true,
      },
      where: {
        id: params.id,
      },
    });

    if (!hasProfessional) {
      this.log("warn", "Professional not found");
      throw new BadRequestError("Profissional não encontrado");
    }

    const appointments = await this.db.appointments.count({
      where: {
        professionalId: hasProfessional.id,
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    });

    if (appointments > 0) {
      this.log(
        "warn",
        `This professional has ${appointments} linked appointments; switch to another professional or remove them to proceed with deleting the professional.`,
        {
          professionalId: hasProfessional.id,
        },
      );
      throw new ConflictError(
        `Este profissional possui ${appointments} agendamentos vinculados; alterne para outro profissional ou remova-os para prosseguir com a exclusão do profissional.`,
      );
    }

    await this.db.professionals.update({
      data: {
        isActive: false,
      },
      where: {
        id: hasProfessional.id,
      },
    });

    return {
      deleted: true,
    };
  }
}
