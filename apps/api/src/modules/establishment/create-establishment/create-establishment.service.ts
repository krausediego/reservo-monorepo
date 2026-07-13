import { generateUniqueSlug, setTraceId } from "@/helpers";
import {
  BadRequestError,
  basePrisma,
  ConflictError,
  IStorage,
  type ILoggingManager,
} from "@/infra";
import { BaseService } from "@/modules/shared";
import { createId } from "@paralleldrive/cuid2";

import type { CreateEstablishment, ICreateEstablishment } from ".";

export class CreateEstablishmentService
  extends BaseService
  implements ICreateEstablishment
{
  constructor(
    protected readonly logger: ILoggingManager,
    private readonly storage: IStorage,
  ) {
    super(logger);
  }

  @setTraceId
  async run(
    params: CreateEstablishment.Params,
  ): Promise<CreateEstablishment.Response | undefined> {
    this.log("info", "Starting process create-establishment");

    const alreadyMember = await basePrisma.members.findFirst({
      select: {
        id: true,
      },
      where: {
        userId: params.userId,
      },
    });

    if (alreadyMember) {
      this.log("warn", "User already member with organization.");
      throw new ConflictError("User already member with organization.");
    }

    const alreadyEstablishment = await basePrisma.establishments.findFirst({
      select: {
        id: true,
      },
      where: {
        cnpj: params.cnpj,
      },
    });

    if (alreadyEstablishment) {
      this.log("warn", "Establishment already exists.", {
        sameEstablishment: alreadyEstablishment.id,
        insertNewCnpj: params.cnpj,
      });
      throw new ConflictError("Establishment already exists.");
    }

    const slug = await generateUniqueSlug(params.name, (slugName) =>
      basePrisma.organizations.count({
        where: {
          slug: slugName,
        },
      }),
    );

    const establishmentId = createId();

    const logoStorageKey = await this.uploadImage({
      establishmentId,
      organizationId: params.organizationId,
      context: "logo",
      image: params.logo,
    });

    const coverStorageKey = await this.uploadImage({
      establishmentId,
      organizationId: params.organizationId,
      context: "cover",
      image: params.cover,
    });

    try {
      const { establishment } = await basePrisma.$transaction(async (tx) => {
        const { id } = await tx.organizations.create({
          data: {
            name: params.name,
            slug,
          },
        });

        await tx.members.create({
          data: {
            userId: params.userId,
            organizationId: id,
            role: "OWNER",
          },
        });

        const establishmentCreated = await tx.establishments.create({
          data: {
            id: establishmentId,
            organizationId: id,
            name: params.name,
            slug,
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
        });

        return { establishment: establishmentCreated };
      });

      const logoSignedUrl = await this.getSignedUrl({ key: logoStorageKey });
      const coverSignedUrl = await this.getSignedUrl({ key: coverStorageKey });

      return {
        establishment: {
          ...establishment,
          businessHours: JSON.parse(establishment.businessHours!.toString()),
          latitude: establishment.latitude.toNumber(),
          longitude: establishment.longitude.toNumber(),
          logoUrl: logoSignedUrl,
          coverUrl: coverSignedUrl,
        },
      };
    } catch (error: any) {
      if (logoStorageKey) {
        await this.removeImage({ key: logoStorageKey });
      }

      if (coverStorageKey) {
        await this.removeImage({ key: coverStorageKey });
      }

      if (error?.message) {
        this.log(
          "warn",
          "An error occurred while creating the establishment.",
          { message: error?.message },
        );
        throw new BadRequestError(
          "An error occurred while creating the establishment.",
        );
      }
    }

    return undefined;
  }

  private async uploadImage(
    params: CreateEstablishment.UploadImageParams,
  ): Promise<string | null> {
    if (!params.image) {
      return null;
    }

    const { key } = await this.storage.upload({
      organizationId: params.organizationId,
      context: "establishments",
      entityId: params.establishmentId,
      fileName: `${params.context}_${Date.now()}.webp`,
      body: Buffer.from(await params.image.arrayBuffer()),
      contentType: params.image.type,
    });

    return key;
  }

  private async getSignedUrl(
    params: CreateEstablishment.GetSignedUrlParams,
  ): Promise<string | null> {
    if (!params.key) {
      return null;
    }

    return this.storage.getSignedUrl({ key: params.key });
  }

  private async removeImage(
    params: CreateEstablishment.RemoveImageParams,
  ): Promise<void> {
    await this.storage.deleteByKey({ key: params.key });
  }
}
