/*
  Warnings:

  - Added the required column `category_id` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_provider_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_service_id_fkey";

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "category_id" TEXT,
ALTER COLUMN "provider_id" DROP NOT NULL,
ALTER COLUMN "service_id" DROP NOT NULL;

-- Backfill: every existing row was created before the open-request
-- model existed, so it always has a service_id — derive category_id
-- from that service's own category rather than picking one blindly.
UPDATE "orders" o
SET "category_id" = s."category_id"
FROM "services" s
WHERE o."service_id" = s."id";

ALTER TABLE "orders" ALTER COLUMN "category_id" SET NOT NULL;

-- CreateIndex
CREATE INDEX "orders_category_id_idx" ON "orders"("category_id");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "providers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
