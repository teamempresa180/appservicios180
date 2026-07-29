-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "provider_status" ADD VALUE 'IN_REVIEW';
ALTER TYPE "provider_status" ADD VALUE 'REJECTED';
ALTER TYPE "provider_status" ADD VALUE 'BLOCKED';

-- AlterTable
ALTER TABLE "providers" ADD COLUMN     "category_id" TEXT,
ADD COLUMN     "specialization" TEXT;

-- CreateIndex
CREATE INDEX "providers_category_id_idx" ON "providers"("category_id");

-- AddForeignKey
ALTER TABLE "providers" ADD CONSTRAINT "providers_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
