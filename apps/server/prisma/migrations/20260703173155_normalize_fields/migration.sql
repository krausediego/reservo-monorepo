/*
  Warnings:

  - You are about to drop the column `accessState` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the column `gracePausedAt` on the `organizations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "accessState",
DROP COLUMN "gracePausedAt",
ADD COLUMN     "access_state" "OrganizationAccessState" NOT NULL DEFAULT 'GRACE',
ADD COLUMN     "grace_paused_at" TIMESTAMP(3);
