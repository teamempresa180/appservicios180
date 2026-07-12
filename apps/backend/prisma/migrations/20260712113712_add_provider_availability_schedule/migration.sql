-- CreateEnum
CREATE TYPE "provider_status" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "provider_type" AS ENUM ('INDEPENDENT', 'FREELANCER', 'COMPANY', 'OTHER');

-- CreateEnum
CREATE TYPE "provider_experience" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- CreateEnum
CREATE TYPE "availability_status" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "availability_type" AS ENUM ('FULL_TIME', 'PART_TIME', 'ON_DEMAND', 'SEASONAL', 'OTHER');

-- CreateEnum
CREATE TYPE "schedule_status" AS ENUM ('OPEN', 'BLOCKED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "schedule_type" AS ENUM ('REGULAR', 'BLOCKED', 'SPECIAL', 'OTHER');

-- CreateTable
CREATE TABLE "providers" (
    "id" TEXT NOT NULL,
    "identity_id" TEXT NOT NULL,
    "provider_profile_id" TEXT NOT NULL,
    "status" "provider_status" NOT NULL,
    "type" "provider_type" NOT NULL,
    "experience" "provider_experience" NOT NULL,
    "biography" TEXT NOT NULL,
    "years_of_experience" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "availabilities" (
    "id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "status" "availability_status" NOT NULL,
    "type" "availability_type" NOT NULL,
    "available_from" TIMESTAMP(3) NOT NULL,
    "available_to" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "availabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedules" (
    "id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "start_date_time" TIMESTAMP(3) NOT NULL,
    "end_date_time" TIMESTAMP(3) NOT NULL,
    "status" "schedule_status" NOT NULL,
    "type" "schedule_type" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "providers_identity_id_key" ON "providers"("identity_id");

-- CreateIndex
CREATE INDEX "providers_provider_profile_id_idx" ON "providers"("provider_profile_id");

-- CreateIndex
CREATE INDEX "availabilities_provider_id_idx" ON "availabilities"("provider_id");

-- CreateIndex
CREATE INDEX "schedules_provider_id_idx" ON "schedules"("provider_id");

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "providers" ADD CONSTRAINT "providers_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "identities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "providers" ADD CONSTRAINT "providers_provider_profile_id_fkey" FOREIGN KEY ("provider_profile_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availabilities" ADD CONSTRAINT "availabilities_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
