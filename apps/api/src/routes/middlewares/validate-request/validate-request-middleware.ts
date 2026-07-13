import { BadRequestError, getHttpError, Http, ok } from "@/infra";
import { IMiddleware } from "@/routes/middlewares";

import { ValidateMiddleware } from ".";

export class ValidateRequestMiddleware implements IMiddleware {
  async handle(request: Http.IRequest<ValidateMiddleware.IData>) {
    const { body, params, query, schema } = request.data;

    console.log("params", params);

    try {
      await schema.parseAsync({
        body,
        params,
        query,
      });

      return ok({ validated: true });
    } catch (error: any) {
      return getHttpError(new BadRequestError(JSON.parse(error)));
    }
  }
}
