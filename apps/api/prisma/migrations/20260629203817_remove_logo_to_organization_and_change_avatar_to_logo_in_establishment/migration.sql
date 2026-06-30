/*
  Warnings:

  - You are about to drop the column `avatar_url` on the `establishments` table. All the data in the column will be lost.
  - You are about to drop the column `logo` on the `organizations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "establishments" DROP COLUMN "avatar_url",
ADD COLUMN     "logo_url" TEXT;

-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "logo";
