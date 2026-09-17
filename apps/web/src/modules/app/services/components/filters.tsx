import { DataFilters } from "@/components/ui/data-filters";
import type { FilterDefinition } from "@/types";

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
];

export function ServicesFilters() {
  return <DataFilters definitions={SERVICE_FILTERS} />;
}
