-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "professional_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "appointment_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" VARCHAR(1000),
    "reply" VARCHAR(1000),
    "replied_at" TIMESTAMP(3),
    "replied_by_id" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professional_rating_stats" (
    "id" TEXT NOT NULL,
    "professional_id" TEXT NOT NULL,
    "review_count" INTEGER NOT NULL DEFAULT 0,
    "rating_sum" INTEGER NOT NULL DEFAULT 0,
    "rating_avg" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "rating_1" INTEGER NOT NULL DEFAULT 0,
    "rating_2" INTEGER NOT NULL DEFAULT 0,
    "rating_3" INTEGER NOT NULL DEFAULT 0,
    "rating_4" INTEGER NOT NULL DEFAULT 0,
    "rating_5" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "professional_rating_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reviews_professional_id_created_at_idx" ON "reviews"("professional_id", "created_at");

-- CreateIndex
CREATE INDEX "reviews_organization_id_created_at_idx" ON "reviews"("organization_id", "created_at");

-- CreateIndex
CREATE INDEX "reviews_customer_id_idx" ON "reviews"("customer_id");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "professionals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_replied_by_id_fkey" FOREIGN KEY ("replied_by_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professional_rating_stats" ADD CONSTRAINT "professional_rating_stats_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "professionals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
