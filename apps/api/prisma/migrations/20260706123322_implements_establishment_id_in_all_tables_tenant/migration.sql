/*
  Warnings:

  - Added the required column `establishment_id` to the `professional_availabilities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `establishment_id` to the `professional_services` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "professional_availabilities" ADD COLUMN     "establishment_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "professional_services" ADD COLUMN     "establishment_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "professional_services" ADD CONSTRAINT "professional_services_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professional_availabilities" ADD CONSTRAINT "professional_availabilities_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
