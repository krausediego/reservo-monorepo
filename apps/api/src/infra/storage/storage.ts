export interface IStorage {
  upload(params: Storage.UploadParams): Promise<Storage.UploadResponse>;
  delete(params: Storage.DeleteParams): Promise<void>;
  deleteByKey(params: Storage.DeleteByKeyParams): Promise<void>;
  getSignedUrl(params: Storage.GetSignedUrlParams): Promise<string>;
  getUploadSignedUrl(
    params: Storage.GetUploadSignedUrlParams,
  ): Promise<Storage.GetUploadSignedUrlResponse>;
  getFileInfo(
    params: Storage.GetFileInfoParams,
  ): Promise<Storage.GetFileInfoResponse>;
  listFiles(
    params: Storage.ListFilesParams,
  ): Promise<Storage.ListFilesResponse[]>;
  move(params: Storage.MoveParams): Promise<void>;
}

export namespace Storage {
  export type UploadParams = BuildKeyParams & {
    body: Buffer | Uint8Array | ReadableStream;
    contentType: string;
    metadata?: Record<string, string>;
  };

  export type UploadResponse = {
    key: string;
  };

  export type BuildKeyParams = {
    organizationId: string;
    context: StorageContext;
    entityId: string;
    fileName: string;
  };

  export type DeleteParams = BuildKeyParams;

  export type DeleteByKeyParams = {
    key: string;
  };

  export type GetSignedUrlParams = {
    key: string;
    expiresInSeconds?: number;
  };

  export type GetUploadSignedUrlParams = {
    organizationId: string;
    context: StorageContext;
    entityId: string;
    fileName: string;
    contentType: string;
    expiresInSeconds: number;
  };

  export type GetUploadSignedUrlResponse = {
    uploadUrl: string;
    key: string;
  };

  export type GetFileInfoParams = {
    key: string;
  };

  export type GetFileInfoResponse = {
    key: string;
    size: number;
    lastModified: Date;
    contentType?: string;
    metadata?: Record<string, string>;
  };

  export type ListFilesParams = {
    organizationId: string;
    context: StorageContext;
    entityId: string;
  };

  export type MoveParams = {
    sourceKey: string;
    destinationKey: string;
  };

  export type ListFilesResponse = GetFileInfoResponse;

  export type StorageContext = "users" | "establishments" | "professionals";
}
