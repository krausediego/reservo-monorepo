import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import type { IAvailabilitiesForm } from "../../types";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { minutesToTime, timeSlots, weekDayEnum } from "@/helpers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AvailabilitiesForm() {
  const form = useFormContext<IAvailabilitiesForm>();

  const { fields } = useFieldArray({
    control: form.control,
    name: "establishmentAvailabilities",
  });

  return (
    <div className="space-y-4">
      <div>
        <h5 className="font-bold">Horários de funcionamento</h5>
        <p className="text-xs">
          Marque os dias em que o estabelecimento abre e defina início e fim da
          jornada.
        </p>
      </div>
      <form className="border border-border border-collapse rounded-md">
        {fields.map((item, index) => (
          <div
            key={item.dayOfWeek}
            className="flex gap-2 border border-border/30 items-center p-2"
          >
            <Controller
              name={`establishmentAvailabilities.${index}.opened`}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  orientation="horizontal"
                >
                  <Checkbox
                    id={`weekday_${index}`}
                    aria-invalid={fieldState.invalid}
                    name={field.name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <FieldLabel htmlFor={`weekday_${index}`}>
                    {weekDayEnum[index as keyof typeof weekDayEnum]}
                  </FieldLabel>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name={`establishmentAvailabilities.${index}.startMinutes`}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={(next) => {
                      field.onChange(Number(next));
                    }}
                  >
                    <SelectTrigger
                      id="startMinutes"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Horário início">
                        {field.value && minutesToTime(field.value)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots().map((time) => (
                        <SelectItem key={time.value} value={time.value}>
                          {time.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            -
            <Controller
              name={`establishmentAvailabilities.${index}.endMinutes`}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={(next) => {
                      field.onChange(Number(next));
                    }}
                  >
                    <SelectTrigger
                      id="endMinutes"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Horário início">
                        {field.value && minutesToTime(field.value)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots().map((time) => (
                        <SelectItem key={time.value} value={time.value}>
                          {time.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        ))}
      </form>
    </div>
  );
}
