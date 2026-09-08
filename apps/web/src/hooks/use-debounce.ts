/* eslint-disable react-hooks/immutability */
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Hook para debounce de valores (ex: input de texto, filtros).
 * Retorna o valor atualizado após `delay` ms sem novas alterações.
 *
 * @example
 * const [search, setSearch] = useState("");
 * const debouncedSearch = useDebounce(search, 500);
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook para debounce de callbacks/funções.
 * Executa a função apenas após `delay` ms da última invocação.
 *
 * @example
 * const handleSearch = useDebouncedCallback((term: string) => {
 *   navigate({ search: (prev) => ({ ...prev, name: term }) });
 * }, 500);
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay = 500,
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useMemo(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const debouncedFn = (...args: Parameters<T>) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    };

    debouncedFn.cancel = () => {
      if (timer) clearTimeout(timer);
    };

    return debouncedFn;
  }, [delay]);
}
