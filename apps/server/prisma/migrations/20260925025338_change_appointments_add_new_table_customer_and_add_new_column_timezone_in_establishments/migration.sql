/*
  Warnings:

  - You are about to drop the column `service_duration_minutes` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `service_name` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `service_price_cents` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `appointments` table. All the data in the column will be lost.
  - Added the required column `customer_id` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration_min` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `origin` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price_cents` to the `appointments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CustomerSource" AS ENUM ('ONLINE', 'WALK_IN', 'IMPORTED');

-- CreateEnum
CREATE TYPE "AppointmentOrigin" AS ENUM ('ONLINE', 'DASH');

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_professional_id_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_service_id_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "commission_entry" DROP CONSTRAINT "commission_entry_appointment_id_fkey";

-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "service_duration_minutes",
DROP COLUMN "service_name",
DROP COLUMN "service_price_cents",
DROP COLUMN "user_id",
ADD COLUMN     "cancelReason" TEXT,
ADD COLUMN     "cancelled_at" TIMESTAMP(3),
ADD COLUMN     "cancelled_by" TEXT,
ADD COLUMN     "created_by_id" TEXT,
ADD COLUMN     "customer_id" TEXT NOT NULL,
ADD COLUMN     "duration_min" INTEGER NOT NULL,
ADD COLUMN     "internal_notes" TEXT,
ADD COLUMN     "origin" "AppointmentOrigin" NOT NULL,
ADD COLUMN     "price_cents" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "establishments" ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'America/Sao_Paulo';

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "notes" TEXT,
    "source" "CustomerSource" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "customers_user_id_idx" ON "customers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "customers_organization_id_user_id_key" ON "customers"("organization_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "customers_organization_id_phone_key" ON "customers"("organization_id", "phone");

-- CreateIndex
CREATE INDEX "appointments_professional_id_starts_at_idx" ON "appointments"("professional_id", "starts_at");

-- CreateIndex
CREATE INDEX "appointments_organization_id_starts_at_idx" ON "appointments"("organization_id", "starts_at");

-- CreateIndex
CREATE INDEX "appointments_customer_id_starts_at_idx" ON "appointments"("customer_id", "starts_at");

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "professionals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;
