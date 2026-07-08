/*
  Warnings:

  - You are about to alter the column `price` on the `services` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- CreateEnum
CREATE TYPE "CommissionDomain" AS ENUM ('SERVICE', 'PRODUCT');

-- CreateEnum
CREATE TYPE "CommissionType" AS ENUM ('PERCENTAGE', 'FIXED');

-- CreateEnum
CREATE TYPE "CommissionEntryStatus" AS ENUM ('PENDING', 'PAID', 'REVERSED');

-- AlterTable
ALTER TABLE "services" ALTER COLUMN "price" SET DATA TYPE INTEGER;

-- CreateTable
CREATE TABLE "establishment_commission_default" (
    "id" TEXT NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "domain" "CommissionDomain" NOT NULL,
    "type" "CommissionType" NOT NULL,
    "value" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "establishment_commission_default_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professional_commission_rule" (
    "id" TEXT NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "professional_id" TEXT NOT NULL,
    "domain" "CommissionDomain" NOT NULL,
    "type" "CommissionType" NOT NULL,
    "value" INTEGER NOT NULL,
    "service_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "professional_commission_rule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commission_entry" (
    "id" TEXT NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "professional_id" TEXT NOT NULL,
    "domain" "CommissionDomain" NOT NULL,
    "base_amount" INTEGER NOT NULL,
    "applied_type" "CommissionType" NOT NULL,
    "applied_value" INTEGER NOT NULL,
    "commission_cents" INTEGER NOT NULL,
    "source_level" INTEGER NOT NULL,
    "status" "CommissionEntryStatus" NOT NULL DEFAULT 'PENDING',
    "appointment_id" TEXT,
    "service_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commission_entry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "establishment_commission_default_establishment_id_domain_key" ON "establishment_commission_default"("establishment_id", "domain");

-- CreateIndex
CREATE INDEX "professional_commission_rule_establishment_id_professional__idx" ON "professional_commission_rule"("establishment_id", "professional_id");

-- CreateIndex
CREATE UNIQUE INDEX "professional_commission_rule_professional_id_domain_service_key" ON "professional_commission_rule"("professional_id", "domain", "service_id");

-- CreateIndex
CREATE INDEX "commission_entry_establishment_id_professional_id_created_a_idx" ON "commission_entry"("establishment_id", "professional_id", "created_at");

-- CreateIndex
CREATE INDEX "commission_entry_appointment_id_idx" ON "commission_entry"("appointment_id");

-- AddForeignKey
ALTER TABLE "establishment_commission_default" ADD CONSTRAINT "establishment_commission_default_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professional_commission_rule" ADD CONSTRAINT "professional_commission_rule_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professional_commission_rule" ADD CONSTRAINT "professional_commission_rule_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "professionals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professional_commission_rule" ADD CONSTRAINT "professional_commission_rule_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commission_entry" ADD CONSTRAINT "commission_entry_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commission_entry" ADD CONSTRAINT "commission_entry_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "professionals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commission_entry" ADD CONSTRAINT "commission_entry_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commission_entry" ADD CONSTRAINT "commission_entry_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
