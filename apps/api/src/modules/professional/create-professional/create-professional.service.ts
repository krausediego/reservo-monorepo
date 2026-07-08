import { setTraceId, setDatabaseContext } from "@/helpers";
import {
  type ILoggingManager,
  type IDatabase,
  NotFoundError,
  ConflictError,
  IStorage,
  BadRequestError,
} from "@/infra";
import { BaseDatabaseService } from "@/modules/shared";
import { createId } from "@paralleldrive/cuid2";

import type { CreateProfessional, ICreateProfessional } from ".";

export class CreateProfessionalService
  extends BaseDatabaseService
  implements ICreateProfessional
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
    params: CreateProfessional.Params,
  ): Promise<CreateProfessional.Response> {
    this.log("info", "Starting process create-professional");

    const hasMember = await this.db.members.findFirst({
      select: {
        id: true,
        userId: true,
      },
      where: {
        id: params.memberId,
      },
    });

    if (!hasMember) {
      this.log("warn", "Member not found", {
        memberId: params.memberId,
      });
      throw new NotFoundError("Member not found");
    }

    const hasProfessionalWithSameMember = await this.db.professionals.findFirst(
      {
        select: {
          id: true,
        },
        where: {
          memberId: hasMember.id,
          isActive: true,
        },
      },
    );

    if (hasProfessionalWithSameMember) {
      this.log("warn", "Member already linked");
      throw new ConflictError("Member already linked");
    }

    const hasServices = await this.db.services.findMany({
      select: {
        id: true,
      },
      where: {
        id: { in: params.servicesIds },
        isActive: true,
      },
    });

    if (
      params.servicesIds &&
      hasServices.length !== params.servicesIds?.length
    ) {
      this.log("warn", "One or more services not found");
      throw new NotFoundError("One or more services not found");
    }

    const professionalId = createId();
    const avatarStorageKey = await this.uploadAvatar({
      establishmentId: params.establishmentId,
      professionalId,
      image: params.avatar,
    });

    await this.createProfessional({
      ...params,
      professionalId,
      avatarStorageKey,
      userId: hasMember.userId,
    }).catch(async (error: any) => {
      if (avatarStorageKey) {
        await this.storage.deleteByKey({
          key: avatarStorageKey,
        });
      }

      this.log("warn", "Error occurred in create professional.");
      throw new BadRequestError(
        error?.message ?? "Error occurred in create professional.",
      );
    });

    const services = await this.db.services.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        id: { in: params.servicesIds },
      },
    });

    const userMember = await this.db.users.findFirst({
      select: {
        id: true,
        name: true,
        email: true,
      },
      where: {
        id: params.userId,
      },
    });

    const avatarUrl = await this.getSignedUrl({
      key: avatarStorageKey,
    });

    return {
      name: params.name,
      bio: params.bio,
      member: {
        user: userMember!,
      },
      services,
      avatarUrl,
    };
  }

  private async createProfessional(
    params: CreateProfessional.Params & {
      professionalId: string;
      avatarStorageKey: string | null;
      userId: string;
    },
  ): Promise<void> {
    await this.db.$transaction(async (tx) => {
      await tx.professionals.create({
        data: {
          id: params.professionalId,
          name: params.name,
          memberId: params.memberId,
          bio: params.bio,
          avatarStorageKey: params.avatarStorageKey,
        },
      });

      await tx.professionalAvailabilities.createMany({
        data: this.getDefaultProfessionalAvailabilities(params.professionalId),
        skipDuplicates: true,
      });

      if (params.servicesIds?.length) {
        await tx.professionalServices.createMany({
          data: params.servicesIds.map((service) => {
            return {
              professionalId: params.professionalId,
              serviceId: service,
            };
          }),
        });
      }
    });
  }

  private async uploadAvatar(
    params: CreateProfessional.UploadImageParams,
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

  private async getSignedUrl(
    params: CreateProfessional.GetSignedUrlParams,
  ): Promise<string | null> {
    if (!params.key) {
      return null;
    }

    return this.storage.getSignedUrl({ key: params.key });
  }

  private getDefaultProfessionalAvailabilities(professionalId: string) {
    return [
      { professionalId, dayOfWeek: 0, startTime: "08:00", endTime: "18:00" },
      { professionalId, dayOfWeek: 1, startTime: "08:00", endTime: "18:00" },
      { professionalId, dayOfWeek: 2, startTime: "08:00", endTime: "18:00" },
      { professionalId, dayOfWeek: 3, startTime: "08:00", endTime: "18:00" },
      { professionalId, dayOfWeek: 4, startTime: "08:00", endTime: "18:00" },
      { professionalId, dayOfWeek: 5, startTime: "08:00", endTime: "18:00" },
      { professionalId, dayOfWeek: 6, startTime: "08:00", endTime: "18:00" },
    ];
  }
}
