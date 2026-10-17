import { Elysia, type ValidationError } from "elysia";

import { HttpError } from "@/infra/http-errors";
import { logger } from "@/infra/logger";

type Issue = { path: string; message: string };

/**
 * Converte os erros do TypeBox em `{ path, message }`.
 *
 * - `message` usa o `error` declarado no schema do campo (ex.: "O nome deve
 *   conter entre 4 e 256 caracteres"); sem ele, cai na mensagem do TypeBox.
 * - `path` sai como `professionals.0` em vez de `/professionals/0`.
 * - Só o primeiro erro de cada campo é mantido.
 */
const toIssues = (error: Readonly<ValidationError>): Issue[] => {
  const issues = new Map<string, string>();

  for (const issue of error.all) {
    const path = issue.path.replace(/^\//, "").replaceAll("/", ".") || "root";
    const custom = "schema" in issue ? issue.schema?.error : undefined;
    const message = typeof custom === "string" ? custom : issue.summary;

    if (!issues.has(path)) {
      issues.set(path, message ?? "Valor inválido");
    }
  }

  return [...issues].map(([path, message]) => ({ path, message }));
};

/**
 * Tratamento global de erros. Mantém o contrato `{ message, code }` que o
 * front já consome.
 */
export const errorHandler = new Elysia({ name: "error-handler" }).onError(
  { as: "global" },
  ({ code, error, status }) => {
    if (error instanceof HttpError) {
      return error.toResponse();
    }

    switch (code) {
      case "VALIDATION": {
        // Resposta fora do schema é bug nosso, não do cliente.
        if (error.type === "response") {
          logger.error({ issues: toIssues(error) }, "Invalid response");
          return status(500, { message: "Internal Server Error" });
        }

        const issues = toIssues(error);
        return status(400, {
          message: issues[0]?.message ?? "Requisição inválida",
          issues,
        });
      }
      case "INVALID_FILE_TYPE": {
        // `t.File({ type })` confere o conteúdo real do arquivo, não só a
        // extensão/mime enviados.
        const path = error.property.replace(/^body\./, "");
        const message = "Tipo de arquivo inválido";
        return status(400, { message, issues: [{ path, message }] });
      }
      case "PARSE":
        return status(400, { message: "Invalid request body" });
      case "NOT_FOUND":
        return status(404, { message: "Not Found" });
      default:
        break;
    }

    // `throw status(...)` já carrega a resposta: deixa o Elysia mapear.
    if (typeof code === "number") {
      return undefined;
    }

    logger.error({ err: error }, "Internal Server Error");
    return status(500, { message: "Internal Server Error" });
  },
);
