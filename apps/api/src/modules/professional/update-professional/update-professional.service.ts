import { setTraceId, setDatabaseContext } from "@/helpers";
import {
  type ILoggingManager,
  type IDatabase,
  NotFoundError,
  IStorage,
  BadRequestError,
} from "@/infra";
import { BaseDatabaseService } from "@/modules/shared";

import type { UpdateProfessional, IUpdateProfessional } from ".";

export class UpdateProfessionalService
  extends BaseDatabaseService
  implements IUpdateProfessional
{
  constructor(
    protected readonly logger: ILoggingManager,
    protected readonly database: IDatabase,
    private readonly storage: IStorage,
  ) {
    super(logger, database);
  }

  @setTraceId
  @setDatabaseContext
  async run(
    params: UpdateProfessional.Params,
  ): Promise<UpdateProfessional.Response> {
    this.log("info", "Starting process update-professional");

    const hasProfessional = await this.db.professionals.findUnique({
      select: {
        id: true,
        avatarStorageKey: true,
      },
      where: {
        id: params.id,
        isActive: true,
      },
    });

    if (!hasProfessional) {
      this.log("warn", "Professional not found", {
        id: params.id,
      });
      throw new NotFoundError("Professional not found");
    }

    const avatarStorageKey = await this.uploadAvatar({
      image: params.avatar,
      professionalId: hasProfessional.id,
      establishmentId: params.establishmentId,
    });

    let updatedProfessional = null;
    try {
      updatedProfessional = await this.db.professionals.update({
        data: {
          name: params.name,
          bio: params.bio,
          avatarStorageKey:
            avatarStorageKey ?? hasProfessional.avatarStorageKey,
        },
        where: {
          id: hasProfessional.id,
        },
      });
    } catch (error: any) {
      if (avatarStorageKey) {
        await this.storage.deleteByKey({ key: avatarStorageKey });
      }

      this.log("warn", "Error in update professional", {
        id: params.id,
        message: error?.message,
      });
      throw new BadRequestError("Error in update professional");
    }

    if (hasProfessional.avatarStorageKey) {
      try {
        await this.storage.deleteByKey({
          key: hasProfessional.avatarStorageKey,
        });
      } catch (error: any) {
        this.log("error", "An error occurred in delete old avatar image", {
          oldAvatarImageKey: hasProfessional.avatarStorageKey,
          professionalId: params.id,
          newAvatarImageKey: avatarStorageKey,
          message: error?.message,
        });
      }
    }

    const avatarUrl = await this.getSignedUrl({
      key: updatedProfessional.avatarStorageKey,
    });

    return {
      professional: {
        ...updatedProfessional,
        avatarUrl,
      },
    };
  }

  private async getSignedUrl(
    params: UpdateProfessional.GetSignedUrlParams,
  ): Promise<string | null> {
    if (!params.key) {
      return null;
    }

    return this.storage.getSignedUrl({ key: params.key });
  }

  private async uploadAvatar(
    params: UpdateProfessional.UploadImageParams,
  ): Promise<any> {
    if (!params.image) {
      return null;
    }

    const { key } = await this.storage.upload({
      establishmentId: params.establishmentId,
      context: "professionals",
      entityId: params.professionalId,
      fileName: `avatar_${Date.now()}.webp`,
      body: Buffer.from(await params.image.arrayBuffer()),
      contentType: params.image.type,
    });

    return key;
  }
}
