import type { FilterDefinition } from "@/types";
import { useListServicesQuery } from "../../services/hooks";
import { DataFilters } from "@/components/ui/data-filters";

export function ProfessionalsFilters() {
  const { data: services } = useListServicesQuery({
    page: 1,
    limit: 100,
    orderBy: "asc",
  });

  const SERVICES_OPTIONS = services?.data?.map((service) => {
    return { label: service.name, value: service.id };
  });

  const PROFESSIONAL_FILTERS: FilterDefinition[] = [
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
    { type: "search", key: "name", placeholder: "Buscar profissionais..." },
    {
      type: "faceted",
      key: "services",
      title: "Serviços",
      options: SERVICES_OPTIONS ?? [],
    },
  ];

  return <DataFilters definitions={PROFESSIONAL_FILTERS} />;
}
