# Kontrak HRIS — Plan de trabajo paralelo para 2 desarrolladores backend

**Documento:** 03-plan-2-devs
**Fecha:** 2026-08-11
**Sustituye (parcialmente):** `docs/scrum/02-plan-de-sprints.md` §7 para los Sprints 3, 4 y 5
**Vigencia:** Sprint 3 (2026-08-11) a Sprint 5 (2026-09-19)
**Equipo:** Dev A (Raul Quispe, dueño del repo) + Dev B (se incorpora hoy)

---

## 0. Por qué existe este documento

El plan de sprints vigente asigna al **Sprint 3 (11–22 ago)** las historias **US-012, US-013, US-014 y US-016**. Tras verificar el repositorio, **US-013 y US-014 son inejecutables hoy** y **US-012 requiere una decisión previa del dueño del producto**. Además el equipo pasa de 1 a 2 desarrolladores, lo que cambia el criterio de secuenciación: ya no basta con ordenar por dependencia, hay que ordenar también por **aislamiento de carpetas** para que dos personas no se pisen.

### 0.1 Hallazgos verificados contra el repositorio (2026-08-11)

| # | Hallazgo | Evidencia | Consecuencia |
|---|---|---|---|
| H1 | **Existen 16 tablas** y ninguna más | `prisma/schema.prisma` + 11 migraciones en `prisma/migrations/` | Todo lo que no esté en esa lista requiere migración nueva |
| H2 | **La tabla `ubigeo` SÍ existe** | `model Ubigeo` (schema.prisma:118) y `CREATE TABLE "ubigeo"` en `20260709010204_expand_employees` | El escenario 4 de US-004 **NO necesita migración**, solo datos de seed. Corrige el supuesto de partida |
| H3 | `payroll_concepts` y `pension_systems` **no existen** | Ausentes de schema y migraciones | Escenarios 2 y 3 de US-004 sí requieren migración nueva |
| H4 | `generated_documents`, `import_batches`, `import_batch_rows`, `employee_documents`, `insurance_policies`, `employee_insurances`, `sctr_declarations`, `password_resets` **no existen** | Ausentes de schema | US-013, US-014, US-016, US-017, US-018, US-019 bloqueadas por esquema |
| H5 | **`pdfmake` NO está instalado.** Solo está `@types/pdfmake` (tipos huérfanos) | `package.json:80` | US-012 dice en sus notas técnicas «usar pdfmake v10+ (ya en devDependencies)». **Eso es falso.** La historia no está lista |
| H6 | Hay **3 librerías de PDF instaladas y compitiendo**: `puppeteer`, `pdfkit`, `pdf-lib` | `package.json:58,59,62` | Se necesita una decisión de librería antes de estimar US-012 |
| H7 | El **Dockerfile no instala chromium** (no hay `apk add` / `apt-get` de chromium) | `Dockerfile` | La imagen construida muy probablemente **no puede generar PDFs**. Riesgo P0 |
| H8 | **No existe BullMQ ni Redis.** `redis` está **comentado** en `docker-compose.yaml` (líneas 53–66), no hay servicio `worker`, no hay dependencia `bullmq` ni `ioredis` | `docker-compose.yaml`, `package.json` | US-013 (encolar job, `GET /jobs/:jobId`) y US-014 (job repetible cada 10 min) tienen un **segundo bloqueador independiente** del de empleados |
| H9 | **No existe CI.** No hay carpeta `.github/` | `Glob .github/**` → sin resultados | Con 2 devs y merges concurrentes, `main` se puede romper sin que nadie se entere. Bloqueante para trabajar en paralelo |
| H10 | `Division.managerEmployeeId` y `User.employeeId` están **comentados** | `prisma/schema.prisma:72` y `:273` | Ninguna US del backlog los crea. Es un hueco del backlog, no una historia pendiente |
| H11 | `SCTR_RISK_LEVELS` tiene ~95 claves con variantes de formato del mismo puesto | `src/domain/excel/constants/positions.ts`: `'ANFITRION(A) C'` (l.59) y `'ANFITRION(A)C'` (l.73); `'ANFITRION(A) R'` (l.62) y `'ANFITRION(A)R'` (l.72); `'ANFITRION(A) PT'` (l.61) y `'ANFITRION(A)PT'` (l.74) | Los 95 puestos sembrados **no son 95 puestos reales**. Inflan el catálogo y falsean el conteo de un reporte SCTR |
| H12 | `testcontainers` **no está instalado**, pese a que la DoD del backlog lo exige | `package.json` | La DoD vigente es inaplicable. Se reemplaza por `pnpm test:e2e` contra `kontrak_test` (ver §6) |

### 0.2 Corrección explícita al supuesto de partida

> El enunciado de este encargo asumía que **ubigeo requiere migración nueva**. **No es así:** la tabla existe desde `20260709010204_expand_employees`. Solo falta el seed. Esto abarata el cierre de US-004 y lo convierte en una tarea ideal de rampa para Dev B.

---

## 1. Reordenamiento del backlog inmediato

### 1.1 Qué sale del Sprint 3 y por qué

| US | Pts (backlog) | Estado en el plan viejo | Veredicto | Motivo verificado |
|---|---|---|---|---|
| **US-012** Puppeteer → pdfmake | **5** | Sprint 3 | **Se aplaza a S5/S6, precedida de un spike** | H5 (pdfmake no instalado), H6 (3 librerías compitiendo), H7 (decisión de Dockerfile pendiente del dueño). Su dependencia US-011 tampoco está hecha |
| **US-013** ContractGenerationService | **3** | Sprint 3 | **Sale. No ejecutable** | Requiere empleados en BD (US-020, no hecha), `generated_documents` (H4) y cola BullMQ (H8). Tres bloqueadores |
| **US-014** Orquestador ingestión OneDrive | **3** | Sprint 3 | **Sale. No ejecutable** | Requiere `import_batches` + `import_batch_rows` (H4), BullMQ repetible (H8) y US-013 |
| **US-016** Modelo de documentos | **1** | Sprint 3 | **Se mueve a S5** | Es solo una migración + índice; es ejecutable, pero su valor solo se realiza junto a US-011. Moverlo a S5 lo empareja con el puerto de storage |

### 1.2 Qué entra, y el criterio

El criterio de reordenamiento es uno solo: **adelantar la ruta crítica (US-020) y rellenar el resto con trabajo que no toque las mismas carpetas.** Todo lo que entra cumple una de estas dos condiciones:

- **(a) No requiere migración** — porque las tablas ya existen (`employees`, `companies`, `branches`, `divisions`, `positions`, `ubigeo`).
- **(b) La migración que requiere es de un solo dev, en un solo sprint, en un solo PR.**

### 1.3 Los 3 sprints

#### Sprint 3 — 2026-08-11 a 2026-08-22
**Objetivo de sprint:** *Que la BD deje de estar vacía de empleados y que existan CI y trazabilidad de actor, para que todo lo demás pueda arrancar.*

| US / Tarea | Título | Pts | Dev | ¿Migración? |
|---|---|---|---|---|
| **US-020** | CRUD de empleados completo | **5** | A | **No** — `employees` ya existe con todos los campos |
| **US-009a** | Propagación de actor: AsyncLocalStorage + `SET LOCAL app.current_user_id` en la transacción | *sin puntos propios* ⚠️ | A | No |
| **TASK-CI** | Pipeline GitHub Actions: lint + type-check + test + test:e2e contra `kontrak_test` | *sin estimar* ⚠️ | B | No |
| **US-004 (esc. 4)** | Cerrar seed de ubigeo INEI | *sin puntos propios* ⚠️ | B | **No** (H2) |
| **US-010** | Recuperación de contraseña | **2** | B | **Sí** — `password_resets` (M1, de Dev B) |

⚠️ **US-009a, US-009b, US-008b, TASK-CI y el resto de US-004 no tienen puntos asignados en el backlog.** US-009 completa vale 2 pts y US-008 completa vale 2 pts, pero el backlog **no estima las rebanadas por separado** y TASK-CI **no existe como historia**. Deben estimarse en el Planning del 11/08 antes de comprometerlos. No invento el número aquí.

**Puntos comprometidos con estimación conocida: 7.** El resto se cierra en Planning.

#### Sprint 4 — 2026-08-25 a 2026-09-05
**Objetivo de sprint:** *Que un jefe solo vea su división y que todo cambio quede auditado; y que la estructura organizativa deje de ser provisional.*

| US / Tarea | Título | Pts | Dev | ¿Migración? |
|---|---|---|---|---|
| **US-008b** | RBAC rebanada B: filtros de alcance **por división** (escenarios 2 y 3) — el alcance por empresa desapareció el 13/08 con `drop_companies` | *sin puntos propios* ⚠️ | A | **Sí** — M2 |
| **US-009b** | Triggers de auditoría + `GET /audit-logs` | *sin puntos propios* ⚠️ | A | **Sí** — M3 |
| **US-031** | Datos del empleador (singleton) | **2** | B | No |
| **US-033** | Sedes/sucursales (branches) | **3** | B | No |
| **US-035** | Puestos con riesgo SCTR | **2** | B | No |
| **US-038** | Catálogos activos/inactivos (`is_active`) | **1** | B | No |
| **SPIKE-PDF** | Decidir librería de PDF y destino de Puppeteer (1 día) | *sin estimar* ⚠️ | B | No |

**Puntos comprometidos con estimación conocida: 9** (todos de Dev B). La carga de Dev A es US-008b + US-009b, a estimar.

#### Sprint 5 — 2026-09-08 a 2026-09-19
**Objetivo de sprint:** *Cerrar el maestro de empleados (cese + carga masiva) y sentar los cimientos de documentos para que EP-03 sea ejecutable en S6.*

| US / Tarea | Título | Pts | Dev | ¿Migración? |
|---|---|---|---|---|
| **US-022** | Cese de empleado con propagación | **3** | A | No |
| **US-023** | Importación masiva desde Excel | **5** | A | No |
| **US-034** | Divisiones/áreas con manager | **3** | B | No (consume M2 de S4) |
| **US-011** | Puerto FileStorage + adaptadores OneDrive/local | **3** | B | No |
| **US-016** | Modelo de documentos (`generated_documents`) | **1** | B | **Sí** — M4 |

**Puntos comprometidos: 8 (Dev A) + 7 (Dev B) = 15.**

### 1.4 Fuera de estos 3 sprints (visibilidad, no compromiso)

Queda pendiente y se planifica en la revisión del 19/09: **US-012** (5, condicionada al SPIKE-PDF), **US-013** (3), **US-014** (3, condicionada a decidir infraestructura asíncrona), **US-015** (2), **US-017** (2), **US-018** (2), **US-019** (3), **US-021** (3), **US-024** a **US-030**, **US-036**, **US-037**, y los escenarios 2 y 3 de **US-004** (payroll_concepts, pension_systems), que son prerrequisito de EP-10.

### 1.5 Nota sobre velocidad — no planificar 2 devs como 2×

El Sprint 2 comprometió **15 pts y entregó ~5**. La velocidad observada real del equipo (1 dev) es **~5 pts/sprint**, no los 22 que asume `02-plan-de-sprints.md` §2.4. Incorporar a Dev B **no duplica** la velocidad en S3: la rampa de entrada y el tiempo de revisión de Dev A consumen capacidad de Dev A.

| Sprint | Expectativa realista | Razonamiento |
|---|---|---|
| S3 | 7–10 pts | Dev A al 80% (20% revisando y explicando); Dev B al 40% productivo |
| S4 | 10–13 pts | Dev B autónomo en su módulo; Dev A recupera foco |
| S5 | 13–16 pts | Régimen de crucero |

**Acción:** no re-negociar fechas de MVP-1/MVP-2 hasta tener la velocidad real de S3 y S4 (medición el 05/09).

---

## 2. Asignación Dev A / Dev B: carpetas, roce y protocolo

### 2.1 Reparto de territorio permanente

| Territorio | Dueño por defecto | Contenido |
|---|---|---|
| `src/modules/auth/**` | **Dev A** | Salvo S3, donde Dev B entra a hacer US-010 (ver §2.2) |
| `src/modules/employees/**` | **Dev A** | US-020, US-022, US-023 |
| `src/modules/organization/**` | **Dev B** | US-031, US-033, US-034, US-035, US-038 (carpeta nueva, la crea Dev B) |
| `src/platform/**` | **Dev A** decide, **Dev B** implementa lo acordado | Cambios arquitectónicos requieren visto bueno de Dev A **antes** de escribir código |
| `src/shared/**` | **Dev A** | Middlewares, helpers, constantes transversales |
| `prisma/schema.prisma` | **Rotativo por sprint** | Ver §2.4 |
| `prisma/seed.ts` | **Rotativo por sprint** | Ver §2.4 |
| `src/domain/excel/**`, `src/services/**`, rutas legacy | **Dev A** | Código legacy sin auth por decisión del dueño. Nadie lo toca sin US explícita |
| `docs/**` | Ambos | Un archivo por US, nunca editar el mismo archivo a la vez |
| `.github/**` | **Dev B** (lo crea en S3) | Después, quien cambie el pipeline avisa en el canal |

### 2.2 Sprint 3 — carpetas y roce

| | Dev A | Dev B |
|---|---|---|
| **Trabajo** | US-020, US-009a | TASK-CI, US-004 esc.4, US-010 |
| **Escribe en** | `src/modules/employees/{domain,application,infrastructure,presentation}/**`, `src/platform/database/**` (ALS + `SET LOCAL`), `src/shared/middleware/` (1 archivo nuevo), `tests/e2e/employees.*` | `.github/workflows/ci.yml`, `prisma/seed.ts`, `src/assets/ubigeo.json` (nuevo), `src/modules/auth/application/{forgot,reset}-password.use-case.ts`, `src/modules/auth/presentation/routes/password.route.ts`, `prisma/schema.prisma` (bloque `PasswordReset`), `tests/e2e/password-reset.*` |
| **NO toca** | `prisma/seed.ts`, `prisma/schema.prisma`, `src/modules/auth/**`, `.github/**` | `src/modules/employees/**`, `src/platform/**`, `src/shared/**`, ficheros existentes de `src/modules/auth/` |

**Puntos de roce en S3 y cómo se resuelven:**

| Roce | Riesgo | Protocolo |
|---|---|---|
| `prisma/schema.prisma` | Dev B añade `PasswordReset` | **Dev B tiene la pluma en S3.** Dev A no toca el schema (US-020 no lo necesita: `employees` ya está completa). Cero conflicto por diseño |
| `prisma/seed.ts` | Dev B añade ubigeo; Dev A necesita fixtures para tests de US-020 | Dev A **no** toca `seed.ts`: crea sus fixtures en `tests/helpers/` con `prisma.employee.create()`. El seed es de producción, no de tests |
| `src/modules/auth/` | Dev B entra a territorio de Dev A | Dev B **solo crea archivos nuevos**. Si necesita cambiar uno existente (p. ej. registrar la ruta en `auth.routes.ts`), lo pide en el PR y Dev A hace ese cambio de una línea. Regla: *archivos nuevos sí, archivos ajenos no* |
| `src/services/app.ts` | Ambos registran rutas nuevas | Registro de rutas **al final del archivo**, una línea por router, en PRs separados. Si hay conflicto, se resuelve tomando `main` y re-añadiendo la línea propia al final |
| Tiempo de Dev A | Revisar 3 PRs de Dev B le come el sprint | Ver §4.4: ventana fija de revisión, 30 min/día |

**Por qué esta asignación y no otra:**

1. **US-020 y US-009a al mismo dev, a propósito.** El backlog declara que US-020 depende de US-009 (dependencia circular denunciada). Al asignar ambas a Dev A, la dependencia deja de ser una dependencia *entre personas* y pasa a ser un orden *dentro de una cabeza*: Dev A hace US-009a primero (2 archivos en `platform/database`) y encima construye US-020. Si estuvieran repartidas, Dev B quedaría bloqueado esperando el commit de Dev A.
2. **US-010 es la mejor rampa de entrada que existe en este repo.** Es SHOULD (si falla, no rompe nada), es independiente (no bloquea a nadie), y para hacerla Dev B está *obligado* a leer `docs/auth/jwt.md`, a reutilizar el patrón de hasheo de token de `refresh_tokens`, a añadir un modelo a Prisma y a escribir tests e2e copiando los 11 que ya existen. Es un recorrido guiado por toda la arquitectura, con la red de seguridad de que Dev A conoce ese módulo al dedillo y puede revisar bien.
3. **TASK-CI es el primer día de Dev B.** Escribir el pipeline lo fuerza a ejecutar `pnpm lint`, `pnpm type-check`, `pnpm test` y `pnpm test:e2e` en local, a levantar `kontrak_test` y a leer `docker-compose.yaml`. Es onboarding disfrazado de entrega, y desbloquea el trabajo paralelo de todo el equipo (H9).
4. **El seed de ubigeo es trabajo de datos**: bajo riesgo de romper nada, alto valor (desbloquea US-029 y las direcciones de empleados), y no requiere migración (H2).

### 2.3 Sprints 4 y 5 — carpetas y roce

**Sprint 4:**

| | Dev A | Dev B |
|---|---|---|
| **Escribe en** | `prisma/schema.prisma` (M2 + M3), `prisma/migrations/**`, `src/shared/middleware/require-permission*`, `src/modules/auth/**`, `src/modules/audit/**` (nuevo), repositorios de `src/modules/employees/` (para el filtro de alcance) | `src/modules/organization/**` (nuevo), `tests/e2e/organization.*`, `docs/pdf/spike-pdf.md` |
| **NO toca** | `src/modules/organization/**` | `prisma/**`, `src/shared/**`, `src/modules/{auth,employees,audit}/**` |
| **Roce** | `src/services/app.ts` (registro de rutas de `/audit-logs` y de organización) | Mismo protocolo de §2.2 |

Dev B trabaja en S4 sobre **cuatro tablas que ya existen** (`companies`, `branches`, `positions` + flag `is_active`). **Cero migraciones para Dev B en S4.** Dev A tiene la pluma completa del schema.

**Sprint 5:**

| | Dev A | Dev B |
|---|---|---|
| **Escribe en** | `src/modules/employees/**`, `src/domain/excel/**` (reutilización para US-023), `tests/e2e/employees.*` | `src/modules/organization/division*`, `src/platform/storage/**` (nuevo), `src/modules/documents/**` (nuevo), `prisma/schema.prisma` (M4) |
| **NO toca** | `src/platform/storage/**`, `prisma/**` | `src/modules/employees/**`, `src/domain/excel/**` |
| **Roce** | US-023 (importación) y US-016 (`generated_documents`) conceptualmente cercanas | **Se separan en el tiempo:** US-023 en S5 **no** escribe en `generated_documents`; solo crea empleados. La conexión se hace en S6 |

En S5 **la pluma del schema vuelve a Dev B** (M4). Dev A no necesita migración en S5: ni el cese (`termination_date` y `status` ya existen en `employees`) ni la importación masiva la requieren.

### 2.4 Protocolo de `prisma/schema.prisma` — el punto caliente

Este es el único archivo donde un conflicto puede corromper el estado de la BD de ambos. Reglas obligatorias:

| # | Regla |
|---|---|
| **R1** | **Un solo dev tiene la pluma por sprint.** S3 → Dev B. S4 → Dev A. S5 → Dev B. El otro dev **no abre** `prisma/schema.prisma` bajo ninguna circunstancia. Si lo necesita, es una señal de que la planificación del sprint estaba mal |
| **R2** | **La migración va en su propio PR, y es el primer PR del sprint.** Nada de mezclar migración + endpoints en un PR de 600 líneas. Título: `db(M2): enlace user↔employee y manager de división` |
| **R3** | **El PR de migración se mergea antes que cualquier PR que dependa de él.** Se anuncia en el canal al mergear: *«M2 en main, rebase y `pnpm prisma generate`»* |
| **R4** | Al recibir ese aviso, el otro dev ejecuta **inmediatamente**: `git pull --rebase origin main && pnpm install && pnpm prisma migrate deploy && pnpm prisma generate`. No se sigue trabajando sobre un cliente Prisma desactualizado |
| **R5** | **Los modelos nuevos se añaden al final del fichero**, nunca insertados entre modelos existentes. Reduce el solapamiento de diffs a casi cero |
| **R6** | **Nunca se edita una migración ya mergeada.** Corregir = migración nueva. `prisma migrate dev` solo se ejecuta en la rama del PR de migración |
| **R7** | Si aun así hay conflicto en `schema.prisma`: **no se resuelve a mano bloque por bloque.** Se hace `git checkout --theirs prisma/schema.prisma` (quedarse con `main`), se re-pega el modelo propio al final, y se regenera la migración desde cero |
| **R8** | Verificar que `src/generated/` esté en `.gitignore`. Un cliente Prisma versionado es una fuente permanente de conflictos ilegibles. **Tarea de S3, Dev B, dentro de TASK-CI** |
| **R9** | Cada migración lleva, en la descripción del PR, su **plan de rollback** en SQL comentado (lo exige la DoD del backlog §4) |

---

## 3. Ruta crítica: por qué US-020 va primero

### 3.1 El argumento

**US-020 (CRUD de empleados, 5 pts, MUST, EP-06, Fase 2) es el único nodo del grafo cuya ausencia bloquea simultáneamente 6 líneas de trabajo.** El plan vigente lo coloca en el Sprint 5 (08–19 sep). Eso implica que durante S3 y S4 —**cuatro semanas y dos personas**— nadie podría tocar EP-03, EP-04 ni EP-05, que son justamente el MVP-1 comprometido con el cliente para el 05/09.

Se adelanta de S5 a **S3**.

### 3.2 Qué desbloquea exactamente

| Bloqueado hoy | Por qué necesita US-020 | Se desbloquea en |
|---|---|---|
| **US-008b** (RBAC alcance, esc. 2 y 3) | «Un jefe solo ve a su división» no es testeable sin empleados ni sin el vínculo `User → Employee → Division` | S4 |
| **US-009b** (triggers de auditoría) | Los escenarios 1 y 2 de US-009 son literalmente *crear empleado* y *cambiar sueldo de empleado*. Sin endpoints de empleados no hay nada que auditar | S4 |
| **US-013** (ContractGenerationService) | Escenario 1: «valida que empleado existe» | S6 (además necesita M5 y cola) |
| **US-014** (ingestión OneDrive) | Genera contratos, que cuelgan de empleados | S6+ |
| **EP-04** (US-017, legajo) | `employee_documents.employee_id` | S6+ |
| **EP-05** (US-018, US-019) | `employee_insurances.employee_id`; el reporte SCTR lista empleados | S6+ |
| **US-021 a US-030** (resto de EP-06) | Todas declaran dependencia de US-020 | S5 en adelante |

### 3.3 Coste de adelantarlo: cero

US-020 **no requiere ninguna migración**: la tabla `employees` ya existe (migraciones `add_employees` + `expand_employees`) con `document_type`, `document_number`, `first_names`, `last_name_father`, `last_name_mother`, `full_name` generado, `hire_date`, `status`, `has_children_under_18`, `ubigeo_id` y soft delete. Adelantarla no cuesta trabajo de esquema; solo cuesta escribir el módulo.

Su única dependencia declarada (US-009) queda satisfecha por la rebanada **US-009a**, que se hace en el mismo sprint y por el mismo dev.

### 3.4 Calendario de migraciones nuevas

| ID | Migración | Contenido | US que la exige | Sprint | Dev |
|---|---|---|---|---|---|
| — | *(ninguna)* | **`ubigeo` ya existe** (H2). Solo falta seed | US-004 esc. 4, US-029 | **S3** | B |
| **M1** | `add_password_resets` | Tabla `password_resets(token_hash, user_id, expires_at, used_at)` + índice | US-010 | **S3** | B |
| **M2** | `link_user_employee_and_division_manager` | Descomentar `users.employee_id` (FK → employees, nullable, UNIQUE parcial) y `divisions.manager_employee_id` (FK → employees, nullable) + índices | **US-008b** | **S4** | A |
| **M3** | `audit_triggers` | Función `fn_audit()` + triggers AFTER INSERT/UPDATE/DELETE en `employees`, `contracts`, `user_roles`; lee `current_setting('app.current_user_id', true)` | US-009b | **S4** | A |
| **M4** | `add_generated_documents` | Tabla `generated_documents` (kind, entity_table, entity_id, employee_id, sha256, storage_provider, storage_path, generation_snapshot JSONB) + índice `(entity_table, entity_id)` | US-016 | **S5** | B |
| **M5** | `add_import_batches` | `import_batches` + `import_batch_rows` | US-014 | **S6** (no comprometido) | por definir |
| **M6** | `add_payroll_catalogs` | `payroll_concepts`, `pension_systems`, `afp_rates` versionadas | US-004 esc. 2 y 3, EP-10 | **S6+** (no comprometido) | por definir |

**Sobre M2 — es un hueco del backlog, no una historia.** Ninguna US del backlog crea `Division.managerEmployeeId` ni `User.employeeId`. US-034 dice «manager por división» pero es SHOULD y está en Fase 2. **Acción para el PO:** M2 se ejecuta como parte de US-008b y se documenta como corrección de alcance en la retro de S4. Otros huecos detectados: no existe US para CI (EP-01 declara 9 historias y solo se escribieron 6), ni para infraestructura asíncrona (Redis/BullMQ), pese a que US-013 y US-014 la dan por hecha.

---

## 4. Contrato de trabajo entre los 2 devs

### 4.1 Ramas

**Situación actual a corregir:** la rama viva es `feat/EP-01` y contiene EP-01 **y** EP-02 (US-007, US-008a, US-004). Una rama por épica es demasiado gruesa: acumula semanas de trabajo, hace los PRs ilegibles y multiplica los conflictos.

| Regla | Detalle |
|---|---|
| **Tronco** | `main`. Sin `develop`: con 2 devs, una rama de integración extra solo añade merges |
| **Nomenclatura** | `<tipo>/US-0XX-descripcion-corta-en-kebab` — ej. `feat/US-020-crud-empleados`, `feat/US-010-recuperacion-password` |
| **Tipos** | `feat/`, `fix/`, `db/` (solo migraciones), `chore/`, `docs/`, `test/` |
| **Sin US** | `chore/ci-pipeline`, `db/M2-user-employee-link`, `spike/pdf-libreria` |
| **Una rama = una US** | Si una US necesita 2 PRs, se usan `feat/US-020-crud-empleados` y `feat/US-020-crud-empleados-tests` |
| **Vida máxima** | **5 días hábiles.** Pasado ese plazo, se parte y se mergea lo que esté verde detrás de un flag o sin ruta expuesta |
| **Rebase, no merge** | `git pull --rebase origin main` a diario, mínimo. Se prohíbe `git merge main` dentro de la rama de feature |
| **Merge a main** | **Squash merge.** El historial de `main` queda a 1 commit por PR |
| **Acción día 1 de S3** | **Cerrar `feat/EP-01`**: mergearla a `main` hoy (11/08) antes de que Dev B clone. Es el punto de sincronización. Sin esto, Dev B parte de un `main` que no refleja la realidad |

### 4.2 Commits

Formato obligatorio, **en español**:

```
tipo(ámbito): descripción en imperativo y minúscula

Cuerpo opcional explicando el porqué, no el qué.

Refs US-020
```

| Elemento | Valores permitidos |
|---|---|
| **tipo** | `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `db`, `perf` |
| **ámbito** | El módulo o carpeta: `auth`, `employees`, `organization`, `platform`, `shared`, `prisma`, `seed`, `ci`, `docs` |
| **descripción** | Español, imperativo, minúscula, sin punto final, ≤ 72 caracteres |
| **Refs** | `Refs US-XXX` en la última línea. Si cierra la historia: `Closes US-XXX` |

**Prohibido, sin excepción:** cualquier línea de atribución al final del commit — `Co-Authored-By:`, `Generated with`, `Assisted by`, firmas de herramientas o de agentes. Un commit lo firma quien lo hace, y nadie más. Esto se verifica en revisión y es motivo de rechazo del PR.

Ejemplos válidos:
```
feat(employees): agregar endpoint POST /employees con validacion de DNI

Refs US-020
```
```
db(prisma): crear tabla password_resets con expiracion de 1 hora

Refs US-010
```

### 4.3 Tamaño de PR

| Métrica | Límite | Nota |
|---|---|---|
| Líneas cambiadas | **≤ 400** | Excluyendo `pnpm-lock.yaml`, `src/generated/**` y SQL de migraciones |
| Archivos | **≤ 20** | |
| Historias por PR | **1** | Un PR nunca mezcla dos US |
| Migración + feature | **Nunca en el mismo PR** | Regla R2 |
| Refactor + feature | **Nunca en el mismo PR** | El refactor va antes, en su propio `refactor/` |

Un PR que exceda el límite **se rechaza sin revisar** y se pide partirlo. Es más barato partir que revisar mal.

### 4.4 Revisión

| Regla | Detalle |
|---|---|
| **Quién revisa** | **Todo PR de Dev B lo revisa Dev A** (obligatorio, es el dueño de la arquitectura). Todo PR de Dev A lo revisa Dev B (es mecanismo de aprendizaje) |
| **SLA de revisión** | **24 h hábiles.** Dev A reserva **30 min/día, 17:00–17:30**, para revisar. No se revisa en modo interrupción |
| **Desbloqueo** | Si Dev B no revisa un PR de Dev A en 24 h, Dev A puede auto-mergear dejando comentario `revisión pendiente, SLA vencido`. **Esta salida no aplica a la inversa:** ningún PR de Dev B se mergea sin aprobación de Dev A |
| **Merge lo hace** | El autor del PR, tras la aprobación y con CI en verde |
| **CI obligatorio** | Ningún merge con CI en rojo. Se configura `main` como rama protegida en S3 |
| **Escalado** | Desacuerdo técnico > 2 rondas de comentarios → 15 min de llamada. No se discute arquitectura en hilos de GitHub |

### 4.5 «No tocar la carpeta del otro»

| Regla | Detalle |
|---|---|
| **N1** | Cada dev escribe solo en los territorios asignados para ese sprint (§2.2, §2.3) |
| **N2** | ¿Necesitas algo de la carpeta del otro? **Se pide, no se hace.** Comentario en el issue con `@dueño necesito X`, respuesta en 4 h |
| **N3** | **Excepción:** cambios de **una línea** para registrar una ruta o exportar un símbolo, siempre **al final del archivo**, siempre anunciados en el PR |
| **N4** | Nadie renombra ni mueve archivos de la carpeta ajena. Nunca. Un rename convierte cualquier diff en ilegible |
| **N5** | Ficheros compartidos de alto riesgo (`src/services/app.ts`, `src/shared/helpers/index.ts`, `eslint.config.mjs`, `tsconfig.json`, `package.json`): se anuncia **antes** de editarlos |
| **N6** | `package.json` / `pnpm-lock.yaml`: **añadir dependencias solo Dev A**, o Dev B con aprobación previa explícita. Cada dependencia nueva se justifica en el PR (motivo H5/H6: el repo ya arrastra tipos huérfanos y 3 librerías de PDF) |

### 4.6 Sincronización diaria

| Cuándo | Qué | Formato |
|---|---|---|
| **09:00** | Daily asíncrono | Cada uno escribe 3 líneas en el canal: *hice / haré / me bloquea*. Máx. 5 min |
| **Al mergear a `main`** | Aviso obligatorio | *«Mergeado #NN (US-0XX). Toca `carpeta/`. ¿Rebase?»* |
| **Al mergear una migración** | Aviso + acción del otro | Regla R3/R4 |
| **Viernes 16:00** | Review + retro | Ambos + PO |
| **Bloqueo > 4 h** | Escalado inmediato | No se espera al daily |

---

## 5. Definition of Ready (DoR)

Una historia **no entra a sprint** si le falta un solo punto:

| # | Criterio | Verificación concreta |
|---|---|---|
| **R-1** | Criterios de aceptación en Gherkin, ≥ 2 escenarios, testables | Se puede escribir el nombre del test e2e leyendo el escenario |
| **R-2** | **Las tablas que toca existen en `prisma/schema.prisma`, o la migración está identificada y asignada a un dev y un sprint** | Grep en `schema.prisma`. *Este criterio es el que habría evitado meter US-013/US-014 en el Sprint 3* |
| **R-3** | **Las dependencias de librería existen en `package.json`** | Grep en `package.json`. *Este criterio es el que habría detectado que `pdfmake` no está instalado (H5)* |
| **R-4** | Dependencias entre US resueltas: todas sus predecesoras están DONE o en el mismo sprint y con el mismo dev | Tabla de dependencias del backlog §5 |
| **R-5** | Estimada en Fibonacci (1–8). Si es > 8, está partida. **Si no tiene puntos, no entra: se estima en Planning** | El backlog no estima US-008b, US-009a/b ni TASK-CI |
| **R-6** | Dueño asignado (Dev A o Dev B) y carpetas declaradas | Tablas §2.2/§2.3 |
| **R-7** | Los spikes o decisiones del PO de los que depende están **cerrados** | Ver §7 |
| **R-8** | No requiere escribir en la carpeta del otro dev en el mismo sprint | Si la requiere, se re-planifica |

---

## 6. Definition of Done (DoD)

Un item es DONE cuando **todo** esto está verde. Comandos reales de este repo:

| # | Criterio | Comando / verificación |
|---|---|---|
| **D-1** | Lint limpio | `pnpm lint` |
| **D-2** | TypeScript compila | `pnpm type-check` |
| **D-3** | Tests unitarios verdes | `pnpm test` |
| **D-4** | Tests e2e verdes contra `kontrak_test` | `pnpm test:e2e` |
| **D-5** | **Al menos 1 test e2e por escenario Gherkin de la US** | Referencia cruzada en la descripción del PR |
| **D-6** | Migración aplicable **y** revertible en BD limpia | `pnpm prisma migrate deploy` sobre BD vacía + SQL de rollback comentado en el PR |
| **D-7** | Seed sigue siendo idempotente | `pnpm seed` dos veces seguidas, sin errores ni duplicados |
| **D-8** | CI en verde en el PR | GitHub Actions (existe a partir de S3) |
| **D-9** | Aprobado por el otro dev (§4.4) | |
| **D-10** | PR ≤ 400 líneas, 1 US, sin líneas de atribución en los commits | |
| **D-11** | Descripción del PR: problema → solución → cómo se probó → rollback | |
| **D-12** | Documentación mínima: 1 archivo en `docs/` si la US crea un módulo, endpoint público o tabla | Precedente: `docs/auth/jwt.md` |
| **D-13** | Sin secretos ni PII en el código, los logs o los tests | Revisión manual en el PR |
| **D-14** | Mergeado a `main` con squash y issue cerrado | |

**Nota sobre cobertura:** la DoD del backlog (`02-plan-de-sprints.md` §4) exige «70% de cobertura» y «Testcontainers». **Testcontainers no está instalado (H12)** y no hay herramienta de cobertura configurada. Hasta que se instalen, la DoD operativa es **D-5** (un e2e por escenario), que es más accionable y verificable hoy. Formalizar la cobertura es una tarea a estimar cuando exista CI.

---

## 7. Riesgos, dueño y mitigación

| # | Riesgo | Prob. | Impacto | Dueño | Mitigación concreta | Fecha |
|---|---|---|---|---|---|---|
| **R1** | **Puppeteer no funciona en la imagen Docker.** El Dockerfile no instala chromium (H7) y `puppeteer` está en `dependencies`. La generación de PDFs en el contenedor probablemente falla hoy en producción | **Alta** | **Crítico** | **Dev A** | (a) **Verificar en 24 h**: `docker compose build && docker compose run api node -e "require('puppeteer').launch()"`. (b) Con el resultado, el PO decide (§8, D3). (c) Si Puppeteer se queda: añadir chromium al Dockerfile y `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD` + `PUPPETEER_EXECUTABLE_PATH`. (d) Si no: US-012 pasa a MUST reforzado en S6 | **12/08** |
| **R2** | **US-012 no es planificable.** `pdfmake` no está instalado pese a que sus notas técnicas lo afirman (H5), y hay 3 librerías de PDF compitiendo (H6). Su estimación de 5 pts no es fiable | Alta | Alto | **Dev B** (ejecuta) / **PO** (decide) | **SPIKE-PDF en S4** (1 día): generar el mismo contrato con `pdfkit` (ya instalado), `pdfmake` (a instalar) y Puppeteer; comparar fidelidad visual, tiempo y tamaño de imagen; documentar en `docs/pdf/spike-pdf.md`. **Re-estimar US-012 con el resultado** | **05/09** |
| **R3** | **No existe infraestructura asíncrona.** Sin BullMQ, sin Redis (comentado en `docker-compose.yaml`), sin servicio `worker` (H8). US-013 y US-014 la dan por existente | Alta | Alto | **Dev A** | Crear historia técnica **«US-0XX: infraestructura de colas»** en el refinamiento del 22/08 y estimarla. **Sin ella, US-014 no se compromete en ningún sprint.** Alternativa a evaluar: `node-cron` (ya instalado) para el job repetible, sin Redis, aceptando no tener reintentos con backoff | **22/08** |
| **R4** | **No hay CI (H9).** Con 2 devs mergeando en paralelo, `main` se rompe y nadie se entera hasta el siguiente `pnpm test` manual | **Alta** | Alto | **Dev B** | **TASK-CI en S3, primera tarea.** Workflow con `pnpm lint`, `type-check`, `test`, `test:e2e` contra servicio Postgres `kontrak_test`. Proteger `main`: prohibir push directo, exigir CI verde + 1 aprobación | **15/08** |
| **R5** | **Duplicación de puestos en `SCTR_RISK_LEVELS`.** ~95 claves con variantes de formato del mismo puesto: `'ANFITRION(A) C'` vs `'ANFITRION(A)C'`, `'ANFITRION(A) R'` vs `'ANFITRION(A)R'`, `'ANFITRION(A) PT'` vs `'ANFITRION(A)PT'` (H11). Los 95 `positions` sembrados **no son 95 puestos reales**; un reporte SCTR contaría empleados repartidos entre variantes del mismo cargo, y un contrato podría emitirse con un nombre de puesto no canónico | **Confirmado** | Alto | **Dev B** | (a) **S4, dentro de US-035**: informe de duplicados — normalizar clave (`trim`, colapsar espacios, mayúsculas, quitar sufijos `PT`/`C`/`R`/`V`/`CAMPAÑA`) y listar los grupos colisionantes. (b) Poblar `positions.canonical_name` (**la columna ya existe**, schema.prisma:98) con el nombre canónico. (c) **US-036 «Normalización de puestos» (2 pts, SHOULD)** deja de ser opcional: se marca candidata a MUST y se propone para S6. (d) **No borrar variantes**: `is_active=false` (US-038) para no romper referencias históricas | **05/09** |
| **R6** | **Sede y división son datos provisionales.** Hay 1 sede y 1 división de relleno hasta que el cliente entregue su estructura real. Todo contrato generado antes de la entrega llevará una sede/división falsa | Media | **Alto** (legal: la sede va en el T-Registro) | **PO** (conseguir datos) / **Dev B** (código) | (a) **US-031 + US-033 + US-034 en S4/S5** dan al cliente el CRUD para cargarlos él mismo. (b) **Marcar los registros provisionales** con código `TEMP-*` y `is_active=false` en cuanto lleguen los reales. (c) **Bloqueo duro:** no generar ni un solo contrato en producción mientras la sede referenciada sea `TEMP-*`. (d) PO pide al cliente: sedes con código SUNAT de establecimiento (4 dígitos), ubigeo y divisiones con su jefe | **05/09** |
| **R7** | **Conflicto en `prisma/schema.prisma`** entre los 2 devs; en el peor caso, dos migraciones divergentes que dejan las BD locales inconsistentes | Media | Alto | **Dev A** | Reglas R1–R9 (§2.4): una pluma por sprint, migración en PR aparte y primero, aviso obligatorio al mergear, modelos al final del fichero, nunca editar migración mergeada | Permanente |
| **R8** | **Sobreestimación de la velocidad con 2 devs.** S2 comprometió 15 y entregó ~5. Duplicar el compromiso porque hay 2 devs repetiría el fallo, agravado por la rampa de Dev B | **Alta** | Medio | **Scrum Master** | S3 se compromete a **7–10 pts** (§1.5). No se re-negocian fechas de MVP hasta medir S3 y S4. Retro del 22/08 con velocidad real por dev | 22/08 |
| **R9** | **Dev A se convierte en revisor a tiempo completo** y su propia entrega (US-020, la ruta crítica) se retrasa | Media | Alto | **Dev A** | Ventana fija de revisión 17:00–17:30 (§4.4). Límite de 400 líneas por PR. En S3 Dev B trabaja sobre US-010, que es la parte del código **mejor documentada** (`docs/auth/jwt.md`) y con 11 tests e2e de referencia: se autoexplica |
| **R10** | **`sunat_plame_code` en null** en los 6 tipos de contrato. Sin él, US-071 (PLAME/T-Registro) es inejecutable y los contratos no son declarables ante SUNAT | Media | Alto | **PO** | Conseguir los 6 códigos de la Tabla 8 de SUNAT (§8, D4). Es un `UPDATE` de 6 filas en el seed: 15 min de trabajo, semanas de espera si no se pide ya | 22/08 |
| **R11** | **Rampa de Dev B más lenta de lo previsto**: arquitectura hexagonal + Prisma 7 con driver adapter + patrón de rotación de refresh tokens es mucha superficie nueva | Media | Medio | **Dev A** | Día 1: recorrido de 1 h por `docs/auth/jwt.md` y `src/modules/auth/`. TASK-CI como primera tarea (fuerza a ejecutar todo el toolchain). Primer PR de Dev B antes del 14/08, por pequeño que sea |
| **R12** | **Deuda del backlog:** faltan historias para CI, colas, `User.employee_id` y `Division.managerEmployeeId`. EP-01 declara 9 historias y solo se escribieron 6 | Confirmado | Medio | **PO** | Refinamiento del 22/08: crear las historias faltantes con ID propio en `01-product-backlog.md`. Mientras tanto, se ejecutan como tareas técnicas dentro de US-008b (M2) y TASK-CI |

---

## 8. Decisiones pendientes del dueño del producto

Estas cuatro decisiones **bloquean la planificación**, no solo la implementación. Sin ellas, historias enteras no cumplen la DoR.

| ID | Decisión | Qué bloquea exactamente | Opciones | Recomendación técnica | Necesaria antes de |
|---|---|---|---|---|---|
| **D1** | **Convención de `entity_type` en `audit_logs`** | **US-009b (Sprint 4).** La columna es `entity_type VARCHAR(100)` y hay tres índices sobre ella (`ix_audit_logs_entity`). Elegir mal significa reescribir todas las filas históricas después | **(a)** Nombre de tabla física: `employees`, `contracts`. **(b)** Agregado de dominio: `Employee`, `Contract` | **(a) nombre de tabla.** Los triggers de PostgreSQL disponen de `TG_TABLE_NAME` de forma nativa: la opción (b) obligaría a mantener un mapa tabla→agregado dentro del trigger, que se desincroniza en cada migración. El backlog ya usa `table_name=employees` en el escenario 1 de US-009 | **Planning S4 — 25/08** |
| **D2** | **¿El área y el puesto vigentes del empleado se derivan del contrato activo o se desnormalizan en `employees`?** | **US-020 (Sprint 3, empieza HOY), US-008b (S4), US-025 (filtros), y todo reporte por división** | **(a)** Derivar: `employees` no guarda puesto/división; se consultan vía el `Contract` vigente. **(b)** Desnormalizar: añadir `current_position_id` y `current_division_id` a `employees`, mantenidos por trigger o caso de uso | **(a) derivar.** Hoy `Contract` ya tiene `positionId`, `branchId` y `divisionId`, y `Employee` **no** tiene ninguno de los tres: el esquema ya está diseñado para derivar. La opción (b) crea dos fuentes de verdad y un problema de consistencia en cada adenda de cambio de puesto. **Coste de (a):** `GET /employees` necesita un JOIN con el contrato vigente y el filtro de alcance de US-008b se vuelve más caro. Si el rendimiento apremia, se resuelve con una vista materializada, no duplicando columnas | **HOY, 11/08** ⚠️ |
| **D3** | **¿Puppeteer sobrevive con chromium en el Dockerfile? ¿US-012 sigue siendo MUST?** | **US-012 (5 pts), US-013, US-069 (boletas PDF)** y el tamaño de la imagen Docker | **(a)** Instalar chromium en el Dockerfile y mantener Puppeteer: 0 pts de desarrollo, imagen > 400 MB, `--no-sandbox` en producción. **(b)** Migrar a pdfmake (US-012 sigue MUST, 5 pts + spike). **(c)** Migrar a `pdfkit`, que **ya está instalado** | Decidir **después del SPIKE-PDF** y de la verificación de R1. Nota de coste: la opción (a) es la más barata **ahora** y la más cara en cada despliegue; (b) contradice el estado real del repo (H5: pdfmake ni siquiera está instalado, pese a lo que dice el backlog); (c) es la menos documentada pero la de menor fricción. **Lo que sí es urgente hoy es (R1): saber si la imagen actual genera PDFs o no** | **Review S4 — 05/09** (verificación R1: **12/08**) |
| **D4** | **Los 6 `sunat_plame_code` de los tipos de contrato** (hoy en `null`) | **US-071 (PLAME/T-Registro)** y la validez declarativa de todo contrato generado | Obtener de la **Tabla 8 de SUNAT** los códigos de: INDETERMINADO, SUPLENCIA, PART_TIME, INICIO_ACTIVIDAD, PRACTICANTE, NECESIDADES_MERCADO | Es dato, no diseño: 6 valores. **El PO los pide al contador o al área de RRHH del cliente.** Cuando lleguen, es un cambio de 6 líneas en `prisma/seed.ts`, idempotente | **22/08** (entrada tardía encarece: cada contrato ya generado habría que revisarlo) |

### 8.1 Decisiones adicionales detectadas en la verificación

| ID | Decisión | Bloquea | Necesaria antes de |
|---|---|---|---|
| **D5** | **Semántica de «su división» en US-008b.** Si D2 = derivar, la división de un empleado vive en su contrato vigente: ¿el jefe ve a quien *tiene contrato vigente* en su división, o también a los cesados que la tuvieron? Afecta a los reportes de rotación y a la privacidad | US-008b (S4) | **25/08** |
| **D6** | **¿La infraestructura asíncrona (Redis + BullMQ) entra en el alcance del MVP-1?** Hoy no existe (H8). Sin ella, US-014 no es ejecutable y US-013 pierde los escenarios 2 y 3 (lote y `GET /jobs/:jobId`) | US-013, US-014, US-019 | **22/08** |
| **D7** | **¿Se acepta el cambio de fecha de MVP-1?** El plan vigente promete «MVP-1: contratos digitales» para el 05/09. Con US-013/US-014 fuera de S3 y S4, **esa fecha ya no es alcanzable**. Proponer nueva fecha en la review del 22/08 con la velocidad real de S3 en la mano | Comunicación con el cliente | **22/08** |

---

## 9. Resumen operativo

### 9.1 Tablero de los 3 sprints

| Sprint | Fechas | Dev A | Dev B | Pts conocidos | Migraciones |
|---|---|---|---|---|---|
| **S3** | 11–22 ago | US-009a, **US-020** (5) | TASK-CI, US-004 esc.4, US-010 (2) | 7 + a estimar | M1 (Dev B) |
| **S4** | 25 ago–5 sep | US-008b, US-009b | US-031 (2), US-033 (3), US-035 (2), US-038 (1), SPIKE-PDF | 8 + a estimar | M2, M3 (Dev A) |
| **S5** | 8–19 sep | US-022 (3), US-023 (5) | US-034 (3), US-011 (3), US-016 (1) | 15 | M4 (Dev B) |

### 9.2 Checklist de arranque — hoy, 11/08

- [ ] **Dev A:** mergear `feat/EP-01` a `main` (§4.1). Sin esto, Dev B parte de un `main` irreal
- [ ] **Dev A:** verificar `.gitignore` de `src/generated/` (R8)
- [ ] **Dev A:** recorrido de 1 h con Dev B por `docs/auth/jwt.md` y la arquitectura hexagonal
- [ ] **Dev A:** verificar R1 (chromium en Docker) — resultado antes del 12/08
- [ ] **PO:** responder **D2 hoy** — condiciona el diseño de US-020, que arranca hoy
- [ ] **PO:** pedir al cliente los 6 códigos de la Tabla 8 (D4) y la estructura real de sedes/divisiones (R6)
- [ ] **Ambos:** estimar en Planning US-009a, US-008b, US-009b, TASK-CI y el resto de US-004
- [ ] **Dev B:** crear `.github/workflows/ci.yml` y proteger `main` antes del 15/08

---

**Fin del documento**

| Versión | Fecha | Cambios |
|---|---|---|
| 1.0 | 2026-08-11 | Documento inicial: reordenamiento S3–S5 para 2 devs, ruta crítica US-020, contrato de trabajo, 12 riesgos, 7 decisiones de PO |
