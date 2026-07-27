-- AlterTable
ALTER TABLE "companies" ADD COLUMN "deleted_at" TIMESTAMPTZ(6),
ADD COLUMN     "industry_code" TEXT,
ADD COLUMN     "is_micro_small" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "legal_name" TEXT,
ADD COLUMN     "legal_representative_document" TEXT,
ADD COLUMN     "legal_representative_name" TEXT;

ALTER TABLE "companies" ADD CONSTRAINT "ck_companies_ruc_format" CHECK (ruc ~ '^(10|15|17|20)[0-9]{9}$')