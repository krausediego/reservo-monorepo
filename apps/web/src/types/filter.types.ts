import type { LucideIcon } from "lucide-react";

export type FilterOption = {
  label: string;
  value: string;
  icon?: LucideIcon;
};

export type SearchFilterDef = {
  type: "search";
  key: string;
  placeholder?: string;
  debounceMs?: number;
};

export type FacetedFilterDef = {
  type: "faceted";
  key: string;
  title: string;
  options: FilterOption[];
};

export type SelectFilterDef = {
  type: "select";
  key: string;
  title: string;
  options: FilterOption[];
};

export type UrlPrimitive = string | number | boolean;

export type TabsFilterOption = {
  label: string;
  value: UrlPrimitive;
};

export type TabsFilterDef = {
  type: "tabs";
  key: string;
  options: TabsFilterOption[];
  defaultValue?: string;
};

export type FilterDefinition =
  | SearchFilterDef
  | FacetedFilterDef
  | TabsFilterDef
  | SelectFilterDef;

export type FilterValue = string | string[];

export type FilterValues = Record<string, FilterValue>;
