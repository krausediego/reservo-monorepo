import { setTraceId } from "@/helpers";
import {
  BadRequestError,
  basePrisma,
  IStorage,
  NotAllowedError,
  type ILoggingManager,
} from "@/infra";
import { BaseService } from "@/modules/shared";

import type { GetEstablishment, IGetEstablishment } from ".";

export class GetEstablishmentService
  extends BaseService
  implements IGetEstablishment
{
  constructor(
    protected readonly logger: ILoggingManager,
    private readonly storage: IStorage,
  ) {
    super(logger);
  }

  @setTraceId
  async run(
    params: GetEstablishment.Params,
  ): Promise<GetEstablishment.Response> {
    this.log("info", "Starting process get-establishment");

    const hasMember = await basePrisma.members.findFirst({
      select: {
        organizationId: true,
      },
      where: {
        userId: params.userId,
      },
    });

    if (!hasMember) {
      this.log("warn", "You are not part of an organization.");
      throw new NotAllowedError("You are not part of an organization.");
    }

    const establishment = await basePrisma.establishments.findFirst({
      where: {
        organizationId: hasMember.organizationId,
      },
    });

    if (!establishment) {
      this.log("warn", "Establishment not found.", {
        organizationId: hasMember.organizationId,
      });
      throw new BadRequestError("Establishment not found.");
    }

    const {
      logoStorageKey,
      coverStorageKey,
      latitude,
      longitude,
      businessHours,
      ...restEstablishment
    } = establishment;

    const logoSignedUrl = await this.getSignedUrl({ key: logoStorageKey });
    const coverSignedUrl = await this.getSignedUrl({ key: coverStorageKey });

    return {
      establishment: {
        ...restEstablishment,
        latitude: latitude.toNumber(),
        longitude: longitude.toNumber(),
        businessHours: JSON.parse(businessHours!.toString()),
        logoUrl: logoSignedUrl,
        coverUrl: coverSignedUrl,
      },
    };
  }

  private async getSignedUrl(
    params: GetEstablishment.GetSignedUrlParams,
  ): Promise<string | null> {
    if (!params.key) {
      return null;
    }

    return this.storage.getSignedUrl({ key: params.key });
  }
}
