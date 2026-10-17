-- AlterEnum
ALTER TYPE "OrganizationAccessState" ADD VALUE 'CANCELED';

-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "stripe_customer_id" DROP NOT NULL;
