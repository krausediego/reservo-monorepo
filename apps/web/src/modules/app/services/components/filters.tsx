import { DataFilters } from "@/components/ui/data-filters";
import type { FilterDefinition } from "@/types";
import { useListProfessionalsQuery } from "../../professionals/hooks";
import { ListSortAscending, ListSortDescending } from "lucide-react";
import { useListCategoriesServiceQuery } from "../hooks";

export function ServicesFilters() {
  const { data: professionals } = useListProfessionalsQuery({
    page: 1,
    limit: 100,
    orderBy: "asc",
  });

  const PROFESSIONAL_OPTIONS = professionals?.data?.map(({ professional }) => {
    return { label: professional.name, value: professional.id };
  });

  const { data: categoriesService } = useListCategoriesServiceQuery();

  const CATEGORIES_OPTIONS =
    categoriesService?.groups.flatMap((group) =>
      group.categories!.map((category) => ({
        label: category.name,
        value: category.id,
      })),
    ) ?? [];

  const SERVICE_FILTERS: FilterDefinition[] = [
    {
      type: "tabs",
      key: "isActive",
      options: [
        {
          label: "Todos",
          value: "all",
        },
        {
          label: "Ativos",
          value: true,
        },
        {
          label: "Inativos",
          value: false,
        },
      ],
    },
    { type: "search", key: "name", placeholder: "Buscar serviços..." },
    {
      type: "faceted",
      key: "categories",
      title: "Categorias",
      options: CATEGORIES_OPTIONS ?? [],
    },
    {
      type: "faceted",
      key: "professionals",
      title: "Profissional",
      options: PROFESSIONAL_OPTIONS ?? [],
    },
    {
      type: "select",
      key: "orderBy",
      title: "...",
      options: [
        { label: "Mais recentes", value: "desc", icon: ListSortDescending },
        { label: "Mais antigos", value: "asc", icon: ListSortAscending },
      ],
    },
  ];

  return <DataFilters definitions={SERVICE_FILTERS} />;
}
