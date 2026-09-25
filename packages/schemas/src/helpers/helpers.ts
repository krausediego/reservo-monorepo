import z from "zod";
import { parsePhoneNumberWithError } from "libphonenumber-js";

export const isoWithTimezone = z.iso
  .datetime({ offset: true })
  .transform((value) => new Date(value));

export const phoneSchema = z
  .string()
  .trim()
  .transform((value, ctx) => {
    try {
      const parsed = parsePhoneNumberWithError(value, "BR");
      if (!parsed.isValid()) throw new Error();
      return parsed.number; // "+5547999999999"
    } catch {
      ctx.addIssue({ code: "custom", message: "Telefone inválido" });
      return z.NEVER;
    }
  });
