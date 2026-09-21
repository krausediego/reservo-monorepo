import { Professionals } from "generated/prisma/client";

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
        users: {
          select: {
            email: true,
            phoneNumber: true,
          },
        },
      },
      where: {
        id: params.memberId,
      },
    });

    if (!hasMember) {
      this.log("warn", "Member not found", {
        memberId: params.memberId,
      });
      throw new NotFoundError("Membro não encontrado");
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
      throw new ConflictError(
        "Este membro já está vinculado a outro profissional",
      );
    }

    const hasServices = await this.db.services.findMany({
      select: {
        id: true,
      },
      where: {
        id: { in: params.servicesIds },
        isActive: true,
        deleted: false,
      },
    });

    if (
      params.servicesIds &&
      hasServices.length !== params.servicesIds?.length
    ) {
      this.log("warn", "One or more services not found");
      throw new NotFoundError("Um ou mais serviços não foram encontrados");
    }

    const existing = await this.db.professionals.findFirst({
      select: {
        id: true,
      },
      where: {
        memberId: params.memberId,
        deleted: true,
      },
    });

    const professionalId = existing?.id ?? createId();
    const avatarStorageKey = await this.uploadAvatar({
      organizationId: params.organizationId,
      professionalId,
      image: params.avatar,
    });

    const {
      professional: professionalCreated,
      services: servicesCreated,
      availabilities: availabilitiesCreated,
    } = await this.db
      .$transaction(async (tx) => {
        let professional: Professionals;

        if (existing) {
          this.log(
            "info",
            "Professional already created and deleted, restoring professional with new fields.",
          );

          professional = await this.db.professionals.update({
            data: {
              name: params.name,
              bio: params.bio,
              avatarStorageKey,
              isActive: true,
              deleted: false,
            },
            where: {
              id: existing.id,
            },
          });
        } else {
          professional = await tx.professionals.create({
            data: {
              id: professionalId,
              name: params.name,
              memberId: params.memberId,
              bio: params.bio,
              avatarStorageKey,
            },
          });
        }

        const establishmentAvailabilities =
          await tx.establishmentAvailabilities.findMany();

        const availabilities =
          await tx.professionalAvailabilities.createManyAndReturn({
            data: establishmentAvailabilities.map(
              ({ establishmentId: _, ...availability }) => {
                return {
                  ...availability,
                  professionalId,
                };
              },
            ),
            skipDuplicates: true,
          });

        const services = await tx.professionalServices.createManyAndReturn({
          select: {
            services: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          data: params.servicesIds.map((serviceId) => {
            return {
              organizationId: params.organizationId,
              professionalId,
              serviceId,
            };
          }),
        });

        return { professional, availabilities, services };
      })
      .catch(async (error: any) => {
        if (avatarStorageKey) {
          await this.storage.deleteByKey({
            key: avatarStorageKey,
          });
        }

        this.log("warn", "Error occurred in create professional.");
        throw new BadRequestError(
          error?.message ?? "Ocorreu um erro ao criar o profissional",
        );
      });

    const avatarUrl = await this.getSignedUrl({ key: avatarStorageKey });

    return {
      professional: {
        ...professionalCreated,
        avatarUrl,
        user: {
          email: hasMember.users.email,
          phoneNumber: hasMember.users.phoneNumber,
        },
      },
      availabilities: availabilitiesCreated,
      services: servicesCreated.map((service) => {
        return {
          id: service.services.id,
          name: service.services.name,
        };
      }),
    };
  }

  private async uploadAvatar(
    params: CreateProfessional.UploadImageParams,
  ): Promise<any> {
    if (!params.image) {
      return null;
    }

    const { key } = await this.storage.upload({
      organizationId: params.organizationId,
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
}
