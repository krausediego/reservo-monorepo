import { getHttpError, type Http, ok } from "@/infra";
import type { IController } from "@/modules/shared";

import type { IListCategoriesService } from ".";

type ListCategoriesServiceHandler = () => IListCategoriesService;

export class ListCategoriesServiceController implements IController {
  constructor(
    private readonly listCategoriesServiceService: ListCategoriesServiceHandler,
  ) {}

  async handle({ locals }: Http.IRequest): Promise<Http.IResponse> {
    try {
      const content = await this.listCategoriesServiceService().run({
        userId: locals.user.id,
        organizationId: locals.session.activeOrganizationId!,
        traceId: locals.traceId,
      });

      return ok({ ...content });
    } catch (error: any) {
      return getHttpError(error);
    }
  }
}
