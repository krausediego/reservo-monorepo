/*
  Warnings:

  - You are about to drop the column `price` on the `services` table. All the data in the column will be lost.
  - Added the required column `service_duration_minutes` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `service_name` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `service_price_cents` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price_cents` to the `services` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "service_duration_minutes" INTEGER NOT NULL,
ADD COLUMN     "service_name" TEXT NOT NULL,
ADD COLUMN     "service_price_cents" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "services" DROP COLUMN "price",
ADD COLUMN     "price_cents" INTEGER NOT NULL;
