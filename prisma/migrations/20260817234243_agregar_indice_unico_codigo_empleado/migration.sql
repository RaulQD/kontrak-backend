CREATE UNIQUE INDEX "ux_employees_code"
  ON "employees" ("employee_code")
  WHERE "deleted_at" IS NULL;