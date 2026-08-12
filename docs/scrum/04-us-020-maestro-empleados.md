# US-020 — Maestro de Empleados (CRUD de la ficha personal)

> **EP-06 · Maestro de empleados**
> La historia existía como una sola fila de tabla en la sección «Detalle medio» del backlog (`01-product-backlog.md:1112`). Este documento es la especificación completa, el contrato de persistencia y el orden de construcción.

| | |
| --- | --- |
| **Prioridad** | MUST |
| **Esfuerzo** | 8 puntos (el backlog la tenía en 5) |
| **Dependencias** | US-007 y US-008 (ambas en `main`) · **US-009a** (rebanada de auditoría) · D1 resuelta |
| **Rama base** | `develop` |

**Leyenda de confianza usada en este documento:**

- ✅ **Verificado** — comprobado leyendo el archivo citado o ejecutando código.
- 🛑 **Bloqueante** — rompe el endpoint si no se arregla antes.
- 🟡 **Decisión** — es tuya, no técnica.

---

## 1. Tres defectos que hay que cerrar primero

Los tres están en código ya escrito y mergeado. Ninguno se manifiesta hoy porque ningún endpoint existente los toca; `GET /api/employees` los toca todos.

### 1.1 🛑✅ `req.query` no es asignable en Express 5

`src/shared/middleware/validation-error.middleware.ts:31` hace `req.query = result.data.query`. En Express 5 `req.query` es un **getter sin setter** en el prototipo, y bajo `"use strict"` —que TypeScript emite siempre— la asignación lanza `TypeError`. Resultado: **HTTP 500 en toda petición que valide query string.**

Nadie lo ha notado porque `loginSchema` declara solo `body` y `revokeSessionsSchema` solo `params` — y `params` sí es propiedad normal. `GET /api/employees` es el primer endpoint del proyecto que valida `query`.

Prueba ejecutada contra el `node_modules` del proyecto:

```
Express 5.2.1 — descriptor de req.query en express.request
  tiene get: true   tiene set: false   configurable: true
  descriptor de params: no existe en el proto (es propiedad normal)

asignación directa    → TypeError: Cannot set property query of
                        #<IncomingMessage> which has only a getter
Object.defineProperty → ok, {"page":1,"limit":20}
```

El arreglo aprovecha que el descriptor es `configurable: true`. Una línea, y merece commit propio:

```ts
if (result.data.query !== undefined) {
  Object.defineProperty(req, 'query', {
    value: result.data.query,
    writable: true, configurable: true, enumerable: true,
  });
}
```

### 1.2 🛑✅ Prisma te deja escribir `full_name`, y Postgres lo rechaza

`full_name` es una columna `GENERATED ALWAYS AS … STORED` creada en SQL crudo, pero `schema.prisma:177` la modela como `fullName String? @default(dbgenerated())`. Consecuencia: aparece como campo opcional en los tipos de escritura generados.

```
src/generated/prisma/models/Employee.ts:509   EmployeeCreateInput  → fullName?: string | null
src/generated/prisma/models/Employee.ts:571   EmployeeUpdateInput  → fullName?: … | string | null
```

Si el mapper la incluye —aunque sea con `null`— Postgres responde `428C9: cannot insert a non-DEFAULT value into column "full_name"` y verás un 500 opaco.

**Regla dura: el mapper construye `data` campo a campo. Prohibido el spread de la entidad leída**, que es exactamente cómo se cuela este bug en un `update`. Blindalo con un test unitario que afirme que `toCreate()` y `toUpdate()` no contienen la clave.

### 1.3 🛑 Las fechas se van un día atrás en el front

`hireDate`, `birthDate` y `terminationDate` son `@db.Date` (`schema.prisma:179,187,188`). Si dejás que `res.json()` las serialice salen como `"2026-08-01T00:00:00.000Z"`, y cualquier front en Lima (UTC−5) las renderiza como **31 de julio**.

- **Al leer:** formatear a `YYYY-MM-DD` en el DTO, con `toISOString().slice(0,10)`.
- **Al escribir:** construir con `new Date('2026-08-01T00:00:00.000Z')`, nunca con fecha local.
- **En Zod:** no uses `z.coerce.date()` a secas — acepta `"2026-13-45"` y timestamps completos. Usá un validador propio con `regex(/^\d{4}-\d{2}-\d{2}$/)` y transformá a medianoche UTC.

El test e2e que lo caza es un `expect(data.hireDate).toBe('2026-08-01')` — string, no ISO con Z.

---

## 2. Cuatro decisiones que cambian los casos de uso

Dos análisis independientes de la misma historia llegaron a conclusiones **opuestas** en estos cuatro puntos. Si no quedan decididos antes de codificar, hay que rehacer los cinco casos de uso.

### 🟡 D1 · ¿De dónde sale la empresa? (el más importante)

No existe forma de derivar la empresa del usuario autenticado:

- `authenticate.middleware.ts:17-21` pone `{ userId, email, permissions }` y nada más.
- `AccessPayload` (`auth/domain/types.ts:1-5`) no lleva empresa.
- `UserRole` (`schema.prisma:330-343`) **no tiene `companyId`**, aunque la nota técnica de US-008 (`01-product-backlog.md:517`) dé por hecho que sí.

El mecanismo de alcance **no existe**: US-020 tiene que construirlo.

| Posición A | Posición B |
| --- | --- |
| Cabecera `X-Company-Id` obligatoria en todas las rutas, resuelta por un middleware que valida que la empresa existe y está activa. | `companyId` en el body del POST y como filtro opcional de query en el GET, más un tipo `EmployeeScope` como costura. |

**Recomiendo B.** La posición A admite ella misma que «la cabecera selecciona, no autoriza» — entonces no aporta seguridad, solo un mecanismo paralelo que duplica lo que el body ya dice. Y `companyId` es un atributo *del empleado que se está creando*, no de la sesión: su lugar natural es el body, donde además ya lo exige la clave foránea.

La costura tipada es lo que hace esto barato en el futuro:

```ts
export type EmployeeScope =
  | { kind: 'ALL' }                                        // hoy
  | { kind: 'COMPANIES'; companyIds: readonly string[] };  // cuando UserRole.companyId exista
```

Cuando llegue el vínculo usuario→empresa cambia *un resolver*, no los cinco casos de uso. El predicado va en `domain/employee-scope.ts` como función pura, porque habla de la colección y no del individuo:

```ts
export const isCompanyInScope = (scope: EmployeeScope, companyId: string): boolean =>
  scope.kind === 'ALL' || scope.companyIds.includes(companyId);
```

### 🟡 D2 · ¿Qué oculta `colaborador:leer_sensible`?

| Posición A | Posición B |
| --- | --- |
| Ocultar 7 campos: `birthDate`, `maritalStatus`, `address`, `phone`, `personalEmail`, `hasChildrenUnder18`, `essaludLifeInsurance`. | No usar ese permiso en US-020: ningún campo de `employees` encaja en su definición. |

**Punto medio — y es decisión de cumplimiento, no técnica.** El catálogo define el permiso como «datos sensibles (salud, derechohabientes)» (`permissions.ts:27`). De los siete, solo **`hasChildrenUnder18`** (derechohabientes) y **`essaludLifeInsurance`** (salud) encajan en esa definición. `phone`, `address` y `birthDate` son PII ordinaria que cualquier analista de RRHH necesita para trabajar, y ocultarlos rompería la ficha para `MANAGER`, que solo tiene `colaborador:leer`.

Cuando se oculte un campo, **omitir la clave, no devolverla en `null`**: así no se distingue «sin permiso» de «sin dato», y un PATCH de ida y vuelta no borra datos existentes. Y no seleccionar esas columnas en el SQL, para que no viajen ni a los logs.

### 🟡 D3 · ¿La auditoría es atómica?

| Posición A | Posición B |
| --- | --- |
| El `INSERT` en `audit_logs` va dentro del mismo `$transaction` que la escritura: viven o mueren juntos. | `auditLogger.record(...)` se llama secuencialmente después de `repo.create()`. |

**A en el principio, pero ninguna de las dos en la mecánica.** Un log de auditoría que puede perder filas en silencio no sirve para auditar, así que A tiene razón. Pero A no menciona su costo: pasar el cliente transaccional por el puerto mete `Prisma.TransactionClient` en el dominio y rompe la regla de dependencias del propio proyecto.

La salida sin ese costo: que el **repositorio** abra el `$transaction` internamente y reciba los dos payloads en una sola llamada. El caso de uso construye la entidad y la entrada de auditoría, y hace una llamada; el dominio nunca ve Prisma; la atomicidad queda garantizada donde vive la transacción.

### 🟡 D4 · ¿Existe `DELETE /employees/:id`?

| Posición A | Posición B |
| --- | --- |
| Sí, como *anulación registral*: soft delete, solo si no hay contratos, sin tocar `status` ni `terminationDate`, con `colaborador:cesar`. | No: cesar ≠ borrar, y el cese es US-022. |

**Recomiendo A, con esas guardas exactas.** El caso real es concreto y va a pasar: corregir un alta mal tipeada durante la migración del Excel, sin editar la base de datos a mano. Y hay un beneficio que se cae solo del diseño existente: como `ux_employees_doc` es parcial (`WHERE deleted_at IS NULL`), después de anular podés volver a crear el mismo documento. Cuesta 1 punto. Si preferís no exponerlo, sale del alcance y bajan 1 punto.

---

## 3. Estado de partida

### 3.1 ✅ Ya construido

- `domain/types.ts` — `DocumentType`, `EmployeeStatus`, `Sex`, `MaritalStatus`, `EmployeeFilters`, `Page<T>`.
- `domain/errors/employee.error.ts` — las seis clases de error.
- La tabla `employees` completa, con constraints y columna generada.
- US-007 (login) y US-008 (`requirePermission`) en `main`.
- Los 5 permisos de colaborador, sembrados en `seed.ts:171-228`.
- Suite e2e con Vitest + Supertest, y `rbac.e2e.test.ts` como plantilla.

### 3.2 Todavía no existe

- `modules/employees/index.ts` existe pero está **vacío**.
- Ni entidad, ni puertos, ni casos de uso, ni repositorio, ni controlador, ni rutas, ni schemas.
- **Auditoría: cero.** `audit_logs` existe con sus 4 índices, pero **no hay ni un trigger ni una función en ninguna de las 11 migraciones**, y no hay módulo de auditoría en `src/`.
- La tabla `ubigeo` está **vacía** — `seed.ts:136` lo dice explícitamente.
- Índice único de `employee_code`: no existe.
- Extensión `pg_trgm`: no existe (solo `btree_gist`).

### 3.3 ✅ El drift, y la prueba histórica de por qué no hay que «arreglarlo»

Cuatro objetos SQL viven en la base de datos y **no están declarados en `schema.prisma`**:

```sql
-- prisma/migrations/20260709010204_expand_employees/migration.sql

ck_employees_dni_format          CHECK (document_type <> 'DNI' OR document_number ~ '^\d{8}$')
ck_employees_termination_range   CHECK (termination_date IS NULL OR termination_date >= hire_date)
full_name                        VARCHAR(220) GENERATED ALWAYS AS
                                   (first_names || ' ' || last_name_father || ' ' || COALESCE(last_name_mother,''))
                                   STORED
ux_employees_doc                 UNIQUE (company_id, document_type, document_number) WHERE deleted_at IS NULL
```

La tentación natural es declarar la unicidad en el schema para «cerrar el drift». **Eso reintroduciría un bug que ya se arregló una vez.** El historial de migraciones lo prueba:

```sql
20260708181624_add_employees:31     CREATE UNIQUE INDEX "employees_document_type_document_number_key"
                                      ON "employees"("document_type","document_number");   -- global, generado por @@unique

20260709010204_expand_employees:36  DROP INDEX "employees_document_type_document_number_key";
20260709010204_expand_employees:98  CREATE UNIQUE INDEX "ux_employees_doc" ON "employees"
                                      (company_id, document_type, document_number) WHERE deleted_at IS NULL;
```

Ese `@@unique` **existió**, generó un índice *global* —que impedía que el mismo DNI existiera en dos razones sociales del grupo— y fue eliminado a mano y reemplazado por el parcial por empresa. Prisma no sabe expresar índices parciales: volver a declararlo produciría otra vez el índice total, y además rompería la posibilidad de recrear un empleado después de un soft delete.

**Qué hacer en su lugar.** Documentar los cuatro objetos en un comentario `///` sobre el modelo, y añadir un test e2e que consulte el catálogo de Postgres y afirme que existen. Eso caza en el acto un `db push` destructivo, que es el riesgo real. `prisma migrate diff --exit-code` no sirve aquí: reportaría estas cuatro diferencias para siempre.

```sql
-- el test consulta el catálogo, no el schema
SELECT indexname   FROM pg_indexes    WHERE tablename = 'employees';
SELECT conname     FROM pg_constraint WHERE conrelid = 'employees'::regclass AND contype = 'c';
SELECT attgenerated FROM pg_attribute WHERE attrelid = 'employees'::regclass AND attname = 'full_name';
-- attgenerated = 's' significa stored generated
```

---

## 4. Contrato de persistencia

### 4.1 Lo único que falta por corrección, no por rendimiento

`DuplicateEmployeeCodeError` está escrito en el código pero **ningún índice lo respalda**: hoy es una comprobación de aplicación con carrera abierta. Como `employee_code` es nullable, el índice necesita las dos condiciones:

```sql
CREATE UNIQUE INDEX IF NOT EXISTS ux_employees_code
  ON employees (company_id, employee_code)
  WHERE employee_code IS NOT NULL AND deleted_at IS NULL;
```

Por empresa, no global — coherente con `ux_employees_doc`. Va en una migración `--create-only` de una sentencia, con el `DROP INDEX` de rollback comentado en el PR. `CONCURRENTLY` no aplica: Prisma envuelve las migraciones en una transacción, y a este volumen el bloqueo es imperceptible.

Y en el repositorio hay que **traducir `P2002` a `DuplicateDocumentError`**. Es la red de seguridad para la carrera entre dos peticiones simultáneas que pasan la comprobación previa: sin esa traducción, el duplicado sale como HTTP 500 en vez de 409.

### 4.2 Índices de rendimiento: todavía no

El inventario completo sobre `employees` es: la clave primaria, `ux_employees_doc`, y nada más — Postgres no crea índices para las claves foráneas. Hay un detalle que juega a favor: **`ux_employees_doc` tiene `company_id` como primera columna y es parcial sobre `deleted_at IS NULL`**, así que ya puede servir el filtro por empresa del listado.

La consulta del listado hará seq scan para el resto. Con cientos de filas eso es irrelevante, y añadir índices ahora es optimización prematura. Cuando el volumen lo justifique:

```sql
CREATE INDEX ix_employees_company_created
  ON employees (company_id, created_at DESC, id DESC) WHERE deleted_at IS NULL;

CREATE INDEX ix_employees_company_status_created
  ON employees (company_id, status, created_at DESC, id DESC) WHERE deleted_at IS NULL;
```

Hacen falta los dos: como `status` es un filtro opcional, el índice que lo lleva en segunda posición no puede sostener el orden cuando el filtro viene ausente.

### 4.3 La caja de búsqueda

`EmployeeFilters.search` ya está definido en el dominio como «coincidencia parcial sobre nombre completo o número de documento» (`domain/types.ts:23`). Eso es `full_name ILIKE '%q%' OR document_number ILIKE '%q%'`, y **ningún índice btree puede servir un `LIKE` con comodín inicial** — hace falta `pg_trgm` + GIN, que no está instalado. Es alcance de US-025.

Para US-020: aceptar el seq scan y exigir `search` de mínimo 2 caracteres, para que un `%a%` no barra la tabla. Dos limitaciones que hay que documentar en la respuesta de la API, porque son sorpresas para el usuario final:

- **Acentos:** «maria» no encuentra «MARÍA». `unaccent` tampoco está instalado.
- **Orden de las palabras:** la columna generada concatena `nombres + apellido paterno + apellido materno`, así que «quispe rojas» encuentra, y «rojas quispe» no.

### 4.4 Paginación: OFFSET

Keyset es más rápido en páginas profundas, pero no puede producir un conteo total baratamente — y el contrato de la API ya promete `total` y `totalPages` en `ApiResponse.paginated`. A este volumen OFFSET es la respuesta correcta.

El detalle que sí importa: **ordenar siempre por `created_at DESC, id DESC`**. El segundo criterio es lo que hace la paginación estable — sin él, dos filas con el mismo `created_at` pueden repetirse u omitirse entre la página 1 y la 2. Y `limit` topado en 100.

---

## 5. Especificación (para pegar en el backlog)

**Narrativa:**
Como **administrador de RRHH**, quiero **crear, consultar, listar con filtros y actualizar la ficha personal de un colaborador dentro de una razón social concreta, con validación del documento de identidad y con cada escritura registrada en la auditoría**, para que **la base de datos —y no el Excel— sea la fuente única de verdad del legajo, y para que ningún usuario vea datos de una empresa que no le corresponde**.

> **El límite de alcance que más se va a malinterpretar.** `Employee` no tiene puesto, sede, división ni salario: esos cuatro campos son de `Contract` (`schema.prisma:239-244`). US-020 es la *ficha personal*. El DTO no expone puesto ni sueldo, ni siquiera derivados por JOIN — eso ya es US-024/US-025 y requiere `contrato:leer`.

### Criterios de aceptación

```gherkin
Escenario 1: Creación exitosa
  Dado un usuario con permiso "colaborador:crear"
  Cuando POST /api/employees con { companyId, documentType: "DNI",
    documentNumber: "40506070", firstNames: "MARIA ELENA",
    lastNameFather: "QUISPE", lastNameMother: "ROJAS", hireDate: "2026-08-17" }
  Entonces responde HTTP 201 con { success: true, data: { id, status: "ACTIVO", ... } }
    Y status = "ACTIVO" y nationality = "PERUANA" por defecto (no se piden al cliente)
    Y fullName llega calculado por la BD y es de solo lectura
    Y hireDate se serializa como "2026-08-17", no como ISO con Z
    Y terminationDate y deletedAt son null

Escenario 2: Documento duplicado en la misma empresa
  Dado que en la empresa A ya existe un colaborador vivo con DNI "40506070"
  Cuando POST /api/employees con ese mismo documentType y documentNumber
  Entonces responde HTTP 409 con
    "Ya existe un colaborador con DNI 40506070 en esta empresa"
    Y no se crea ninguna fila
    Y la violación de ux_employees_doc (P2002) también se traduce a 409,
      nunca a HTTP 500 — defensa ante la carrera entre dos peticiones simultáneas

Escenario 3: El mismo documento sí puede existir en otra razón social
  Dado que el DNI "40506070" ya existe en la empresa A
  Cuando POST /api/employees con ese DNI y companyId de la empresa B
  Entonces responde HTTP 201 y ambos registros coexisten,
    porque la unicidad es (company_id, document_type, document_number)

Escenario 4: Validación de formato del documento según su tipo
  Cuando POST con { documentType: "DNI", documentNumber: "1234567" }
  Entonces HTTP 422 con errors: [{ field: "documentNumber",
    message: "El DNI debe tener exactamente 8 dígitos" }]
    Y con documentType "CE" y 8 caracteres -> 422
    Y con documentType "CE" y "001234567" -> 201
    Y el número se normaliza antes de validar: trim, sin espacios, mayúsculas
    Y ningún caso llega a estrellarse contra el CHECK ck_employees_dni_format

Escenario 5: Actualización parcial
  Cuando PATCH /api/employees/<id> con { phone: "987654321", address: "AV. AREQUIPA 123" }
  Entonces HTTP 200 y solo esos dos campos cambian
    Y los otros 13 campos nullable conservan su valor previo
    Y updatedAt avanza
    Y un body vacío {} responde HTTP 422 ("Debe enviar al menos un campo")

Escenario 6: Campos que PATCH no puede tocar
  Cuando PATCH incluye companyId, fullName, deletedAt o id
  Entonces HTTP 422 indicando el campo rechazado — schema estricto,
    no se ignora en silencio
    Y cuando PATCH intenta status: "CESADO" o terminationDate sin
      el permiso "colaborador:cesar"
    Entonces HTTP 403: el cese es US-022 y tiene su propio permiso
    Y cuando PATCH mueve hireDate más allá de un terminationDate existente
    Entonces HTTP 422 por invariante de dominio, sin llegar al CHECK de Postgres

Escenario 7: Listado paginado con filtros
  Dado 47 colaboradores en la empresa A (30 ACTIVO, 17 CESADO) y 12 en la empresa B
  Cuando GET /api/employees?page=2&limit=20&status=ACTIVO&companyId=<A>
  Entonces HTTP 200 con 10 elementos y
    pagination = { page: 2, limit: 20, total: 30, totalPages: 2 }
    Y ninguno de los 12 de la empresa B aparece
    Y ningún registro con deletedAt distinto de null aparece
    Y el orden es created_at DESC, id DESC para que la paginación no repita filas
    Y sin parámetros los defaults son page=1, limit=20; limit>100 responde 422

Escenario 8: Búsqueda parcial por nombre y por documento
  Dado "MARIA ELENA QUISPE ROJAS" (DNI 40506070) y "JUAN PEREZ LOPEZ"
  Cuando GET /api/employees?search=quispe
  Entonces devuelve a MARIA ELENA — parcial, insensible a mayúsculas, sobre full_name
    Y GET ?search=4050 devuelve a MARIA ELENA por document_number
    Y GET ?search=zzz devuelve data: [] con total: 0 y HTTP 200, nunca 404
    Y search de menos de 2 caracteres responde 422
    Y se documenta como limitación conocida que "maria" no encuentra "MARÍA"
      y que "rojas quispe" no encuentra: ambas son alcance de US-025

Escenario 9: Alcance — colaborador de otra empresa
  Dado un colaborador <id-B> de la empresa B, fuera del alcance del actor
  Cuando GET /api/employees/<id-B>
  Entonces HTTP 404, no 403: no se revela que el registro existe
    Y lo mismo aplica a PATCH y DELETE sobre <id-B>
    Y el filtro de alcance se aplica DENTRO del caso de uso, no solo en el middleware
    Y en el listado, un companyId fuera de alcance responde 403
      (el actor ya conoce ese id, no hay enumeración que proteger)

Escenario 10: Campos sensibles ocultos sin "colaborador:leer_sensible"
  Dado un usuario con rol HR_ANALYST, que no tiene ese permiso
  Cuando GET /api/employees/<id>
  Entonces HTTP 200 y la respuesta OMITE las claves
    hasChildrenUnder18 y essaludLifeInsurance
    Y las omite, no las devuelve en null, para que no se distinga
      "sin permiso" de "sin dato" ni un PATCH de ida y vuelta borre datos
    Y esas columnas tampoco se seleccionan en el SQL: no viajan ni a los logs
    Y las mismas claves se omiten en cada elemento del listado
    Y con rol HR_ADMIN ambas claves aparecen

Escenario 11: Toda escritura queda auditada, y de forma atómica
  Cuando POST /api/employees se completa con éxito
  Entonces existe una fila en audit_logs con action="CREATE",
    entityType="employees", entityId=<id>, actorUserId=<actor>,
    newValues={...}, oldValues=null, ipAddress y correlationId
    Y cuando PATCH cambia phone de "999111222" a "987654321"
    Entonces audit_logs registra action="UPDATE" con
      oldValues={phone:"999111222"} y newValues={phone:"987654321"},
      SOLO los campos que cambiaron
    Y el INSERT ocurre en la MISMA transacción que la escritura:
      si la auditoría falla, la escritura se revierte
    Y si la escritura falla, no queda ninguna fila de auditoría
    Y las lecturas no generan auditoría en esta historia (US-009b)

Escenario 12: Anulación registral, distinta del cese
  Dado un colaborador creado por error, SIN ningún contrato asociado
  Cuando DELETE /api/employees/<id> con permiso "colaborador:cesar"
  Entonces HTTP 200, se fija deletedAt = now() y NO se borra la fila
    Y desaparece del listado, y GET por id da 404
    Y status y terminationDate NO se modifican: eso es un cese, y es US-022
    Y se puede volver a crear un colaborador con el mismo documento,
      porque ux_employees_doc es parcial
    Y audit_logs registra action="DELETE"
    Y cuando el colaborador SÍ tiene al menos un contrato
    Entonces HTTP 409 con un mensaje que remite al cese, y deletedAt no cambia
```

### Definición de Hecho

- [ ] Cinco endpoints operativos bajo `/api/employees`, con `authenticate` y `requirePermission`.
- [ ] Fix de `req.query` en `validation-error.middleware.ts`, en commit propio.
- [ ] Migración `ux_employees_code` aplicada, con el rollback comentado en el PR.
- [ ] Tests unitarios de invariantes de la entidad, del mapper y de la política de campos sensibles.
- [ ] Test del mapper que afirma que `toCreate` y `toUpdate` no contienen `fullName`.
- [ ] Tests e2e de los 12 escenarios, con fixtures de **dos** empresas y los roles `HR_ADMIN`, `HR_ANALYST` y `MANAGER`.
- [ ] Test e2e de atomicidad de la auditoría, y test de catálogo que verifica los 4 objetos SQL.
- [ ] `modules/employees/index.ts` expone el router; `type-check` y `lint` verdes.
- [ ] `docs/api/employees.md` con la matriz endpoint × permiso y las limitaciones de búsqueda.

---

## 6. Alcance: qué no entra, y a dónde va cada exclusión

| Excluido de US-020 | Historia | Por qué |
| --- | --- | --- |
| Cuentas sueldo/CTS, AFP/ONP, comisión | US-021 | Tablas propias con `EXCLUDE` de vigencias; ninguna existe aún |
| Cambiar `status` a `CESADO`, fijar `terminationDate`, propagar a contratos y seguros | US-022 | El cese es un acto jurídico con efectos en cascada, no un PATCH de ficha |
| Carga masiva desde Excel, reporte de errores por fila | US-023 | Reutilizará el caso de uso `CreateEmployee` fila a fila |
| Histórico de puesto y sueldo por fecha | US-024 | Vive en `Contract`, no en `Employee` |
| Índice GIN `pg_trgm`, acentos, filtro por área y por fecha de ingreso | US-025 | US-020 entrega la búsqueda funcional; US-025 la hace rápida y la extiende |
| Contactos de emergencia | US-026 | Tabla propia inexistente |
| Derechohabientes: hijos, cónyuge | US-027 | US-020 solo persiste el booleano `hasChildrenUnder18` |
| CUSPP, AFP vigente, comisión usable en planilla | US-028 | Depende de US-021, no de la ficha |
| Catálogo INEI de ubigeo y normalización de direcciones | US-029 | US-020 solo valida que `ubigeoId` exista |
| Transiciones a `SUSPENDIDO`, `VACACIONES`, `SUBSIDIADO` | US-030 | US-020 fija `ACTIVO` en el alta y no lo vuelve a tocar |
| Puesto, sede, división, salario | US-031…038 | No son campos de `Employee` |
| Triggers genéricos, `GET /audit-logs`, auditoría de lecturas | US-009b | US-020 audita sus propias escrituras vía puerto de aplicación |
| Restringir a qué empresas accede cada usuario | US-008b | Requiere `UserRole.companyId`, que hoy no existe |
| Subida de foto y documentos del legajo | US-017 | US-020 solo guarda `photoUrl` como texto |

---

## 7. Construcción

### 7.1 Endpoints

| Endpoint | Permiso | Éxito | Errores |
| --- | --- | --- | --- |
| `POST /api/employees` | `colaborador:crear` | 201 | 401 · 403 · 409 duplicado · 422 Zod, invariante, empresa o ubigeo inexistente |
| `GET /api/employees` | `colaborador:leer` | 200 | 401 · 403 alcance · 422 query inválida |
| `GET /api/employees/:id` | `colaborador:leer` | 200 | 401 · 404 inexistente o fuera de alcance · 422 id no uuid |
| `PATCH /api/employees/:id` | `colaborador:editar` | 200 | 401 · 403 sin permiso o intento de cese · 404 · 409 · 422 |
| `DELETE /api/employees/:id` | `colaborador:cesar` | 200 | 401 · 403 · 404 · 409 tiene contratos |

### 7.2 El puerto del repositorio

```ts
export interface IEmployeeRepository {
  findById(id: string): Promise<Employee | null>;

  // Devuelve la ENTIDAD, no un boolean: update necesita comparar el id del dueño.
  // Si el documento existe pero es del mismo empleado, no es conflicto.
  findByDocument(
    companyId: string, documentType: DocumentType, documentNumber: string,
  ): Promise<Employee | null>;

  findByEmployeeCode(companyId: string, employeeCode: string): Promise<Employee | null>;

  create(employee: Employee, audit: AuditEntry): Promise<void>;   // un solo $transaction
  update(employee: Employee, audit: AuditEntry): Promise<void>;
  softDelete(id: string, audit: AuditEntry): Promise<void>;

  // scope va SEPARADO de filters a propósito: filters viene del cliente y scope
  // del token. Fusionados, un companyId del cliente podría pisar el alcance.
  // Con dos parámetros el AND es estructural y la fuga es imposible por construcción.
  list(filters: EmployeeFilters, scope: EmployeeScope): Promise<Page<Employee>>;

  hasContracts(employeeId: string): Promise<boolean>;   // guarda del escenario 12
}
```

Más dos lectores de otros agregados, `ICompanyReader.existsActive()` y `IUbigeoReader.exists()`. Van como puertos propios y no se delega a la clave foránea porque una FK violada da `P2003` genérico —no sabés si falló la empresa o el ubigeo— y además no comprueba `isActive` ni `deletedAt`. Cuando exista el módulo de organización se sustituye solo el adaptador.

### 7.3 Entidad rica, no tipo plano

El proyecto ya eligió esto: `user.entity.ts` tiene campos privados con getters e invariantes dentro del agregado. Y hay una razón específica aquí: tres invariantes tienen respaldo de `CHECK` en la base. Si no las valida el dominio, la violación llega a Postgres y sale como **500 opaco** en vez de 422 con mensaje útil.

Dos entradas: `Employee.create()` valida, `Employee.fromPersistence()` no. Ese patrón evita que un dato legacy ya guardado bloquee un `GET` — importante en un proyecto que migra desde Excel.

Las invariantes que **solo el dominio** puede sostener, porque la base no las expresa:

- **Coherencia estado ↔ cese:** `status === 'CESADO'` ⇔ `terminationDate !== null`, en ambos sentidos. Sin ella tendrás cesados sin fecha y activos con fecha de cese.
- **Formato de CE, PASAPORTE y PTP:** el `CHECK` solo cubre DNI. Propuesta: CE `^[0-9A-Z]{9,12}$`, PASAPORTE `^[0-9A-Z]{6,12}$`, PTP `^\d{9}$` — confirmar con el contador contra la tabla de SUNAT.
- **Longitudes:** si no las validás, Postgres da `22001` → 500.
- **`ubigeoId` de 6 dígitos exactos:** es `@db.Char(6)`, y con 5 dígitos se rellena con espacios y rompe la FK en silencio.
- **`nationality`:** el `@default("PERUANA")` no aplica si mandás `null` explícito, solo si omitís la columna.

### 7.4 Árbol de archivos

```
src/modules/employees/
├── domain/
│   ├── types.ts                          [EXISTE] + EmployeeScope, EmployeeUpdatePatch, ActorContext
│   ├── employee-scope.ts                 función pura isCompanyInScope(scope, companyId)
│   ├── entities/
│   │   ├── employee.entity.ts            agregado: invariantes de documento, fechas y estado
│   │   └── employee.entity.test.ts
│   ├── errors/employee.error.ts          [EXISTE] + CompanyOutOfScopeError, TerminationNotAllowedError
│   └── ports/
│       ├── employee.repository.port.ts
│       ├── company-reader.port.ts
│       └── ubigeo-reader.port.ts
├── application/
│   ├── dtos/employee.dto.ts              EmployeeOutput + toEmployeeOutput(entity, canReadSensitive)
│   ├── create-employee.use-case.ts
│   ├── update-employee.use-case.ts
│   ├── get-employee.use-case.ts
│   ├── list-employees.use-case.ts
│   └── soft-delete-employee.use-case.ts
├── infrastructure/persistence/
│   ├── mappers/employee.mapper.ts
│   └── repository/
│       ├── prisma-employee.repository.ts       + traducción de P2002
│       ├── prisma-company-reader.repository.ts
│       └── prisma-ubigeo-reader.repository.ts
├── presentation/
│   ├── controllers/employee.controller.ts
│   ├── routes/employee.routes.ts
│   └── schemas/
│       ├── create-employee.schema.ts     .strict()
│       ├── update-employee.schema.ts     .strict() + refine "al menos un campo"
│       ├── list-employees.schema.ts      z.coerce en page y limit
│       ├── employee-id.schema.ts
│       └── shared-fields.schema.ts       dateOnly, documentNumber, ubigeoId
└── index.ts                              [EXISTE, VACÍO] composition root

tests/helpers/employee.fixtures.ts        2 empresas + 1 ubigeo; NO tocar prisma/seed.ts
tests/e2e/employees.e2e.test.ts
src/services/app.ts                       [EDITAR] +2 líneas
src/shared/middleware/validation-error.middleware.ts   [EDITAR] fix de req.query
```

Dos cosas que `auth/` no tiene: `application/dtos/`, porque cinco casos de uso comparten una sola forma de respuesta de 20 campos y duplicarla es peor; y `employee-scope.ts`, porque el predicado habla de la colección, no del individuo. No hay `value-objects/` porque `auth` tampoco los tiene en el código real.

### 7.5 Detalles del mapper que producen bugs silenciosos

- **`fullName`:** omitir siempre en escritura. En lectura, ignorar `row.fullName` y exponer un getter calculado, para no arrastrar un `string | null` que obligue a `?? ''` en cada consumidor. La fórmula del dominio debe coincidir con la del SQL, incluido el `COALESCE`. Cubrilo con un test.
- **Nullables:** son 15 columnas. En el dominio son `T | null`, nunca `undefined`. En el update, `undefined` significa «no tocar» y `null` significa «poner NULL» — Prisma usa esa misma semántica. Si convertís `undefined` en `null` por descuido, **un PATCH de un solo campo borra los otros 14**.
- **Enums:** los literales del dominio coinciden carácter a carácter con los de Prisma; solo cambia el nombre del tipo (`SexType` vs `Sex`). El cast va en el mapper y en ningún otro sitio: es la frontera.
- **Soft delete:** `deletedAt: null` en todos los `where` de lectura, como ya hace `prisma-user.repository.ts:24,30`.
- **No hay ningún `Decimal` en `Employee`.** Llegan en US-024 con `Contract.salary`, y ahí van con `.toString()`, nunca `Number()`.

---

## 8. Orden de construcción

Esta sección sí es una secuencia: cada paso depende del anterior. Dos PRs, para respetar el límite de 400 líneas por revisión.

1. **Decidir D1 a D4.** Son cuatro respuestas, no código. D1 determina la firma de los cinco casos de uso.
2. **Fix de `req.query`** en `validation-error.middleware.ts`, commit propio y aislado.
3. **US-009a:** puerto de auditoría y propagación del actor. Va primero porque el escenario 11 depende de él, y porque el repositorio necesita su firma para abrir el `$transaction`.
4. **Migración `ux_employees_code`**, aditiva y de una sentencia. Anunciala antes: `prisma/` es territorio compartido.
5. **Dominio:** entidad, invariantes, `employee-scope.ts`, puertos. Con sus tests unitarios, que son el grueso del valor y no necesitan base de datos.
6. **PR 1 — lectura:** mapper, repositorio, `GET` lista y detalle, proyección de campos sensibles. Escenarios 7 a 10.
7. **PR 2 — escritura:** `POST`, `PATCH`, `DELETE`, auditoría atómica, traducción de `P2002`. Escenarios 1 a 6, 11 y 12.
8. **Test de catálogo** que verifica los 4 objetos SQL, y `docs/api/employees.md`.

---

## 9. Estimación

| Tarea | Horas |
| --- | --- |
| Schemas Zod y tabla de formatos por tipo de documento | 2.5 |
| Dominio: invariantes, política de campos sensibles, puertos | 3.5 |
| Repositorio, mapper y `select` condicionado por permiso | 4.0 |
| Cinco casos de uso con filtro de alcance propio | 3.5 |
| Controlador, rutas, composition root | 3.0 |
| Auditoría: puerto, diff de campos, transacción compartida | 2.0 |
| Migración y traducción de `P2002` | 1.0 |
| Tests unitarios | 2.5 |
| Tests e2e: 12 escenarios, fixtures de 2 empresas y 3 roles | 4.0 |
| Documentación y PRs | 1.5 |
| **Total** | **27.5** |

27,5 h cae en el tramo de **8 puntos** (16–32 h). Los 5 puntos originales corresponden a un CRUD sin alcance multi-RUC, sin máscara de campos sensibles y sin auditoría: llegar a 5 exige entregar la historia sin sus tres mecanismos de seguridad.

La comparación que lo sostiene: **US-031**, el CRUD de empresas, vale 3 puntos — es el CRUD «desnudo», sin alcance ajeno ni auditoría propia. Y **US-021, US-022 y US-027** valen 3 cada una *porque* US-020 habrá construido antes el alcance, el puerto de auditoría, el helper de paginación y las fixtures. Parte de estos 8 puntos es infraestructura amortizada por seis historias posteriores.

---

## 10. Riesgos y preguntas abiertas

| # | Riesgo o pregunta | Recomendación |
| --- | --- | --- |
| R1 | US-020 declara depender de US-009, que está al 0% | Partir en **US-009a** (propagación del actor + puerto de auditoría en capa de aplicación, ~2 pts, mismo dev, primero) y **US-009b** (triggers genéricos + `GET /audit-logs` + auditoría de lecturas). El trigger de Postgres no conoce al actor del JWT, y `docs/sprint/sprint-1.md:22` ya había decidido auditoría por decorator |
| R2 | Formatos de CE, PASAPORTE y PTP sin confirmar | Arrancar con los regex propuestos en §7.3 y validarlos con el contador contra la tabla de tipos de documento de SUNAT antes del cierre del sprint. Si cambian, es una constante y un test |
| R3 | Ley 29733 exige auditar **lecturas** de datos sensibles | Diferir a US-009b. Auditar cada GET multiplica las escrituras en `audit_logs` y exige política de retención y particionado, que no están decididas |
| R4 | Drift: cuatro objetos SQL fuera de `schema.prisma`; un `db push` los perdería en silencio | Test de catálogo (§3.3). **`prisma db push` está prohibido en este repo** |
| R5 | US-023 (importación masiva) reutilizará el alta; riesgo de dos caminos de validación divergentes | `CreateEmployee` es el **único** punto de alta. US-023 lo invoca por fila y captura `DuplicateDocumentError` / `InvalidEmployeeDataError` para su reporte. Los schemas Zod se exportan desde el módulo |
| R6 | `NotFoundError` produce spanglish: *"Colaborador with id 'x' not found"* (`app-error-v2.ts:47`) | Que `EmployeeNotFoundError` construya su propio mensaje en español. Toca un archivo del módulo, no el compartido, y no rompe los tests de `auth` |
| R7 | `shared/types/employees.interface.ts` es la fila del Excel legacy, no la ficha maestra, y tiene un `ValidationError` homónimo del de `app-error-v2.ts` | `src/modules/employees/**` **nunca** lo importa. El puente Excel↔dominio es US-023 |
| R8 | `requirePermission` usa `.some()`: la semántica es **OR**, no AND | Nunca pasarle dos códigos esperando exigir ambos. El chequeo de `colaborador:cesar` del escenario 6 va en la capa de aplicación, no en el middleware |

---

*Los hallazgos marcados ✅ se comprobaron leyendo el archivo citado o ejecutando código; el bug de `req.query` se reprodujo contra Express 5.2.1 del `node_modules` del proyecto.*
