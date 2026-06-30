import { Sessions, Users } from "generated/prisma/client";

export namespace Http {
  export interface IRequest<Data = any> {
    method: string;
    path: string;
    data: Data;
    locals: {
      traceId: string;
      session: Sessions;
      user: Users;
    };
  }

  export interface IResponse {
    statusCode: number;
    code?: number;
    body?: any;
  }
}
