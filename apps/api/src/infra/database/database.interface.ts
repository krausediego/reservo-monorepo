import { Prisma, PrismaClient } from "generated/prisma/client";

export interface IDatabase {
  create(params: Database.Params): Database.Response;
}

export namespace Database {
  export type Params = {
    userId: string;
    establishmentId: string;
  };

  export type Response = {
    [K in keyof PrismaClient]: K extends "$transaction"
      ? RelaxedTransaction
      : K extends `$${string}`
        ? PrismaClient[K]
        : RelaxDelegate<PrismaClient[K]>;
  };

  type RelaxedTransactionClient = {
    [K in keyof PrismaClient as K extends `$${string}`
      ? never
      : K]: RelaxDelegate<PrismaClient[K]>;
  };

  type RelaxedTransaction = {
    <R>(
      fn: (tx: RelaxedTransactionClient) => Promise<R>,
      options?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: Prisma.TransactionIsolationLevel;
      },
    ): Promise<R>;
    <R extends any[]>(
      arg: [...R],
      options?: { isolationLevel?: Prisma.TransactionIsolationLevel },
    ): Promise<R>;
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

  type RelaxData<D> = D extends any
    ? D extends Array<infer E>
      ? RelaxAuto<E>[]
      : RelaxAuto<D>
    : never;

  type Flatten<T> = { [K in keyof T]: T[K] };

  type ArgsOf<Fn> = Fn extends { (args: infer P): any }
    ? P
    : Fn extends { (args?: infer P): any }
      ? P
      : never;

  type RetOf<Fn> = Fn extends { (args: any): infer R }
    ? R
    : Fn extends { (args?: any): infer R }
      ? R
      : never;

  type ArgsOptional<Fn> = Fn extends { (args: any): any } ? false : true;

  type RelaxArgs<A> = Flatten<
    Omit<A, "data" | "create" | "update"> &
      (A extends { data: infer D } ? { data: RelaxData<D> } : {}) &
      (A extends { create: infer C } ? { create: RelaxData<C> } : {}) &
      (A extends { update: infer U } ? { update: RelaxData<U> } : {})
  >;

  type RelaxWrite<Fn> = [ArgsOf<Fn>] extends [never]
    ? Fn
    : ArgsOptional<Fn> extends true
      ? (args?: RelaxArgs<ArgsOf<Fn>>) => RetOf<Fn>
      : (args: RelaxArgs<ArgsOf<Fn>>) => RetOf<Fn>;

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
    client: any;
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
