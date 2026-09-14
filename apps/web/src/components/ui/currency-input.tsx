import * as React from "react";
import { Input } from "./input";
import { useCurrencyInput } from "@/hooks";

type CurrencyInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "value" | "onChange" | "type"
> & {
  onChange: (value: number | null) => void;
  value?: number | null;
  maxCents?: number;
};

export const CurrencyInput = React.forwardRef<
  HTMLInputElement,
  CurrencyInputProps
>(({ value, onChange, maxCents, ...props }, ref) => {
  const { inputRef, inputProps } = useCurrencyInput({
    value,
    onChange,
    maxCents,
  });

  return (
    <Input
      {...props}
      {...inputProps}
      ref={(el) => {
        inputRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) ref.current = el;
      }}
    />
  );
});

CurrencyInput.displayName = "CurrencyInput";
