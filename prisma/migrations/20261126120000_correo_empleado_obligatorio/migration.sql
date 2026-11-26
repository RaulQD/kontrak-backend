-- US-020c: el correo corporativo es obligatorio, y su columna pasa a llamarse
-- corporate_email para distinguirla de personal_email. La API sigue usando `email`.
-- Antes de aplicarla, esta consulta debe devolver 0 (cuenta también los anulados):
--   SELECT count(*) FROM employees WHERE email IS NULL;
-- Primero el NOT NULL: si falla por un correo en null, la columna queda como estaba.
-- Reversión:
--   ALTER TABLE "employees" RENAME COLUMN "corporate_email" TO "email";
--   ALTER TABLE "employees" ALTER COLUMN "email" DROP NOT NULL;
ALTER TABLE "employees" ALTER COLUMN "email" SET NOT NULL;
ALTER TABLE "employees" RENAME COLUMN "email" TO "corporate_email";
