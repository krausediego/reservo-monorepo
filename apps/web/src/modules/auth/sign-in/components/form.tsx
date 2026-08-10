import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@reservo/schemas";
import type { ISignInSchema } from "@reservo/types";
import { Lock, Mail } from "lucide-react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useSignIn } from "../hooks";
import { Spinner } from "@/components/ui/spinner";

export function SignInForm() {
  const form = useForm<ISignInSchema.GetParams>({
    resolver: zodResolver(signInSchema.shape.body),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const { mutateAsync, isPending } = useSignIn();

  const handleSignIn: SubmitHandler<ISignInSchema.GetParams> = async (
    values,
  ) => {
    await mutateAsync(values);
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSignIn)}
      className="w-full px-8 lg:px-0 lg:w-1/2 space-y-5"
    >
      <FieldGroup>
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
                  placeholder="Digite seu e-mail"
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
                  type="password"
                  placeholder="Digite sua senha"
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
          name="rememberMe"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} orientation="horizontal">
              <Checkbox
                id="remember"
                aria-invalid={fieldState.invalid}
                name={field.name}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <FieldLabel htmlFor="remember">Lembrar-me?</FieldLabel>
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
