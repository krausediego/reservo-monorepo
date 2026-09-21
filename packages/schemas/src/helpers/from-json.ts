import z from "zod";

export function fromJson<T extends z.ZodType>(
  schema: T,
  message = "Formato inválido",
) {
  return z.preprocess((v) => {
    if (typeof v !== "string") return v;
    try {
      return JSON.parse(v);
    } catch {
      return v; // deixa o schema interno rejeitar com a mensagem dele
    }
  }, schema);
}
