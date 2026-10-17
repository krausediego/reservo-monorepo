/*
  Warnings:

  - Made the column `closed` on table `establishment_availabilities` required. This step will fail if there are existing NULL values in that column.
  - Made the column `closed` on table `professional_availabilities` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "establishment_availabilities" ALTER COLUMN "closed" SET NOT NULL;

-- AlterTable
ALTER TABLE "professional_availabilities" ALTER COLUMN "closed" SET NOT NULL;
