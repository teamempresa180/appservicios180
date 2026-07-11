-- CreateEnum
CREATE TYPE "document_type" AS ENUM ('NATIONAL_ID', 'PASSPORT', 'FOREIGN_ID', 'TAX_ID', 'OTHER');

-- CreateEnum
CREATE TYPE "identity_status" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "auth_method_type" AS ENUM ('PASSWORD', 'BIOMETRIC', 'ONE_TIME_CODE', 'THIRD_PARTY', 'OTHER');

-- CreateEnum
CREATE TYPE "authentication_status" AS ENUM ('ACTIVE', 'INACTIVE', 'LOCKED', 'REVOKED');

-- CreateEnum
CREATE TYPE "credential_type" AS ENUM ('PASSWORD', 'RECOVERY_CODE', 'SECURITY_KEY', 'OTHER');

-- CreateEnum
CREATE TYPE "credential_status" AS ENUM ('ACTIVE', 'EXPIRED', 'REVOKED');

-- CreateTable
CREATE TABLE "identities" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "document_type" "document_type" NOT NULL,
    "document_number" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "status" "identity_status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "identities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "authentications" (
    "id" TEXT NOT NULL,
    "identity_id" TEXT NOT NULL,
    "method_type" "auth_method_type" NOT NULL,
    "status" "authentication_status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "authentications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credentials" (
    "id" TEXT NOT NULL,
    "identity_id" TEXT NOT NULL,
    "type" "credential_type" NOT NULL,
    "status" "credential_status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credentials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "authentications_identity_id_idx" ON "authentications"("identity_id");

-- CreateIndex
CREATE INDEX "credentials_identity_id_idx" ON "credentials"("identity_id");

-- AddForeignKey
ALTER TABLE "authentications" ADD CONSTRAINT "authentications_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "identities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "identities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
