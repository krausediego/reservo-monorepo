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
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, User } from "lucide-react";
import { signUpSchema } from "@reservo/schemas";
import type { ISignUpSchema } from "@reservo/types";
import { Button } from "@/components/ui/button";
import { useSignUpMutation } from "../hooks";
import { Spinner } from "@/components/ui/spinner";

export function SignUpForm() {
  const form = useForm<ISignUpSchema.GetParams>({
    resolver: zodResolver(signUpSchema.shape.body),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      repeatPassword: "",
      role: "ADMIN",
    },
  });

  const { mutateAsync, isPending } = useSignUpMutation();

  const handleSignUp: SubmitHandler<ISignUpSchema.GetParams> = async (
    values,
  ) => {
    await mutateAsync(values);
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSignUp)}
      className="w-full px-8 lg:px-0 lg:w-1/2 space-y-5"
    >
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Nome</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id="name"
                  aria-invalid={fieldState.invalid}
                  type="text"
                  placeholder="Digite seu nome"
                />
                <InputGroupAddon>
                  <User />
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">E-mail</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id="email"
                  aria-invalid={fieldState.invalid}
                  type="email"
                  placeholder="Digite seu melhor e-mail"
                />
                <InputGroupAddon>
                  <Mail />
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">Senha</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id="password"
                  aria-invalid={fieldState.invalid}
                  placeholder="Digite uma senha segura"
                  autoComplete="off"
                />
                <InputGroupAddon>
                  <Lock />
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="repeatPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="repeat-password">
                Confirme a senha
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id="repeat-password"
                  aria-invalid={fieldState.invalid}
                  placeholder="Repita sua senha"
                  autoComplete="off"
                />
                <InputGroupAddon>
                  <Lock />
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Spinner />}
        Criar conta
      </Button>
    </form>
  );
}
