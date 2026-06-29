import { setTraceId } from "@/helpers";
import type { ILoggingManager } from "@/infra";
import { BaseService } from "@/modules/shared";
import type { CreateEstablishmentSchema } from "@reservo/types";

import type { CreateEstablishment, ICreateEstablishment } from ".";

export class CreateEstablishmentService extends BaseService implements ICreateEstablishment {
  constructor(protected readonly logger: ILoggingManager) {
    super(logger);
  }

  @setTraceId
  async run(params: CreateEstablishment.Params): Promise<CreateEstablishment.Response> {
    this.log("info", "Starting process create-establishment");

    return {};
  }
}
