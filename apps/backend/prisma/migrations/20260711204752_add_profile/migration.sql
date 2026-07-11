-- CreateEnum
CREATE TYPE "profile_visibility" AS ENUM ('PUBLIC', 'PRIVATE', 'CONTACTS_ONLY');

-- CreateEnum
CREATE TYPE "profile_status" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "identity_id" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "avatar_url" TEXT,
    "bio" TEXT,
    "visibility" "profile_visibility" NOT NULL,
    "status" "profile_status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "profiles_identity_id_idx" ON "profiles"("identity_id");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "identities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
