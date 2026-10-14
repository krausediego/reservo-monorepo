import type { FilterDefinition, FilterValue } from "@/types";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
import { Search, X } from "lucide-react";
import { FacetedFilter } from "./faceted-filter";
import { useIsMobile, useUrlFilters } from "@/hooks";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Tabs, TabsList, TabsTrigger } from "./tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

type FilterFieldProps = {
  def: FilterDefinition;
  onChange: (value: FilterValue) => void;
  value?: FilterValue;
  isMobile?: boolean;
};

function FilterField({ def, onChange, value, isMobile }: FilterFieldProps) {
  switch (def.type) {
    case "search":
      return (
        <InputGroup className="w-auto">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            placeholder={def.placeholder}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            className={cn(isMobile && "w-full")}
          />
        </InputGroup>
      );

    case "faceted":
      return (
        <FacetedFilter
          title={def.title}
          options={def.options}
          selectedValues={Array.isArray(value) ? value : []}
          onSelect={onChange}
        />
      );

    case "tabs":
      return (
        <Tabs
          value={typeof value === "string" ? value : undefined}
          onValueChange={onChange}
        >
          <TabsList>
            {def.options.map((opt) => (
              <TabsTrigger key={String(opt.value)} value={String(opt.value)}>
                {opt.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      );

    case "select":
      return (
        <Select
          value={typeof value === "string" ? value : undefined}
          onValueChange={onChange}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>

          <SelectContent position="popper">
            {def.options.map(({ icon: Icon, ...opt }) => (
              <SelectItem value={opt.value}>
                {Icon && <Icon className="size-4" />}
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    default: {
      const _exhaustive: never = def;
      return _exhaustive;
    }
  }
}

type DataFiltersProps = {
  definitions: FilterDefinition[];
  resetLabel?: string;
  className?: string;
};

export function DataFilters({
  definitions,
  resetLabel = "Limpar",
  className,
}: DataFiltersProps) {
  const isMobile = useIsMobile();
  const { values, setFilter, reset, isFiltered } = useUrlFilters(definitions);

  const tabs = definitions.filter((d) => d.type === "tabs");
  const orderBy = definitions.find((d) => d.key === "orderBy");
  const inline = definitions.filter(
    (d) => d.type !== "tabs" && d.key !== "orderBy",
  );

  const renderField = (def: FilterDefinition) => (
    <FilterField
      key={def.key}
      def={def}
      value={values[def.key]}
      onChange={(value) => setFilter(def.key, value)}
      isMobile={isMobile}
    />
  );

  return (
    <div className={cn("flex w-full flex-col gap-3", className)}>
      {tabs.length > 0 && (
        <div className="flex gap-2">{tabs.map(renderField)}</div>
      )}

      {(inline.length > 0 || orderBy || isFiltered) && (
        <div className="flex w-full flex-wrap items-center gap-2">
          {inline.map(renderField)}

          {isFiltered && (
            <Button variant="ghost" onClick={reset}>
              {resetLabel}
              <X />
            </Button>
          )}

          {orderBy && (
            <div className={cn(!isMobile && "ml-auto")}>
              {renderField(orderBy)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
