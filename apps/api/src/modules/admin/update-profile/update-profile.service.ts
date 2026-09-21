import { setTraceId, setDatabaseContext } from "@/helpers";
import {
  type ILoggingManager,
  type IDatabase,
  type IStorage,
  NotFoundError,
} from "@/infra";
import { BaseDatabaseService } from "@/modules/shared";

import type { UpdateProfile, IUpdateProfile } from ".";

export class UpdateProfileService
  extends BaseDatabaseService
  implements IUpdateProfile
{
  constructor(
    protected readonly logger: ILoggingManager,
    protected readonly database: IDatabase,
    protected readonly storage: IStorage,
  ) {
    super(logger, database);
  }

  @setTraceId
  @setDatabaseContext
  async run(params: UpdateProfile.Params): Promise<UpdateProfile.Response> {
    this.log("info", "Starting process update-profile");

    const user = await this.db.users.findFirst({
      where: {
        id: params.userId,
      },
    });

    if (!user) {
      this.log("warn", "User not found", {
        id: params.userId,
      });
      throw new NotFoundError("Usuário não encontrado");
    }

    const imageStorageKey = await this.uploadImage({
      userId: user.id,
      context: "avatar",
      image: params.image,
    });

    const userUpdated = await this.db.users
      .update({
        data: {
          name: params.name,
          phoneNumber: params.phoneNumber,
          image: imageStorageKey ?? user.image,
        },
        where: {
          id: user.id,
        },
      })
      .catch(async () => {
        if (imageStorageKey) {
          await this.removeImage({ key: imageStorageKey });
        }
      });

    if (imageStorageKey && user.image) {
      this.removeImage({ key: user.image });
    }

    const imageUrl = await this.getSignedUrl({
      key: imageStorageKey ?? user.image,
    });

    return {
      user: {
        ...userUpdated!,
        imageUrl,
      },
    };
  }

  private async uploadImage(
    params: UpdateProfile.UploadImageParams,
  ): Promise<string | null> {
    if (!params.image) {
      return null;
    }

    const { key } = await this.storage.upload({
      userId: params.userId,
      context: "admin_users",
      entityId: params.userId,
      fileName: `${params.context}_${Date.now()}.webp`,
      body: Buffer.from(await params.image.arrayBuffer()),
      contentType: params.image.type,
    });

    return key;
  }

  private async removeImage(
    params: UpdateProfile.RemoveImageParams,
  ): Promise<void> {
    await this.storage.deleteByKey({ key: params.key });
  }

  private async getSignedUrl(
    params: UpdateProfile.GetSignedUrlParams,
  ): Promise<string | null> {
    if (!params.key) {
      return null;
    }

    return this.storage.getSignedUrl({ key: params.key });
  }
}
