-- CreateEnum
CREATE TYPE "contact_type" AS ENUM ('EMAIL', 'PHONE', 'OTHER');

-- CreateEnum
CREATE TYPE "contact_status" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "address_type" AS ENUM ('HOME', 'WORK', 'BILLING', 'SERVICE', 'EMERGENCY', 'OTHER');

-- CreateEnum
CREATE TYPE "address_status" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "identity_id" TEXT NOT NULL,
    "type" "contact_type" NOT NULL,
    "value" TEXT NOT NULL,
    "status" "contact_status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" TEXT NOT NULL,
    "identity_id" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "full_address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "type" "address_type" NOT NULL,
    "status" "address_status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "contacts_identity_id_idx" ON "contacts"("identity_id");

-- CreateIndex
CREATE INDEX "addresses_identity_id_idx" ON "addresses"("identity_id");

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "identities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "identities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
