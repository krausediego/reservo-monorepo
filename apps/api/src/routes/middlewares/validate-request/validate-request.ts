import { ZodObject } from "zod";

import { adaptMiddleware } from "@/routes/handlers";

import { makeValidateRequestMiddleware } from ".";

export const validateRequest = (schema: ZodObject) =>
  adaptMiddleware(makeValidateRequestMiddleware(), schema);
