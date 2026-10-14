import { CurrencyInput } from "@/components/ui/currency-input";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { durationOptions } from "@/helpers";
import type { ICreateServiceSchema } from "@reservo/types";
import { Banknote, CloudSync, IdCard, Timer, User2 } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { useListProfessionalsQuery } from "../../professionals/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useListCategoriesServiceQuery } from "../hooks";

export function CreateServiceForm() {
  const form = useFormContext<ICreateServiceSchema.GetParams>();

  const { data: professionals, isPending: isProfessionalsPending } =
    useListProfessionalsQuery({
      page: 1,
      limit: 100,
      orderBy: "asc",
      isActive: true,
    });

  const { data: categoriesService, isPending: isCategoriesServicePending } =
    useListCategoriesServiceQuery();

  return (
    <>
      <h1 className="text-lg flex items-center gap-2">
        <IdCard className="text-primary" />
        Identificação do procedimento
      </h1>

      <FieldGroup className="grid grid-cols-8">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="col-span-4">
              <FieldLabel htmlFor="name">Nome do serviço</FieldLabel>
              <Input
                {...field}
                id="name"
                aria-invalid={fieldState.invalid}
                placeholder="Corte de Cabelo & Barba"
                autoCapitalize="off"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="categoryId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="col-span-4">
              <FieldLabel htmlFor="category">Categoria</FieldLabel>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
                disabled={
                  !categoriesService?.groups || isCategoriesServicePending
                }
              >
                <SelectTrigger id="category" aria-invalid={fieldState.invalid}>
                  <SelectValue placeholder="Barba & Terapias faciais" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {categoriesService?.groups?.map((group) => (
                    <SelectGroup key={group.key}>
                      <SelectLabel>{group.label}</SelectLabel>
                      {group?.categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                      <SelectSeparator />
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="col-span-8">
              <div className="flex justify-between">
                <FieldLabel htmlFor="description">
                  Descrição detalhada para o cliente
                </FieldLabel>

                <p className="text-muted-foreground">
                  {field.value.length} / 400
                </p>
              </div>
              <Textarea
                {...field}
                id="description"
                aria-invalid={fieldState.invalid}
                maxLength={400}
                placeholder="Descrição sobre o serviço a ser oferecido ao cliente"
                autoCapitalize="off"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Separator />

      <h1 className="text-lg flex items-center gap-2">
        <Timer className="text-primary" />
        Duração e escala de atendimento
      </h1>

      <FieldGroup>
        <Controller
          name="durationMinutes"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="duration">
                Duração estimada do procedimento
              </FieldLabel>
              <ToggleGroup
                type="single"
                variant="outline"
                value={String(field.value)}
                onValueChange={(e) => e && field.onChange(Number(e))}
                className="flex flex-wrap"
              >
                {durationOptions({ stepMinutes: 15, maxMinutes: 2 * 60 }).map(
                  (time) => (
                    <ToggleGroupItem
                      key={time.value}
                      value={String(time.value)}
                      aria-invalid={fieldState.invalid}
                    >
                      {time.label}
                    </ToggleGroupItem>
                  ),
                )}
              </ToggleGroup>
              {fieldState && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="professionals"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center justify-between">
                <FieldLabel>Profissionais habilitados para realizar</FieldLabel>

                <Button
                  size="xs"
                  variant="ghost"
                  type="button"
                  className="text-primary font-bold"
                  onClick={() =>
                    field.onChange(
                      professionals?.data?.map(
                        ({ professional }) => professional.id,
                      ),
                    )
                  }
                >
                  Marcar Todos
                </Button>
              </div>
              <ToggleGroup
                type="multiple"
                variant="outline"
                value={field.value}
                onValueChange={field.onChange}
                disabled={!professionals?.data || isProfessionalsPending}
              >
                {isProfessionalsPending && <Skeleton className="h-9 w-58" />}
                {professionals?.data?.map(({ professional }) => (
                  <ToggleGroupItem
                    key={professional.id}
                    value={professional.id}
                    aria-invalid={fieldState.invalid}
                    className="py-5 rounded-full"
                  >
                    <Avatar>
                      <AvatarImage src={professional.avatarUrl ?? undefined} />
                      <AvatarFallback>
                        <User2 className="size-4" />
                      </AvatarFallback>
                    </Avatar>

                    <p>{professional.name}</p>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Separator />

      <h1 className="text-lg flex items-center gap-2">
        <Banknote className="text-primary" />
        Precificação e repasse
      </h1>

      <FieldGroup className="grid grid-cols-8">
        <Controller
          name="priceCents"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="col-span-4">
              <FieldLabel htmlFor="price">Preço base</FieldLabel>
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

        <Controller
          name="priceCents"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="col-span-4">
              <FieldLabel htmlFor="price">Comissão de repasse</FieldLabel>
              <CurrencyInput
                {...field}
                id="price"
                aria-invalid={fieldState.invalid}
                placeholder="Preço do serviço"
                disabled
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="isActive"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              className="col-span-8 justify-between bg-muted p-4 rounded"
              orientation="horizontal"
              data-invalid={fieldState.invalid}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-muted-foreground/20 rounded">
                  <CloudSync className="size-6 text-primary" />
                </div>
                <div>
                  <FieldLabel>Disponível para agendamento online</FieldLabel>
                  <FieldDescription>
                    Libera o serviço instantaneamente no app mobile dos clientes
                    e no link da bio
                  </FieldDescription>
                </div>
              </div>
              <Switch
                name={field.name}
                aria-invalid={fieldState.invalid}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </>
  );
}
