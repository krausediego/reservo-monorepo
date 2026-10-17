/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Prisma, PrismaClient } from "@generated/prisma/client";

/**
 * Campos preenchidos automaticamente pela extension de tenant/auditoria.
 * Ficam opcionais nos `data`/`create`/`update` do `TenantDatabase`.
 */
export type AutoInjectedField =
  | "organizationId"
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

type TenantTransactionClient = {
  [K in keyof PrismaClient as K extends `$${string}`
    ? never
    : K]: RelaxDelegate<PrismaClient[K]>;
};

type TenantTransaction = {
  <R>(
    fn: (tx: TenantTransactionClient) => Promise<R>,
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

/**
 * Client do Prisma com escopo de tenant: `organizationId` é injetado em
 * todas as queries e as escritas geram `AuditLogs`.
 */
export type TenantDatabase = {
  [K in keyof PrismaClient]: K extends "$transaction"
    ? TenantTransaction
    : K extends `$${string}`
      ? PrismaClient[K]
      : RelaxDelegate<PrismaClient[K]>;
};

export type TenantContext = {
  organizationId: string;
  userId: string;
};

export type AuditAction = "create" | "update" | "delete";
