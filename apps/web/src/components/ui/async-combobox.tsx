import * as React from "react";
import { Check, ChevronsUpDown, Loader2, Plus, X } from "lucide-react";

import { cn } from "@/lib/utils";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "./separator";

// ---------------------------------------------------------------------------
// Valor do combobox: um item existente OU um nome novo digitado
// ---------------------------------------------------------------------------

export type AsyncComboboxValue<T> =
  | { type: "existing"; item: T }
  | { type: "new"; name: string };

export interface AsyncComboboxProps<T> {
  value: AsyncComboboxValue<T> | null;
  onChange: (value: AsyncComboboxValue<T> | null) => void;

  /** Termo de busca já com debounce. */
  onSearchChange: (search: string) => void;
  options: T[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;

  getValue: (item: T) => string;
  getLabel: (item: T) => string;
  renderOption?: (item: T) => React.ReactNode;

  /** Permite escolher "criar novo" com o termo digitado. Default true. */
  allowCreate?: boolean;
  createLabel?: (search: string) => string;
  /** Sufixo mostrado no trigger quando o valor é um novo. Default "novo". */
  newBadge?: string;

  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  minChars?: number;
  debounceMs?: number;
  disabled?: boolean;
  clearable?: boolean;
  className?: string;
}

export function AsyncCombobox<T>({
  value,
  onChange,
  onSearchChange,
  options,
  isLoading = false,
  isError = false,
  onRetry,
  getValue,
  getLabel,
  renderOption,
  allowCreate = true,
  createLabel = (s) => `Criar "${s}"`,
  newBadge = "novo",
  placeholder = "Selecionar...",
  searchPlaceholder = "Buscar...",
  emptyText = "Nenhum resultado.",
  minChars = 0,
  debounceMs = 300,
  disabled,
  clearable = true,
  className,
}: AsyncComboboxProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [debounced, setDebounced] = React.useState("");

  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(search.trim()), debounceMs);
    return () => clearTimeout(id);
  }, [search, debounceMs]);

  React.useEffect(() => {
    onSearchChange(debounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const isDebouncing = search.trim() !== debounced;
  const busy = isLoading || isDebouncing;
  const belowMin = search.trim().length < minChars;

  const selectedId = value?.type === "existing" ? getValue(value.item) : null;
  const exactMatch = options.some(
    (o) => getLabel(o).toLowerCase() === debounced.toLowerCase(),
  );
  const showCreate =
    allowCreate && debounced.length > 0 && !exactMatch && !busy;

  const triggerLabel =
    value?.type === "existing"
      ? getLabel(value.item)
      : value?.type === "new"
        ? value.name
        : null;

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setSearch("");
  }

  function selectExisting(item: T) {
    onChange({ type: "existing", item });
    handleOpenChange(false);
  }

  function selectNew(name: string) {
    onChange({ type: "new", name });
    handleOpenChange(false);
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onChange(null);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal",
            !value && "text-muted-foreground",
            className,
          )}
        >
          <span className="flex min-w-0 items-center gap-2">
            <span className="truncate">{triggerLabel ?? placeholder}</span>
            {value?.type === "new" && (
              <span className="shrink-0 rounded-sm bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                {newBadge}
              </span>
            )}
          </span>
          <span className="ml-2 flex shrink-0 items-center gap-1">
            {clearable && value && !disabled && (
              <span
                role="button"
                aria-label="Limpar seleção"
                onClick={handleClear}
                className="rounded-sm opacity-50 hover:opacity-100"
              >
                <X className="size-4" />
              </span>
            )}
            <ChevronsUpDown className="size-4 opacity-50" />
          </span>
        </Button>
      </PopoverTrigger>

      {/* Tailwind v4: variável CSS em arbitrary value usa parênteses */}
      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <div className="relative">
            <CommandInput
              value={search}
              onValueChange={setSearch}
              placeholder={searchPlaceholder}
            />
            {busy && !belowMin && (
              <Loader2 className="absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
            )}
          </div>

          <CommandList>
            {belowMin ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Digite ao menos {minChars}{" "}
                {minChars === 1 ? "caractere" : "caracteres"}
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center gap-2 py-6 text-sm text-muted-foreground">
                <span>Não foi possível buscar.</span>
                {onRetry && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={onRetry}
                  >
                    Tentar de novo
                  </Button>
                )}
              </div>
            ) : (
              <>
                {!busy && options.length === 0 && !showCreate && (
                  <CommandEmpty>{emptyText}</CommandEmpty>
                )}

                <CommandGroup>
                  <CommandItem
                    value={`__create__${debounced}`}
                    onSelect={() => selectNew(debounced)}
                  >
                    <Plus className="mr-2 size-4" />
                    {createLabel(debounced)}
                  </CommandItem>
                </CommandGroup>

                <Separator />

                {options.length > 0 && (
                  <CommandGroup>
                    {options.map((item) => {
                      const id = getValue(item);
                      const selected = id === selectedId;
                      return (
                        <CommandItem
                          key={id}
                          value={id}
                          onSelect={() => selectExisting(item)}
                        >
                          <Check
                            className={cn(
                              "mr-2 size-4",
                              selected ? "opacity-100" : "opacity-0",
                            )}
                          />
                          <span className="flex-1 truncate">
                            {renderOption ? renderOption(item) : getLabel(item)}
                          </span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                )}

                {showCreate && (
                  <>{options.length > 0 && <CommandSeparator />}</>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
