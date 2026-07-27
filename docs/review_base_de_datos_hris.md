# Review de Base de Datos — Sistema HRIS Kontrak

> Revisión realizada con dos agentes especializados (**sql-pro**: correctitud del DDL; **database-administrator**: operación, concurrencia, seguridad y encaje con Prisma 7).
> Fecha: 2026-07-11
> Alcance: (1) diseño de BD del `plan_sistema_rrhh_hris.md`, (2) esquema alternativo propuesto externamente, (3) comparación y recomendación final.

---

# PARTE 1 — Review del diseño en `plan_sistema_rrhh_hris.md`

**Veredicto general:** diseño maduro. Puntos sólidos confirmados por ambos agentes: EXCLUDE anti-solape con `btree_gist`, numeración gapless sin SEQUENCE, versionado inmutable de plantillas, snapshots JSONB, índices parciales para soft-delete, tipos de dato correctos para Perú (NUMERIC para dinero, regex DNI/RUC). Los hallazgos son puntuales, no estructurales.

## 🔴 Críticos

### C1 — `employees.full_name VARCHAR(220)` puede desbordar
El máximo real de la columna generada es `100 + 1 + 60 + 1 + 60 = 222` caracteres. Un empleado con nombres al límite rompe el INSERT (`value too long for type character varying(220)`).

```sql
-- Fix: VARCHAR(240) o directamente TEXT
full_name VARCHAR(240) GENERATED ALWAYS AS
  (first_names || ' ' || last_name_father || ' ' || last_name_mother) STORED
```

> ⚠️ Esta tabla **ya está aplicada** en la BD real → requiere migración `ALTER` (las columnas generadas se recrean: `DROP COLUMN` + `ADD COLUMN`).

### C2 — `user_roles` con PK `(user_id, role_id)` contradice el multi-RUC
Impide que un mismo usuario tenga el mismo rol en dos razones sociales distintas.

```sql
-- Fix (PG15+): permite rol global (company_id NULL) sin duplicados
ALTER TABLE user_roles
  ADD CONSTRAINT ux_user_roles UNIQUE NULLS NOT DISTINCT (user_id, role_id, company_id);
```

### C3 — `UNIQUE (company_id, code)` con `company_id NULL` no previene duplicados
En PostgreSQL los NULL son distintos entre sí en un índice único → dos conceptos/plantillas "de sistema" con el mismo `code` pasan. Afecta a `payroll_concepts` y `document_templates`.

```sql
ALTER TABLE payroll_concepts
  ADD CONSTRAINT ux_payroll_concepts_code UNIQUE NULLS NOT DISTINCT (company_id, code);
ALTER TABLE document_templates
  ADD CONSTRAINT ux_document_templates_code UNIQUE NULLS NOT DISTINCT (company_id, code);
```

### C4 — Faltan índices en FKs de los caminos calientes
PostgreSQL **no** indexa las FKs automáticamente. Justo las consultas declaradas como diferenciadoras quedan sin soporte:

- `contracts.parent_contract_id` y `contract_renewals.source_contract_id` → la cadena de renovaciones / control de desnaturalización haría seq scan por nivel.
- `generated_documents.employee_id` → pantalla "documentos del colaborador".
- `payslips.employee_id` / `payslips.contract_id` → historial de boletas.

```sql
CREATE INDEX ix_contracts_parent    ON contracts (parent_contract_id) WHERE parent_contract_id IS NOT NULL;
CREATE INDEX ix_renewals_source     ON contract_renewals (source_contract_id);
CREATE INDEX ix_renewals_result_ctr ON contract_renewals (result_contract_id);
CREATE INDEX ix_gendocs_employee    ON generated_documents (employee_id) WHERE employee_id IS NOT NULL;
CREATE INDEX ix_payslips_employee   ON payslips (employee_id);
```

No hace falta indexar toda FK (los catálogos son diminutos); solo las transaccionales y las auto-referencias.

### C5 — La transacción del correlativo gapless NO puede englobar el I/O de OneDrive
Si se toma el correlativo, se renderiza el PDF y se sube a OneDrive dentro de la misma transacción, el lock de la fila `(company, tipo, año)` se sostiene durante segundos de red. Al importar un Excel con cientos de contratos, se emiten **en serie** (cada uno bloqueado por la subida del anterior). Es el cuello de botella operativo n.º 1 del caso de uso principal.

**Regla del pipeline:**
1. Render del PDF **antes** de abrir la transacción (a buffer temporal).
2. Transacción corta: tomar correlativo + `INSERT generated_documents` (con `storage_path` NULL) + **commit inmediato**.
3. Subida a OneDrive y `sha256` **después** del commit; luego `UPDATE` fija `storage_path`/`sha256`.
4. Para lotes: reservar un rango en un solo `UPDATE ... SET last_number = last_number + N RETURNING` y repartirlo en memoria.

## 🟡 Importantes

### I1 — Rollover de año en `document_number_sequences`
El `UPDATE...RETURNING` devuelve 0 filas si la fila `(company, type, año_nuevo)` no existe → bug garantizado cada 1 de enero. **Patrón canónico** (resuelve rollover y carrera en una sentencia, manteniendo el lock de fila):

```sql
INSERT INTO document_number_sequences (company_id, document_type_id, year, last_number)
VALUES ($1, $2, $3, 1)
ON CONFLICT (company_id, document_type_id, year)
DO UPDATE SET last_number = document_number_sequences.last_number + 1
RETURNING last_number;
```

### I2 — `afp_rates` sin protección anti-solape
Dos tasas vigentes para la misma fecha = boletas con montos incorrectos (bug de dinero).

```sql
ALTER TABLE afp_rates ADD CONSTRAINT ck_afp_rates_range
  CHECK (valid_to IS NULL OR valid_to >= valid_from);
ALTER TABLE afp_rates ADD CONSTRAINT ex_afp_rates_no_overlap
  EXCLUDE USING gist (
    pension_system_id WITH =,
    daterange(valid_from, valid_to, '[)') WITH &&
  );
```

Aplicar el mismo patrón a cualquier tabla de parámetros versionados (RMV/UIT).

### I3 — `audit_logs` particionada sin partición DEFAULT
Si el job no crea la partición del mes siguiente, el trigger de auditoría **aborta las transacciones de negocio** (planilla incluida).

```sql
CREATE TABLE audit_logs_default PARTITION OF audit_logs DEFAULT;
```

Mismo criterio para `attendance_records`. El job debe crear el mes N+1 con antelación.

### I4 — `contract_renewals`: CHECK debería ser XOR + falta unicidad de cadena
El CHECK actual permite `result_contract_id` **y** `result_addendum_id` poblados a la vez (ambiguo).

```sql
ALTER TABLE contract_renewals ADD CONSTRAINT ck_renewal_result_xor
  CHECK ((result_contract_id IS NOT NULL) <> (result_addendum_id IS NOT NULL));
ALTER TABLE contract_renewals ADD CONSTRAINT ux_renewal_chain
  UNIQUE (source_contract_id, renewal_number);
```

### I5 — Coherencia multi-RUC entre `contracts` y `employees`
Nada garantiza que `contracts.company_id` = empresa del empleado.

```sql
ALTER TABLE employees ADD CONSTRAINT ux_employees_company UNIQUE (id, company_id);
ALTER TABLE contracts
  ADD CONSTRAINT fk_contracts_employee_company
  FOREIGN KEY (employee_id, company_id) REFERENCES employees (id, company_id);
```

### I6 — Brecha RLS/PII
El plan justifica PostgreSQL citando RLS para confidencialidad salarial, pero no hay ni un `CREATE POLICY` en el DDL. Peor: el trigger de auditoría vuelca sueldos, DNI y cuentas bancarias **en claro** a `audit_logs` (sin protección propia).

- RLS mínima en `payslips`, `payslip_details`, `contracts`, `employees` (vía `current_setting('app.current_user_id')`, el mismo mecanismo de la auditoría).
- Rol dedicado para leer `audit_logs`.
- Redactar/excluir `account_number`/`cci` del payload del trigger, o cifrarlas con `pgcrypto` (es el punto de mejor relación valor/esfuerzo; cifrar todo `employees` sería sobre-ingeniería).

### I7 — Lista de "SQL manual" para Prisma incompleta
El plan lista EXCLUDE, índices parciales, triggers y particiones, pero olvida marcar como SQL manual (`--create-only`):

- **CHECK constraints** (todos: regex RUC/DNI, `salary >= 0`, `net_pay = gross - deductions`, desnaturalización…).
- **Columnas GENERATED** (`full_name`) — Prisma no las crea; mapear read-only.
- **Índices con INCLUDE** (`ix_payslips_period ... INCLUDE (net_pay, gross_income)`).

Si no se documentan, se pierden como drift silencioso al regenerar migraciones.

### I8 — Reglas de dominio sin garantía en BD
- `is_fixed_term` no obliga a `end_date` (ni al revés) → requiere trigger `BEFORE INSERT/UPDATE` que consulte `contract_types`.
- Fin de periodo de prueba sin columna ni índice para el job de alertas:

```sql
probation_end_date DATE GENERATED ALWAYS AS
  (start_date + (probation_months * INTERVAL '1 month'))::date STORED
-- + índice parcial sobre estados activos
CREATE INDEX ix_empdocs_expiring ON employee_documents (expires_at)
  WHERE expires_at IS NOT NULL AND deleted_at IS NULL;
```

## 🔵 Menores

| # | Tabla | Problema | Fix |
|---|-------|----------|-----|
| M1 | `positions` | Sin `UNIQUE (company_id, code)` (incoherente con branches/divisions) | Agregar unicidad |
| M2 | `contract_addendums` | `status` reutiliza `contract_status` (permite VIGENTE/RENOVADO en una adenda) | Enum propio: `addendum_status ('BORRADOR','GENERADO','FIRMADO','ANULADO')` |
| M3 | `payroll_periods`, `insurance_policies` | Sin `CHECK (end_date >= start_date)` | Agregar por consistencia |
| M4 | Enum `document_type` (DNI/CE) vs tabla `document_types` | Colisión de nombres confusa | Renombrar enum a `identity_document_type` |
| M5 | `contracts.currency` | `CHAR(3)` sin validación | `CHECK (currency IN ('PEN','USD'))` |
| M6 | `contracts.salary` | `CHECK (salary >= 0)` permite sueldo 0 | Revisar si debe ser `> 0` |
| M7 | EXCLUDE | `COALESCE(end_date,'infinity')` + `'[]'` funciona, pero `daterange(start_date, end_date, '[]')` con NULL directo es más limpio | Opcional |
| M8 | `payroll_periods` | `LIQUIDACION` con `UNIQUE (company, kind, year, month)` puede colisionar (varios ceses/mes) | Revisar modelado |

## ✅ Sobre-ingeniería a evitar (dictamen DBA)

- **PgBouncer**: innecesario a esta escala; el pool de Prisma basta. Complica el `SET LOCAL app.current_user_id` de la auditoría (requiere transaction pooling).
- **No particionar** `generated_documents` ni preocuparse por bloat del soft-delete.
- La justificación de "millones de filas/año" en marcaciones está sobredimensionada (~cientos de miles reales). El particionamiento se mantiene porque es barato.

## ✅ Lo que está bien diseñado (no tocar)

- EXCLUDE anti-solape (contratos, previsión, seguros) — garantía imposible de dar solo en la app bajo concurrencia.
- Numeración gapless con lock de fila (mejor que SEQUENCE para el requisito legal).
- Versionado inmutable de plantillas + `ux_template_current` (versión activa única garantizada).
- Snapshots JSONB (`generation_snapshot`, `pension_snapshot`) para reproducibilidad legal.
- Índices parciales alineados a estados calientes (`ix_contracts_expiring`, `ux_employees_doc`).
- Auditoría vía `SET LOCAL` + `current_setting(..., true)` — patrón idiomático correcto.
- Tipos peruanos: NUMERIC(12,2) para dinero, regex RUC `^(10|15|17|20)\d{9}$`, DNI `^\d{8}$`, ubigeo normalizado.
- CHECK de desnaturalización (`NOT exceeded_legal_limit OR (override_reason IS NOT NULL AND approved_by IS NOT NULL)`).

## Prioridad de acción (Parte 1)

1. Correcciones al plan que afectan tablas **aún no modeladas** (C2, C3, C5, I1, I4, I5, I7) — gratis, solo editar el doc.
2. `full_name` (C1) — migración ALTER sobre lo ya aplicado.
3. Índices FK (C4) y partición DEFAULT (I3) — antes de producción.
4. RLS/PII (I6) — antes de cargar sueldos reales.

---

# PARTE 2 — Review del esquema alternativo propuesto

**Veredicto general:** buen esquema en amplitud (trae SST, disciplinario, firmas multi-firmante), pero **repite errores ya corregidos en el plan y agrega nuevos**. Como base, el plan es superior — lo correcto es portar módulos, no reemplazar.

## 🔴 Críticos

### C1 — Datos médicos sin protección (riesgo LEGAL, el más grave)
`medical_exams.result` (APTO/NO_APTO) y los certificados son **datos sensibles bajo la Ley 29733** (protección reforzada: consentimiento expreso, seguridad reforzada, confidencialidad). La Ley 29783 (SST) establece que el empleador accede a la **aptitud**, no al detalle clínico. El esquema no tiene RLS ni control alguno: cualquier rol con SELECT ve resultados médicos de todos. Igual de sensibles: `disciplinary_cases.description`/`defense_text`, `work_accidents.description`. `pgcrypto` está declarada pero solo se usa para UUIDs.

**Fix:** RLS con rol dedicado (`salud_ocupacional`/`rrhh_legal`) separado del rol RRHH general; el detalle clínico no debe ser legible por RRHH estándar, solo aptitud/vencimiento.

### C2 — `ON DELETE CASCADE` sobre datos de conservación legal
Todo el legajo (documentos, exámenes médicos, cuentas bancarias, saldos vacacionales) cascadea desde `employees`; `document_signatures` — que guarda la **evidencia legal de firma** (IP, OTP, hash) — cascadea desde `generated_documents`; `disciplinary_actions` (sanciones) desde `disciplinary_cases`. Un solo `DELETE` que salte el middleware de soft-delete destruye registros con obligación de conservación de ~5 años. Además es incoherente: soft-delete en maestras, hard-delete-cascade en hijas.

**Fix:** `ON DELETE RESTRICT` + soft-delete para todo lo legal; CASCADE solo para lo efímero (contactos de emergencia, educación). `document_signatures` debe ser inmutable/append-only.

### C3 — Varias versiones "publicadas" de la misma plantilla
`is_published BOOLEAN` sin unicidad: el motor no sabe qué versión usar para emitir un documento legal. El plan ya lo resolvía con `ux_template_current`.

```sql
CREATE UNIQUE INDEX ux_template_published
    ON document_template_versions (template_id)
    WHERE is_published;
```

### C4 — `full_name VARCHAR(220)` — mismo overflow que el plan
222 caracteres máximos en columna de 220. Fix: `VARCHAR(240)` o `TEXT`.

### C5 — Correlativo gapless sin documentar sus dos trampas
Mismo patrón de fila única, pero sin ni siquiera el comentario explicativo del plan: falta el upsert `ON CONFLICT` para el rollover de año, y falta la regla de transacción corta (sin I/O a storage dentro del lock). Ver C5/I1 de la Parte 1 — aplican idénticos.

## 🟡 Importantes

### I1 — Bloque `DO` de triggers `updated_at`: one-shot frágil
- Corre **una sola vez**: toda tabla creada en migraciones Prisma futuras queda sin trigger silenciosamente.
- **No idempotente**: re-ejecutar da `trigger already exists`.
- No filtra vistas: `information_schema.columns` las incluye; una vista con `updated_at` abortaría la migración.

**Fix:** en proyecto Prisma, trigger explícito por tabla en cada migración con `CREATE OR REPLACE TRIGGER` (PG14+), filtrando `table_type = 'BASE TABLE'` si se mantiene el barrido.

### I2 — Brecha de índices más amplia que la del plan
El esquema anota "(alertas)" pero no crea los índices que las sirven:

```sql
CREATE INDEX ix_medexams_expiring   ON medical_exams (expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX ix_sctr_expiring       ON sctr_policies (end_date);
CREATE INDEX ix_empdocs_employee    ON employee_documents (employee_id) WHERE deleted_at IS NULL;
CREATE INDEX ix_empdocs_expiring    ON employee_documents (expires_at) WHERE expires_at IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX ix_notif_due           ON notifications (scheduled_for) WHERE status='PENDIENTE';  -- hot path del despachador
CREATE INDEX ix_signatures_document ON document_signatures (document_id);   -- FK con CASCADE sin índice
CREATE INDEX ix_signatures_pending  ON document_signatures (status) WHERE status='PENDIENTE';
CREATE INDEX ix_contracts_parent    ON contracts (parent_contract_id) WHERE parent_contract_id IS NOT NULL;
```

Además `ix_contracts_enddate` no filtra por estado (incluye VENCIDO/BORRADOR/soft-deleted); el `ix_contracts_expiring` del plan es superior.

### I3 — PK natural `VARCHAR(40)` en `document_types` sin `ON UPDATE CASCADE`
Prisma 7 lo soporta (`String @id`) y es legible, pero renombrar un `code` queda bloqueado por 3 FKs. Opciones: declarar los codes inmutables, agregar `ON UPDATE CASCADE`, o UUID + `code UNIQUE` (como el resto del propio esquema — es incoherente en esto).

### I4 — Sin control de desnaturalización
Tiene `parent_contract_id` y `max_duration_months` pero nada los conecta: no hay tabla de renovaciones, ni meses acumulados, ni CHECK de `override_reason`+`approved_by`. Para cumplimiento SUNAFIL es de lo más valioso del plan y aquí falta.

### I5 — `template_version_id NOT NULL` bloquea artefactos sin plantilla
Reportes Excel/SCTR que no vienen de plantilla no se pueden registrar. El plan la tenía nullable a propósito.

### I6 — `audit_logs` sin mecanismo de llenado ni protección
No hay trigger que la pueble (100% disciplina de app → fácil de bypassear); el comentario dice "append-only" pero nada impide UPDATE/DELETE (`REVOKE UPDATE, DELETE`); PK UUID aleatoria en tabla append-only (mejor `BIGINT IDENTITY`, menor a esta escala).

### I7 — Repite hallazgos del plan
- `UNIQUE (company_id, code)` con NULL permite plantillas de sistema duplicadas.
- `contract_addendums.status` reutiliza `contract_status`.
- Sin coherencia `contracts.company_id` ↔ `employees.company_id`.
- `positions` sin `UNIQUE (company_id, code)`.
- `leave_requests` sin EXCLUDE anti-solape de ausencias aprobadas:

```sql
ALTER TABLE leave_requests ADD CONSTRAINT ex_leaves_no_overlap
  EXCLUDE USING gist (
    employee_id WITH =,
    daterange(start_date, end_date, '[]') WITH &&
  ) WHERE (status IN ('APROBADA','GOZADA'));
```

### I8 — Menores propios
- `document_signatures` sin `UNIQUE (document_id, sign_order)` — órdenes de firma duplicables.
- Nada valida que `generated_documents.document_type` coincida con el tipo de la plantilla de `template_version_id` (se puede emitir un CONTRATO con plantilla de MEMORANDO) → trigger o FK compuesta.
- CHECKs de rango faltantes: `disciplinary_actions (effective_to >= effective_from)`, `medical_exams (expires_at >= exam_date)`.
- `user_roles` sin `company_id` (roles globales; impide acotar por razón social).
- `leave_requests.days` redundante (derivable del rango).

## ✅ Aciertos del esquema alternativo

- `audit_logs` plana sin particionar — **correcto a esta escala** (elimina el riesgo de partición sin DEFAULT del plan).
- Orden de migración limpio: única FK diferida (`divisions.manager_employee_id`) resuelta con `ALTER TABLE` explícito.
- `UNIQUE (company_id, document_type, correlativo)` con NULL en borradores — semántica correcta sin índice parcial.
- `leave_balances.pending_days` como columna generada.
- `variables_schema` JSONB embebido en la versión (versionado atómico con el body; trade-off: menos consultable que `template_variables`).

---

# PARTE 3 — Comparación y recomendación final

## Qué adoptar del esquema alternativo al plan

| Módulo/idea | Por qué | Condición al portarlo |
|---|---|---|
| `document_signatures` multi-firmante | `evidence JSONB` (IP/OTP/hash), rol, orden, estado — mucho mejor que el `signed_at` escalar del plan | Inmutable, sin CASCADE, con `UNIQUE (document_id, sign_order)` e índices |
| Módulo SST (`medical_exams`, `work_accidents`, `sctr_policies`) | El plan lo menciona pero no lo aterriza en DDL | **Con RLS/rol dedicado** (dato sensible Ley 29733) e índices de vencimiento |
| Módulo disciplinario (`disciplinary_cases` + `disciplinary_actions`) | Flujo de descargo completo, ausente en el plan | RESTRICT (no CASCADE) en sanciones; CHECKs de rango |
| `notifications` con `scheduled_for` | Modelo explícito de alertas programadas | Con índice parcial `WHERE status='PENDIENTE'` |
| `audit_logs` sin particionar | A esta escala es lo correcto (simplifica y elimina el riesgo de partición faltante) | Mantener trigger de llenado del plan + `REVOKE UPDATE/DELETE` |
| Detalles | `risk_level` con `MEDIO`, `identity_doc_type` con `OTRO`, `pending_days` generada, FK diferida explícita en el orden de migración | — |

## Qué mantiene mejor el plan (no reemplazar)

- **Toda la nómina** (payslips, `afp_rates` versionadas, CTS, gratificaciones, 5.ª categoría, PLAME) — el esquema alternativo no tiene nada de planilla y es el núcleo de un HRIS peruano.
- **Plantillas como JSONB de pdfmake** (sin eval/HTML) vs HTML/Handlebars en TEXT — el alternativo reintroduce el render HTML del que ya se migró, con más superficie de inyección.
- **Historial previsional normalizado** (`pension_systems` + `afp_rates` + afiliaciones con EXCLUDE) vs columnas de texto plano en `employees`.
- **Versión publicada única garantizada** (`ux_template_current`).
- **Control de desnaturalización** (`contract_renewals` + CHECK SUNAFIL).
- **Trigger genérico de auditoría** (llenado confiable de `audit_logs`).
- Índices parciales afinados con estado + `deleted_at`.
- Documentación operativa (migraciones, seed, backup/PITR).

## Recomendación

**Mantener el plan como base** y:

1. Aplicar las correcciones de la Parte 1 (críticos primero).
2. Portar del esquema alternativo: SST + disciplinario + `document_signatures` + `notifications` (corrigiendo C1, C2 e I2 de la Parte 2 al hacerlo).
3. Adoptar la simplificación de `audit_logs` sin particionar.
4. Cerrar los 3 problemas que **ningún** esquema resuelve todavía:
   - Protección de datos médicos/PII (RLS + roles).
   - Semántica de borrado coherente (RESTRICT + soft-delete para datos legales).
   - Patrón completo del correlativo (upsert de rollover + transacción corta sin I/O de storage).

## Checklist rápido para el modelado en Prisma

Construcciones que **siempre** van en SQL manual (`prisma migrate dev --create-only` + editar):

- [ ] `CREATE EXTENSION` (`pgcrypto`, `btree_gist`, `pg_trgm`)
- [ ] `EXCLUDE USING gist` (contratos, afiliaciones, seguros, ausencias, tasas AFP)
- [ ] Índices únicos parciales (`ux_employees_doc`, `ux_template_current`, `ux_gendocs_number`)
- [ ] Índices parciales (`ix_contracts_expiring`, `ix_notif_due`, etc.)
- [ ] **Todos los CHECK constraints** (regex RUC/DNI, rangos de fechas, desnaturalización, XOR de renovaciones)
- [ ] Columnas `GENERATED ALWAYS AS ... STORED` (`full_name`, `pending_days`, `probation_end_date`) — mapear read-only en Prisma
- [ ] Índices con `INCLUDE` (covering)
- [ ] `UNIQUE NULLS NOT DISTINCT`
- [ ] Triggers (`updated_at`, auditoría) y funciones plpgsql
- [ ] Particiones (`attendance_records`) + partición DEFAULT
- [ ] `REVOKE UPDATE, DELETE ON audit_logs`
- [ ] Políticas RLS (`CREATE POLICY`)

Las referencias polimórficas (`generated_documents.entity_table`/`entity_id`, `audit_logs`) van como columnas planas sin `@relation` — Prisma no soporta relaciones polimórficas; el join se hace en código.
