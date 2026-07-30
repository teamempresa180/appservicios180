-- CreateEnum
CREATE TYPE "order_status" AS ENUM ('PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REJECTED');

-- CreateEnum
CREATE TYPE "order_priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "quote_status" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "quote_type" AS ENUM ('STANDARD', 'DETAILED', 'ESTIMATE', 'OTHER');

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "identity_id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "scheduled_date" TIMESTAMP(3) NOT NULL,
    "status" "order_status" NOT NULL,
    "priority" "order_priority" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotes" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "proposed_price" DOUBLE PRECISION NOT NULL,
    "estimated_duration" INTEGER NOT NULL,
    "notes" TEXT NOT NULL,
    "status" "quote_status" NOT NULL,
    "type" "quote_type" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "orders_identity_id_idx" ON "orders"("identity_id");

-- CreateIndex
CREATE INDEX "orders_provider_id_idx" ON "orders"("provider_id");

-- CreateIndex
CREATE INDEX "orders_service_id_idx" ON "orders"("service_id");

-- CreateIndex
CREATE INDEX "quotes_order_id_idx" ON "quotes"("order_id");

-- CreateIndex
CREATE INDEX "quotes_provider_id_idx" ON "quotes"("provider_id");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "identities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
