/*
  Warnings:

  - You are about to drop the column `business_name` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `legal_representative_document` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `legal_representative_name` on the `companies` table. All the data in the column will be lost.
  - You are about to alter the column `trade_name` on the `companies` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - You are about to alter the column `address` on the `companies` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(300)`.
  - You are about to alter the column `industry_code` on the `companies` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.
  - You are about to alter the column `legal_name` on the `companies` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - Made the column `legal_name` on table `companies` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "companies" DROP COLUMN "business_name",
DROP COLUMN "legal_representative_document",
DROP COLUMN "legal_representative_name",
ADD COLUMN     "legal_rep_document" VARCHAR(15),
ADD COLUMN     "legal_rep_name" VARCHAR(200),
ALTER COLUMN "trade_name" SET DATA TYPE VARCHAR(200),
ALTER COLUMN "address" SET DATA TYPE VARCHAR(300),
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "industry_code" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "legal_name" SET NOT NULL,
ALTER COLUMN "legal_name" SET DATA TYPE VARCHAR(200);
