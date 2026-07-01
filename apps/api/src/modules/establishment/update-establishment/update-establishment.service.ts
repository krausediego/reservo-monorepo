import { setTraceId } from "@/helpers";
import { basePrisma, type ILoggingManager } from "@/infra";
import { BaseService } from "@/modules/shared";

import type { UpdateEstablishment, IUpdateEstablishment } from ".";

export class UpdateEstablishmentService
  extends BaseService
  implements IUpdateEstablishment
{
  constructor(protected readonly logger: ILoggingManager) {
    super(logger);
  }

  @setTraceId
  async run(
    params: UpdateEstablishment.Params,
  ): Promise<UpdateEstablishment.Response> {
    this.log("info", "Starting process update-establishment");

    const hasEstablishment = await basePrisma.establishments.findFirst({
      select: {
        organizationId: true,
      },
      where: {
        id: params.id,
        isActive: true,
      },
    });

    if (!hasEstablishment) {
      this.log("warn", "");
    }

    return {};
  }
}
