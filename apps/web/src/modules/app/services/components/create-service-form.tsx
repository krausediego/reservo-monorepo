import { CurrencyInput } from "@/components/ui/currency-input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { durationOptions } from "@/helpers";
import type { ICreateServiceSchema } from "@reservo/types";
import { Controller, useFormContext } from "react-hook-form";

export function CreateServiceForm() {
  const form = useFormContext<ICreateServiceSchema.GetParams>();

  return (
    <FieldGroup>
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="name">Nome</FieldLabel>
            <Input
              {...field}
              id="name"
              aria-invalid={fieldState.invalid}
              placeholder="Serviço 1"
              autoCapitalize="off"
              autoComplete="off"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="description"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="description">Descrição</FieldLabel>
            <Textarea
              {...field}
              id="description"
              aria-invalid={fieldState.invalid}
              placeholder="Descrição sobre o serviço a ser oferecido ao cliente"
              autoCapitalize="off"
              autoComplete="off"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="durationInMinutes"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="duration">Duração</FieldLabel>
            <Select
              name={field.name}
              value={String(field.value)}
              onValueChange={(next) => {
                field.onChange(Number(next));
              }}
            >
              <SelectTrigger id="duration" aria-invalid={fieldState.invalid}>
                <SelectValue placeholder="Duração do serviço" />
              </SelectTrigger>
              <SelectContent>
                {durationOptions().map((time) => (
                  <SelectItem key={time.value} value={String(time.value)}>
                    {time.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="priceCents"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="price">Preço</FieldLabel>
            <CurrencyInput
              {...field}
              id="price"
              aria-invalid={fieldState.invalid}
              placeholder="Preço do serviço"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  );
}
