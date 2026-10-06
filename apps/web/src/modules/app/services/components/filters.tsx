import { DataFilters } from "@/components/ui/data-filters";
import type { FilterDefinition } from "@/types";
import { useListProfessionalsQuery } from "../../professionals/hooks";

export function ServicesFilters() {
  const { data: professionals } = useListProfessionalsQuery({
    page: 1,
    limit: 100,
    orderBy: "asc",
  });

  const PROFESSIONAL_OPTIONS = professionals?.data?.map(({ professional }) => {
    return { label: professional.name, value: professional.id };
  });

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
      key: "professionals",
      title: "Profissional",
      options: PROFESSIONAL_OPTIONS ?? [],
    },
  ];

  return <DataFilters definitions={SERVICE_FILTERS} />;
}
