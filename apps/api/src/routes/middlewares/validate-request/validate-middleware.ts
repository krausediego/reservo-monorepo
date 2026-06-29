import { ZodObject } from "zod";

export namespace ValidateMiddleware {
  export interface IData {
    body: Record<string, any>;
    params: any;
    query: Record<string, any>;
    schema: ZodObject;
  }
}
