/* eslint-disable no-console */
import "@/infra/config/dotenv";

import { ServiceCategoryGroup } from "generated/prisma/enums";

import { basePrisma } from "@/infra/database";

export const SERVICE_CATEGORIES = [
  // Hair
  {
    slug: "mens-haircut",
    name: "Corte masculino",
    group: ServiceCategoryGroup.HAIR,
  },
  {
    slug: "womens-haircut",
    name: "Corte feminino",
    group: ServiceCategoryGroup.HAIR,
  },
  {
    slug: "kids-haircut",
    name: "Corte infantil",
    group: ServiceCategoryGroup.HAIR,
  },
  {
    slug: "hair-color",
    name: "Coloração",
    group: ServiceCategoryGroup.HAIR,
  },
  {
    slug: "highlights",
    name: "Mechas e luzes",
    group: ServiceCategoryGroup.HAIR,
  },
  {
    slug: "blowout-styling",
    name: "Escova e finalização",
    group: ServiceCategoryGroup.HAIR,
  },
  {
    slug: "updo-hairstyle",
    name: "Penteado",
    group: ServiceCategoryGroup.HAIR,
  },
  {
    slug: "straightening",
    name: "Alisamento e progressiva",
    group: ServiceCategoryGroup.HAIR,
  },
  {
    slug: "hair-treatment",
    name: "Tratamento capilar",
    group: ServiceCategoryGroup.HAIR,
  },
  {
    slug: "braids-dreads",
    name: "Tranças e dreads",
    group: ServiceCategoryGroup.HAIR,
  },

  // Beard
  {
    slug: "beard",
    name: "Barba",
    group: ServiceCategoryGroup.BEARD,
  },
  {
    slug: "edge-up",
    name: "Pezinho e acabamento",
    group: ServiceCategoryGroup.BEARD,
  },
  {
    slug: "haircut-beard-combo",
    name: "Combo cabelo + barba",
    group: ServiceCategoryGroup.BEARD,
  },

  // Face
  {
    slug: "eyebrows",
    name: "Sobrancelha",
    group: ServiceCategoryGroup.FACE,
  },
  {
    slug: "eyelashes",
    name: "Cílios",
    group: ServiceCategoryGroup.FACE,
  },
  {
    slug: "facial-cleansing",
    name: "Limpeza de pele",
    group: ServiceCategoryGroup.FACE,
  },
  {
    slug: "facial-aesthetics",
    name: "Estética facial",
    group: ServiceCategoryGroup.FACE,
  },
  {
    slug: "makeup",
    name: "Maquiagem",
    group: ServiceCategoryGroup.FACE,
  },

  // Nails
  {
    slug: "manicure",
    name: "Manicure",
    group: ServiceCategoryGroup.NAILS,
  },
  {
    slug: "pedicure",
    name: "Pedicure",
    group: ServiceCategoryGroup.NAILS,
  },
  {
    slug: "nail-extensions",
    name: "Alongamento de unhas",
    group: ServiceCategoryGroup.NAILS,
  },
  {
    slug: "nail-art",
    name: "Nail art",
    group: ServiceCategoryGroup.NAILS,
  },

  // Body
  {
    slug: "hair-removal",
    name: "Depilação",
    group: ServiceCategoryGroup.BODY,
  },
  {
    slug: "massage",
    name: "Massagem",
    group: ServiceCategoryGroup.BODY,
  },
  {
    slug: "body-aesthetics",
    name: "Estética corporal",
    group: ServiceCategoryGroup.BODY,
  },

  // Other
  {
    slug: "other",
    name: "Outros",
    group: ServiceCategoryGroup.OTHER,
  },
] as const;

export async function seedServiceCategories() {
  console.log("🌱 Semeando categorias de serviços...");

  let createdCount = 0;
  let updatedCount = 0;

  for (const category of SERVICE_CATEGORIES) {
    const existing = await basePrisma.serviceCategories.findUnique({
      where: { slug: category.slug },
    });

    await basePrisma.serviceCategories.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        group: category.group,
      },
      create: {
        slug: category.slug,
        name: category.name,
        group: category.group,
      },
    });

    if (existing) {
      updatedCount += 1;
    } else {
      createdCount += 1;
    }
  }

  console.log(
    `✅ Categorias de serviço processadas com sucesso! (${createdCount} criadas, ${updatedCount} atualizadas, total: ${SERVICE_CATEGORIES.length})`,
  );
}

export default seedServiceCategories;

const isDirectExecution =
  process.argv[1]?.endsWith("create-service-categories.ts") ||
  process.argv[1]?.endsWith("create-service-categories");

if (isDirectExecution) {
  seedServiceCategories()
    .catch((error) => {
      console.error("❌ Erro ao semear categorias de serviço:", error);
      process.exit(1);
    })
    .finally(async () => {
      await basePrisma.$disconnect();
    });
}
