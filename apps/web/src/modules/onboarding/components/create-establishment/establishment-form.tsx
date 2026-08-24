import { Controller, useFormContext } from "react-hook-form";
import type { IEstablishmentForm } from "../../types";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UFS } from "@/helpers";
import { ImageInput } from "@/components/ui/image-input";

export function EstablishmentForm() {
  const form = useFormContext<IEstablishmentForm>();

  return (
    <form className="grid grid-cols-6 gap-4">
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="col-span-4">
            <FieldLabel htmlFor="name">Nome</FieldLabel>
            <Input
              {...field}
              id="name"
              aria-invalid={fieldState.invalid}
              placeholder="Barbearia aurora"
              type="text"
              autoComplete="off"
              autoCapitalize="none"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="cnpj"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="col-span-2">
            <FieldLabel htmlFor="cnpj">CNPJ</FieldLabel>
            <Input
              {...field}
              id="cnpj"
              aria-invalid={fieldState.invalid}
              placeholder="00.000.000/000-00"
              type="number"
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
          <Field data-invalid={fieldState.invalid} className="col-span-6">
            <FieldLabel htmlFor="description">Descrição</FieldLabel>
            <Textarea
              {...field}
              id="description"
              aria-invalid={fieldState.invalid}
              placeholder="Breve descrição sobre o estabelecimento"
              autoComplete="off"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="zipCode"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="col-span-3">
            <FieldLabel htmlFor="zipCode">CEP</FieldLabel>
            <Input
              {...field}
              id="zipCode"
              aria-invalid={fieldState.invalid}
              placeholder="00000-000"
              autoComplete="off"
              autoCapitalize="off"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="street"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="col-span-4">
            <FieldLabel htmlFor="street">Rua</FieldLabel>
            <Input
              {...field}
              id="street"
              aria-invalid={fieldState.invalid}
              placeholder="Rua ..."
              type="text"
              disabled
              autoComplete="off"
              autoCapitalize="off"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="number"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="col-span-2">
            <FieldLabel htmlFor="number">Número</FieldLabel>
            <Input
              {...field}
              id="number"
              aria-invalid={fieldState.invalid}
              placeholder="000"
              type="number"
              autoComplete="off"
              autoCapitalize="off"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="city"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="col-span-3">
            <FieldLabel htmlFor="city">Cidade</FieldLabel>
            <Input
              {...field}
              id="city"
              aria-invalid={fieldState.invalid}
              placeholder="Jaraguá do sul"
              type="text"
              disabled
              autoComplete="off"
              autoCapitalize="off"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="state"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="col-span-3">
            <FieldLabel htmlFor="state">Estado</FieldLabel>
            <Select
              name={field.name}
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger
                disabled
                id="state"
                aria-invalid={fieldState.invalid}
              >
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                {UFS.map((uf) => (
                  <SelectItem key={uf.acronym} value={uf.name}>
                    {uf.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="logo"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="col-span-2">
            <FieldLabel htmlFor="logo">Logo</FieldLabel>
            <ImageInput
              id="logo"
              label="Logo"
              value={field.value}
              onPick={field.onChange}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="cover"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="col-span-4">
            <FieldLabel>Capa</FieldLabel>
            <ImageInput
              id="cover"
              label="Capa"
              value={field.value}
              onPick={field.onChange}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </form>
  );
}
