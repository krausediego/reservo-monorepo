import { t } from "elysia";

/** Corpo de erro padrão (`HttpError` e respostas dos macros). */
export const ErrorModel = t.Object(
  {
    message: t.String(),
    code: t.Optional(t.Number()),
  },
  { description: "Erro" },
);

/** Corpo devolvido pelo `error-handler` quando a validação falha. */
export const ValidationErrorModel = t.Object(
  {
    message: t.String({ description: "Mensagem do primeiro campo inválido" }),
    issues: t.Array(
      t.Object({
        path: t.String({ examples: ["name"] }),
        message: t.String(),
      }),
    ),
  },
  { description: "Erro de validação" },
);

/** IDs gerados pelo Prisma (`@default(cuid())`). */
export const Id = (error: string) =>
  t.String({ pattern: "^[0-9a-z]+$", error, examples: ["cmvba98fd000f0p7s"] });
