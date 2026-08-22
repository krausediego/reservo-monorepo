import { makeLogging } from "@/infra";

import { NormalizeFilesMiddleware } from ".";

export const makeNormalizeFilesMiddleware = () => {
  return new NormalizeFilesMiddleware(makeLogging());
};
