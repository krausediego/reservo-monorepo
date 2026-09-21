import { AvatarUpload } from "@/components/ui/avatar-upload";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useMeQuery } from "@/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema } from "@reservo/schemas";
import type { IUpdateProfileSchema } from "@reservo/types";
import { Phone, Save, UserRound } from "lucide-react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useUpdateProfileMutation } from "../hooks";
import { Spinner } from "@/components/ui/spinner";
import { InputMask } from "@/helpers";

export function SettingsProfileForm() {
  const { data } = useMeQuery();
  const { mutateAsync: updateProfileFn, isPending: isUpdateProfilePending } =
    useUpdateProfileMutation();

  const form = useForm<IUpdateProfileSchema.GetParams>({
    resolver: zodResolver(updateProfileSchema.shape.body),
    defaultValues: {
      name: data?.user.name,
      phoneNumber: data?.user.phoneNumber ?? "",
    },
  });

  const handleUpdateProfile: SubmitHandler<
    IUpdateProfileSchema.GetParams
  > = async (values) => {
    await updateProfileFn(values);
  };

  const masked = new InputMask();

  return (
    <form className="w-full" onSubmit={form.handleSubmit(handleUpdateProfile)}>
      <FieldGroup className="max-w-md">
        <Controller
          name="image"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="items-center">
              <AvatarUpload
                defaultAvatar={data?.user.imageUrl ?? undefined}
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
              <InputGroup>
                <InputGroupAddon>
                  <UserRound />
                </InputGroupAddon>
                <InputGroupInput
                  {...field}
                  id="name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Nome de usuário"
                  autoComplete="off"
                  autoCapitalize="off"
                />
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="phoneNumber"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="phone">Telefone</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <Phone />
                </InputGroupAddon>
                <InputGroupInput
                  {...field}
                  id="phone"
                  value={field.value ? masked.celPhone(field.value) : undefined}
                  aria-invalid={fieldState.invalid}
                  placeholder="(99) 99999-9999"
                  autoComplete="off"
                  autoCapitalize="off"
                />
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button
          disabled={isUpdateProfilePending}
          className="mr-auto"
          type="submit"
        >
          {isUpdateProfilePending ? <Spinner /> : <Save />}
          Salvar
        </Button>
      </FieldGroup>
    </form>
  );
}
