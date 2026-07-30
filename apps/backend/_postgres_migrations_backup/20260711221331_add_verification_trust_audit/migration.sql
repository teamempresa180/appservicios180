-- CreateEnum
CREATE TYPE "verification_type" AS ENUM ('DOCUMENT', 'FACIAL', 'ADDRESS', 'PHONE', 'EMAIL', 'OTHER');

-- CreateEnum
CREATE TYPE "verification_status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "trust_level" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH');

-- CreateEnum
CREATE TYPE "trust_status" AS ENUM ('ACTIVE', 'SUSPENDED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "audit_action_type" AS ENUM ('CREATED', 'UPDATED', 'DELETED', 'ACCESSED', 'LOGGED_IN', 'LOGGED_OUT', 'OTHER');

-- CreateTable
CREATE TABLE "verifications" (
    "id" TEXT NOT NULL,
    "identity_id" TEXT NOT NULL,
    "type" "verification_type" NOT NULL,
    "status" "verification_status" NOT NULL,
    "verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trust_profiles" (
    "id" TEXT NOT NULL,
    "identity_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "level" "trust_level" NOT NULL,
    "status" "trust_status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trust_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_records" (
    "id" TEXT NOT NULL,
    "identity_id" TEXT NOT NULL,
    "action_type" "audit_action_type" NOT NULL,
    "description" TEXT NOT NULL,
    "occurred_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audit_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "verifications_identity_id_idx" ON "verifications"("identity_id");

-- CreateIndex
CREATE UNIQUE INDEX "trust_profiles_identity_id_key" ON "trust_profiles"("identity_id");

-- CreateIndex
CREATE INDEX "audit_records_identity_id_idx" ON "audit_records"("identity_id");

-- AddForeignKey
ALTER TABLE "verifications" ADD CONSTRAINT "verifications_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "identities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trust_profiles" ADD CONSTRAINT "trust_profiles_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "identities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_records" ADD CONSTRAINT "audit_records_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "identities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
