/*
  Warnings:

  - You are about to drop the column `business_hours` on the `establishments` table. All the data in the column will be lost.
  - You are about to drop the column `end_time` on the `professional_availabilities` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `professional_availabilities` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[professional_id,day_of_week]` on the table `professional_availabilities` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `end_minutes` to the `professional_availabilities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_minutes` to the `professional_availabilities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "establishments" DROP COLUMN "business_hours";

-- AlterTable
ALTER TABLE "professional_availabilities" DROP COLUMN "end_time",
DROP COLUMN "start_time",
ADD COLUMN     "closed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "end_minutes" INTEGER NOT NULL,
ADD COLUMN     "start_minutes" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "establishment_availabilities" (
    "id" TEXT NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "start_minutes" INTEGER NOT NULL,
    "end_minutes" INTEGER NOT NULL,
    "closed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "establishment_availabilities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "establishment_availabilities_establishment_id_day_of_week_idx" ON "establishment_availabilities"("establishment_id", "day_of_week");

-- CreateIndex
CREATE UNIQUE INDEX "establishment_availabilities_establishment_id_day_of_week_key" ON "establishment_availabilities"("establishment_id", "day_of_week");

-- CreateIndex
CREATE INDEX "professional_availabilities_professional_id_day_of_week_idx" ON "professional_availabilities"("professional_id", "day_of_week");

-- CreateIndex
CREATE UNIQUE INDEX "professional_availabilities_professional_id_day_of_week_key" ON "professional_availabilities"("professional_id", "day_of_week");

-- AddForeignKey
ALTER TABLE "establishment_availabilities" ADD CONSTRAINT "establishment_availabilities_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "establishment_availabilities" ADD CONSTRAINT "establishment_availabilities_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
