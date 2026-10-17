/*
  Warnings:

  - You are about to drop the column `closed` on the `establishment_availabilities` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "establishment_availabilities" DROP COLUMN "closed",
ADD COLUMN     "opened" BOOLEAN NOT NULL DEFAULT false;
