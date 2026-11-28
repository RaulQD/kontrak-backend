# Kontrak HRIS (Apparka) — Sprints 1 a 11 (Etapas 0, 1 y 2)

**Documento:** 06-sprints-etapas-0-2
**Fecha:** 2026-11-15
**Deriva de:** `05-plan-de-implementacion.md`
**Continúa en:** `07-sprints-etapas-3-6.md`

Tickets en formato de tablero (Jira o GitHub Projects), listos para cargar. Cubren hasta el MVP-2: empleados en la BD y contratos generados desde la BD, con el legacy eliminado.

---

## 0. Convenciones

### 0.1 Claves y tipos

| Clave | Tipo | Uso |
|---|---|---|
| `US-XXX` | Historia | Historia del backlog `01-product-backlog.md`. La numeración no cambia |
| `US-XXXa`, `US-XXXb` | Historia | Rebanada de una historia del backlog que no cabe en un PR |
| `TASK-NN` | Tarea | Trabajo técnico sin historia propia en el backlog |
| `SPIKE-XXX` | Spike | Investigación con tiempo fijo; su entregable es una decisión escrita |

### 0.2 Capacidad y calendario

- Sprints de dos semanas, de lunes a viernes, desde el 2026-11-16.
- **Capacidad de planificación: 8 puntos por sprint.** Es una hipótesis: la única velocidad medida es ~5 (`03-plan-2-devs.md` §1.5). Se recalibra al cerrar el Sprint 2 con lo realmente entregado.
- Equipo: un solo desarrollador (confirmado el 2026-11-16). `03-plan-2-devs.md` ya no aplica.
- Las `TASK` y las rebanadas llevan estimación propia de este documento; las `US` completas conservan los puntos del backlog salvo donde se indica.

### 0.3 Definición de Hecho

Cada ticket trae su propia **Definición de Hecho** al final, con lo que hay que poder mostrar para cerrarlo. Los criterios de aceptación describen el comportamiento; la Definición de Hecho, la evidencia de que está terminado.

Además, estas condiciones comunes aplican a todo ticket que toque código:

- [ ] PR de 400 líneas o menos, revisado y mergeado a `develop`.
- [ ] `lint`, `type-check`, tests unitarios, `depcruise` y e2e en verde.
- [ ] Toda ruta nueva pasa por `authenticate` y `requirePermission`.
- [ ] Toda mutación deja su registro en `audit_logs` dentro de la misma transacción.
- [ ] Si hay cambio de esquema: migración en PR propio, con el SQL de reversa en la descripción, y `pnpm prisma generate` ejecutado.
- [ ] `docs/api/<módulo>.md` actualizado con endpoint, permiso y errores.

### 0.4 Flujo de estados

`Por hacer` → `En curso` → `En revisión` → `Hecho`. Un ticket bloqueado por una decisión externa pasa a `Bloqueado` con la clave de la decisión (D1 a D7 de `05` §5).

---

## 1. Resumen

| Sprint | Fechas | Etapa | Objetivo | Tickets | Pts |
|---|---|---|---|---|---|
| 1 | 16/11 – 27/11 | 0 | Las fronteras se verifican solas | TASK-01 a TASK-06 | 8 |
| 2 | 30/11 – 11/12 | 0–1 | Plataforma HTTP y primera lectura de empleados | TASK-07, US-009a, US-020a | 7 |
| 3 | 14/12 – 25/12 | 1 | Ficha del empleado completa y auditada | US-020b, TASK-08, US-004d, US-031 | 8 |
| 4 | 28/12 – 08/01 | 1 | Estructura organizativa y vínculo con el empleado | US-033, US-035, TASK-09 | 8 |
| 5 | 11/01 – 22/01 | 1 | El jefe solo ve su división; cese con eventos | US-034, US-008b, US-022 | 8 |
| 6 | 25/01 – 05/02 | 1 | **MVP-1:** empleados reales cargados | TASK-10, US-023, US-038 | 8 |
| 7 | 08/02 – 19/02 | 2 | El legacy de contratos vive en un módulo | SPIKE-PDF, TASK-11, TASK-12 | 7 |
| 8 | 22/02 – 05/03 | 2 | Legacy eliminado; almacenamiento y documentos | TASK-13, TASK-14, US-011, US-016 | 8 |
| 9 | 08/03 – 19/03 | 2 | Contrato generado desde un empleado de la BD | TASK-15, US-013a, US-013b | 8 |
| 10 | 22/03 – 02/04 | 2 | Adendas, ingestión de OneDrive y legajo | US-015, US-014, US-017 | 8 |
| 11 | 05/04 – 16/04 | 2 | **MVP-2:** PDF definitivo y alertas de vencimiento | US-012, US-082 | 8 |

Total: 86 puntos. Etapa 0: 12. Etapa 1: 35. Etapa 2: 39.

---

## Sprint 1 — 16/11 al 27/11

**Objetivo:** que ninguna violación de arquitectura pueda llegar a `develop` sin que falle el build.
**Demo:** un PR con un import prohibido entre módulos queda en rojo.

### TASK-01 · Sanear el cliente Prisma y el dominio de `employees`

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Tarea | EP-06 | Bloqueante | 1 | `modules/employees`, `prisma` | — |

**Descripción.** El cliente Prisma generado es del 07/08, anterior a `drop_companies`: `Employee` todavía exige `companyId`. El dominio de `employees` tiene tres defectos que el type-check no detecta. Hay trabajo de agosto sin commitear.

**Criterios de aceptación**
- Dado el repo limpio, cuando se borra `src/generated/prisma` y se corre `pnpm prisma generate`, entonces no existe `models/Company.ts` y `Employee` no tiene `companyId`.
- `pnpm type-check` pasa contra el cliente regenerado.
- `EmployeeUpdatePatch` usa los mismos nombres que `EmployeeProps` (`firstNames`, `lastNameFather`, `lastNameMother`). Un test demuestra que `withPatch({ firstNames: 'ANA' })` cambia el nombre.
- `MAX.documentNumber` es 15. Un test con 16 caracteres lanza `InvalidEmployeeDataError`.
- El mensaje de `EmployeeNotFoundError` es exactamente `No se encontró un colaborador con el id <id>`, sin el sufijo " not found".

**Subtareas**
- [ ] Regenerar el cliente Prisma.
- [ ] Corregir `types.ts`, `employee.entity.ts` y `employee.error.ts`.
- [ ] Crear `employee.entity.test.ts` con los tres casos.
- [ ] Commit 1: adendas legacy (`addendum.controller`, `addendum.route`, `contract.service`, `upload.middleware`, `templates.ts`, `excel.ts`).
- [ ] Commit 2: `employees`, `platform/audit` y la migración `ux_employees_code`.

**Definición de Hecho**
- [ ] El cliente Prisma regenerado no contiene `Company` ni `companyId`.
- [ ] `employee.entity.test.ts` existe y cubre los tres defectos corregidos.
- [ ] Los dos commits están en una rama propia y `git status` queda limpio.
- [ ] Queda decidido si la plantilla `.xlsm` de `src/assets` se versiona o se ignora.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

### TASK-02 · Migración: corregir `RESULETO` en `contract_status`

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Tarea | EP-01 | Media | 1 | `prisma` | TASK-01 |

**Descripción.** El enum tiene el valor `RESULETO`. La tabla `contracts` está vacía, así que corregirlo ahora no requiere tocar datos.

**Criterios de aceptación**
- La migración contiene una sola sentencia: `ALTER TYPE "contract_status" RENAME VALUE 'RESULETO' TO 'RESUELTO';`
- `schema.prisma` declara `RESUELTO`.
- `pnpm prisma migrate deploy` pasa sobre `kontrak_test`.
- `RESULETO` solo aparece en migraciones anteriores.

**Subtareas**
- [ ] `prisma migrate dev --create-only` y editar el SQL.
- [ ] SQL de reversa en la descripción del PR.
- [ ] `pnpm prisma generate`.

**Definición de Hecho**
- [ ] Migración aplicada en la BD local y en `kontrak_test`.
- [ ] SQL de reversa escrito en la descripción del PR.
- [ ] Cliente Prisma regenerado después de la migración.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

### TASK-03 · Mover los middlewares de autenticación al módulo `auth`

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Tarea | EP-02 (US-005) | Alta | 1 | `modules/auth`, `shared` | — |

**Descripción.** `shared/middleware/authenticate.middleware.ts` importa `ITokenSigner` desde `modules/auth/domain`. `shared` no puede depender de un módulo.

**Criterios de aceptación**
- `authenticate.middleware.ts`, `require-permission.middleware.ts` y el helper `getAuth` viven en `modules/auth/presentation/middlewares/`.
- El `index.ts` de `auth` exporta `authenticate` y `requirePermission`. Ningún otro archivo importa esas rutas internas.
- Ningún archivo de `src/shared` importa desde `src/modules` ni desde `src/platform`.
- El catálogo `shared/constants/permissions.ts` se queda en `shared`: es una constante pura que también usa el seed.
- Los e2e de `auth` y `rbac` pasan sin cambios en sus aserciones.

**Definición de Hecho**
- [ ] Los archivos antiguos de `shared/middleware` están eliminados, no reexportados.
- [ ] Una búsqueda de imports hacia `shared/middleware/authenticate` o `require-permission` no devuelve resultados.
- [ ] Los e2e de `auth` y `rbac` pasan sin cambiar sus aserciones.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

### TASK-04 · Reglas de frontera con dependency-cruiser

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Tarea | EP-01 (US-005) | Alta | 2 | raíz del repo | TASK-03, TASK-06 |

**Descripción.** Las reglas de `05` §2.1 pasan a ser un chequeo automático.

**Criterios de aceptación**
- Existe `.dependency-cruiser.cjs` con estas reglas, todas en severidad `error`:

| Regla | Prohíbe |
|---|---|
| R1 | `modules/X/domain` importa algo que no sea su propio dominio o `shared` |
| R2 | `modules/X/application` importa `infrastructure`, `presentation`, `express` o el cliente Prisma |
| R3 | `modules/X` importa de `modules/Y` algo distinto de `modules/Y/index.ts` |
| R4 | `platform` importa de `modules` |
| R5 | `shared` importa de `modules` o `platform` |
| R6 | `modules` o `platform` importan del legacy (`src/api`, `core`, `domain`, `infrastructure`, `services`) |
| R7 | Dependencias circulares |

- `pnpm depcruise` termina con código 0 sobre `develop`.
- La descripción del PR incluye la salida de una violación provocada a propósito, para probar que la regla falla.
- El chequeo corre en el hook `pre-commit` junto a `type-check`.

**Notas técnicas.** El dominio importa hoy `shared/utils/app-error-v2`, que conoce códigos HTTP. R1 lo permite: es una excepción aceptada, y se anota en el doc de arquitectura.

**Definición de Hecho**
- [ ] `.dependency-cruiser.cjs` versionado y script `depcruise` en `package.json`.
- [ ] El hook `pre-commit` lo ejecuta.
- [ ] El PR muestra la salida de una violación provocada a propósito.
- [ ] El doc de arquitectura lista las siete reglas y la excepción de `app-error-v2`.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

### TASK-05 · Integración continua

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Tarea | EP-01 | Alta | 2 | `.github/workflows` | TASK-04. Decisión D1 |

**Descripción.** La CI se retiró el 24/07 por la facturación de GitHub. Sin ella, nada de lo anterior protege a `develop`.

**Criterios de aceptación**
- En cada PR hacia `develop` o `main` corren, en este orden: instalación con lockfile congelado, `prisma generate`, `lint`, `type-check`, `test`, `depcruise`, `test:e2e`.
- Los e2e usan un servicio `postgres:16` con la BD `kontrak_test`, y el job define `TEST_DATABASE_URL` apuntando a él (`tests/e2e/test-db-url.ts` exige que el nombre termine en `_test`).
- Un PR con un test roto no se puede mergear (protección de rama).
- El pipeline completo tarda menos de 10 minutos.

**Si D1 sigue sin resolverse:** la misma batería corre en un hook `pre-push` de Husky, y el ticket se cierra con esa variante documentada.

**Definición de Hecho**
- [ ] Workflow versionado, con una ejecución en verde enlazada en el PR.
- [ ] Protección de rama activa en `develop` y `main`.
- [ ] El `README.md` explica cómo correr la misma batería en local.
- [ ] Si se usó la variante `pre-push`, queda documentada y D1 anotada como pendiente.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

### TASK-06 · Configuración validada en `platform/config`

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Tarea | EP-01 (US-003) | Alta | 1 | `platform/config` | — |

**Descripción.** `env.ts` valida con Zod pero vive en `src/config` y solo lo importa el cliente Prisma. El arranque usa `process.env` sin validar.

**Criterios de aceptación**
- `env.ts` vive en `src/platform/config/env.ts` y es el primer import de `src/index.ts`.
- `src/index.ts` toma el puerto de `env.PORT`.
- Dado que falta `DATABASE_URL`, cuando arranca el proceso, entonces termina con código 1 y el log menciona el nombre de la variable, nunca su valor. Hay un test que lo cubre.
- `.env.example` incluye `DATABASE_URL`, `JWT_REFRESH_SECRET` y `REDIS_URL`.
- `src/config/index.ts` (variables legacy) no se toca: se elimina en TASK-13.

**Definición de Hecho**
- [x] `src/config/env.ts` eliminado y sin imports hacia esa ruta.
- [x] El test de variable faltante está en la suite.
- [x] Cada variable de `EnvSchema` aparece en `.env.example`.
- [x] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

---

## Sprint 2 — 30/11 al 11/12

**Objetivo:** la aplicación se compone desde un punto único y el primer módulo de negocio responde consultas.
**Demo:** `GET /api/employees` paginado, con campos sensibles ocultos según el rol.

### TASK-07 · Plataforma HTTP y raíz de composición

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Tarea | EP-01 (US-006) | Alta | 2 | `platform/http`, `src/index.ts` | TASK-06 |

**Descripción.** `src/services/app.ts` mezcla la fábrica de Express con el registro de rutas. Como `platform` no puede importar módulos, se separan.

**Criterios de aceptación**
- `platform/http/create-app.ts` exporta una fábrica que recibe la lista de routers y devuelve la app con: JSON, CORS, cookies, identificador de petición, 404 uniforme y manejador de errores.
- El registro de routers (los de `auth` y el router legacy) vive en `src/index.ts` o en un archivo de composición en la raíz de `src`.
- El manejador de errores vive en `platform/http/middlewares/` y ya no tiene la rama duplicada de `AppError`.
- Cada petición recibe un identificador (UUID) disponible por `AsyncLocalStorage` y devuelto en la cabecera `X-Request-Id`.
- `GET /api/health` ejecuta `SELECT 1`: responde 200 si la BD contesta y 503 si no.
- `src/services/app.ts` deja de existir. Los e2e pasan.

**Notas técnicas.** US-006 pedía errores en formato RFC 7807. No se adopta aquí: el frontend ya consume `{ success, message, code }` y cambiarlo es una historia aparte.

**Definición de Hecho**
- [ ] `src/services/app.ts` eliminado; la app arranca con `pnpm dev` y con la imagen Docker.
- [ ] Tests de `health` (200 y 503), de 404 y del formato de error.
- [ ] El `HEALTHCHECK` del Dockerfile sigue respondiendo.
- [ ] La decisión de no adoptar RFC 7807 queda anotada en el doc de arquitectura.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

### US-009a · Puerto de auditoría y propagación del actor

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-02 | Alta | 2 | `platform/audit`, `platform/http` | TASK-07 |

**Descripción.** Como oficial de cumplimiento, quiero que cada escritura sensible registre quién la hizo, desde dónde y qué cambió, para poder reconstruir cualquier cambio. Esta rebanada entrega el mecanismo; los triggers y `GET /audit-logs` son US-009b.

**Criterios de aceptación**
- Dada una petición autenticada, el caso de uso obtiene `actorUserId`, `ipAddress` y `correlationId` del contexto de la petición, sin recibir `req`.
- `writeAudit(tx, entry)` inserta dentro de la transacción recibida. Si el insert de auditoría falla, la escritura de negocio se revierte. Si la escritura falla, no queda fila de auditoría. Ambos casos tienen test.
- `AuditEntry` incluye `correlationId`.
- Existe un helper que, dados el estado anterior y el nuevo, devuelve solo los campos que cambiaron.
- El dominio no ve `Prisma.TransactionClient`: la transacción la abre el repositorio (decisión D3 de `04`).

**Subtareas**
- [ ] Contexto de petición con `AsyncLocalStorage` (actor, IP, identificador).
- [ ] `correlationId` en `AuditEntry` y en `writeAudit`.
- [ ] Helper de diferencias, con tests.
- [ ] Unificar nombres: la especificación de US-020 dice `action = "DELETE"` y `entityType = "employees"`; el código dice `SOFT_DELETE` y `'Employee'`. Elegir uno y aplicarlo en ambos lados.

**Definición de Hecho**
- [ ] Tests unitarios del helper de diferencias y del contexto de petición.
- [ ] Test de integración de la atomicidad en los dos sentidos.
- [ ] Nombres de `action` y `entityType` unificados en el código y en `04-us-020-maestro-empleados.md`.
- [ ] El doc de arquitectura explica cómo audita un módulo.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

### US-020a · Ficha del empleado: consulta y listado

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-06 | Alta | 3 | `modules/employees` | TASK-01, TASK-03 |

**Descripción.** Como administrador de RRHH, quiero consultar y listar con filtros la ficha personal de los colaboradores, para que la BD sea la fuente de verdad del legajo. Es el PR de lectura de `04-us-020-maestro-empleados.md` §8.

**Criterios de aceptación** (escenarios 6, 7 y 8 de `04` §5)
- **Listado paginado.** Dados 47 colaboradores (30 activos), cuando `GET /api/employees?page=2&limit=20&status=ACTIVO`, entonces responde 10 elementos y `pagination = { page: 2, limit: 20, total: 30, totalPages: 2 }`. Orden `created_at DESC, id DESC`. `limit` mayor que 100 o un parámetro desconocido responde 422.
- **Búsqueda.** `?search=quispe` encuentra por nombre completo sin distinguir mayúsculas; `?search=4050` encuentra por documento; sin resultados responde 200 con lista vacía; menos de 2 caracteres responde 422.
- **Campos sensibles.** Sin el permiso `colaborador:leer_sensible`, la respuesta omite las claves `hasChildrenUnder18` y `essaludLifeInsurance` (no las devuelve en `null`) y esas columnas no se seleccionan en el SQL.
- **Detalle.** `GET /api/employees/:id` responde 404 si no existe o está anulado, y 422 si el id no es UUID.
- Ningún registro con `deletedAt` aparece en ninguna lectura.

**Subtareas**
- [ ] Puertos `IEmployeeRepository` (lectura) e `IUbigeoReader`.
- [ ] Mapper, con test de que la escritura nunca incluye `fullName`.
- [ ] Repositorio Prisma: `findById`, `list`.
- [ ] DTO `toEmployeeOutput(entity, canReadSensitive)`.
- [ ] Casos de uso `GetEmployee` y `ListEmployees`.
- [ ] Schemas Zod estrictos; controlador, rutas e `index.ts`.
- [ ] Fixtures en `tests/helpers/` para los roles `HR_ADMIN`, `HR_ANALYST` y `MANAGER`.
- [ ] e2e de los tres escenarios y test de catálogo de los objetos SQL de `employees`.

**Definición de Hecho**
- [ ] e2e de los escenarios 6, 7 y 8 en verde, con los tres roles.
- [ ] Tests unitarios del mapper y de la proyección de campos sensibles.
- [ ] Test de catálogo de los objetos SQL de `employees` dentro de la suite.
- [ ] Router montado en `/api/employees` y `docs/api/employees.md` con los endpoints de lectura.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

---

## Sprint 3 — 14/12 al 25/12

**Objetivo:** la ficha del empleado se puede crear, editar y anular con auditoría atómica.
**Demo:** alta de un colaborador, edición de un campo y la fila de auditoría con el antes y el después.

### US-020b · Ficha del empleado: alta, edición y anulación

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-06 | Alta | 3 | `modules/employees` | US-020a, US-009a |

**Descripción.** Como administrador de RRHH, quiero crear, actualizar y anular fichas con validación del documento de identidad, para dejar de depender del Excel. Es el PR de escritura de `04` §8.

**Criterios de aceptación** (escenarios 1 a 5, 9 y 10 de `04` §5)
- **Alta.** `POST /api/employees` con datos válidos responde 201, con `status = "ACTIVO"` y `nationality = "PERUANA"` por defecto. `hireDate` se serializa como `"2026-08-17"`.
- **Duplicado.** Un documento ya registrado en un colaborador vivo responde 409. La violación del índice `ux_employees_doc` (`P2002`) también se traduce a 409, nunca a 500. Si el anterior está anulado, el alta procede.
- **Formato del documento.** Un DNI de 7 dígitos responde 422 con el campo y el mensaje. El número se normaliza antes de validar (sin espacios, en mayúsculas).
- **Edición parcial.** `PATCH` con dos campos cambia solo esos dos; los demás conservan su valor. Un cuerpo vacío responde 422.
- **Campos protegidos.** `PATCH` con `fullName`, `deletedAt` o `id` responde 422. Intentar `status: "CESADO"` responde 403: el cese es US-022.
- **Auditoría.** Cada escritura deja una fila en `audit_logs`, en la misma transacción, con solo los campos que cambiaron.
- **Anulación.** `DELETE /api/employees/:id` fija `deletedAt` sin tocar `status` ni `terminationDate`. Con al menos un contrato asociado responde 409.

**Subtareas**
- [x] Casos de uso `CreateEmployee`, `UpdateEmployee`, `SoftDeleteEmployee`.
- [x] Repositorio: `create`, `update`, `softDelete`, `hasContracts`, traducción de `P2002`.
- [x] Adaptador `PrismaUbigeoReader`.
- [x] Schemas de alta y edición, estrictos.
- [x] e2e de los siete escenarios y de la atomicidad de la auditoría.
- [x] `docs/api/employees.md`.

**Notas técnicas.** `CreateEmployee` es el único punto de alta del sistema: US-023 lo reutiliza fila por fila.

**Definición de Hecho**
- [x] e2e de los escenarios 1 a 5, 9 y 10 en verde.
- [x] Test que demuestra que `P2002` responde 409.
- [x] e2e de auditoría en alta, edición y anulación.
- [x] `docs/api/employees.md` completo: matriz endpoint × permiso y limitaciones de búsqueda.
- [x] La lista de Definición de Hecho de `04` §5 queda marcada completa.
- [x] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

### US-020c · Correo corporativo obligatorio y único

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-06 | Alta | 2 | `modules/employees`, `prisma` | US-020b |

**Descripción.** Como analista de RR. HH., quiero que cada colaborador tenga un correo corporativo propio, obligatorio desde el alta y que no se repita, para que las boletas y documentos que envíe el sistema lleguen siempre a la persona correcta.

**Criterios de aceptación**
- Dado un alta sin `corporateEmail`, con `corporateEmail` vacío o mal formado, cuando se envía `POST /api/employees`, entonces responde 400 y no crea nada.
- Dado un correo con mayúsculas o espacios (`  Ana.Perez@Empresa.PE `), cuando se da de alta, entonces se guarda y se devuelve como `ana.perez@empresa.pe`.
- Dado un colaborador vigente con `ana.perez@empresa.pe`, cuando se da de alta otro con `ANA.PEREZ@empresa.pe`, entonces responde 409 y no queda ni el empleado ni su registro de auditoría.
- Dado un colaborador cesado, su correo sigue reservado: un alta o una edición con ese correo responde 409.
- Dado un colaborador anulado (anulación registral, D4), su correo queda libre: un alta con ese correo responde 201.
- Dado un `PATCH` con el mismo correo que el colaborador ya tiene, aunque cambien las mayúsculas, entonces no responde 409.
- Dado un `PATCH` con el correo de otro colaborador vigente o cesado, entonces responde 409.
- Dado un `PATCH` con `corporateEmail: null`, entonces responde 400: el correo no se puede quitar.
- Dadas dos altas simultáneas con el mismo correo, una responde 201 y la otra 409; nunca 500.
- `juan_perez@empresa.pe` y `juanxperez@empresa.pe` son correos distintos.

**Subtareas**
- [x] Migración A: `employees.corporate_email` NOT NULL; `schema.prisma` y `pnpm prisma generate`.
- [x] Tipos `string | null` → `string` (entidad, vista, DTO, patch) y fixtures/dev-data con correo.
- [x] Zod: `corporateEmail` obligatorio en el alta y no anulable en el PATCH.
- [x] Entidad: correo obligatorio y normalizado (`trim` + minúsculas).
- [x] Migración B: normalizar los correos existentes y crear `ux_employees_corporate_email`.
- [x] `DuplicateEmailError` (409) y `findByCorporateEmail` en el puerto y el repositorio.
- [x] `violatedUniqueIndex`: traducir P2002 por nombre de índice (doc, código, correo).
- [x] Verificación previa en CreateEmployee y UpdateEmployee.
- [x] Tests unitarios y e2e de los criterios.
- [x] Documentación.

**Notas técnicas.**
- La unicidad la da un índice parcial `ux_employees_corporate_email` sobre `lower(corporate_email) WHERE deleted_at IS NULL`, la misma regla que DNI y código: cesar no libera el correo, anular sí. Si el colaborador reingresa, sigue siendo el mismo registro (su DNI también está reservado), así que conserva su correo.
- El índice va fuera de `schema.prisma` (drift §3.3). Las migraciones se crean a mano y se aplican con `prisma migrate deploy`; nunca `db push` ni `migrate dev`.
- `findByCorporateEmail` compara exacto contra el valor ya normalizado. No usa `mode: 'insensitive'`, porque Prisma lo traduce a ILIKE y `_` actúa como comodín.
- P2002 se traduce por el nombre del índice en el mensaje original de Postgres, porque `meta.target` no llega con el adapter y la regex del adapter falla con `lc_messages` en español.
- `personalEmail` no cambia: sigue opcional y sin unicidad.

**Definición de Hecho**
- [x] Las dos migraciones aplicadas con `prisma migrate deploy` en la BD local y en la de tests, con el SQL de reversión en la descripción de cada PR.
- [x] Unitarios y e2e de todos los criterios en verde, incluido el de concurrencia.
- [x] `docs/api/employees.md` documenta el 400 y el 409 de correo.
- [x] `diseno_bd_fase0.md` lista `ux_employees_corporate_email`; `04-us-020` registra la decisión D7.
- [x] PRs ≤400 líneas, revisados y mergeados a `develop` con lint, type-check, tests, depcruise y e2e en verde. PR #45 superó el límite: 582 líneas de código, por el cambio de nombre a `corporateEmail`.

### TASK-08 · Cerrar los cabos sueltos de `auth`

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Tarea | EP-02 (US-007) | Media | 2 | `modules/auth` | TASK-03 |

**Descripción.** Dos piezas de `auth` existen pero no se usan: `simulateVerify` y la columna `tokensRevokedAt`.

**Criterios de aceptación**
- Dado un email inexistente, cuando se intenta el login, entonces se ejecuta `simulateVerify` antes de responder 401, de modo que el tiempo de respuesta no distinga un email inexistente de una contraseña incorrecta.
- Dado que se revocan las sesiones de un usuario (`DELETE /api/users/:id/sessions`), cuando ese usuario presenta un access token emitido antes de la revocación, entonces recibe 401 de inmediato, sin esperar los 15 minutos de expiración.
- Dado un usuario desactivado (`isActive = false`), su access token vigente recibe 401.
- Hay tests e2e de los tres casos.

**Notas técnicas.** Implica una lectura por clave primaria en `authenticate` (`tokensRevokedAt`, `isActive`), comparada con el `iat` del token. Para un sistema interno con decenas de usuarios el costo es despreciable.

**Definición de Hecho**
- [x] e2e de los tres casos en verde.
- [x] `docs/auth/jwt.md` describe la revocación inmediata.
- [x] Los e2e existentes de `auth` pasan sin cambios.
- [x] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

### US-004d · Seed del catálogo de ubigeo

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-01 | Media | 1 | `prisma/seed.ts` | — |

**Descripción.** Como administrador, quiero el catálogo de departamentos, provincias y distritos cargado, para registrar direcciones válidas. La tabla existe y está vacía.

**Criterios de aceptación**
- El seed carga el catálogo INEI vigente desde un archivo de datos versionado en el repo.
- Es idempotente: ejecutarlo dos veces no duplica ni falla.
- `150101` corresponde a LIMA / LIMA / LIMA.
- Todo `id` tiene exactamente 6 dígitos.
- Un test afirma el conteo de distritos del archivo fuente.

**Definición de Hecho**
- [ ] Archivo de datos versionado, con su fuente y fecha de descarga anotadas.
- [ ] Seed ejecutado dos veces seguidas sin error.
- [ ] Tests de conteo y del código `150101` en la suite.
- [ ] El `global-setup` de e2e sigue pasando con el seed ampliado.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

### US-031 · Datos del empleador

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-07 | Alta | 2 | `modules/organization` (nuevo) | US-009a |

**Descripción.** Como administrador, quiero editar la razón social, el RUC, el domicilio y el representante legal en un solo lugar, para que los contratos dejen de tenerlos escritos dentro de las plantillas.

**Criterios de aceptación**
- Existe una tabla de una sola fila. Un segundo registro es imposible por restricción de la BD.
- `GET /api/organization/employer` requiere `organizacion:leer`; `PUT` requiere `organizacion:editar`.
- El RUC debe tener 11 dígitos y dígito verificador válido; si no, responde 422.
- Cada edición audita con el antes y el después.
- El seed carga los valores actuales desde la constante `EMPLOYER` de `prisma/seed.ts`.

**Subtareas**
- [ ] Migración de la tabla (PR propio).
- [ ] Esqueleto del módulo `organization` con sus cuatro capas e `index.ts`.
- [ ] Caso de uso de lectura y de actualización; e2e con matriz de permisos.

**Notas técnicas.** Las plantillas de contrato siguen usando sus valores embebidos hasta US-012.

**Definición de Hecho**
- [ ] Migración aplicada, con su reversa en el PR.
- [ ] e2e con la matriz de permisos: leer, editar y sin permiso.
- [ ] El seed carga la fila única.
- [ ] `modules/organization/index.ts` expone el router y la lectura del empleador para otros módulos.
- [ ] `docs/api/organization.md` creado.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

---

## Sprint 4 — 28/12 al 08/01

**Objetivo:** existe la estructura organizativa y el empleado queda vinculado a ella.
**Demo:** asignar a un colaborador su sede, división y puesto.

### US-033 · Sedes

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-07 | Alta | 3 | `modules/organization` | US-031 |

**Descripción.** Como administrador, quiero gestionar las sedes con su código, ubicación y código de establecimiento SUNAT, para asignarlas a colaboradores y contratos.

**Criterios de aceptación**
- CRUD bajo `/api/organization/branches`, con `organizacion:leer` y `organizacion:editar`.
- Un `code` repetido responde 409.
- `sunatEstablishmentCode`, si se envía, tiene 4 dígitos. `ubigeoId` debe existir. `kind` es `PLAYA` u `OFICINA`.
- No se puede anular una sede con contratos o colaboradores asociados: responde 409.
- El listado es paginado. Toda mutación audita.

**Definición de Hecho**
- [ ] e2e de alta, edición, anulación, 409, 422 y permisos.
- [ ] Auditoría verificada por e2e en las tres mutaciones.
- [ ] `docs/api/organization.md` actualizado con sedes.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

### US-035 · Puestos con nivel de riesgo SCTR

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-07 | Alta | 2 | `modules/organization` | US-031 |

**Descripción.** Como administrador, quiero un catálogo de puestos con su nivel de riesgo, para saber quién entra en la póliza SCTR.

**Criterios de aceptación**
- CRUD bajo `/api/organization/positions`.
- `name` repetido responde 409.
- `sctrRiskLevel` es `ALTO` o `BAJO`. Si `requiresSctr` es falso, el nivel se ignora en los reportes.
- `minSalary` no puede superar a `maxSalary`: responde 422.
- `sunatOccupationCode`, si se envía, tiene 6 dígitos.

**Notas técnicas.** El seed trae variantes del mismo puesto (`ANFITRION(A) C` y `ANFITRION(A)C`). Unificarlas es US-036, opcional.

**Definición de Hecho**
- [ ] e2e de alta, edición, 409, 422 y permisos.
- [ ] Auditoría verificada por e2e.
- [ ] `docs/api/organization.md` actualizado con puestos.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

### TASK-09 · Migración: vínculos del empleado con la organización

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Tarea | EP-06 / EP-07 | Bloqueante | 3 | `prisma`, `modules/employees` | US-020b, US-033, US-035. Decisión D4 |

**Descripción.** Hoy un empleado solo llega a su división, puesto y sede a través de un contrato. Sin un vínculo directo no se puede construir US-008b ni los reportes por área.

**Criterios de aceptación**
- `employees` gana `division_id`, `position_id` y `branch_id`, opcionales, con clave foránea. Representan la asignación vigente.
- `users` gana `employee_id`, opcional y único.
- `divisions` gana `manager_employee_id`, opcional.
- `POST` y `PATCH` de empleados aceptan los tres campos de asignación. Un id inexistente o inactivo responde 422.
- El DTO de salida incluye la asignación con id y nombre.
- La auditoría registra los cambios de asignación.

**Subtareas**
- [ ] Migración en PR propio, con reversa.
- [ ] Extender entidad, mapper, schemas y DTO de `employees`.
- [ ] Puerto de lectura hacia `organization` (existencia y estado activo), consumido por su `index.ts`.

**Notas técnicas.** El historial de cambios de puesto es US-024. El contrato conserva su propia copia de puesto, sede y división.

**Definición de Hecho**
- [ ] Migración aplicada, con su reversa en el PR, y cliente regenerado.
- [ ] Tests de entidad y de mapper para los tres campos de asignación.
- [ ] e2e de asignación válida, id inexistente e id inactivo.
- [ ] `docs/api/employees.md` actualizado.
- [ ] D4 marcada como resuelta en `05` §5.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

---

## Sprint 5 — 11/01 al 22/01

**Objetivo:** el acceso a los datos depende de la posición de cada usuario, y el cese es un acto con efectos.
**Demo:** un jefe entra y ve solo a su división; RRHH registra un cese y el usuario del cesado pierde el acceso.

### US-034 · Divisiones con jefe

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-07 | Alta | 3 | `modules/organization` | TASK-09 |

**Descripción.** Como administrador, quiero gestionar las divisiones y asignar a cada una su jefe, para que cada jefe gestione a su equipo.

**Criterios de aceptación**
- CRUD bajo `/api/organization/divisions`. `code` repetido responde 409.
- `managerEmployeeId` debe ser un colaborador `ACTIVO`; si no, responde 422.
- Cuando el jefe es cesado, la división queda sin jefe y se registra en auditoría.
- No se puede anular una división con colaboradores o puestos asociados: responde 409.

**Fuera de alcance:** jerarquía de divisiones (división padre).

**Definición de Hecho**
- [ ] e2e de alta, jefe no activo, anulación bloqueada y permisos.
- [ ] El caso del jefe cesado se verifica junto con US-022.
- [ ] `docs/api/organization.md` actualizado con divisiones.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

### US-008b · Alcance por división

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-02 | Alta | 2 | `modules/auth`, `modules/employees` | US-034 |

**Descripción.** Como jefe de área, quiero ver solo a los colaboradores de mi división, y como empleado, solo mis propios datos, para que la información personal no se filtre entre áreas.

**Criterios de aceptación**
- Dado un usuario con rol `MANAGER` vinculado a un colaborador que es jefe de la división A, cuando lista colaboradores, entonces solo recibe los de la división A, y el `total` de la paginación refleja ese filtro.
- Cuando ese jefe pide el detalle de un colaborador de la división B, recibe 404, no 403, para no revelar que existe.
- Dado un usuario con rol `EMPLOYEE`, solo puede leer su propia ficha.
- Los roles de RRHH ven a todos.
- Un e2e cubre la matriz de tres roles por dos divisiones.

**Subtareas**
- [ ] Permiso nuevo `colaborador:leer_todos` en el catálogo y el seed, asignado a `SUPER_ADMIN`, `HR_ADMIN` y `HR_ANALYST`.
- [ ] Resolución del alcance en la capa de aplicación: sin ese permiso, el alcance es las divisiones que el usuario dirige más su propia ficha.
- [ ] Filtro aplicado en el repositorio, no después de leer.
- [ ] Endpoint para vincular usuario y colaborador: `PUT /api/users/:id/employee`, con `usuario:gestionar`.

**Notas técnicas.** `requirePermission` evalúa con OR. El alcance no se resuelve en el middleware.

**Definición de Hecho**
- [ ] e2e de la matriz de tres roles por dos divisiones.
- [ ] Permiso `colaborador:leer_todos` presente en `permissions.ts` y en el seed.
- [ ] Un test demuestra que el filtro va en la consulta: el `total` paginado refleja el alcance.
- [ ] `docs/api/employees.md` describe el alcance por rol.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

### US-022 · Cese de colaborador

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-06 | Alta | 3 | `modules/employees`, `platform/events` (nuevo) | US-020b |

**Descripción.** Como administrador de RRHH, quiero registrar el cese de un colaborador con su fecha y motivo, para que el sistema propague sus efectos a contratos, seguros y accesos.

**Criterios de aceptación**
- `POST /api/employees/:id/termination` con `terminationDate` y `reason` requiere `colaborador:cesar`. Deja `status = "CESADO"`.
- Una fecha anterior al ingreso responde 422. Un colaborador ya cesado responde 409.
- Tras confirmarse la transacción se publica el evento `EmployeeTerminated` con el id, la fecha y el motivo.
- El módulo `auth` consume el evento: desactiva el usuario vinculado y revoca sus sesiones.
- Si un consumidor falla, el cese no se revierte: el fallo queda en el log con el identificador de la petición.
- El cese audita con el estado anterior y el nuevo.

**Subtareas**
- [ ] `platform/events`: bus en proceso, tipado, que despacha después del commit.
- [ ] Caso de uso `TerminateEmployee` sobre `Employee.terminate()`.
- [ ] Consumidor en `auth`, registrado en la raíz de composición.
- [ ] e2e del flujo completo.

**Pregunta abierta para RRHH:** ¿se registran ceses con fecha futura? Por defecto, no.

**Notas técnicas.** Los consumidores de `contracts` e `insurance` llegan en las Etapas 2 y 3.

**Definición de Hecho**
- [ ] Tests unitarios del bus: despacho tras el commit y fallo aislado de un consumidor.
- [ ] e2e del flujo completo, incluido el usuario desactivado.
- [ ] La pregunta sobre ceses con fecha futura está respondida por RRHH y reflejada en el código.
- [ ] El evento `EmployeeTerminated` queda documentado: nombre, contenido y consumidores.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

---

## Sprint 6 — 25/01 al 05/02

**Objetivo (MVP-1):** los colaboradores reales de Apparka están en la BD, con respaldo.
**Demo:** importación del Excel del negocio con su reporte de filas aceptadas y rechazadas.

### TASK-10 · Respaldo diario y restauración probada

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Tarea | EP-14 (parte de US-084) | Bloqueante | 2 | operación | — |

**Descripción.** A partir de este sprint la BD contiene datos personales reales. No se cargan sin un respaldo restaurable.

**Criterios de aceptación**
- Un `pg_dump` en formato comprimido corre a diario de forma automática.
- Los respaldos se conservan 14 días y se copian fuera del servidor de la BD.
- Una restauración completa se ejecutó al menos una vez sobre una BD vacía, y sobre ella pasó el test de catálogo.
- `docs/operacion/backups.md` describe cómo respaldar, dónde quedan los archivos y cómo restaurar paso a paso.

**Notas técnicas.** El mecanismo de programación depende de dónde despliegue el cliente (VPS o Azure). La recuperación a un punto en el tiempo es US-084, en la Etapa 6.

**Definición de Hecho**
- [ ] El respaldo automático corre en el entorno del cliente y generó archivos en dos días distintos.
- [ ] La restauración se ejecutó, con su fecha y duración registradas.
- [ ] `docs/operacion/backups.md` mergeado.
- [ ] El responsable de infraestructura del cliente recibió el documento.

### US-023 · Importación masiva de colaboradores desde Excel

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-06 | Alta | 5 | `modules/employees`, `platform/excel` (nuevo) | US-020b, TASK-09, TASK-10 |

**Descripción.** Como administrador de RRHH, quiero cargar los colaboradores desde el Excel que el negocio ya usa, para poblar la BD sin tipear ficha por ficha.

**Criterios de aceptación**
- `POST /api/employees/import` recibe un `.xlsx` y requiere `colaborador:crear`.
- Con `?dryRun=true` valida todo y no escribe nada.
- La respuesta resume `{ total, created, skipped, errors }`, y cada error indica fila, campo y mensaje.
- Una fila inválida no detiene a las demás.
- Un documento que ya existe en la BD se cuenta como omitido, no como error: reimportar el mismo archivo no duplica.
- Un documento repetido dentro del mismo archivo se reporta en la segunda aparición.
- Sede, división y puesto se resuelven por código o nombre; si no existen, la fila se rechaza con el valor que no se encontró.
- Un archivo con más filas que `MAX_EMPLOYEES` responde 422 antes de procesar.
- Cada alta audita igual que una alta individual.

**Subtareas**
- [ ] Mover el parser y los validadores de `src/domain/excel` a `platform/excel`, sin cambiar su comportamiento.
- [ ] Mapeo de columnas del Excel del negocio a los campos de la ficha.
- [ ] Caso de uso `ImportEmployees`, que invoca `CreateEmployee` por fila.
- [ ] e2e con un archivo de prueba sin datos reales.
- [ ] Carga real en el entorno del cliente y conciliación del conteo con RRHH.

**Definición de Hecho**
- [ ] e2e de archivo válido, archivo con errores, `dryRun` y reimportación.
- [ ] El parser vive solo en `platform/excel`; el legacy lo importa desde ahí, sin copia duplicada.
- [ ] Carga real ejecutada y conteo conciliado con RRHH por escrito.
- [ ] `docs/api/employees.md` describe el formato del Excel y el reporte de errores.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

### US-038 · Catálogos activos e inactivos

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-07 | Media | 1 | `modules/organization` | US-033, US-034, US-035 |

**Descripción.** Como administrador, quiero desactivar una sede, división o puesto sin borrarlo, para que no aparezca en nuevas asignaciones y se conserve en el historial.

**Criterios de aceptación**
- Los listados aceptan `?isActive=true|false`. Sin el parámetro devuelven solo los activos.
- Asignar un elemento inactivo a un colaborador o a un contrato nuevo responde 422.
- Los registros que ya lo referencian siguen mostrándolo.

**Definición de Hecho**
- [ ] e2e del filtro y del rechazo de asignación en los tres catálogos.
- [ ] `docs/api/organization.md` actualizado.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

**Criterio de cierre del MVP-1:** los colaboradores de Apparka están cargados y conciliados con RRHH; el e2e de alcance pasa; existe un respaldo restaurado con éxito. Aquí se mide la velocidad real y se recalcula el calendario.

---

## Sprint 7 — 08/02 al 19/02

**Objetivo:** el generador de contratos vive dentro de un módulo sin haber cambiado su comportamiento.
**Demo:** los mismos endpoints de siempre, respondiendo desde `modules/contracts`.

### SPIKE-PDF · Decidir el motor de PDF

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Spike | EP-03 | Bloqueante | 2 | `platform/pdf` | Decisión D2 |

**Descripción.** Hay tres librerías instaladas (`puppeteer`, `pdfkit`, `pdf-lib`), `pdfmake` no está instalado y la imagen Docker no trae Chromium, así que hoy la imagen no puede generar contratos.

**Tiempo fijo:** 2 días.

**Criterios de aceptación**
- Se genera `CONTRACT_FULL_TIME`, la plantilla más larga, por las dos vías: Puppeteer con Chromium dentro de Docker, y pdfmake.
- `docs/pdf/spike-pdf.md` compara fidelidad visual contra el PDF actual, tiempo para 10 documentos, tamaño de imagen y memoria.
- El documento termina con una decisión, y con US-012 confirmada o sustituida.
- Si se mantiene Puppeteer, el Dockerfile queda corregido en este mismo ticket y la imagen genera un PDF real.

**Definición de Hecho**
- [ ] `docs/pdf/spike-pdf.md` mergeado, con la decisión escrita.
- [ ] D2 marcada como resuelta en `05` §5.
- [ ] US-012 confirmada o sustituida en este documento.
- [ ] Si se mantiene Puppeteer: la imagen Docker construida genera un PDF, con la evidencia en el PR.
- [ ] El código de prueba del spike no entra a `src`.

### TASK-11 · Tests de caracterización del legacy

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Tarea | EP-03 | Bloqueante | 2 | `tests/e2e` | — |

**Descripción.** El legacy no tiene tests. Antes de moverlo hay que fijar lo que hace hoy, para detectar cualquier cambio accidental.

**Criterios de aceptación**
- Hay un e2e por cada flujo: lectura de Excel de contratos, descarga del ZIP de contratos, vista previa de contrato, lectura de Excel de adendas, ZIP de adendas, y los Excel de SCTR, Vida Ley y fotochecks.
- Cada test afirma lo observable: cantidad y nombres de archivos del ZIP, que cada PDF tiene páginas, encabezados y cantidad de filas de cada Excel.
- Los archivos de entrada viven en `tests/fixtures/` y no contienen datos de personas reales.
- La suite pasa sobre el código actual sin modificarlo.

**Definición de Hecho**
- [ ] La suite corre en CI.
- [ ] Las fixtures fueron revisadas y no contienen datos reales.
- [ ] El PR lista qué flujos quedan cubiertos y cuáles no.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

### TASK-12 · Mudanza del legacy de contratos

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Tarea | EP-03 | Alta | 3 | `modules/contracts` (nuevo), `platform/pdf` (nuevo) | TASK-11 |

**Descripción.** Mover, sin reescribir, todo lo que genera contratos y adendas.

**Criterios de aceptación**
- `src/domain/contracts/**`, los controladores y rutas de contratos y adendas, y los processors `excel-to-contract` y `addendum-contract` viven en `modules/contracts`.
- `infrastructure/browser` y `pdf-generator.service` viven en `platform/pdf`.
- Las URL públicas no cambian.
- El diff no contiene cambios de lógica: solo movimientos, imports y el `index.ts` del módulo.
- La suite de TASK-11 pasa sin tocar sus aserciones.
- El archivo `addendum-contract.processort.ts` pierde la errata del nombre.

**Subtareas**
- [ ] Mover dominio y plantillas a `modules/contracts/domain`.
- [ ] Mover processors a `application`, y controladores y rutas a `presentation`.
- [ ] Verificar con dependency-cruiser si `contracts.ts` y `contractsv2.ts` tienen consumidores; eliminar el que no.
- [ ] `index.ts` del módulo y registro en la raíz de composición.

**Definición de Hecho**
- [ ] La suite de TASK-11 pasa sin tocar sus aserciones.
- [ ] Las carpetas de origen están eliminadas.
- [ ] Prueba manual: un ZIP generado con el Excel del negocio en el entorno de pruebas.
- [ ] El mapa de módulos del doc de arquitectura está actualizado.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

---

## Sprint 8 — 22/02 al 05/03

**Objetivo:** no queda código legacy, y los archivos generados tienen un almacenamiento y un registro propios.
**Demo:** `src/` contiene solo `modules`, `platform`, `shared` y `types`.

### TASK-13 · Mudanza del resto del legacy y eliminación de sus carpetas

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Tarea | EP-03 / EP-05 | Alta | 3 | varios | TASK-12 |

**Descripción.** Reubicar lo que queda y borrar las cinco carpetas legacy.

**Criterios de aceptación**

| Origen | Destino |
|---|---|
| Processors `sctr-report`, `sctr-report-ape`, `lawlife-report`, `insurances-fola` | `modules/insurance` |
| Processors `card-id-report`, `salary-account` | `modules/reports` |
| `core/orchestration` y el scheduler de OneDrive | `modules/documents` |
| `infrastructure/onedrive` (proveedor y adaptador) | `platform/storage/onedrive` |
| `infrastructure/email` | `platform/email` |
| `core/notifications` (plantillas) | `modules/documents` |
| `config/index.ts` (variables de Azure, correo y límites) | `platform/config/env.ts`, validadas con Zod |

- `src/api`, `src/core`, `src/domain`, `src/infrastructure`, `src/services` y `src/config` dejan de existir.
- `service.container.ts` desaparece: cada módulo compone sus dependencias en su `index.ts`.
- `shared/utils/app-error.ts` (versión 1) desaparece: todo usa la versión 2.
- `process.env` solo se lee en `platform/config`.
- La regla R6 de dependency-cruiser se elimina por no tener objeto.
- La suite de TASK-11 pasa.

**Definición de Hecho**
- [ ] Las seis carpetas legacy no existen.
- [ ] Una búsqueda de `process.env` solo encuentra `platform/config`.
- [ ] `.env.example` incluye las variables de Azure, correo y límites.
- [ ] La app y el scheduler de OneDrive arrancan en el entorno de pruebas con la imagen Docker.
- [ ] El doc de arquitectura refleja la estructura final de `src`.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

### TASK-14 · Autenticación en las rutas mudadas

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Tarea | EP-02 | Alta | 1 | `modules/contracts`, `insurance`, `documents`, `reports` | TASK-13. Decisión D5 |

**Descripción.** Las rutas heredadas reciben y devuelven DNI y sueldos sin autenticación.

**Criterios de aceptación**
- Todas las rutas de los cuatro módulos pasan por `authenticate` y `requirePermission` con el permiso que corresponde (`contrato:crear`, `documento:generar`, entre otros).
- Sin token responden 401; con token sin permiso, 403. Hay e2e de ambos casos por router.
- El cambio se despliega coordinado con el frontend, que ya debe enviar el token.

**Definición de Hecho**
- [ ] e2e de 401 y 403 por cada router.
- [ ] Matriz endpoint × permiso en el `docs/api` de cada módulo.
- [ ] El frontend fue verificado contra el entorno de pruebas antes del despliegue.
- [ ] D5 marcada como resuelta en `05` §5.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

### US-011 · Puerto de almacenamiento de archivos

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-03 | Alta | 3 | `platform/storage` | TASK-13 |

**Descripción.** Como desarrollador, quiero una interfaz única para guardar y leer archivos, para que el código de negocio no dependa de OneDrive.

**Criterios de aceptación**
- El puerto `FileStorage` define `put`, `getStream`, `delete` y `getSignedUrl`.
- `put` devuelve proveedor, clave, tamaño y hash SHA-256.
- Hay dos adaptadores: OneDrive, que envuelve al proveedor actual, y local, sobre el sistema de archivos, para desarrollo y tests.
- El adaptador se elige por variable de entorno.
- Los errores se normalizan: archivo inexistente y proveedor no disponible son errores distintos y propios del puerto.
- Una misma suite de tests de contrato corre contra ambos adaptadores; el de OneDrive, con Graph simulado.

**Definición de Hecho**
- [ ] La suite de contrato pasa contra los dos adaptadores.
- [ ] La variable del proveedor está en `env.ts` y en `.env.example`.
- [ ] Una regla de dependency-cruiser impide importar el proveedor de OneDrive fuera de `platform/storage`.
- [ ] `docs/platform/storage.md` creado.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

### US-016 · Registro de documentos generados

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-04 | Alta | 1 | `modules/documents`, `prisma` | US-011 |

**Descripción.** Como módulo de documentos, quiero registrar cada archivo generado con sus metadatos, para tener trazabilidad y detectar duplicados.

**Criterios de aceptación**
- La tabla `generated_documents` guarda tipo de documento, entidad referida, colaborador, proveedor y clave de almacenamiento, nombre, tipo MIME, tamaño, hash, snapshot de los datos usados, autor y fecha.
- Hay índices por entidad y por colaborador.
- Dos archivos con el mismo hash se pueden identificar con una consulta.
- El `index.ts` de `documents` expone una función para registrar un documento, que es lo único que usan los demás módulos.

**Definición de Hecho**
- [ ] Migración aplicada, con su reversa en el PR.
- [ ] Tests del repositorio: registro, búsqueda por hash y por colaborador.
- [ ] La función pública del módulo está documentada.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

---

## Sprint 9 — 08/03 al 19/03

**Objetivo:** un contrato nace de un empleado de la BD y queda registrado.
**Demo:** elegir un colaborador, generar su contrato y descargarlo; lanzar un lote y consultar su avance.

### TASK-15 · Cola de trabajos y proceso `worker`

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Tarea | EP-01 (resto de US-002) | Alta | 3 | `platform/queue` (nuevo), `docker-compose` | TASK-13 |

**Descripción.** La generación en lote bloquea la petición HTTP mientras corre. Hace falta ejecución asíncrona con reintentos.

**Criterios de aceptación**
- `docker compose up` levanta `api`, `worker`, `db` y `redis`.
- `REDIS_URL` pasa a ser obligatoria en `env.ts`.
- Existe el punto de entrada `src/worker.ts`, que registra los procesadores de cada módulo.
- Un trabajo de prueba encolado desde la API lo procesa el `worker`.
- Un trabajo que falla se reintenta 3 veces con espera creciente y luego queda marcado como fallido, consultable.
- Ante `SIGTERM`, el `worker` termina el trabajo en curso antes de salir.

**Definición de Hecho**
- [ ] `docker compose up` levanta los cuatro servicios con sus healthchecks.
- [ ] Tests de integración del trabajo de prueba y del reintento.
- [ ] `docs/entorno-docker-compose.md` y `.env.example` actualizados.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

### US-013a · Generar un contrato desde un colaborador de la BD

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-03 | Alta | 3 | `modules/contracts` | US-011, US-016, US-020b |

**Descripción.** Como analista de RRHH, quiero generar el contrato de un colaborador eligiéndolo del sistema, para no depender de un Excel por cada contrato.

**Criterios de aceptación**
- `POST /api/contracts` recibe colaborador, tipo de contrato, puesto, sede, división, fechas, sueldo y jornada. Requiere `contrato:crear`.
- El colaborador debe existir y estar `ACTIVO`; si no, responde 422.
- Un tipo a plazo fijo exige fecha de fin posterior al inicio, y respeta `maxDurationMonths`.
- No puede haber dos contratos vigentes del mismo colaborador con fechas solapadas: responde 409.
- El caso de uso crea el contrato en `BORRADOR`, genera el PDF, lo guarda con `FileStorage`, lo registra en `generated_documents` y pasa el contrato a `GENERADO`.
- `generationSnapshot` guarda los datos usados, la versión de la plantilla y los datos del empleador.
- `GET /api/contracts/:id`, `GET /api/contracts?employeeId=` y `GET /api/contracts/:id/document` requieren `contrato:leer`.
- Una transición de estado inválida responde 409.

**Subtareas**
- [ ] Agregado `Contract` con su máquina de estados: `BORRADOR` → `GENERADO` → `FIRMADO` → `VIGENTE` → `VENCIDO`, `RESUELTO` o `RENOVADO`.
- [ ] Puerto de lectura hacia `employees` y hacia `organization`.
- [ ] Caso de uso `GenerateContract`; repositorio y mapper.
- [ ] Consumidor de `EmployeeTerminated`: los contratos vigentes pasan a `RESUELTO`.
- [ ] e2e con el adaptador local de almacenamiento.

**Notas técnicas.** El sueldo es `Decimal`: se transporta como texto, nunca como `Number`. El backlog estima 3 puntos para US-013 completa; con agregado, estados y snapshot es probable que esta rebanada suba a 5 al refinarla.

**Definición de Hecho**
- [ ] Tests unitarios de todas las transiciones de estado, válidas e inválidas.
- [ ] e2e de generación, 422, 409 por solapamiento y descarga.
- [ ] Test del consumidor de `EmployeeTerminated`.
- [ ] `docs/api/contracts.md` creado.
- [ ] Demo con RRHH: un contrato generado desde la BD y validado contra el formato actual.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

### US-013b · Generación en lote como trabajo asíncrono

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-03 | Alta | 2 | `modules/contracts` | US-013a, TASK-15 |

**Descripción.** Como analista de RRHH, quiero lanzar la generación de un lote y seguir trabajando, para no esperar con la pantalla bloqueada.

**Criterios de aceptación**
- `POST /api/contracts/batch` recibe el mismo cuerpo que hoy produce la validación del Excel y responde 202 con un `jobId`.
- `GET /api/jobs/:id` devuelve estado, avance, errores por fila y, al terminar, el enlace de descarga del ZIP.
- Un colaborador del lote que no existe en la BD se crea con `CreateEmployee` antes de generar su contrato.
- Una fila con error no detiene el lote.
- El endpoint síncrono anterior sigue disponible hasta que el frontend migre, y queda marcado como obsoleto.

**Definición de Hecho**
- [ ] e2e de un lote con una fila errónea y de la consulta de estado.
- [ ] El endpoint síncrono figura como obsoleto en `docs/api/contracts.md`.
- [ ] El frontend fue avisado del endpoint nuevo.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

---

## Sprint 10 — 22/03 al 02/04

**Objetivo:** adendas con reglas, ingestión automática confiable y legajo del colaborador.
**Demo:** un Excel dejado en OneDrive termina en contratos generados y registrados, sin intervención.

### US-015 · Adendas como casos de uso

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-03 | Alta | 3 | `modules/contracts`, `prisma` | US-013a |

**Descripción.** Como analista de RRHH, quiero generar adendas de suplencia y de incremento de actividades validadas contra el contrato base, para no emitir adendas inconsistentes.

**Criterios de aceptación**
- Una adenda solo se crea sobre un contrato `VIGENTE`; si no, responde 409.
- Dos adendas del mismo contrato no pueden solaparse en fechas. Lo impide una restricción de la BD, además de la validación.
- Las adendas de incremento de actividades no superan 36 meses acumulados.
- Una adenda de suplencia exige indicar al colaborador reemplazado y el motivo.
- La generación en lote de adendas usa la cola, igual que US-013b.

**Subtareas**
- [ ] Migración de la tabla de adendas, con la restricción de no solapamiento (PR propio).
- [ ] Caso de uso `GenerateAddendum` y sus reglas en el dominio.
- [ ] Reemplazar el endpoint `/addendum/process` por la versión asíncrona.

**Definición de Hecho**
- [ ] Migración con la restricción de no solapamiento aplicada, con su reversa.
- [ ] Tests unitarios de las tres reglas: solapamiento, tope de 36 meses y suplencia.
- [ ] e2e de generación individual y en lote.
- [ ] El endpoint síncrono de adendas queda retirado o marcado como obsoleto.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

### US-014 · Ingestión de OneDrive como trabajo repetible

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-03 | Alta | 3 | `modules/documents`, `prisma` | US-013b, TASK-15 |

**Descripción.** Como analista de RRHH, quiero dejar el Excel en la carpeta de OneDrive y recibir los documentos, para mantener mi forma de trabajo actual con trazabilidad.

**Criterios de aceptación**
- Un trabajo repetible revisa la carpeta cada 10 minutos (configurable) y reemplaza al scheduler de `node-cron`.
- Cada archivo detectado se registra en `import_batches` con su hash. Un archivo con un hash ya procesado no se procesa de nuevo.
- El tipo de archivo (contratos o adendas) se detecta por sus encabezados.
- Si la validación falla, el original no se borra y RRHH recibe un correo con el detalle por fila.
- Si la validación pasa, se encola la generación y el lote queda asociado a los documentos que produjo.
- Un error temporal de Graph (límite de peticiones o error del servidor) se reintenta con espera creciente.
- Con `ONEDRIVE_ENABLED=false` el trabajo no se registra.

**Subtareas**
- [ ] Migración de `import_batches` e `import_batch_rows` (PR propio).
- [ ] Descomponer el orquestador en caso de uso de ingestión y procesadores de trabajo.
- [ ] e2e con el adaptador local simulando la carpeta.

**Definición de Hecho**
- [ ] Migración aplicada, con su reversa.
- [ ] e2e con el adaptador local: archivo válido, inválido y repetido.
- [ ] `node-cron` sale de `package.json` si no le queda otro uso.
- [ ] Probado contra OneDrive real en el entorno de pruebas.
- [ ] Hay una guía de qué hacer cuando un lote falla.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

### US-017 · Documentos del legajo

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-04 | Media | 2 | `modules/documents`, `prisma` | US-011, US-020b |

**Descripción.** Como asistente de RRHH, quiero subir al legajo de un colaborador su DNI escaneado, certificados y CV, para tenerlos en un solo lugar.

**Criterios de aceptación**
- `POST /api/employees/:id/documents` recibe el archivo, su tipo y, si aplica, su fecha de vencimiento.
- Solo se aceptan PDF, JPG y PNG, hasta el tamaño máximo configurado; lo demás responde 422.
- El archivo se guarda con `FileStorage` y sus metadatos en `employee_documents`.
- `GET /api/employees/:id/documents` lista el legajo, incluidos los contratos generados.
- La lectura respeta el alcance de US-008b.

**Subtareas**
- [ ] Migración de `employee_documents`.
- [ ] Permiso nuevo `documento:subir` en el catálogo y el seed.

**Definición de Hecho**
- [ ] Migración aplicada y permiso `documento:subir` sembrado.
- [ ] e2e de subida válida, tipo no permitido, tamaño excedido y alcance.
- [ ] `docs/api/documents.md` actualizado.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

---

## Sprint 11 — 05/04 al 16/04

**Objetivo (MVP-2):** el motor de PDF queda en su forma definitiva y RRHH recibe alertas de vencimiento.
**Demo:** contrato generado con los datos del empleador tomados del sistema; correo con los contratos que vencen en 30 días.

### US-012 · Migración de las plantillas a pdfmake

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-03 | Alta | 5 | `modules/contracts`, `platform/pdf` | SPIKE-PDF, US-031 |

**Descripción.** Como responsable de operación, quiero generar los PDF sin un navegador dentro del contenedor, para tener imágenes más livianas y menos consumo de memoria.

**Solo se ejecuta si SPIKE-PDF lo confirma.** Si el spike mantiene Puppeteer, este ticket se sustituye por uno de 3 puntos con las dos primeras subtareas.

**Criterios de aceptación**
- Las 8 plantillas de `templates.ts` existen en pdfmake: tiempo parcial, tiempo completo, anexo, subsidio, tratamiento de datos personales, no sujeto a fiscalización, adenda por incremento de actividades y adenda por suplencia.
- Los datos del empleador salen de US-031, no de la plantilla.
- RRHH aprueba una muestra impresa de cada plantilla contra el documento actual.
- Generar 10 contratos tarda menos de 10 segundos.
- La imagen Docker no contiene Chromium y `puppeteer` sale de `package.json`.
- La suite de TASK-11 pasa.

**Subtareas**
- [ ] Partir `templates.ts` (3,367 líneas) en un archivo por plantilla, con un registro de plantillas.
- [ ] Leer los datos del empleador desde `organization`.
- [ ] Portar cada plantilla a pdfmake.
- [ ] Retirar Puppeteer y las librerías de PDF que queden sin uso.

**Definición de Hecho**
- [ ] Aprobación de RRHH registrada por cada plantilla.
- [ ] El PR incluye la medición de tiempo y el tamaño de la imagen antes y después.
- [ ] `puppeteer` y las librerías sin uso salen de `package.json` y del lockfile.
- [ ] La suite de TASK-11 pasa.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

### US-082 · Alertas de vencimiento de contratos

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-13 | Media | 3 | `modules/contracts` | US-013a, TASK-15 |

**Descripción.** Como analista de RRHH, quiero un aviso cuando un contrato a plazo fijo está por vencer, para renovarlo o cerrarlo a tiempo.

**Criterios de aceptación**
- Un trabajo diario busca los contratos vigentes cuya fecha de fin cae en 30, 15 y 7 días.
- RRHH recibe un solo correo diario con el resumen, no uno por contrato.
- Cada umbral se notifica una sola vez por contrato.
- Un contrato cuya fecha de fin pasó sin renovación queda en `VENCIDO`.
- `GET /api/contracts/expiring?days=30` devuelve la misma lista.

**Definición de Hecho**
- [ ] Tests unitarios de la selección por umbral y de la no repetición del aviso.
- [ ] e2e del endpoint de contratos por vencer.
- [ ] El trabajo está registrado en el `worker` y fue probado en el entorno de pruebas.
- [ ] `docs/api/contracts.md` actualizado.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

**Criterio de cierre del MVP-2:** un contrato se genera eligiendo un colaborador de la BD y queda registrado; el flujo por Excel y por OneDrive sigue funcionando; no existe ninguna carpeta legacy; la imagen Docker genera PDF.
