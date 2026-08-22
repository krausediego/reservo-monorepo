import { adaptMiddleware } from "@/routes/handlers";

import { makeNormalizeFilesMiddleware } from ".";

export const normalizeFiles = () =>
  adaptMiddleware(makeNormalizeFilesMiddleware());
