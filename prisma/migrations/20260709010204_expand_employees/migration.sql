/*
  Warnings:

  - The values [ACTIVE,INACTIVE,SUSPENDED] on the enum `employee_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `first_name` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `maternal_surname` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `paternal_surname` on the `employees` table. All the data in the column will be lost.
  - You are about to alter the column `document_number` on the `employees` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(15)`.
  - You are about to alter the column `email` on the `employees` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - You are about to alter the column `personal_email` on the `employees` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - You are about to alter the column `phone` on the `employees` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `address` on the `employees` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(300)`.
  - Added the required column `first_names` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name_father` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name_mother` to the `employees` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "sex_type" AS ENUM ('MASCULINO', 'FEMENINO');

-- CreateEnum
CREATE TYPE "marital_status" AS ENUM ('SOLTERO', 'CASADO', 'DIVORCIADO', 'CONVIVIENTE', 'VIUDO');

-- AlterEnum
BEGIN;
CREATE TYPE "employee_status_new" AS ENUM ('ACTIVO', 'CESADO', 'SUSPENDIDO', 'VACACIONES', 'SUBSIDIADO');
ALTER TABLE "public"."employees" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "employees" ALTER COLUMN "status" TYPE "employee_status_new" USING ("status"::text::"employee_status_new");
ALTER TYPE "employee_status" RENAME TO "employee_status_old";
ALTER TYPE "employee_status_new" RENAME TO "employee_status";
DROP TYPE "public"."employee_status_old";
ALTER TABLE "employees" ALTER COLUMN "status" SET DEFAULT 'ACTIVO';
COMMIT;

-- DropIndex
DROP INDEX "employees_document_type_document_number_key";

-- AlterTable
ALTER TABLE "branches" ADD COLUMN     "ubigeo_id" CHAR(6);

-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "ubigeo_id" CHAR(6);

-- AlterTable
ALTER TABLE "employees" DROP COLUMN "first_name",
DROP COLUMN "maternal_surname",
DROP COLUMN "paternal_surname",
ADD COLUMN     "deleted_at" TIMESTAMPTZ(6),
ADD COLUMN     "employee_code" VARCHAR(20),
ADD COLUMN     "essalud_life_insurance" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "first_names" VARCHAR(100) NOT NULL,
ADD COLUMN     "has_children_under_18" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_name_father" VARCHAR(60) NOT NULL,
ADD COLUMN     "last_name_mother" VARCHAR(60) NOT NULL,
ADD COLUMN     "marital_status" "marital_status",
ADD COLUMN     "nationality" VARCHAR(40) DEFAULT 'PERUANA',
ADD COLUMN     "photo_url" VARCHAR(500),
ADD COLUMN     "sex" "sex_type",
ADD COLUMN     "ubigeo_id" CHAR(6),
ALTER COLUMN "document_type" SET DEFAULT 'DNI',
ALTER COLUMN "document_number" SET DATA TYPE VARCHAR(15),
ALTER COLUMN "birth_date" DROP NOT NULL,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "personal_email" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "phone" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "address" SET DATA TYPE VARCHAR(300),
ALTER COLUMN "status" SET DEFAULT 'ACTIVO';

-- CreateTable
CREATE TABLE "ubigeo" (
    "id" CHAR(6) NOT NULL,
    "department" VARCHAR(80) NOT NULL,
    "province" VARCHAR(80) NOT NULL,
    "district" VARCHAR(80) NOT NULL,

    CONSTRAINT "ubigeo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_ubigeo_id_fkey" FOREIGN KEY ("ubigeo_id") REFERENCES "ubigeo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branches" ADD CONSTRAINT "branches_ubigeo_id_fkey" FOREIGN KEY ("ubigeo_id") REFERENCES "ubigeo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_ubigeo_id_fkey" FOREIGN KEY ("ubigeo_id") REFERENCES "ubigeo"("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- CHECK: si el documento es DNI, deben ser exactamente 8 dígitos
ALTER TABLE "employees" ADD CONSTRAINT "ck_employees_dni_format"
    CHECK (document_type <> 'DNI' OR document_number ~ '^\d{8}$');

-- CHECK: la fecha de cese no puede ser anterior al ingreso
ALTER TABLE "employees" ADD CONSTRAINT "ck_employees_termination_range" CHECK (termination_date IS NULL OR termination_date >= hire_date);

ALTER TABLE "employees" ADD COLUMN "full_name" VARCHAR(220) GENERATED ALWAYS AS (first_names || ' ' || last_name_father || ' ' || COALESCE(last_name_mother, '')) STORED;

CREATE UNIQUE INDEX "ux_employees_doc" ON "employees" (company_id, document_type, document_number) WHERE deleted_at IS NULL;