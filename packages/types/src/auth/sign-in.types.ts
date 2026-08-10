import { signInResponseSchema, signInSchema } from "@reservo/schemas";
import z from "zod";

export namespace ISignInSchema {
  export type GetParams = z.infer<typeof signInSchema>["body"];
  export type GetResponse = z.infer<typeof signInResponseSchema>;
}
