-- AlterTable
ALTER TABLE "users" ADD COLUMN     "last_failed_login_at" TIMESTAMPTZ(6),
ADD COLUMN     "lockouts_count" SMALLINT NOT NULL DEFAULT 0;
