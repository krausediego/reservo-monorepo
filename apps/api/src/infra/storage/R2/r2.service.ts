import { StorageEnv } from "@/infra/config";
import { ILoggingManager } from "@/infra/logging";
import { BaseService } from "@/modules/shared";
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { IStorage, Storage } from "../storage";

export class R2Service extends BaseService implements IStorage {
  private client: S3Client;

  private bucket: string;

  constructor(logger: ILoggingManager) {
    super(logger);
    this.bucket = StorageEnv.bucketName;

    this.client = new S3Client({
      region: "auto",
      endpoint: `https://${StorageEnv.accountID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: StorageEnv.accessKeyID,
        secretAccessKey: StorageEnv.secretAccessKey,
      },
    });
  }

  async upload({
    establishmentId,
    context,
    entityId,
    fileName,
    body,
    contentType,
    metadata,
  }: Storage.UploadParams): Promise<Storage.UploadResponse> {
    const key = this.buildKey({ establishmentId, context, entityId, fileName });

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        Metadata: metadata,
      }),
    );

    return { key };
  }

  async delete({
    establishmentId,
    context,
    entityId,
    fileName,
  }: Storage.DeleteParams): Promise<void> {
    const key = this.buildKey({ establishmentId, context, entityId, fileName });

    await this.deleteByKey({ key });
  }

  async deleteByKey({ key }: Storage.DeleteByKeyParams): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  async getSignedUrl({
    key,
    expiresInSeconds = 3600,
  }: Storage.GetSignedUrlParams): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.client, command, { expiresIn: expiresInSeconds });
  }

  async getUploadSignedUrl({
    establishmentId,
    context,
    entityId,
    fileName,
    contentType,
    expiresInSeconds,
  }: Storage.GetUploadSignedUrlParams): Promise<Storage.GetUploadSignedUrlResponse> {
    const key = this.buildKey({ establishmentId, context, entityId, fileName });

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(this.client, command, {
      expiresIn: expiresInSeconds,
    });

    return { uploadUrl, key };
  }

  async getFileInfo({
    key,
  }: Storage.GetFileInfoParams): Promise<Storage.GetFileInfoResponse> {
    const { ContentLength, LastModified, ContentType, Metadata } =
      await this.client.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );

    return {
      key,
      size: ContentLength ?? 0,
      lastModified: LastModified ?? new Date(),
      contentType: ContentType,
      metadata: Metadata,
    };
  }

  async listFiles({
    establishmentId,
    context,
    entityId,
  }: Storage.ListFilesParams): Promise<Storage.ListFilesResponse[]> {
    const prefix = `${establishmentId}/${context}/${entityId}/`;

    const { Contents } = await this.client.send(
      new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: prefix,
      }),
    );

    return (Contents ?? []).map(({ Key, Size, LastModified }) => ({
      key: Key!,
      size: Size ?? 0,
      lastModified: LastModified ?? new Date(),
    }));
  }

  async move({ sourceKey, destinationKey }: Storage.MoveParams): Promise<void> {
    await this.client.send(
      new CopyObjectCommand({
        Bucket: this.bucket,
        CopySource: `${this.bucket}/${sourceKey}`,
        Key: destinationKey,
      }),
    );

    await this.deleteByKey({ key: sourceKey });
  }

  private buildKey({
    establishmentId,
    context,
    entityId,
    fileName,
  }: Storage.BuildKeyParams): string {
    return `${establishmentId}/${context}/${entityId}/${fileName}`;
  }
}
