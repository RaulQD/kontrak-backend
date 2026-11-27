-- US-020c: un correo corporativo no se repite entre colaboradores vigentes o cesados.
-- Índice parcial de expresión: vive fuera de schema.prisma, igual que
-- ux_employees_doc y ux_employees_code (drift §3.3).
-- Antes de aplicarla, esta consulta debe devolver 0 filas:
--   SELECT lower(trim(corporate_email)) AS correo, count(*) FROM employees
--   WHERE deleted_at IS NULL GROUP BY 1 HAVING count(*) > 1;
-- Reversión: DROP INDEX "ux_employees_corporate_email";
UPDATE "employees" SET "corporate_email" = lower(trim("corporate_email")) WHERE "corporate_email" <> lower(trim("corporate_email"));

CREATE UNIQUE INDEX "ux_employees_corporate_email"
  ON "employees" (lower("corporate_email"))
  WHERE "deleted_at" IS NULL;