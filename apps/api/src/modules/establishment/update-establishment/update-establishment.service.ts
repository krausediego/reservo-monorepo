import { generateUniqueSlug, setTraceId } from "@/helpers";
import {
  BadRequestError,
  basePrisma,
  ConflictError,
  IStorage,
  NotFoundError,
  type ILoggingManager,
} from "@/infra";
import { BaseService } from "@/modules/shared";

import type { UpdateEstablishment, IUpdateEstablishment } from ".";

export class UpdateEstablishmentService
  extends BaseService
  implements IUpdateEstablishment
{
  constructor(
    protected readonly logger: ILoggingManager,
    private readonly storage: IStorage,
  ) {
    super(logger);
  }

  @setTraceId
  async run(
    params: UpdateEstablishment.Params,
  ): Promise<UpdateEstablishment.Response | undefined> {
    this.log("info", "Starting process update-establishment");

    const hasEstablishment = await basePrisma.establishments.findFirst({
      select: {
        logoStorageKey: true,
        coverStorageKey: true,
        cnpj: true,
        slug: true,
        name: true,
      },
      where: {
        id: params.id,
        organizationId: params.organizationId,
        isActive: true,
      },
    });

    if (!hasEstablishment) {
      this.log("warn", "Establishment not found");
      throw new NotFoundError("Establishment not found");
    }

    if (params.cnpj !== hasEstablishment.cnpj) {
      const hasSameCnpj = await basePrisma.establishments.findFirst({
        select: {
          id: true,
        },
        where: {
          cnpj: params.cnpj,
        },
      });

      if (hasSameCnpj) {
        this.log(
          "warn",
          "There is already an establishment with the same CNPJ provided.",
          {
            theSameEstablishment: hasSameCnpj.id,
            cnpjProvided: params.cnpj,
          },
        );
        throw new ConflictError(
          "There is already an establishment with the same CNPJ provided.",
        );
      }
    }

    let establishmentSlug: string = hasEstablishment.slug;
    if (params.name !== hasEstablishment.name) {
      establishmentSlug = await generateUniqueSlug(params.name, (slugName) =>
        basePrisma.organizations.count({
          where: {
            slug: slugName,
          },
        }),
      );
    }

    const logoStorageKey = await this.uploadImage({
      establishmentId: params.id,
      context: "logo",
      image: params.logo,
    });

    const coverStorageKey = await this.uploadImage({
      establishmentId: params.id,
      context: "cover",
      image: params.cover,
    });

    try {
      const { establishment } = await basePrisma.$transaction(async (tx) => {
        const establishmentUpdated = await tx.establishments.update({
          data: {
            name: params.name,
            slug: establishmentSlug,
            cnpj: params.cnpj,
            description: params.description,
            address: params.address,
            city: params.city,
            state: params.state,
            zipCode: params.zipCode,
            latitude: params.latitude,
            longitude: params.longitude,
            businessHours: JSON.stringify(params.businessHours),
            phone: params.phone,
            logoStorageKey,
            coverStorageKey,
          },
          where: {
            id: params.id,
          },
        });

        if (establishmentSlug !== hasEstablishment.slug) {
          await tx.organizations.update({
            data: {
              slug: establishmentSlug,
            },
            where: {
              id: params.organizationId,
            },
          });
        }

        return { establishment: establishmentUpdated };
      });

      return {
        establishment: {
          ...establishment,
          businessHours: JSON.parse(establishment.businessHours!.toString()),
          latitude: establishment.latitude.toNumber(),
          longitude: establishment.longitude.toNumber(),
          logoUrl: null,
          coverUrl: null,
        },
      };
    } catch (error: any) {
      if (error?.message) {
        this.log(
          "warn",
          "An error occurred while updating the establishment.",
          { message: error?.message },
        );
        throw new BadRequestError(
          "An error occurred while updating the establishment.",
        );
      }
    }

    return undefined;
  }

  private async uploadImage(
    params: UpdateEstablishment.UploadImageParams,
  ): Promise<string | null> {
    if (!params.image) {
      return null;
    }

    const { key } = await this.storage.upload({
      establishmentId: params.establishmentId,
      context: "establishments",
      entityId: params.establishmentId,
      fileName: `${params.context}_${Date.now()}.webp`,
      body: Buffer.from(await params.image.arrayBuffer()),
      contentType: params.image.type,
    });

    return key;
  }

  private async removeImage(
    params: UpdateEstablishment.RemoveImageParams,
  ): Promise<void> {
    await this.storage.deleteByKey({ key: params.key });
  }
}
