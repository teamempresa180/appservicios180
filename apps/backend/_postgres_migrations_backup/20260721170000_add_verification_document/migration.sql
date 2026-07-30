-- AlterEnum
ALTER TYPE "verification_type" ADD VALUE 'CRIMINAL_RECORD';
ALTER TYPE "verification_type" ADD VALUE 'CERTIFICATION';

-- AlterTable
ALTER TABLE "verifications" ADD COLUMN     "document_path" TEXT;
