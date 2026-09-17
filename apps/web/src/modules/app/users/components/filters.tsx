import { DataFilters } from "@/components/ui/data-filters";
import type { FilterDefinition } from "@/types";

const ROLE_OPTIONS = [
  { label: "Líder", value: "OWNER" },
  { label: "Gerenciador", value: "MANAGER" },
];

const USER_FILTERS: FilterDefinition[] = [
  { type: "search", key: "name", placeholder: "Buscar usuários..." },
  {
    type: "faceted",
    key: "roles",
    title: "Permissão",
    options: ROLE_OPTIONS,
  },
];

export function UsersFilters() {
  return <DataFilters definitions={USER_FILTERS} />;
}
