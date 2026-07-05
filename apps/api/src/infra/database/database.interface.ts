import { PrismaClient } from "generated/prisma/client";

export interface IDatabase {
  create(params: Database.Params): Database.Response;
}

export namespace Database {
  export type Params = {
    userId: string;
    establishmentId: string;
  };

  export type Response = {
    [K in keyof PrismaClient]: K extends `$${string}`
      ? PrismaClient[K]
      : RelaxDelegate<PrismaClient[K]>;
  };

  export type AutoInjectedField =
    | "establishmentId"
    | "createdBy"
    | "updatedBy"
    | "deletedBy";

  type RelaxAuto<T> = T extends object
    ? Omit<T, AutoInjectedField> &
        Partial<Pick<T, Extract<keyof T, AutoInjectedField>>>
    : T;

  type RelaxWrite<Fn> = Fn extends (args: infer A, ...r: infer R) => infer Ret
    ? A extends { data: infer D }
      ? (
          args: Omit<A, "data"> & {
            data: D extends Array<infer E> ? RelaxAuto<E>[] : RelaxAuto<D>;
          },
          ...r: R
        ) => Ret
      : Fn
    : Fn;

  type WriteOp = "create" | "createMany" | "update" | "updateMany" | "upsert";

  type RelaxDelegate<D> = {
    [Op in keyof D]: Op extends WriteOp ? RelaxWrite<D[Op]> : D[Op];
  };

  export type HasDataParams = {
    args: any;
    key: string;
  };

  export type Options = {
    skipTenant?: Set<string>;
    skipAudit?: Set<string>;
  };

  export type Action = "create" | "update" | "delete";

  export type RunAuditedParams = {
    model: string;
    operation: string;
    action: Action;
    args: any;
    query: (args: any) => Promise<unknown>;
    userId: string;
    establishmentId: string;
  };

  export type DiffParams = {
    before: Record<string, any>;
    after: Record<string, any>;
  };

  export type DiffResponse = Record<string, { before: any; after: any }>;

  export type ActionForParams = {
    operation: string;
  };

  export type InjectTenantParams = {
    operation: string;
    args: any;
    establishmentId: string;
  };

  export type InjectActorParams = {
    operation: string;
    args: any;
    userId: string;
  };
}
