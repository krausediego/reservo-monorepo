import { AvatarUpload } from "@/components/ui/avatar-upload";
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
import type { ICreateProfessionalSchema } from "@reservo/types";
import { Controller, useFormContext } from "react-hook-form";
import { useListUsersQuery } from "../../users/hooks";
import { useListServicesQuery } from "../../services/hooks";
import { MultiSelect } from "@/components/ui/multiple-select";

export function CreateProfessionalForm() {
  const form = useFormContext<ICreateProfessionalSchema.GetParams>();

  const { data: users, isLoading: isUsersLoading } = useListUsersQuery(
    {
      page: 1,
      limit: 100,
      orderBy: "desc",
      availableLinkProfessional: true,
    },
    {
      staleTime: 0,
      gcTime: 0,
    },
  );

  const { data: services, isLoading: isServicesLoading } = useListServicesQuery(
    {
      page: 1,
      limit: 100,
      orderBy: "desc",
      isActive: true,
    },
  );

  return (
    <FieldGroup>
      <Controller
        name="avatar"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <AvatarUpload
              onFileChange={(e) => {
                if (e && e.file) {
                  field.onChange(e.file);
                }
              }}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

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
              placeholder="Nome do profissional"
              autoCapitalize="off"
              autoComplete="off"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="bio"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="bio">Bio</FieldLabel>
            <Textarea
              {...field}
              id="bio"
              aria-invalid={fieldState.invalid}
              placeholder={`Resumo sobre o profissional, semelhante a bio do instagram.\n(o cliente vê estas informações na hora de selecionar um profissional)`}
              autoCapitalize="off"
              autoComplete="off"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="memberId"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="user">Usuário</FieldLabel>
            <Select
              name={field.name}
              value={field.value}
              onValueChange={field.onChange}
              disabled={isUsersLoading}
            >
              <SelectTrigger id="user" aria-invalid={fieldState.invalid}>
                <SelectValue placeholder="Usuário para vincular ao profissional" />
              </SelectTrigger>
              <SelectContent position="popper">
                {users?.data?.length ? (
                  users?.data?.map((user) => (
                    <SelectItem value={user.member.id}>
                      {user.user.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                    Nenhum usuário disponível
                  </div>
                )}
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="servicesIds"
        control={form.control}
        render={({ field, fieldState }) => {
          return (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="servicesIds">Serviços</FieldLabel>
              <MultiSelect
                disabled={isServicesLoading}
                options={
                  services?.data?.map((s) => ({
                    label: s.name,
                    value: s.id,
                  })) ?? []
                }
                value={field.value}
                onChange={field.onChange}
                placeholder="Adicione serviços"
                emptyText="Serviço não encontrado"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          );
        }}
      />
    </FieldGroup>
  );
}
