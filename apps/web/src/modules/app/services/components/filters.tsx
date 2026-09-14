import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";

export function ServicesFilters() {
  return (
    <div className="flex w-full gap-2">
      <InputGroup className="w-auto">
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput placeholder="Buscar serviços..." />
      </InputGroup>
    </div>
  );
}
