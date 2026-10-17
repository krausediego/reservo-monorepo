/*
  Warnings:

  - You are about to drop the column `establishment_id` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `establishment_id` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `establishment_id` on the `commission_entry` table. All the data in the column will be lost.
  - You are about to drop the column `establishment_id` on the `establishment_commission_default` table. All the data in the column will be lost.
  - You are about to drop the column `establishment_id` on the `professional_availabilities` table. All the data in the column will be lost.
  - You are about to drop the column `establishment_id` on the `professional_commission_rule` table. All the data in the column will be lost.
  - You are about to drop the column `establishment_id` on the `professional_services` table. All the data in the column will be lost.
  - You are about to drop the column `establishment_id` on the `professionals` table. All the data in the column will be lost.
  - You are about to drop the column `establishment_id` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `active_establishment_id` on the `sessions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[organization_id,domain]` on the table `establishment_commission_default` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organization_id` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `audit_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `commission_entry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `establishment_commission_default` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `professional_availabilities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `professional_commission_rule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `professional_services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `professionals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `services` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_establishment_id_fkey";

-- DropForeignKey
ALTER TABLE "commission_entry" DROP CONSTRAINT "commission_entry_establishment_id_fkey";

-- DropForeignKey
ALTER TABLE "establishment_commission_default" DROP CONSTRAINT "establishment_commission_default_establishment_id_fkey";

-- DropForeignKey
ALTER TABLE "professional_availabilities" DROP CONSTRAINT "professional_availabilities_establishment_id_fkey";

-- DropForeignKey
ALTER TABLE "professional_commission_rule" DROP CONSTRAINT "professional_commission_rule_establishment_id_fkey";

-- DropForeignKey
ALTER TABLE "professional_services" DROP CONSTRAINT "professional_services_establishment_id_fkey";

-- DropForeignKey
ALTER TABLE "professionals" DROP CONSTRAINT "professionals_establishment_id_fkey";

-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_establishment_id_fkey";

-- DropIndex
DROP INDEX "commission_entry_establishment_id_professional_id_created_a_idx";

-- DropIndex
DROP INDEX "establishment_commission_default_establishment_id_domain_key";

-- DropIndex
DROP INDEX "professional_commission_rule_establishment_id_professional__idx";

-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "establishment_id",
ADD COLUMN     "organization_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "audit_logs" DROP COLUMN "establishment_id",
ADD COLUMN     "organization_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "commission_entry" DROP COLUMN "establishment_id",
ADD COLUMN     "organization_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "establishment_commission_default" DROP COLUMN "establishment_id",
ADD COLUMN     "organization_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "professional_availabilities" DROP COLUMN "establishment_id",
ADD COLUMN     "organization_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "professional_commission_rule" DROP COLUMN "establishment_id",
ADD COLUMN     "organization_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "professional_services" DROP COLUMN "establishment_id",
ADD COLUMN     "organization_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "professionals" DROP COLUMN "establishment_id",
ADD COLUMN     "organizationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "services" DROP COLUMN "establishment_id",
ADD COLUMN     "organization_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "active_establishment_id";

-- CreateIndex
CREATE INDEX "commission_entry_organization_id_professional_id_created_at_idx" ON "commission_entry"("organization_id", "professional_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "establishment_commission_default_organization_id_domain_key" ON "establishment_commission_default"("organization_id", "domain");

-- CreateIndex
CREATE INDEX "professional_commission_rule_organization_id_professional_i_idx" ON "professional_commission_rule"("organization_id", "professional_id");

-- AddForeignKey
ALTER TABLE "professionals" ADD CONSTRAINT "professionals_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professional_services" ADD CONSTRAINT "professional_services_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professional_availabilities" ADD CONSTRAINT "professional_availabilities_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "establishment_commission_default" ADD CONSTRAINT "establishment_commission_default_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professional_commission_rule" ADD CONSTRAINT "professional_commission_rule_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commission_entry" ADD CONSTRAINT "commission_entry_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
