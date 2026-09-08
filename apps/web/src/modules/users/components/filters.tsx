import { Button } from "@/components/ui/button";
import { FacetedFilter } from "@/components/ui/faceted-filter";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Search, X } from "lucide-react";

const ROLE_OPTIONS = [
  { label: "Líder", value: "OWNER" },
  { label: "Gerenciador", value: "MANAGER" },
];

const NON_FILTER_KEYS = ["page", "limit"];

export function UsersFilters() {
  const navigate = useNavigate({ from: "/users/" });
  const search = useSearch({ from: "/_app/users/" });

  const isFiltered = Object.entries(search).some(([key, value]) => {
    if (NON_FILTER_KEYS.includes(key)) return false;
    if (Array.isArray(value)) return value.length > 0;
    return Boolean(value);
  });

  function handleFilterChange(name: string) {
    navigate({
      search: (prev) => ({
        ...prev,
        name: name || undefined,
      }),
    });
  }

  function handleRolesChange(roles: string[]) {
    navigate({
      search: (prev) => ({
        ...prev,
        roles: roles.length > 0 ? roles.join(",") : undefined,
      }),
    });
  }

  function handleResetFilters() {
    navigate({
      search: {
        name: undefined,
        roles: undefined,
      },
    });
  }

  const selectedRoles = search.roles ? search.roles.split(",") : [];

  return (
    <div className="flex w-full gap-2">
      <InputGroup className="w-auto">
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Buscar usuários..."
          value={search.name ?? ""}
          onChange={(e) => handleFilterChange(e.target.value)}
        />
      </InputGroup>

      <FacetedFilter
        title="Permissão"
        options={ROLE_OPTIONS}
        selectedValues={selectedRoles}
        onSelect={handleRolesChange}
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
