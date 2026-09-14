import { formatCents } from "@/helpers";
import * as React from "react";

export function parseToCents(input: string, maxCents: number): number | null {
  const digits = input.replace(/\D/g, "");
  if (!digits) return null;
  return Math.min(Number(digits), maxCents);
}

type UseCurrencyInputParams = {
  onChange: (value: number | null) => void;
  value?: number | null;
  maxCents?: number;
};

export function useCurrencyInput({
  value,
  onChange,
  maxCents = 99_999_99,
}: UseCurrencyInputParams) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const displayValue =
    typeof value === "number" && Number.isFinite(value)
      ? formatCents(value, { fallback: "" })
      : "";

  const caretToEnd = React.useCallback(() => {
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      el.setSelectionRange(el.value.length, el.value.length);
    });
  }, []);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(parseToCents(e.target.value, maxCents));
      caretToEnd();
    },
    [onChange, maxCents, caretToEnd],
  );

  return {
    inputRef,
    inputProps: {
      value: displayValue,
      onChange: handleChange,
      onfocus: caretToEnd,
      onClick: caretToEnd,
      inputMode: "numeric" as const,
      autoComplete: "off",
      autoCapitalize: "off",
    },
  };
}
