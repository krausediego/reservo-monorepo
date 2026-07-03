/*
  Warnings:

  - Added the required column `stripe_customer_id` to the `organizations` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrganizationAccessState" AS ENUM ('ACTIVE', 'GRACE', 'EXPIRED');

-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "accessState" "OrganizationAccessState" NOT NULL DEFAULT 'GRACE',
ADD COLUMN     "gracePausedAt" TIMESTAMP(3),
ADD COLUMN     "stripe_customer_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "reference_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'incomplete',
    "stripe_customer_id" TEXT,
    "stripe_subscription_id" TEXT,
    "period_start" TIMESTAMP(3),
    "period_end" TIMESTAMP(3),
    "cancel_at_period_end" BOOLEAN DEFAULT false,
    "cancel_at" TIMESTAMP(3),
    "canceled_at" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),
    "seats" INTEGER,
    "trial_start" TIMESTAMP(3),
    "trial_end" TIMESTAMP(3),
    "billing_interval" TEXT,
    "stripe_schedule_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);
