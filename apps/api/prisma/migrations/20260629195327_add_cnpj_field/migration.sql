/*
  Warnings:

  - Added the required column `cnpj` to the `establishments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "establishments" ADD COLUMN     "cnpj" TEXT NOT NULL;
