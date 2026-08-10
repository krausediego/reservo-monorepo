import z from "zod";
import { signUpResponseSchema, signUpSchema } from "@reservo/schemas";

export namespace ISignUpSchema {
  export type GetParams = z.infer<typeof signUpSchema>["body"];
  export type GetResponse = z.infer<typeof signUpResponseSchema>;
}
