/* eslint-disable no-continue */
import type { Request } from "express";
import { File as NodeFile } from "node:buffer";
import { readFile } from "node:fs/promises";

type MulterFile = Express.Multer.File;

const toWebFile = async (f: MulterFile): Promise<File> => {
  const buffer = f.buffer ?? (await readFile(f.path));
  return new NodeFile([buffer], f.originalname, {
    type: f.mimetype,
  }) as unknown as File;
};

export const normalizeFiles = async (
  files: Request["files"],
  file?: Request["file"],
): Promise<Record<string, File>> => {
  const entries: [string, MulterFile][] = [];

  if (file) {
    entries.push([file.fieldname, file]);
  }

  if (Array.isArray(files)) {
    for (const f of files) {
      entries.push([f.fieldname, f]);
    }
  } else if (files) {
    for (const [field, value] of Object.entries(files)) {
      const first = Array.isArray(value) ? value[0] : value;
      if (first) {
        entries.push([field, first]);
      }
    }
  }

  const result: Record<string, File> = {};
  for (const [field, f] of entries) {
    if (field in result) {
      continue;
    }
    result[field] = await toWebFile(f);
  }
  return result;
};
