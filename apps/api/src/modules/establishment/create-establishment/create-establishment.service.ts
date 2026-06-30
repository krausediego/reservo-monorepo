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
  ): Promise<CreateEstablishment.Response> {
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
        cnpj: params.body.cnpj,
      },
    });

    if (alreadyEstablishment) {
      this.log("warn", "Establishment already exists.", {
        sameEstablishment: alreadyEstablishment.id,
        insertNewCnpj: params.body.cnpj,
      });
      throw new ConflictError("Establishment already exists.");
    }

    const slug = await generateUniqueSlug(params.body.name, (slugName) =>
      basePrisma.organizations.count({
        where: {
          slug: slugName,
        },
      }),
    );

    const establishmentId = createId();

    try {
      const { establishment } = await basePrisma.$transaction(async (tx) => {
        const { id } = await tx.organizations.create({
          data: {
            name: params.body.name,
            slug,
          },
        });

        const establishmentCreated = await tx.establishments.create({
          data: {
            id: establishmentId,
            organizationId: id,
            name: params.body.name,
            slug,
            cnpj: params.body.cnpj,
            description: params.body.description,
            address: params.body.address,
            city: params.body.city,
            state: params.body.state,
            zipCode: params.body.zipCode,
            latitude: params.body.latitude,
            longitude: params.body.longitude,
            businessHours: JSON.stringify(params.body.businessHours),
            phone: params.body.phone,
            logoStorageKey: await this.uploadImage({
              establishmentId,
              image: params.body.logo,
            }),
            coverStorageKey: await this.uploadImage({
              establishmentId,
              image: params.body.cover,
            }),
          },
        });

        return { establishment: establishmentCreated };
      });

      return {
        establishment: {
          ...establishment,
          businessHours: JSON.parse(establishment.businessHours!.toString()),
          latitude: establishment.latitude.toNumber(),
          longitude: establishment.longitude.toNumber(),
        },
      };
    } catch (error: any) {
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
  }

  private async uploadImage(
    params: CreateEstablishment.UploadImageParams,
  ): Promise<string | null> {
    if (!params.image) {
      return null;
    }

    const { key } = await this.storage.upload({
      establishmentId: params.establishmentId,
      context: "establishments",
      entityId: params.establishmentId,
      fileName: `logo_${Date.now()}.webp`,
      body: Buffer.from(await params.image.arrayBuffer()),
      contentType: params.image.type,
    });

    return key;
  }
}
