/* eslint-disable react-hooks/set-state-in-effect */
import { Button } from "@/components/ui/button";
import { FacetedFilter } from "@/components/ui/faceted-filter";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useDebouncedCallback } from "@/hooks";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

const ROLE_OPTIONS = [
  { label: "Líder", value: "OWNER" },
  { label: "Gerenciador", value: "MANAGER" },
];

const NON_FILTER_KEYS = ["page", "limit"];

type Filters = {
  name?: string;
  roles?: string[];
};

export function UsersFilters() {
  const navigate = useNavigate({ from: "/users/" });
  const search = useSearch({ from: "/_app/users/" });

  // Estado local para manter todos os filtros sincronizados e com resposta visual imediata
  const [filters, setFilters] = useState<Filters>({
    name: search.name ?? "",
    roles: search.roles ? search.roles.split(",") : [],
  });

  // Sincroniza o estado local caso a URL mude externamente (ex: voltar no histórico)
  useEffect(() => {
    setFilters({
      name: search.name ?? "",
      roles: search.roles ? search.roles.split(",") : [],
    });
  }, [search.name, search.roles]);

  const isFiltered =
    Object.entries(search).some(([key, value]) => {
      if (NON_FILTER_KEYS.includes(key)) return false;
      if (Array.isArray(value)) return value.length > 0;
      return Boolean(value);
    }) ||
    Boolean(filters.name) ||
    (filters.roles && filters.roles.length > 0);

  // Debounce que atualiza a URL com TODOS os filtros acumulados
  const debouncedNavigate = useDebouncedCallback((updatedFilters: Filters) => {
    navigate({
      search: (prev) => ({
        ...prev,
        name: updatedFilters.name ? updatedFilters.name : undefined,
        roles:
          updatedFilters.roles && updatedFilters.roles.length > 0
            ? updatedFilters.roles.join(",")
            : undefined,
        page: 1,
      }),
    });
  }, 500);

  function handleFilterChange(partial: Partial<Filters>) {
    setFilters((prev) => {
      const next = { ...prev, ...partial };
      debouncedNavigate(next);
      return next;
    });
  }

  function handleResetFilters() {
    debouncedNavigate.cancel();
    setFilters({ name: "", roles: [] });
    navigate({
      search: (prev) => ({
        ...prev,
        name: undefined,
        roles: undefined,
        page: 1,
      }),
    });
  }

  return (
    <div className="flex w-full gap-2">
      <InputGroup className="w-auto">
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Buscar usuários..."
          value={filters.name ?? ""}
          onChange={(e) => handleFilterChange({ name: e.target.value })}
        />
      </InputGroup>

      <FacetedFilter
        title="Permissão"
        options={ROLE_OPTIONS}
        selectedValues={filters.roles ?? []}
        onSelect={(values) => handleFilterChange({ roles: values })}
      />

      {isFiltered && (
        <Button variant="ghost" onClick={handleResetFilters}>
          Limpar
          <X />
        </Button>
      )}
    </div>
  );
}
