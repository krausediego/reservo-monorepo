/*
  Warnings:

  - You are about to drop the column `cover_url` on the `establishments` table. All the data in the column will be lost.
  - You are about to drop the column `logo_url` on the `establishments` table. All the data in the column will be lost.
  - You are about to drop the column `avatar_url` on the `professionals` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "establishments" DROP COLUMN "cover_url",
DROP COLUMN "logo_url",
ADD COLUMN     "cover_storage_key" TEXT,
ADD COLUMN     "logo_storage_key" TEXT;

-- AlterTable
ALTER TABLE "professionals" DROP COLUMN "avatar_url",
ADD COLUMN     "avatar_storage_key" TEXT;
