/*
  Warnings:

  - You are about to drop the column `address` on the `establishments` table. All the data in the column will be lost.
  - Added the required column `neighborhood` to the `establishments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `establishments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `establishments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "establishments" DROP COLUMN "address",
ADD COLUMN     "neighborhood" TEXT NOT NULL,
ADD COLUMN     "number" INTEGER NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL;
