import { normalizeFiles } from "@/helpers";
import { getHttpError, Http, ILoggingManager, ok } from "@/infra";

import { IMiddleware } from "../middleware";

export class NormalizeFilesMiddleware implements IMiddleware {
  constructor(private readonly logger: ILoggingManager) {}

  async handle({ data }: Http.IRequest): Promise<Http.IResponse> {
    try {
      const normalizedFiles = await normalizeFiles(data?.files, data?.file);

      return ok({ normalizedFiles });
    } catch (error: any) {
      return getHttpError(error);
    }
  }
}
