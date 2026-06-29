export interface IHttpRequest {
  get<T = any>(input: HttpRequest.Get): Promise<T>;
  post<T = any>(input: HttpRequest.Post): Promise<T>;
  put<T = any>(input: HttpRequest.Put): Promise<T>;
  delete<T = any>(input: HttpRequest.Delete): Promise<T>;
}

export namespace HttpRequest {
  export type Get = {
    url: string;
    headers?: Record<string, any>;
    timeout?: number;
  };

  export type Post = {
    url: string;
    headers?: Record<string, any>;
    data?: Record<string, any>;
    timeout?: number;
  };

  export type Put = {
    url: string;
    headers?: Record<string, any>;
    data?: Record<string, any>;
    timeout?: number;
  };

  export type Delete = {
    url: string;
    headers?: Record<string, any>;
    data?: Record<string, any>;
    timeout?: number;
  };
}
