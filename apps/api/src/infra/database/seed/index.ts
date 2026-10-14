/* eslint-disable no-console */
import "@/infra/config/dotenv";

import fs from "node:fs";
import path from "node:path";

import { basePrisma } from "@/infra/database";

async function run() {
  const seedArg = process.argv[2];

  const seedFiles = fs
    .readdirSync(__dirname)
    .filter(
      (file) =>
        file.endsWith(".ts") && file !== "index.ts" && !file.endsWith(".d.ts"),
    );

  if (!seedArg) {
    console.error("❌ Erro: Nenhum arquivo de seed informado.\n");
    console.log("Uso:");
    console.log("  pnpm seed <nome-do-arquivo>\n");
    console.log("Arquivos de seed disponíveis:");
    seedFiles.forEach((file) => {
      console.log(`  - ${file}`);
    });
    process.exit(1);
  }

  const normalizedName = seedArg.endsWith(".ts") ? seedArg : `${seedArg}.ts`;
  const baseName = path.basename(normalizedName);
  const targetPath = path.resolve(__dirname, baseName);

  if (!fs.existsSync(targetPath)) {
    console.error(`❌ Erro: Arquivo de seed "${baseName}" não encontrado.\n`);
    console.log("Arquivos de seed disponíveis:");
    seedFiles.forEach((file) => {
      console.log(`  - ${file}`);
    });
    process.exit(1);
  }

  console.log(`🚀 Executando seed: ${baseName}...`);

  try {
    const seedModule = await import(targetPath);
    let seedFn =
      typeof seedModule.default === "function" ? seedModule.default : null;
    if (!seedFn && typeof seedModule.seed === "function") {
      seedFn = seedModule.seed;
    }
    if (!seedFn) {
      seedFn = Object.values(seedModule).find(
        (exp) => typeof exp === "function",
      );
    }

    if (typeof seedFn === "function") {
      await seedFn();
    } else {
      console.log(`ℹ️ Seed "${baseName}" carregado.`);
    }

    console.log(`✨ Seed "${baseName}" concluído com sucesso!`);
  } catch (error) {
    console.error(`💥 Erro ao executar seed "${baseName}":`, error);
    process.exit(1);
  } finally {
    await basePrisma.$disconnect();
  }
}

run();
