/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/use-memo */
import type {
  FilterDefinition,
  FilterValue,
  FilterValues,
  UrlPrimitive,
} from "@/types";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

function emptyValue(def: FilterDefinition): FilterValue {
  switch (def.type) {
    case "faceted":
      return [];
    case "tabs":
      return String(def.defaultValue ?? def.options[0]?.value ?? "");
    case "search":
      return "";
  }
}

function isEmpty(def: FilterDefinition, value: FilterValue) {
  if (value === undefined) return true;
  if (Array.isArray(value)) return value.length === 0;
  return value === emptyValue(def);
}

function isPrimitive(raw: unknown): raw is UrlPrimitive {
  return (
    typeof raw === "string" ||
    typeof raw === "number" ||
    typeof raw === "boolean"
  );
}

function parse(def: FilterDefinition, raw: unknown): FilterValue {
  if (!isPrimitive(raw) || raw === "") return emptyValue(def);
  const str = String(raw);
  return def.type === "faceted" ? str.split(",") : str;
}

function serialize(
  def: FilterDefinition,
  value: FilterValue,
): UrlPrimitive | undefined {
  if (isEmpty(def, value)) return undefined;
  if (Array.isArray(value)) return value.join(",");

  if (def.type === "tabs") {
    return def.options.find((o) => String(o.value) === value)?.value ?? value;
  }
  return value;
}

type UrlPatch = Record<string, UrlPrimitive | undefined>;

function isResettable(def: FilterDefinition) {
  return def.type !== "tabs";
}

export function useUrlFilters(definitions: FilterDefinition[]) {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as Record<string, unknown>;

  const urlValues = useMemo<FilterValues>(
    () =>
      Object.fromEntries(
        definitions.map((def) => [def.key, parse(def, search[def.key])]),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [definitions, ...definitions.map((def) => search[def.key])],
  );

  const [values, setValues] = useState<FilterValues>(urlValues);

  useEffect(() => {
    setValues(urlValues);
  }, [urlValues]);

  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    const current = timers.current;

    return () => {
      return Object.values(current).forEach(clearTimeout);
    };
  }, []);

  const commit = useCallback(
    (patch: UrlPatch) => {
      navigate({
        to: ".",
        search: (prev: Record<string, unknown>) => ({ ...prev, ...patch }),
      } as never);
    },
    [navigate],
  );

  const setFilter = useCallback(
    (key: string, value: FilterValue) => {
      const def = definitions.find((d) => d.key === key);
      if (!def) return;

      setValues((prev) => ({
        ...prev,
        [key]: value,
      }));

      const patch: UrlPatch = { [key]: serialize(def, value) };
      const delay = def.type === "search" ? (def.debounceMs ?? 500) : 0;

      clearTimeout(timers.current[key]);

      if (delay > 0) {
        timers.current[key] = setTimeout(() => commit(patch), delay);
      } else {
        commit(patch);
      }
    },
    [definitions, commit],
  );

  const reset = useCallback(() => {
    const resettable = definitions.filter(isResettable);

    Object.values(timers.current).forEach(clearTimeout);

    setValues((prev) => ({
      ...prev,
      ...Object.fromEntries(resettable.map((d) => [d.key, emptyValue(d)])),
    }));
    commit(Object.fromEntries(resettable.map((d) => [d.key, undefined])));
  }, [definitions, commit]);

  const isFiltered = definitions.some(
    (d) =>
      isResettable(d) &&
      (!isEmpty(d, values[d.key]) || !isEmpty(d, urlValues[d.key])),
  );

  return { values, setFilter, reset, isFiltered };
}
