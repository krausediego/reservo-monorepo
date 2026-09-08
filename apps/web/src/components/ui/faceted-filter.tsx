// src/components/ui/faceted-filter.tsx
import * as React from "react";
import { Check, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

export interface FacetedFilterOption {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number; // Contador à direita (ex: 3, 5, 4 do seu print)
}

interface FacetedFilterProps {
  title?: string;
  options: FacetedFilterOption[];
  selectedValues?: string[];
  onSelect?: (values: string[]) => void;
}

export function FacetedFilter({
  title,
  options,
  selectedValues = [],
  onSelect,
}: FacetedFilterProps) {
  const selectedSet = new Set(selectedValues);

  const handleSelect = (value: string) => {
    const next = new Set(selectedSet);
    if (next.has(value)) {
      next.delete(value);
    } else {
      next.add(value);
    }
    onSelect?.(Array.from(next));
  };

  const handleClear = () => {
    onSelect?.([]);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-dashed">
          <PlusCircle className="size-4" />
          {title}
          {selectedSet.size > 0 && (
            <>
              <Separator orientation="vertical" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedSet.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedSet.size > 0 && (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedSet.size}
                  </Badge>
                )}
              </div>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-50 p-0" align="start">
        <Command className="p-0">
          <DropdownMenuGroup>
            <CommandInput
              inputGroupClassName="bg-transparent border-none p-0"
              autoFocus
              placeholder={title}
            />
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <CommandList>
              <CommandEmpty>Nenhum resultado.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selectedSet.has(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => handleSelect(option.value)}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible",
                        )}
                      >
                        <Check className="size-4" />
                      </div>
                      {option.icon && (
                        <option.icon className="mr-2 size-4 text-muted-foreground" />
                      )}
                      <span>{option.label}</span>
                      {option.count !== undefined && (
                        <span className="ml-auto flex size-4 items-center justify-center font-mono text-xs text-muted-foreground">
                          {option.count}
                        </span>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {selectedSet.size > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={handleClear}
                      className="text-muted-foreground"
                    >
                      Limpar filtros
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </DropdownMenuGroup>
        </Command>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
