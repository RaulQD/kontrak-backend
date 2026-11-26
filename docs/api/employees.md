# API de colaboradores (`/api/employees`)

Módulo `modules/employees`. La lectura es US-020a y la escritura US-020b; las decisiones D1–D6 están en `docs/scrum/04-us-020-maestro-empleados.md`.

Todas las rutas exigen `Authorization: Bearer <accessToken>` (se obtiene con `POST /api/auth/login`).

## Endpoints y permisos

| Endpoint | Permiso | Éxito | Errores |
| --- | --- | --- | --- |
| `GET /api/employees` | `colaborador:leer` | 200 | 401 · 403 · 422 |
| `GET /api/employees/:id` | `colaborador:leer` | 200 | 401 · 403 · 404 · 422 |
| `POST /api/employees` | `colaborador:crear` | 201 | 401 · 403 · 409 · 422 |
| `PATCH /api/employees/:id` | `colaborador:editar` | 200 | 401 · 403 · 404 · 409 · 422 |
| `DELETE /api/employees/:id` | `colaborador:cesar` | 200 | 401 · 403 · 404 · 409 · 422 |

Qué puede hacer cada rol del seed:

| Acción | SUPER_ADMIN | HR_ADMIN | HR_ANALYST | MANAGER | EMPLOYEE |
| --- | :---: | :---: | :---: | :---: | :---: |
| Listar y ver el detalle | ✓ | ✓ | ✓ | ✓ | — |
| Ver los campos sensibles | ✓ | ✓ | — | — | — |
| Dar de alta | ✓ | ✓ | — | — | — |
| Editar | ✓ | ✓ | ✓ (sin campos sensibles) | — | — |
| Anular | ✓ | ✓ | — | — | — |

## Formato de las respuestas

**Éxito**

```json
{ "success": true, "message": "…", "data": { "…": "…" } }
```

El listado agrega `pagination`, y la anulación responde sin `data`.

**Error de la aplicación** (permisos, no encontrado, duplicados, reglas de negocio):

```json
{ "success": false, "message": "Ya existe un colaborador con DNI 40506070", "code": "CONFLICT" }
```

| HTTP | `code` | Cuándo |
| --- | --- | --- |
| 401 | `UNAUTHORIZED` | Sin token, token vencido, revocado o de un usuario desactivado |
| 403 | `FORBIDDEN` | Falta el permiso de la ruta, se intenta un cese por PATCH o se escribe un campo sensible sin `colaborador:leer_sensible` |
| 404 | `NOT_FOUND` | El colaborador no existe o está anulado |
| 409 | `CONFLICT` | Documento o código ya registrados; anulación de un colaborador con contratos |
| 422 | `VALIDATION_ERROR` | Una regla del dominio o un ubigeo que no existe |

**Error de validación del schema** (422). Tiene otra forma: lista cada campo con su mensaje.

```json
{
  "message": "Validation errors",
  "errors": [{ "field": "documentNumber", "message": "El DNI debe tener exactamente 8 dígitos" }]
}
```

`field` vale `body` cuando el error es del cuerpo entero: claves no permitidas o cuerpo vacío.

Cada respuesta trae la cabecera `X-Request-Id`. Es el `correlationId` con el que la escritura queda en `audit_logs`, y sirve para buscar los logs de esa petición.

## La ficha del colaborador

Es la misma en el detalle, en cada elemento del listado y en las respuestas de `POST` y `PATCH`.

| Campo | Tipo | Notas |
| --- | --- | --- |
| `id` | UUID | |
| `employeeCode` | string \| null | Código interno de planilla, hasta 20 caracteres |
| `documentType` | `DNI` \| `CE` \| `PASAPORTE` \| `PTP` | |
| `documentNumber` | string | Sin espacios y en mayúsculas |
| `firstNames`, `lastNameFather`, `lastNameMother` | string | |
| `fullName` | string | Lo calcula la base de datos. Solo lectura |
| `sex` | `MASCULINO` \| `FEMENINO` \| null | |
| `birthDate` | `YYYY-MM-DD` \| null | |
| `maritalStatus` | `SOLTERO` \| `CASADO` \| `DIVORCIADO` \| `CONVIVIENTE` \| `VIUDO` \| null | |
| `nationality` | string \| null | `PERUANA` por defecto en el alta |
| `email` | string | Correo corporativo. Siempre tiene valor, en minúsculas |
| `personalEmail` | string \| null | En minúsculas |
| `phone`, `address`, `photoUrl` | string \| null | |
| `ubigeoId` | string \| null | Código INEI de 6 dígitos del distrito |
| `hireDate` | `YYYY-MM-DD` | |
| `terminationDate` | `YYYY-MM-DD` \| null | Solo lo fija el cese (US-022) |
| `status` | `ACTIVO` \| `CESADO` \| `SUSPENDIDO` \| `VACACIONES` \| `SUBSIDIADO` | `ACTIVO` en el alta |
| `createdAt`, `updatedAt` | ISO 8601 con hora | |
| `deletedAt` | ISO 8601 \| null | Siempre `null` en lo que devuelve la API |
| `hasChildrenUnder18` | boolean | **Sensible** |
| `essaludLifeInsurance` | boolean | **Sensible** |

**Fechas.** Las de solo día (`hireDate`, `birthDate`, `terminationDate`) viajan como `YYYY-MM-DD` en las dos direcciones, sin hora, para que un front en Lima no muestre el día anterior. Una fecha imposible como `2026-02-31` o con hora como `2026-08-17T00:00:00Z` responde 422.

### Campos sensibles

Son `hasChildrenUnder18` (derechohabientes) y `essaludLifeInsurance` (salud), según D2. El permiso `colaborador:leer_sensible` no da acceso a la ficha: cambia su forma.

- **Lectura.** Sin el permiso, las dos claves **no aparecen** en ninguna respuesta (no llegan en `null`) y ni siquiera se leen de la base de datos.
- **Escritura (D6).** Sin el permiso, enviar cualquiera de las dos en `POST` o `PATCH` responde 403 con `No tiene permiso para registrar hasChildrenUnder18`. Quien no puede ver un dato tampoco puede escribirlo.

## `GET /api/employees`: listado

| Parámetro | Valor | Por defecto |
| --- | --- | --- |
| `page` | entero ≥ 1 | 1 |
| `limit` | entero de 1 a 100 | 20 |
| `status` | uno de los estados de la ficha | todos |
| `search` | texto de 2 caracteres o más | sin filtro |

Un parámetro desconocido responde 422. Ordena por `createdAt` descendente y, a igual fecha, por `id`. Los anulados nunca aparecen.

```json
{
  "success": true,
  "message": "…",
  "data": [{ "id": "…", "fullName": "MARIA ELENA QUISPE ROJAS", "status": "ACTIVO", "...": "…" }],
  "pagination": { "page": 2, "limit": 20, "total": 30, "totalPages": 2 }
}
```

**Limitaciones de la búsqueda**

- Busca solo en `fullName` y en `documentNumber`: no en el código, el correo ni el teléfono.
- Es una coincidencia parcial de texto contiguo y sin distinguir mayúsculas. El orden de las palabras importa: `quispe rojas` encuentra a MARIA ELENA QUISPE ROJAS y `rojas quispe` no.
- Distingue tildes: `pérez` no encuentra `PEREZ`.
- `%` y `_` se buscan literalmente: no son comodines.
- La paginación es por OFFSET. Si se crean colaboradores mientras se recorren las páginas, un elemento puede repetirse o saltarse entre una página y la siguiente.

## `GET /api/employees/:id`: detalle

`id` debe ser un UUID (si no, 422). Responde 404 si el colaborador no existe o está anulado.

## `POST /api/employees`: alta

| Campo | Obligatorio | Reglas |
| --- | :---: | --- |
| `documentType` | ✓ | `DNI`, `CE`, `PASAPORTE` o `PTP` |
| `documentNumber` | ✓ | Se quitan los espacios y se pasa a mayúsculas antes de validar. DNI: 8 dígitos · CE: 9 a 12 letras o dígitos · PASAPORTE: 6 a 12 letras o dígitos · PTP: 9 dígitos |
| `firstNames` | ✓ | Hasta 100 caracteres |
| `lastNameFather`, `lastNameMother` | ✓ | Hasta 60 caracteres cada uno |
| `hireDate` | ✓ | `YYYY-MM-DD` |
| `email` | ✓ | Correo corporativo válido, hasta 150 caracteres. Se quitan los espacios de los extremos y se guarda en minúsculas |
| `employeeCode` | | Hasta 20 caracteres |
| `sex`, `maritalStatus` | | Valores de la tabla de la ficha |
| `birthDate` | | `YYYY-MM-DD` |
| `nationality` | | Hasta 40 caracteres. Si no se envía, `PERUANA` |
| `personalEmail` | | Correo válido, hasta 150 caracteres. Se guarda en minúsculas |
| `phone` | | Hasta 20 caracteres |
| `address` | | Hasta 300 caracteres |
| `ubigeoId` | | 6 dígitos y debe existir en el catálogo |
| `hasChildrenUnder18`, `essaludLifeInsurance` | | Booleanos, `false` si no se envían. Requieren `colaborador:leer_sensible` |
| `photoUrl` | | Hasta 500 caracteres |

- **No se aceptan** `id`, `status`, `terminationDate`, `fullName`, `createdAt`, `updatedAt` ni `deletedAt`: cualquiera de ellos responde 422. El alta siempre queda `ACTIVO`.
- Un texto opcional vacío (`""`) responde 422. Si el campo no tiene valor, se omite.
- **Unicidad.** El documento (tipo y número) y el código no pueden repetirse entre colaboradores vigentes o cesados. Los de un colaborador anulado sí se pueden volver a usar.

```http
POST /api/employees
Content-Type: application/json

{
  "documentType": "DNI",
  "documentNumber": "40506070",
  "firstNames": "MARIA ELENA",
  "lastNameFather": "QUISPE",
  "lastNameMother": "ROJAS",
  "hireDate": "2026-08-17",
  "email": "maria.quispe@empresa.pe"
}
```

Responde 201 con la ficha creada, igual que el detalle: `status: "ACTIVO"`, `nationality: "PERUANA"`, `hireDate: "2026-08-17"`.

| Error | Respuesta |
| --- | --- |
| Formato del documento, campos obligatorios, longitudes, fechas, claves no permitidas | 422 con `errors` |
| Correo ausente, vacío, solo con espacios o en `null` | 422 con `errors`: `El correo corporativo es obligatorio` |
| Ubigeo que no está en el catálogo | 422 `El ubigeo 999999 no existe` |
| Documento ya registrado | 409 `Ya existe un colaborador con DNI 40506070` |
| Código ya registrado | 409 `Ya existe un colaborador con el código EMP-001` |
| Campo sensible sin `colaborador:leer_sensible` | 403 |

Dos altas simultáneas con el mismo documento no generan 500: una responde 201 y la otra 409.

## `PATCH /api/employees/:id`: edición parcial

Acepta los mismos campos que el alta, todos opcionales.

- **Campo ausente:** no se toca.
- **`null`:** borra el valor. Solo en `employeeCode`, `sex`, `birthDate`, `maritalStatus`, `personalEmail`, `phone`, `address`, `ubigeoId` y `photoUrl`. El documento, los nombres, `email`, `nationality`, `hireDate` y los campos sensibles se pueden cambiar, pero no borrar.
- **Texto vacío (`""`):** 422 `No puede estar vacío: envía null para borrarlo`.
- **Correo corporativo.** Se cambia, pero no se borra: `null` o `""` en `email` responden 422 `El correo corporativo es obligatorio`.
- **Cuerpo vacío:** 422 `Debe enviar al menos un campo`.

```http
PATCH /api/employees/7d0b6c0e-0a0e-4f9b-9a57-2f4b6d1c3e10
Content-Type: application/json

{ "phone": "987654321", "address": "AV. AREQUIPA 123" }
```

Responde 200 con la ficha actualizada.

- **Campos que no se editan.** `id`, `fullName`, `createdAt`, `updatedAt` y `deletedAt` responden 422.
- **Cese.** `status` o `terminationDate` responden **403**: el cese tiene su propio proceso (US-022) y no se hace editando la ficha.
- **Documento.** Si llegan `documentType` y `documentNumber` juntos, el formato se valida con el campo en `errors`. Si llega solo el número, se valida contra el tipo que ya tiene el colaborador y el 422 no trae `errors`: `El número de documento no tiene el formato válido para DNI`.
- **Reglas de la ficha.** También se validan al editar. Por ejemplo, mover `hireDate` después del `terminationDate` de un cesado responde 422.
- **Unicidad.** El documento y el código no pueden ser los de **otro** colaborador (409). Volver a enviar los propios, aunque sea con espacios, no es un conflicto.
- **Sin cambios.** Si los valores enviados son los que ya tenía, responde 200 sin escribir ni auditar, y `updatedAt` no cambia.

## `DELETE /api/employees/:id`: anulación registral

La anulación corrige un alta que **no debió existir**: un registro duplicado, una fila mal importada del Excel o alguien que nunca llegó a trabajar. **No es el cese.** Si el colaborador trabajó y dejó de hacerlo, corresponde el cese (US-022), que conserva su historial.

```json
{ "success": true, "message": "Colaborador anulado" }
```

- Solo fija `deletedAt`. La fila no se borra y `status` y `terminationDate` no cambian.
- El colaborador deja de aparecer en el listado, y el detalle, la edición y una segunda anulación responden 404.
- Su documento y su código quedan libres para volver a registrarlos.
- **Con contratos no se anula.** Si tiene al menos un contrato, anulado o no, responde 409 `El colaborador tiene contratos; si dejó de trabajar, regístralo como cese`, y no cambia nada.
- Requiere `colaborador:cesar`, el mismo permiso del cese: HR_ANALYST puede editar, pero no anular.

## Auditoría

Cada escritura exitosa deja **una** fila en `audit_logs`, en la misma transacción que la escritura: si la auditoría falla, la escritura se revierte; y si la escritura falla, no queda fila.

| Operación | `action` | `oldValues` | `newValues` |
| --- | --- | --- | --- |
| Alta | `CREATE` | `null` | Los campos con valor del colaborador nuevo |
| Edición | `UPDATE` | El valor anterior de los campos que cambiaron | Su valor nuevo |
| Anulación | `DELETE` | `{ "deletedAt": null }` | `{ "deletedAt": "<ISO>" }` |

Cada fila guarda además `actorUserId`, `ipAddress` y `correlationId` (el `X-Request-Id` de la respuesta). Las lecturas no se auditan; eso queda para US-009b.

Los valores sensibles también quedan en `audit_logs`, porque ahí se registra qué cambió. Cuando exista una consulta de auditoría, tendrá que ocultarlos a quien no tenga `colaborador:leer_sensible`.

## Pendiente en otras historias

- **US-020c:** correo corporativo único.
- **US-004d:** catálogo completo de ubigeos. Hasta entonces solo existen los cargados a mano (`tests/manual/dev-data.ts` crea el `150101`).
- **US-022:** cese del colaborador.
