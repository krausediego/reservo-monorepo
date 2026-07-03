export namespace LimitMiddleware {
  export type GetActiveLimitsParams = {
    organizationId: string;
    headers: Headers;
  };

  export type GetActiveLimitsResponse = Record<LimitKey, number> | null;

  export type LimitKey = "professionals" | "services" | "products" | "members";
}
