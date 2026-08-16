-- Sistema de una sola empresa (un solo RUC).
--
-- Decisión: el cliente opera bajo una única razón social, así que el catálogo
-- `companies` y la columna `company_id` dejan de tener sentido. Se elimina el
-- multi-RUC completo. Los datos del empleador (RUC, razón social, domicilio y
-- representante legal) ya viven en las plantillas de contrato
-- (src/domain/contracts/templates/templates.ts), que hoy son su fuente de verdad.
--
-- Momento elegido: `employees` y `contracts` están vacías, así que no hay
-- backfill ni pérdida de historia. Solo se pierde la única fila de `companies`,
-- que era semilla.
--
-- Rollback (no automático — exige recrear la fila de la empresa y repoblar
-- company_id en las 5 tablas antes de volver a poner los NOT NULL):
--   CREATE TABLE "companies" (...);
--   ALTER TABLE "branches"  ADD COLUMN "company_id" UUID;
--   ALTER TABLE "divisions" ADD COLUMN "company_id" UUID;
--   ALTER TABLE "positions" ADD COLUMN "company_id" UUID;
--   ALTER TABLE "employees" ADD COLUMN "company_id" UUID;
--   ALTER TABLE "contracts" ADD COLUMN "company_id" UUID;
--   -- ...UPDATE con el id de la empresa, luego SET NOT NULL, FKs e índices.

-- 1. Claves foráneas hacia companies.
ALTER TABLE "branches"  DROP CONSTRAINT "branches_company_id_fkey";
ALTER TABLE "divisions" DROP CONSTRAINT "divisions_company_id_fkey";
ALTER TABLE "positions" DROP CONSTRAINT "positions_company_id_fkey";
ALTER TABLE "employees" DROP CONSTRAINT "employees_company_id_fkey";
ALTER TABLE "contracts" DROP CONSTRAINT "contracts_company_id_fkey";

-- 2. Índices únicos compuestos que empezaban por company_id.
--    Al haber una sola empresa, la llave natural pasa a ser global.
DROP INDEX "branches_company_id_code_key";
DROP INDEX "divisions_company_id_code_key";
DROP INDEX "positions_company_id_name_key";
DROP INDEX "ux_employees_doc";

-- 3. La columna.
ALTER TABLE "branches"  DROP COLUMN "company_id";
ALTER TABLE "divisions" DROP COLUMN "company_id";
ALTER TABLE "positions" DROP COLUMN "company_id";
ALTER TABLE "employees" DROP COLUMN "company_id";
ALTER TABLE "contracts" DROP COLUMN "company_id";

-- 4. El catálogo.
DROP TABLE "companies";

-- 5. Los mismos únicos, ahora globales. Los tres primeros llevan el nombre que
--    Prisma genera para @unique, para que el schema y la base no queden en drift.
CREATE UNIQUE INDEX "branches_code_key"  ON "branches" ("code");
CREATE UNIQUE INDEX "divisions_code_key" ON "divisions" ("code");
CREATE UNIQUE INDEX "positions_name_key" ON "positions" ("name");

-- ux_employees_doc sigue siendo PARCIAL sobre deleted_at IS NULL, y por eso
-- sigue sin poder declararse en schema.prisma (Prisma no expresa índices
-- parciales). Es lo que permite volver a crear un colaborador con el mismo
-- documento después de una anulación registral. Ver docs/scrum/04 §3.3.
CREATE UNIQUE INDEX "ux_employees_doc"
  ON "employees" ("document_type", "document_number")
  WHERE "deleted_at" IS NULL;
