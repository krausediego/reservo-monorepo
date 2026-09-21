/*
  Warnings:

  - You are about to drop the column `closed` on the `professional_availabilities` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "professional_availabilities" DROP COLUMN "closed",
ADD COLUMN     "opened" BOOLEAN NOT NULL DEFAULT false;
