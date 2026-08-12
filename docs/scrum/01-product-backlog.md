# Kontrak HRIS — Product Backlog Completo

**Proyecto:** Kontrak HRIS (Transformación del generador de contratos en HRIS completo para Perú)  
**Versión:** 1.0  
**Fecha:** 2026-07-08  
**Responsable:** Product Manager Kontrak  

---

## 1. Visión del Producto

### Elevator Pitch

Para **gerentes de RRHH y jefes de área en empresas medianas peruanas**, que **necesitan un único sistema para gestionar empleados, contratos, asistencia, planilla y seguros sin depender de múltiples SaaS desconectados**, **Kontrak HRIS es un sistema integral de Recursos Humanos** que **integra todo el ciclo de vida laboral con normativa peruana automatizada**, a diferencia de **los 4+ proveedores actuales (Payroll SaaS genérico + portal de firma + tracker de asistencia + proveedor de SCTR manual)**, **nuestro producto conecta en tiempo real: empleados → contratos → asistencia → planilla → seguros → reportes SUNAT, con una sola base de datos de verdad, reduciendo errores manuales en 90% y ahorrando 15–20 horas semanales en RRHH.**

---

## 2. Personas y Roles de Usuario

| Rol | Descripción | Necesidades clave | Permiso mínimo |
| --- | --- | --- | --- |
| **Administrador RRHH** | Responsable de toda la operación de nómina, contratos y seguros. Gestiona usuarios, accede a datos sensibles. | Crear/editar empleados y contratos, calcular planilla, ver históricos, generar reportes SUNAT, gestionar usuarios. | `SUPER_ADMIN` o `HR_ADMIN` |
| **Asistente RRHH** | Apoyo administrativo: captura de datos, control de documentos, seguimiento de procesos. Acceso limitado a datos de bajo riesgo. | Cargar empleados por lote, ver estado de contratos/documentos, crear reportes. | `HR_ANALYST` |
| **Jefe de Área / Supervisor** | Valida asistencia de su equipo, autoriza licencias/vacaciones, ve información no sensible de su división. | Aprobar solicitudes de ausencia, ver asistencia de su equipo, alertas de vencimiento de contratos del área. | `MANAGER` (scoped a su división) |
| **Empleado** | Accede a información propia: boletas, vacaciones, contratos, documentos del legajo. Autoservicio sin intervención RRHH. | Descargar boleta de pago, consultar saldo vacacional, solicitar vacaciones, ver documentos del legajo. | `EMPLOYEE` (scoped a sus datos) |
| **Gerencia / Ejecutivos** | Toman decisiones estratégicas: costo laboral, rotación, headcount, informes de compliance. | Reportes de costo, productividad laboral, ratios de rotación, cumplimiento normativo. | `MANAGER` (acceso a reportes agregados sin detalle salarial individual) |
| **Sistema (Procesos automatizados)** | Orquestación de flujos sin intervención humana: cálculos, alertas, integraciones externas (GeoVictoria, OneDrive). | Leer/escribir en BD, encolar jobs, integrar APIs externas, enviar notificaciones. | Service account sin restricción de RBAC (autenticación interna) |

---

## 3. Mapa de Épicas

| EP-# | Nombre | Fase(s) | Objetivo de Negocio | Prioridad MoSCoW | # US esperadas |
| --- | --- | --- | --- | --- | --- |
| **EP-01** | Fundaciones técnicas: BD, auth, Docker, CI | Fase 0 | Plataforma estable, segura y desplegable para todas las demás épicas. Reemplaza scripts y monolito frágil. | **MUST** | 9 |
| **EP-02** | Autenticación, RBAC y auditoría | Fase 0 | Seguridad: solo usuarios autorizados acceden a datos según su rol. Trazabilidad legal de cambios. | **MUST** | 6 |
| **EP-03** | Migración: generación de contratos y adendas | Fase 1 | Reutilizar inversión existente (templates, processors). Reducir riesgo de migración. | **MUST** | 7 |
| **EP-04** | Documentos y legajo digital | Fase 1 | Centralizar archivos de empleados (PDF contratos, certificados, DNI) con versionado e inmutabilidad. Reemplazar OneDrive desordenado. | **MUST** | 4 |
| **EP-05** | Seguros: SCTR, EPS, Ley de Vida | Fase 1 | Migrar processors SCTR/EPS/Ley de Vida. Automatizar declaraciones mensuales a aseguradoras. | **MUST** | 5 |
| **EP-06** | Maestro de empleados | Fase 2 | Fuente única de verdad de datos personales, bancarios, de pensión y histórico laboral. Base para todos los cálculos futuros. | **MUST** | 8 |
| **EP-07** | Organización (companies, sedes, puestos, divisiones) | Fase 2 | Estructurar la empresa en unidades: sedes, áreas, puestos con riesgos SCTR. Multi-RUC desde inicio. | **MUST** | 5 |
| **EP-08** | Conector GeoVictoria y gestión de asistencia | Fase 3 | Sincronizar marcaciones de reloj biométrico. Calcular tardanzas, HE y cierre de periodo (insumo de planilla). | **MUST** | 6 |
| **EP-09** | Vacaciones y licencias | Fase 3 | Cumplimiento legal: récord vacacional de 30 días/año, devengue automático, solicitudes con flujo de aprobación. | **MUST** | 5 |
| **EP-10** | Motor de planilla (régimen general + practicantes) | Fase 4 | Cálculo automático de nómina: AFP/ONP, CTS, gratificaciones, asignación familiar, 5.ª categoría, EsSalud, SCTR. Reproducir 100% exacto. | **MUST** | 12 |
| **EP-11** | Boletas y exportes PLAME/AFPnet/banco | Fase 4 | PDFs de boleta descargables, exportes de archivo bancario, envíos a SUNAT (PLAME), AFP (AFPnet), aseguradora. | **MUST** | 5 |
| **EP-12** | Reportes y PLAME | Fase 5 | Reportes Excel/PDF para gerencia (costo laboral, rotación, headcount). Exportes regulatorios (PLAME, T-Registro). | **SHOULD** | 4 |
| **EP-13** | Portal del empleado (autoservicio) | Fase 5 | Acceso 24/7 a boletas, saldo vacacional, ver documentos, solicitar ausencias. Reduce carga RRHH. | **SHOULD** | 4 |
| **EP-14** | Hardening, backups y recuperación ante desastres | Fase 6 | Backups automatizados, PITR, pruebas mensuales de restore. Cumplimiento retención 5 años. Manuales operacionales. | **MUST** | 3 |
| **EP-15** | Integraciones futuras (SSO Entra ID, firma digital externa) | Fase 6 | Investigación y API preparadas para: Entra ID login (RRHH), plataforma de firmas externa (contrato empleado). | **SHOULD** | 2 |

**Total épicas:** 15  
**Total historias esperadas:** ~85–90 (detalle varía por fase)

---

## 4. Historias de Usuario

### Nivel de Detalle Progresivo

**Importante:** Este backlog sigue una estrategia de refinamiento realista de Scrum:

- **Épicas de Fase 0 y 1:** detalle COMPLETO (narrativa + 2–5 criterios de aceptación Gherkin completos + dependencias + notas técnicas).
- **Épicas de Fase 2 y 3:** detalle MEDIO (narrativa + 2–3 criterios de aceptación Gherkin + dependencias críticas).
- **Épicas de Fase 4, 5 y 6:** detalle MINIMAL (ID, título, narrativa de una línea + prioridad MoSCoW). Se refinará cuando la fase se acerque (típicamente 2–3 sprints antes de su inicio).

La calidad de una historia se valida en grooming semanal; si llega a sprint con criterios incompletos, se bloquea hasta refinarse.

---

### EP-01: Fundaciones Técnicas — Base de Datos, Autenticación, Docker, CI

#### US-001: PostgreSQL 16 + Prisma inicializados con esquema núcleo

**Prioridad:** MUST  
**Dependencias:** Ninguna (bloqueador de todo lo demás)  
**Esfuerzo estimado:** 3–4 días

**Narrativa:**  
Como **equipo de desarrollo**, quiero **tener un motor de BD PostgreSQL 16 con el esquema núcleo documentado y migraciones Prisma versionadas**, para que **todo cambio de BD sea trazable y reversible, y el código TypeScript esté tipado contra la base de datos**.

**Criterios de aceptación:**

```gherkin
Escenario 1: Inicializar PostgreSQL y crear tablas núcleo
  Dado que ejecuto "prisma migrate dev --name init"
  Cuando las migraciones se aplican sin error
  Entonces existen las 16 tablas núcleo del esquema (companies, employees, contracts, etc.)
    Y la columna PK es "id UUID DEFAULT gen_random_uuid()" en todas
    Y los ENUMs de documento_type, contract_status, etc. están definidos
    Y no hay registro en "deleted_at" (NULL por defecto)

Escenario 2: Validar integridad referencial
  Dado que existe una empresa en "companies"
  Cuando intento insertar un "employee" sin company_id
  Entonces la BD rechaza con error FK
    Y no se crea el registro

Escenario 3: Prisma client generado con tipos
  Dado que ejecuto "prisma generate"
  Cuando abro el archivo generado "node_modules/.prisma/client/index.d.ts"
  Entonces puedo hacer type-safe queries como "await prisma.employees.findUnique({...})"
    Y el autocompletado en TypeScript da sugerencias para campos y relaciones

Escenario 4: Índices y optimización
  Dado que ejecuto una consulta que busca empleados por nombre
  Cuando se ejecuta contra un índice GIN de trigrama
  Entonces la latencia es <50ms incluso con 10.000 empleados
    Y no hay tabla full-scan en el plan EXPLAIN
```

**Notas técnicas:**

- Usar `@prisma/adapter-pg` + `pg` driver.
- Crear archivo `prisma/schema.prisma` con las 16 tablas; usar `prisma migrate dev --create-only` para inspeccionar SQL antes de aplicar.
- Agregar extensiones PostgreSQL con `CREATE EXTENSION btree_gist` en migración de seed.
- Mockear BD en tests con Testcontainers (contenedor PostgreSQL real en CI).
- No incluir datos seed reales en esta US (ver US-004 para seed de catálogos).

**Definición de Hecho:**

- [ ] `prisma/schema.prisma` compila sin errores.
- [ ] `npm run prisma:migrate:dev` crea BD fresh.
- [ ] Vitest + Testcontainers pueden correr un test que inserta un empleado.
- [ ] Documentación en `docs/database/schema.md` con diagrama ER.
- [ ] Migraciones registradas en git como archivos SQL versionados.

---

#### US-002: Docker multi-stage y docker-compose para API, worker, PostgreSQL, Redis

**Prioridad:** MUST  
**Dependencias:** US-001  
**Esfuerzo estimado:** 3 días

**Narrativa:**  
Como **DevOps / desarrollador solo**, quiero que **`docker-compose up` levante todo el stack en mi máquina o en VPS idéntico**, para que **no exista fricción entre "funciona en mi laptop" y "falla en producción"**.

**Criterios de aceptación:**

```gherkin
Escenario 1: docker-compose up levanta todo sin error
  Dado que tengo Docker y Docker Compose instalados
  Cuando ejecuto "docker-compose up --build" en el directorio raíz
  Entonces en <2 minutos: API escucha en :3000, worker procesa jobs, Postgres en :5432, Redis en :6379
    Y "docker-compose ps" muestra 4 servicios en estado "Up"
    Y no hay errores de conexión en los logs

Escenario 2: Volúmenes persistentes para datos
  Dado que docker-compose levanta PostgreSQL con volumen "db_data"
  Cuando creo datos en la BD, detengo los contenedores y ejecuto "docker-compose up" nuevamente
  Entonces los datos persisten (no se pierden)
    Y el volumen está en ".docker/volumes/db_data"

Escenario 3: Variables de entorno inyectadas
  Dado un archivo ".env.local" con DATABASE_URL, JWT_SECRET, BREVO_API_KEY
  Cuando docker-compose arranca
  Entonces cada contenedor recibe sus variables de entorno
    Y el API puede conectar a Postgres
    Y el worker puede conectar a Redis

Escenario 4: Multi-stage build reduce tamaño de imagen
  Dado que construyo "docker build -t kontrak-api:latest ."
  Cuando termina el build
  Entonces el tamaño de imagen es <400MB
    Y la imagen de producción no contiene node_modules de dev ni TypeScript source
```

**Notas técnicas:**

- Dockerfile con stage `builder` (instala deps, compila TS) + stage `runtime` (solo node y dist/).
- `docker-compose.yml` con servicios: `api`, `worker`, `postgres`, `redis`.
- Usar `COPY --chown` para permisos correctos; `USER node` (no root) en runtime.
- Healthchecks en cada servicio: `curl http://localhost:3000/health` para API.
- Archivo `.dockerignore` para excluir node_modules, .git, .env.
- No incluir Chrome/Puppeteer en imagen (usar pdfmake).

**Definición de Hecho:**

- [ ] Dockerfile multiestage sin vulnerabilidades (escanear con Trivy).
- [ ] docker-compose.yml con volúmenes nombrados y networks.
- [ ] README con instrucciones "docker-compose up" probadas en máquina limpia.
- [ ] Logs claros de cada servicio sin errores de conexión.

---

#### US-003: Validación de variables de entorno con Zod al arranque

**Prioridad:** MUST  
**Dependencias:** US-001 (necesita conocer qué variables requiere la BD)  
**Esfuerzo estimado:** 2 días

**Narrativa:**  
Como **operador del sistema**, quiero que **el servidor falle inmediatamente al arrancar si falta una variable de entorno crítica (DATABASE_URL, JWT_SECRET, BREVO_API_KEY)**, para que **no espere a la primera request para descubrirlo**.

**Criterios de aceptación:**

```gherkin
Escenario 1: Falta DATABASE_URL → falla rápido
  Dado que no existe la variable DATABASE_URL en .env
  Cuando ejecuto "npm start" o "docker-compose up"
  Entonces el proceso termina en <2 segundos con un mensaje de error claro
    Y el mensaje dice qué variables faltan y por qué son críticas
    Y el exit code es 1

Escenario 2: Valor inválido de DATABASE_URL
  Dado que DATABASE_URL="mysql://invalid" (no PostgreSQL)
  Cuando el servidor intenta conectar
  Entonces falla con un error específico: "DATABASE_URL debe ser postgresql://..."

Escenario 3: Variables opcionales con defaults sensatos
  Dado que LOG_LEVEL no está definido
  Cuando el servidor arranca
  Entonces usa el default "info"
    Y no falla

Escenario 4: Configuración cargada desde múltiples fuentes
  Dado que existen .env, .env.local, y variables del SO
  Cuando valida config al arrancar
  Entonces el orden de precedencia es: SO > .env.local > .env
    Y Zod valida el resultado final contra el schema
```

**Notas técnicas:**

- Crear `src/config/env.ts` con Zod schema: `const ConfigSchema = z.object({ DATABASE_URL: z.string().url(), ...})`.
- Invocar validación en `src/index.ts` línea 1 con `parseConfig()`, que lanza si hay error.
- Usar `process.exit(1)` si falla.
- No loguear valores sensibles (JWT_SECRET, API keys) en el log, solo presencia/ausencia.

**Definición de Hecho:**

- [ ] `src/config/env.ts` con validación Zod de al menos 15 variables críticas.
- [ ] Test que simula variable faltante y verifica exit code.
- [ ] `.env.example` con todos los templates de variables.
- [ ] Documentación en README explicando cada variable.

---

#### US-004: Seed de catálogos y datos iniciales (roles, permisos, tipos de contrato, conceptos de planilla)

**Prioridad:** MUST  
**Dependencias:** US-001, US-002  
**Esfuerzo estimado:** 2 días

**Narrativa:**  
Como **administrador que levanta un ambiente nuevo**, quiero que **al ejecutar "npm run seed" se carguen automáticamente todos los catálogos del sistema (roles, permisos, contract_types, payroll_concepts, pension_systems, ubigeo INEI)**, para que **no tenga que insertar manualmente 200 filas de configuración**.

**Criterios de aceptación:**

```gherkin
Escenario 1: Seed de roles y permisos
  Dado que ejecuto "npm run seed"
  Cuando termina sin error
  Entonces existen 5 roles en la tabla "roles": SUPER_ADMIN, HR_ADMIN, HR_ANALYST, MANAGER, EMPLOYEE
    Y cada rol tiene sus permisos asociados en "role_permissions"
    Y SUPER_ADMIN tiene todos los permisos, EMPLOYEE solo los de autoservicio

Escenario 2: Seed de tipos de contrato y conceptos de planilla
  Dado que la BD está vacía
  Cuando ejecuto el seed
  Entonces existen 6 contract_types: INDETERMINADO, SUPLENCIA, PART_TIME, INICIO_ACTIVIDAD, PRACTICANTE, NECESIDADES_MERCADO
    Y cada uno tiene su "legal_basis" con cita a D.Leg. 728 o Ley 28518
    Y existen 20+ payroll_concepts: SUELDO_BASICO, ASIG_FAM, AFP_DESCTO, ESSALUD, SCTR, CTS_DEPOSITO, etc.

Escenario 3: Seed de sistemas de pensión (AFP, ONP)
  Dado que necesito las tasas vigentes
  Cuando se ejecuta seed
  Entonces existen pension_systems: AFP_INTEGRA, AFP_PRIMA, AFP_PROFUTURO, AFP_HABITAT, ONP
    Y cada una tiene afp_rates con valid_from=2026-01-01, contribution_pct=10% (AFP) o 13% (ONP)
    Y la estructura permite agregar tasas versionadas sin eliminar las viejas

Escenario 4: Seed de ubigeo INEI
  Dado que seed carga catálogo de ubicaciones
  Cuando consulto "SELECT * FROM ubigeo WHERE department = 'LIMA'"
  Entonces existen ~45 distritos de Lima con sus códigos INEI
    Y puedo usar ubigeo_id en direcciones de empleados/empresas

Escenario 5: Seed idempotente (se ejecuta 2 veces sin fallar)
  Dado que ejecuto "npm run seed" dos veces seguidas
  Cuando la segunda ejecución termina
  Entonces no hay duplicados (UNIQUE constraints previenen)
    Y el resultado es idéntico a la primera ejecución
```

**Notas técnicas:**

- Crear archivo `prisma/seed.ts` que importa Prisma.
- No incluir datos reales de empleados (eso viene en US-006: importador de Excel).
- Ubigeo: cargar desde CSV o JSON en `src/assets/ubigeo.json` (gobierno INEI público).
- Usar `upsert` en lugar de create para idempotencia.

**Definición de Hecho:**

- [ ] `prisma/seed.ts` compilado y sin errores TypeScript.
- [ ] `npm run seed` carga en <10 segundos.
- [ ] `package.json` con script `"seed": "prisma db seed"`.
- [ ] Datos de seed incluyen UIT 2026 ($4,600) y RMV ($1,500) como parámetros.
- [ ] Test que verifica conteos mínimos post-seed.

---

#### US-005: Esqueleto de módulos (carpeta `src/modules`, `src/platform`) y estructura hexagonal

**Prioridad:** MUST  
**Dependencias:** Ninguna (paralelo a US-001)  
**Esfuerzo estimado:** 1 día

**Narrativa:**  
Como **arquitecto del proyecto**, quiero que **la carpeta `src/` esté reorganizada en `modules/{dominio}/{domain,application,infrastructure,api}` + `platform/{database,http,queue,storage,logger}` + `shared`**, para que **sea imposible mezclar dependencias, los límites de dominio sean visuales e impuestos por linter**.

**Criterios de aceptación:**

```gherkin
Escenario 1: Estructura de directorios creada
  Dado que ejecuto "find src/modules -type d"
  Cuando lista el árbol
  Entonces existen carpetas: modules/{contracts,documents,insurance,auth,employees}
    Y cada módulo tiene subcarpetas: domain/, application/, infrastructure/, api/
    Y existen platform/{database,http,queue,storage,logger}
    Y existe shared/ con tipos genéricos

Escenario 2: Regla ESLint de límites de módulos
  Dado que tengo eslint-plugin-boundaries configurado
  Cuando intento importar "import { Foo } from 'src/modules/employees/infrastructure/...'"
  Entonces eslint FALLA, porque desde otro módulo solo se debe importar desde "modules/employees/index.ts"

Escenario 3: Archivo index.ts de cada módulo como API pública
  Dado que soy desarrollador del módulo "contracts"
  Cuando exporto solo lo que quiero desde "modules/contracts/index.ts" (tipos y servicios públicos)
  Entonces otros módulos hacen "import { ContractService } from '@modules/contracts'"
    Y no pueden acceder a "ContractRepository" directamente

Escenario 4: Platform no conoce los módulos
  Dado que código en platform/
  Cuando lo inspecciono
  Entonces no hay import de módulos específicos (contracts, employees, etc.)
    Y platform es agnóstico del negocio, reutilizable
```

**Notas técnicas:**

- Configurar path aliases en `tsconfig.json`: `@modules/*`, `@platform/*`, `@shared/*`.
- Crear `.eslintrc.js` con regla `eslint-plugin-boundaries`.
- Empezar con módulos vacíos para Fase 1 (contracts) y mantener código antiguo en `legacy/` para no romper nada.

**Definición de Hecho:**

- [ ] Todas las carpetas creadas vacías.
- [ ] ESLint configurado y pasa `npm run lint` (regla de límites no lo rompe).
- [ ] README en `src/modules/` explicando la arquitectura.
- [ ] Archivo `src/index.ts` limpio sin lógica, solo orquestación de módulos.

---

#### US-006: Servidor HTTP básico con middlewares globales (auth, CORS, error handler, logging)

**Prioridad:** MUST  
**Dependencias:** US-003 (necesita config), US-005 (estructura)  
**Esfuerzo estimado:** 2 días

**Narrativa:**  
Como **desarrollador que agrega endpoints**, quiero que **exista un servidor Express ya configurado con middlewares de logging (Pino), CORS, manejo de errores centralizado (RFC 7807), rate limiting y autenticación JWT**, para que **no tenga que copypastear middleware en cada módulo**.

**Criterios de aceptación:**

```gherkin
Escenario 1: Servidor HTTP escucha correctamente
  Dado que ejecuto "npm start"
  Cuando hago GET http://localhost:3000/health
  Entonces responde con JSON: { status: "up", uptime: "..." }
    Y HTTP 200

Escenario 2: Logging con Pino en cada request
  Dado que llegan 3 requests al servidor
  Cuando inspecciono los logs
  Entonces veo 3 líneas JSON con: method, path, statusCode, duration_ms, requestId
    Y en desarrollo se ve con colores (pino-pretty)
    Y en producción es JSON puro (ECS compatible)

Escenario 3: Error handler centralizado RFC 7807
  Dado que un endpoint lanza new AppError('Campo inválido', 400)
  Cuando el cliente recibe la respuesta
  Entonces es JSON con: { type, title, status, detail, instance, errors: [...] }
    Y statusCode HTTP coincide con status en payload

Escenario 4: CORS configurado
  Dado que el frontend en localhost:5173 hace un CORS preflight
  Cuando la solicitud llega al servidor
  Entonces Access-Control-Allow-Origin contiene localhost:5173 (o configurado)
    Y no falla con error CORS

Escenario 5: Rate limiting en endpoints pesados
  Dado que el endpoint POST /api/contracts/generate-batch tiene rate limit 3 req/min
  Cuando envío 4 requests en 10 segundos
  Entonces la 4.ª request recibe HTTP 429 Too Many Requests
    Y el header Retry-After dice cuándo reintentar
```

**Notas técnicas:**

- Archivo `platform/http/server.ts` que construye app Express.
- Middleware order: `morgan` → `json` → `requestId` (AsyncLocalStorage) → `pino-http` → `cors` → `helmet` → rutas → error handler.
- Error handler debe capturar `AppError` typed y genérico `Error`, loguear y responder RFC 7807.
- Rate limiting con `express-rate-limit`, keyed by IP o JWT sub.

**Definición de Hecho:**

- [ ] `npm start` levanta servidor en puerto 3000.
- [ ] GET /health retorna 200.
- [ ] Tests con Supertest verifican: logging, CORS, error handler, rate limit.
- [ ] Documentación en `docs/http/middleware.md`.

---

### EP-02: Autenticación, RBAC y Auditoría

#### US-007: JWT access token (15 min) + refresh token rotativo con persistencia en BD

**Prioridad:** MUST  
**Dependencias:** US-001, US-006  
**Esfuerzo estimado:** 3 días

**Narrativa:**  
Como **usuario del sistema**, quiero **autenticarme con email/contraseña, recibir un access token corta vida (15 min) y un refresh token persistido en BD**, para que **si revoco el refresh token, la sesión se cierre forzosamente (ej. al cesar un empleado)**.

**Criterios de aceptación:**

```gherkin
Escenario 1: Login exitoso
  Dado que existe usuario con email="maria@empresa.com" y contraseña hasheada
  Cuando POST /auth/login con { email, password }
  Entonces responde HTTP 200 con { accessToken: "eyJ...", refreshToken: "ref_...", expiresIn: 900 }
    Y accessToken es JWT con: { sub (user_id), email, permissions: [...], iat, exp: ahora+15min }
    Y refreshToken es UUID aleatorio, almacenado en tabla "refresh_tokens" con hasheado
    Y la cookie httpOnly "refreshToken" contiene solo el JWT (no legible desde JS)

Escenario 2: Refresh token expirado o revocado
  Dado que POST /auth/refresh con un refreshToken revocado
  Cuando se invoca
  Entonces HTTP 401 Unauthorized
    Y el cliente debe hacer login nuevamente

Escenario 3: Access token expirado, pero refresh válido
  Dado que accessToken expiró y refreshToken sigue vigente
  Cuando POST /auth/refresh
  Entonces recibo nuevo accessToken y nuevo refreshToken
    Y el refreshToken anterior se marca como revoked (no puedo reusar)

Escenario 4: Revocar todas las sesiones de un usuario
  Dado que ejecuto DELETE /users/:id/sessions (admin)
  Cuando se aplica
  Entonces todos los refresh_tokens de ese usuario se marcan como revoked
    Y los access tokens existentes dejan de ser válidos en la siguiente request

Escenario 5: Contraseña incorrecta
  Dado que POST /auth/login con contraseña incorrecta
  Cuando se envía
  Entonces HTTP 401 y no revela si existe el usuario (para no enumerar)
```

**Notas técnicas:**

- Usar `jsonwebtoken` (ya instalado) para crear JWT.
- Contraseñas hasheadas con `bcryptjs` o `argon2id` (mejor, pero bcryptjs es más común).
- Tabla `refresh_tokens` con PK compuesto (user_id, token_hash) + `revoked_at` nullable.
- Access token NO persistido (stateless), refresh SÍ persistido (stateful, revocable).
- Cookie httpOnly + secure en producción; SameSite=Strict.

**Definición de Hecho:**

- [x] Endpoint POST /auth/login testeado con Supertest.
- [x] Endpoint POST /auth/refresh testeado con token expirado y válido.
- [x] Endpoint DELETE /users/:id/sessions revoca todas las sesiones.
- [x] Tests verifican hasheo de contraseña (nunca en texto plano).
- [x] Documentación JWT en `docs/auth/jwt.md`.

---

#### US-008: RBAC con permisos granulares (recurso:acción) y middleware de protección

**Prioridad:** MUST  
**Dependencias:** US-007  
**Esfuerzo estimado:** 2 días

**Narrativa:**  
Como **administrador**, quiero **asignar roles a usuarios (SUPER_ADMIN, HR_ADMIN, MANAGER, EMPLOYEE) y cada rol tenga un conjunto configurable de permisos** (e.g. `payroll:calculate`, `employees:read`), para que **el acceso a recursos sea controlado y auditado, con dos capas: middleware de permiso + filtro de alcance en el caso de uso**.

**Criterios de aceptación:**

```gherkin
Escenario 1: Middleware de protección de permiso
  Dado que un endpoint usa @requirePermission('employees:write')
  Cuando usuario con rol EMPLOYEE intenta acceder (permiso ausente)
  Entonces HTTP 403 Forbidden y responde { detail: "No tienes permiso employees:write" }

Escenario 2: Jefe de área solo ve su área
  Dado que usuario es MANAGER de DIVISIÓN="Estacionamientos"
  Cuando solicita GET /employees?division=Estacionamientos
  Entonces ve solo empleados de esa división (no todos)
    Y si intenta filtrar por otra división, middleware rechaza o devuelve vacío

Escenario 3: Empleado solo ve sus propios datos
  Dado que usuario loggeado es empleado con employee_id=123
  Cuando solicita GET /employees/123/payslips
  Entonces accede (es el suyo)
    Y cuando solicita GET /employees/456/payslips
    Entonces HTTP 403 (no es el suyo)

Escenario 4: Roles editables en BD sin redeployar
  Dado que administrador modifica tabla "role_permissions" agregando permiso `reports:export`
  Cuando un usuario con ese rol hace logout/login
  Entonces obtiene el nuevo permiso en el access token siguiente
```

**Notas técnicas:**

- Tabla `users` + `roles` + `permissions` + `role_permissions` + `user_roles` (con scope opcional por company_id).
- Middleware `requirePermission(code)` que lee `req.user.permissions` (array en JWT).
- Casos de uso deben hacer filtro adicional de alcance (no solo middleware).
- Nunca confiar en claims del JWT solos; re-validar alcance en la capa de aplicación.

**Definición de Hecho:**

- [x] Tablas RBAC creadas con seed de 5 roles + 29 permisos.
- [ ] Middleware `requirePermission` probado con tests.
- [ ] Filtro de alcance implementado en repositorios (Prisma).
- [ ] Test E2E: MANAGER intenta leer salario de otra división, rechazado.

---

#### US-009: Auditoría de cambios sensibles (creación, cambio de datos, cambios de rol)

**Prioridad:** MUST  
**Dependencias:** US-001 (tabla audit_logs), US-007 (req.user)  
**Esfuerzo estimado:** 2 días

**Narrativa:**  
Como **oficial de cumplimiento**, quiero **que cada cambio en datos sensibles (empleados, sueldos, roles, contratos) se registre en audit_logs con quién, cuándo, qué cambió de antes a después**, para que **auditoría externa o interna pueda investigar cualquier anomalía**.

**Criterios de aceptación:**

```gherkin
Escenario 1: Crear empleado genera entrada de auditoría
  Dado que POST /employees con datos de nuevo empleado
  Cuando se crea exitosamente
  Entonces INSERT en audit_logs: action=CREATE, table_name=employees, record_id=<id>, new_data={...}, user_id=<quien creo>, ip=<IP>

Escenario 2: Cambiar sueldo registra antes y después
  Dado que PATCH /employees/123 con salary: 5000 → 6000
  Cuando se aplica
  Entonces audit_logs registra: old_data={salary:5000}, new_data={salary:6000}

Escenario 3: Cambio de rol es auditable
  Dado que PATCH /users/456/roles agregando "HR_ADMIN"
  Cuando se aplica
  Entonces audit_logs registra la nueva lista de roles

Escenario 4: Auditoría no ralentiza requests
  Dado que un endpoint sin auditoría crítica tarda 50ms
  Cuando se agregan triggers de auditoría
  Entonces sigue tardando ~50–60ms (no es bottleneck)
```

**Notas técnicas:**

- Usar triggers PostgreSQL AFTER INSERT/UPDATE/DELETE en tablas sensibles.
- Trigger lee `current_setting('app.current_user_id')` inyectado por Prisma middleware.
- `audit_logs` con columnas: `user_id`, `action`, `table_name`, `record_id`, `old_data`, `new_data`, `ip`, `occurred_at`.
- Particionado por mes (trigger + mantenimiento automático).
- No loguear PII completa en old_data, solo campos que cambiaron.

**Definición de Hecho:**

- [ ] Triggers creados en migración Prisma.
- [ ] Tabla audit_logs poblada después de operaciones CRUD.
- [ ] API GET /audit-logs?table=employees&record_id=123 para investigación.
- [ ] Test que verifica INSERT/UPDATE/DELETE generan entradas.

---

#### US-010: Recuperación de contraseña y cambio seguro

**Prioridad:** SHOULD  
**Dependencias:** US-007  
**Esfuerzo estimado:** 2 días

**Narrativa:**  
Como **empleado que olvidó su contraseña**, quiero **enviar POST /auth/forgot-password y recibir un email con un link de recuperación** que **expira en 1 hora**, para que **pueda setear una nueva contraseña sin intervención de admin**.

**Criterios de aceptación:**

```gherkin
Escenario 1: Solicitud de recuperación
  Dado que POST /auth/forgot-password con email="maria@empresa.com"
  Cuando se procesa
  Entonces HTTP 200 (no revela si existe el email)
    Y se envía email con link: https://app/reset?token=<token_hash>
    Y token es UUID con 1 hora de vigencia

Escenario 2: Token inválido o expirado
  Dado que intento usar link con token expirado
  Cuando lo sigo
  Entonces HTTP 401 y puedo iniciar nuevo reset

Escenario 3: Cambio de contraseña
  Dado que tengo token válido
  Cuando POST /auth/reset-password con token, password_new, password_confirm
  Entonces contraseña se actualiza
    Y se borra el token (no se puede reusar)
    Y sesiones activas se revocan (logout forzado)
```

**Notas técnicas:**

- Tabla `password_resets` con token_hash, user_id, expires_at.
- Email desde Brevo (ya integrado).
- Frontend no está en scope, pero backend debe servir una página simple de reset si es SPA.

**Definición de Hecho:**

- [ ] Endpoint POST /auth/forgot-password.
- [ ] Endpoint POST /auth/reset-password con token validation.
- [ ] Email enviado verificado en test (mockeado).

---

### EP-03: Migración — Generación de Contratos y Adendas

#### US-011: Puerto FileStorage y adaptador OneDrive

**Prioridad:** MUST  
**Dependencias:** US-005 (estructura), US-002 (docker-compose)  
**Esfuerzo estimado:** 3 días

**Narrativa:**  
Como **desarrollador de documentos**, quiero **una interfaz única `FileStorage` con métodos `put()`, `getStream()`, `delete()`, `getSignedUrl()` implementada por adaptadores concretos (OneDrive, local, S3)**, para que **el código de negocio no dependa de OneDrive específicamente y sea fácil testear sin Azure**.

**Criterios de aceptación:**

```gherkin
Escenario 1: Interfaz FileStorage agnóstica
  Dado que defino "interface FileStorage { put(key, buffer), getStream(key), delete(key), getSignedUrl(key) }"
  Cuando la implemento en OneDriveStorageAdapter y LocalStorageAdapter
  Entonces ambas satisfacen el contrato
    Y el código de negocio usa solo la interfaz, no la clase concreta

Escenario 2: Poner archivo en OneDrive
  Dado que ejecuto "await storage.put('contratos/2026/contrato_123.pdf', pdfBuffer)"
  Cuando se carga exitosamente
  Entonces el archivo aparece en OneDrive/contratos/2026/
    Y devuelve { path: "driveItem_id", size: 123456 }

Escenario 3: Obtener stream para descarga
  Dado que ejecuto "const stream = await storage.getStream('contratos/2026/contrato_123.pdf')"
  Cuando lo consumo
  Entonces es un stream legible que puedo pipeai a response
    Y no cargo todo en memoria

Escenario 4: Adaptor local para tests
  Dado que en tests uso LocalStorageAdapter que escribe en /tmp
  Cuando pongo un archivo
  Entonces se crea en filesystem local sin depender de Azure

Escenario 5: Errores manejados consistentemente
  Dado que intento getStream() de un archivo que no existe
  Cuando se invoca
  Entonces lanza error tipado: { code: 'NOT_FOUND', message: '...' }
```

**Notas técnicas:**

- Crear `platform/storage/port.ts` con interfaz.
- `platform/storage/adapters/onedrive.adapter.ts` envolviendo `OneDriveProvider` actual.
- `platform/storage/adapters/local.adapter.ts` escribiendo a `/tmp` o carpeta configurable.
- Metadatos siempre en Postgres (documento.ts con hash, mime, tamaño, storage_provider, storage_path).

**Definición de Hecho:**

- [ ] Interfaz FileStorage definida en TS.
- [ ] OneDriveStorageAdapter implementado (wrapping código existente).
- [ ] LocalStorageAdapter para tests.
- [ ] Tests de ambos adaptadores con Vitest.

---

#### US-012: Migración Puppeteer → pdfmake (completar)

**Prioridad:** MUST  
**Dependencias:** US-011  
**Esfuerzo estimado:** 5 días

**Narrativa:**  
Como **equipo de DevOps**, quiero **reemplazar Puppeteer (que requiere Chrome/Chromium, +400MB en Docker) con pdfmake (librería pura JS)**, para que **las imágenes Docker sean más pequeñas, rápidas y no requieran `--no-sandbox`**.

**Criterios de aceptación:**

```gherkin
Escenario 1: PDFs generados con pdfmake idénticos a Puppeteer
  Dado que tengo contrato con datos: empleado, puesto, sueldo, etc.
  Cuando genero PDF con pdfmake (en lugar de Puppeteer)
  Entonces el PDF visual es idéntico o muy similar al generado por Puppeteer
    Y se descarga sin error

Escenario 2: Plantillas ported a pdfmake
  Dado que templates.ts (3,000 líneas) contiene HTML Handlebars
  Cuando convierto a pdfmake format (definición de documento JSON)
  Entonces todos los tipos de documento funcional: contrato, adenda, anexo, carta no-sujeto

Escenario 3: Performance mejor que Puppeteer
  Dado que genero 10 PDFs en lote
  Cuando se ejecuta con pdfmake
  Entonces tarda <10 segundos (antes tardaba 30–40s con Puppeteer)
    Y no requiere browser-singleton ni locks de Chromium

Escenario 4: Docker sin Chrome
  Dado que Dockerfile no tiene "install chromium"
  Cuando se construye
  Entonces imagen <250MB (antes era >400MB)
```

**Notas técnicas:**

- Usar `pdfmake` v10+ (ya en devDependencies).
- Convertir Handlebars + HTML a definición de documento pdfmake (arrays y objetos JS).
- Crear `platform/pdf/pdfmake.generator.ts` con métodos `generateContractPdf(data): Buffer`.
- Eliminar `infrastructure/browser/` y referencias a Puppeteer.
- Archivo `docs/migration_to_pdfmake.md` ya existe; completarlo.

**Definición de Hecho:**

- [ ] `platform/pdf/pdfmake.generator.ts` compilado.
- [ ] Todos los tipos de contrato generados sin error.
- [ ] PDF visual pass (inspección manual de 3 documentos tipo).
- [ ] Performance benchmark: 10 PDFs en <10s.
- [ ] Docker sin Chromium.

---

#### US-013: Capa de aplicación: ContractGenerationService como caso de uso

**Prioridad:** MUST  
**Dependencias:** US-011, US-012  
**Esfuerzo estimado:** 2 días

**Narrativa:**  
Como **módulo de contratos**, quiero **un servicio de aplicación `ContractGenerationService` que coordine: validación de datos, selección de plantilla, generación de PDF, almacenamiento en FileStorage y registro en BD**, para que **el controlador HTTP sea delgado y toda la lógica esté testeable sin HTTP**.

**Criterios de aceptación:**

```gherkin
Escenario 1: Generar contrato unitario
  Dado que llamo "contractService.generateContract(employeeId, contractTypeId)"
  Cuando retorna
  Entonces: 1) valida que empleado existe y contrato type es válido
    2) carga plantilla versionada de BD
    3) genera PDF con pdfmake
    4) almacena en OneDrive (FileStorage)
    5) registra entrada en generated_documents con hash SHA256
    Y retorna { documentId, storagePath, fileName }

Escenario 2: Generación en lote desde JSON (flujo actual Excel)
  Dado que llamo "contractService.generateBatch(empleados: EmployeePayload[])"
  Cuando se procesa
  Entonces: 1) valida cada fila (Zod)
    2) enqeuea job BullMQ con los empleados validados
    Y retorna jobId inmediatamente (202 Accepted)

Escenario 3: Consultar estado de job
  Dado que tengo jobId
  Cuando GET /jobs/:jobId
  Entonces retorna { status: 'processing' | 'completed' | 'failed', progress: 8/20, errors: [...] }

Escenario 4: Manejo de errores granular
  Dado que PDF generation falla (memory error)
  Cuando se procesa
  Entonces: 1) el job se marca como failed
    2) se registra el error específico (no genérico)
    3) email de notificación a RRHH con detalles
```

**Notas técnicas:**

- `modules/contracts/application/contract-generation.service.ts`.
- Delega en `platform/pdf/pdfmake.generator.ts` para PDF.
- Delega en `platform/storage` para almacenamiento.
- Enqeuea con `platform/queue/bull.service.ts`.
- `domain/contracts/entities/contract.ts` con validaciones de negocio puras.

**Definición de Hecho:**

- [ ] `ContractGenerationService` implementado.
- [ ] Tests unitarios de validación sin BD.
- [ ] Tests de integración con Testcontainers (Postgres + Redis).
- [ ] Endpoint POST /contracts/generate → enqeuea job.

---

#### US-014: Orquestador de ingestión OneDrive y procesamiento de archivos

**Prioridad:** MUST  
**Dependencias:** US-011, US-013, BullMQ básico  
**Esfuerzo estimado:** 3 días

**Narrativa:**  
Como **sistema de documentos**, quiero **un job repetible cada N minutos que: 1) scan carpeta OneDrive "subir excel", 2) descarga cada Excel, 3) lo valida, 4) lo registra en import_batches, 5) enqeuea job de procesamiento (contratos/adendas), 6) notifica RRHH de resultados**, para que **el flujo actual siga funcionando pero con trazabilidad en BD y sin borrar archivos en error**.

**Criterios de aceptación:**

```gherkin
Escenario 1: Job ingestión OneDrive ejecutado cada 10 min
  Dado que BullMQ está configurado
  Cuando se ejecuta el job "ingest-onedrive-files" cada 10 min
  Entonces: 1) lista archivos en "subir excel" de OneDrive
    2) para cada Excel nuevo, descarga
    3) registra en import_batches(file_name, sha256, kind, status='processing')

Escenario 2: Detectar tipo de Excel (contratos vs adendas)
  Dado que descargo un Excel
  Cuando inspecciono encabezados
  Entonces detecta: "CONTRATOS" (si tiene columnas típicas) o "ADENDAS" (si tiene estructura de adenda)
    Y lo registra en import_batches(kind='CONTRATOS'|'ADENDAS')

Escenario 3: Validar sin borrar
  Dado que Excel tiene fila con error de validación (DNI inválido)
  Cuando se procesa
  Entonces: 1) registra el error en import_batch_rows
    2) envía email a RRHH con detalle de errores
    3) NO borra el Excel original de OneDrive (permite reintento manual)

Escenario 4: Éxito registra todos los artefactos generados
  Dado que Excel procesado exitosamente genera 10 contratos + 2 anexos
  Cuando termina
  Entonces: 1) import_batches.status='completed', ok_rows=10, error_rows=0
    2) generated_documents tiene 12 registros apuntando a archivos en OneDrive
    3) email de éxito con contadores

Escenario 5: Reintentos automáticos en falla temporal
  Dado que job falla por conexión a OneDrive (throttling)
  Cuando se ejecuta
  Entonces BullMQ reintenta 3 veces con backoff exponencial
    Y notifica solo después del 3.er intento fallido
```

**Notas técnicas:**

- Job repetible con BullMQ: `bull.addRepeatableJob('ingest-onedrive', every: 10 * 60 * 1000)`.
- Tabla `import_batches` con status: PROCESSING, COMPLETED, FAILED.
- Tabla `import_batch_rows` con raw_data, errors JSONB por fila.
- No lanzar browser Puppeteer en scheduler (está centralizado en platform/pdf).
- Política de borrado: nunca borrar en error; opcional borrar en success después de N días.

**Definición de Hecho:**

- [ ] Job "ingest-onedrive" en worker.
- [ ] import_batches y import_batch_rows pobladas en tests.
- [ ] Email de notificación enviado (verificado en tests con mock).
- [ ] E2E test: subo Excel a OneDrive, espero 15 min, verifico import_batches.status='completed'.

---

#### US-015: Adendas como casos de uso separados

**Prioridad:** MUST  
**Dependencias:** US-013, US-014  
**Esfuerzo estimado:** 2 días

**Narrativa:**  
Como **módulo de contratos**, quiero **un servicio `AddendumGenerationService` que maneje la creación de adendas (suplencia, incremento de actividad, cambio de sueldo)** con **validaciones específicas: solapamiento de fechas, continuidad del contrato base**, para que **sea independiente de la generación de contratos y testeable por separado**.

**Criterios de aceptación:**

```gherkin
Escenario 1: Generar adenda válida
  Dado que contrato existe con vigencia 2026-01-01 a 2026-12-31
  Cuando creo adenda de tipo SUPLENCIA con vigencia 2026-06-01 a 2026-08-31
  Entonces: 1) se valida que está dentro del contrato
    2) se genera PDF de adenda
    3) se registra en contract_addendums con sequence_number

Escenario 2: Adenda no se solapa con otra
  Dado que contrato ya tiene adenda 1 en 2026-06-01 a 2026-06-30
  Cuando intento crear adenda 2 en 2026-06-15 a 2026-07-15
  Entonces rechaza: "Adenda se solapa con adenda anterior"

Escenario 3: Adenda de incremento de actividad tiene tope de 36 meses
  Dado que creo adenda tipo INCREMENTO_ACTIVIDAD
  Cuando intento set end_date > inicio + 36 meses
  Entonces rechaza: "Incremento de actividad no puede exceder 36 meses"
```

**Notas técnicas:**

- `modules/contracts/application/addendum-generation.service.ts`.
- Validación con EXCLUDE constraint en BD (vigencias no solapadas).
- Enumeración de tipos: SUPLENCIA, INCREMENTO_ACTIVIDAD, PRORROGA, CAMBIO_REMUNERACION, CAMBIO_PUESTO.

**Definición de Hecho:**

- [ ] `AddendumGenerationService` con validaciones.
- [ ] Tests de solape de fechas y límite de 36 meses.
- [ ] Endpoint POST /contracts/:id/addendums.

---

### EP-04: Documentos y Legajo Digital

#### US-016: Modelo de documentos y metadata en BD

**Prioridad:** MUST  
**Dependencias:** US-001  
**Esfuerzo estimado:** 1 día

**Narrativa:**  
Como **módulo de documentos**, quiero **una tabla `generated_documents` con metadatos de cada PDF/Excel generado: tipo, referencia a entidad, hash SHA256, fecha, creador, storage provider y path**, para que **tenga trazabilidad completa del flujo y pueda identificar duplicados por hash**.

**Criterios de aceptación:**

```gherkin
Escenario 1: Registrar contrato generado
  Dado que genero contrato PDF
  Cuando se almacena exitosamente
  Entonces INSERT en generated_documents: kind='CONTRATO', entity_table='contracts', entity_id=<uuid>, 
    storage_provider='ONEDRIVE', storage_path='driveItem/...' , sha256='...', created_by=<user_id>

Escenario 2: Identificar duplicados por hash
  Dado que genero el mismo contrato dos veces
  Cuando consulto "SELECT * FROM generated_documents WHERE sha256='...'"
  Entonces encuentro 2 registros
    Y puedo detectar que fueron creados (para no generar nuevamente)

Escenario 3: Legajo por empleado
  Dado que GET /employees/:id/documents
  Cuando consulto
  Entonces veo todos los documentos del empleado (contratos, anexos, certificados, boletas)
    Y ordena por fecha DESC
```

**Notas técnicas:**

- Tabla `generated_documents` con: id, company_id, kind (enum), entity_table, entity_id, employee_id FK, file_name, mime_type, size_bytes, sha256 CHAR(64), storage_provider, storage_path, generation_snapshot JSONB, created_at, created_by.
- Índice en (entity_table, entity_id) para queries rápidas.
- SHA256 de binario calculado en plataforma/pdf o plataforma/storage.

**Definición de Hecho:**

- [ ] Tabla created en migración Prisma.
- [ ] Test de insert y query por hash.

---

#### US-017: Upload de documentos del legajo (DNI, certificados, CV)

**Prioridad:** SHOULD  
**Dependencias:** US-011, US-016  
**Esfuerzo estimado:** 2 días

**Narrativa:**  
Como **asistente RRHH**, quiero **subir documentos del legajo (DNI escaneado, certificado de estudios, CV) por empleado mediante un formulario**, para que **tengan versionado en OneDrive y acceso desde el portal del empleado**.

**Criterios de aceptación:**

```gherkin
Escenario 1: Upload de documento con tipo y expiry
  Dado que POST /employees/:id/documents con file (PDF, DNI escaneado) y document_kind='DNI_SCAN'
  Cuando se sube
  Entonces: 1) valida MIME type (solo PDF, PNG, JPG)
    2) limita tamaño (máx 10MB)
    3) almacena en OneDrive/legajo/:employee_id/
    4) registra en employee_documents(employee_id, document_kind, file_name, storage_path, expires_at)
    Y retorna { documentId, expiryDate }

Escenario 2: Alertas de vencimiento
  Dado que documento tiene expires_at=2026-08-31
  Cuando corro job diario de alertas (10 días antes)
  Entonces envía notificación a RRHH: "Carné de :employee hace vencimiento"

Escenario 3: Empleado ve su legajo
  Dado que GET /employees/me/documents (loggeado como empleado)
  Cuando consulta
  Entonces ve sus documentos sin poder borrar
    Y puede descargar PDF
```

**Notas técnicas:**

- Tabla `employee_documents` con (employee_id, document_kind, file_name, storage_path, uploaded_at, expires_at, created_by).
- Middelware Multer con límite 10MB y whitelist MIME.
- No borrar documento, marcar como superseded si se sube uno nuevo del mismo kind.

**Definición de Hecho:**

- [ ] Endpoint POST /employees/:id/documents.
- [ ] Validación de MIME y tamaño.
- [ ] Test de upload y descarga.

---

### EP-05: Seguros — SCTR, EPS, Ley de Vida

#### US-018: Pólizas y cobertura de empleados

**Prioridad:** MUST  
**Dependencias:** US-001 (tablas insurance_policies, employee_insurances)  
**Esfuerzo estimado:** 2 días

**Narrativa:**  
Como **administrador de seguros**, quiero **gestionar pólizas (SCTR salud/pensión, EPS, Ley de Vida) con vigencias y dar de alta/baja empleados en cada póliza**, para que **el sistema sepa qué empleado está cubierto en qué seguro en cada fecha (para reportes mensuales a aseguradora)**.

**Criterios de aceptación:**

```gherkin
Escenario 1: Crear póliza SCTR
  Dado que POST /insurance/policies con provider_id, kind='SCTR_SALUD', policy_number='0123456', start_date=2026-01-01, end_date=2026-12-31
  Cuando se crea
  Entonces registra en insurance_policies
    Y puedo associar empleados luego

Escenario 2: Alta de empleado en póliza
  Dado que POST /insurance/policies/:id/enrollments con employee_id, start_date, declared_salary
  Cuando se crea
  Entonces INSERT en employee_insurances
    Y EXCLUDE constraint previene solapamiento de coberturas del mismo tipo

Escenario 3: Baja de empleado (cese)
  Dado que DELETE /insurance/enrollments/:id
  Cuando se ejecuta (con end_date=hoy)
  Entonces se marca como ended (soft-delete)
    Y no aparece en reportes del mes siguiente

Escenario 4: Vigencia de póliza no se solapa
  Dado que SCTR tiene póliza 1: 2026-01-01 a 2026-06-30, póliza 2: 2026-07-01 a 2026-12-31
  Cuando consulto empleados cubiertos por SCTR en 2026-05-15
  Entonces retorna empleados bajo póliza 1
```

**Notas técnicas:**

- Tabla `insurance_providers` con nombre, ruc, email de contacto (para reportes).
- EXCLUDE USING gist en (employee_id, policy_id, daterange) para prevenir solapamiento.
- `declared_salary` por enrollment (puede variar con adendas, se snapshotea en reporte mensual).

**Definición de Hecho:**

- [ ] Endpoints CRUD de pólizas y enrollments.
- [ ] Test de EXCLUDE constraint.

---

#### US-019: Generación de reportes SCTR y envío a aseguradora

**Prioridad:** MUST  
**Dependencias:** US-018, US-014 (procesamiento asíncrono)  
**Esfuerzo estimado:** 3 días

**Narrativa:**  
Como **asistente de seguros**, quiero **ejecutar un reporte mensual SCTR que genere Excel con empleados cubiertos, sueldos y riesgo (hoy lo hace manualmente), enviar por email a la aseguradora**, para que **sea 100% automático y auditable en BD**.

**Criterios de aceptación:**

```gherkin
Escenario 1: Generar reporte SCTR de período
  Dado que POST /insurance/reports/sctr con year=2026, month=7
  Cuando se invoca
  Entonces: 1) enqeuea job BullMQ
    2) retorna HTTP 202 con jobId

Escenario 2: Job genera Excel con estructura de aseguradora
  Dado que job procesa
  Cuando termina
  Entonces: 1) Excel tiene columnas: DNI, Nombres, Sueldo, Riesgo (ALTO/BAJO), Cobertura Salud, Cobertura Pensión
    2) incluye solo empleados vigentes en el período
    3) suma sueldos por riesgo
    4) se registra en sctr_declarations(policy_id, period_year/month, employees_count, total_declared_salary)

Escenario 3: Email enviado a aseguradora
  Dado que job completa generación
  Cuando termina
  Entonces: 1) email enviado a insurance_policies.provider.contact_email
    2) adjunto es el Excel
    3) se registra en email_logs(kind='SCTR_DECLARATION', to, status='sent', sent_at)

Escenario 4: Reporte se regenera si se añaden empleados
  Dado que genero reporte para julio, luego agrego un empleado al 15/7
  Cuando regenero el reporte
  Entonces incluye al nuevo empleado
    Y se sobrescribe la declaration anterior
```

**Notas técnicas:**

- Reutilizar `SctrReportProcessor` de la capa actual como `sctr.report-generator.ts`.
- Job enqeudo desde endpoint, estado consultable vía GET /jobs/:jobId.
- `sctr_declarations` con documento_id FK a `generated_documents` (trazabilidad).

**Definición de Hecho:**

- [ ] Endpoint POST /insurance/reports/sctr.
- [ ] Job genera Excel con estructura correcta.
- [ ] Email enviado (verificado en mock).
- [ ] Test E2E: carga empleados, genera reporte, verifica contenido Excel.

---

### FASES 2 y 3 — Detalle MEDIO

#### US-020 a US-030: EP-06 (Maestro de empleados) — Detalle medio

**Narrativa general:** Como **administrador**, quiero **gestionar empleados: crear, editar, ver histórico de puestos/salarios, cargar por lote desde Excel**, para que **tengan datos actualizados en la BD y no dependa 100% del Excel manual**.

| US | Título | Narrativa (1 línea) | CA (2–3) | Prioridad | Dependencias |
| --- | --- | --- | --- | --- | --- |
| **US-020** | CRUD de empleados completo | Crear, actualizar, buscar, listar empleados con filtros | `Dado dato_nuevo Cuando POST Entonces registra con auditoría` | MUST | US-009 |
| **US-021** | Datos bancarios y afiliaciones | Múltiples cuentas sueldo/CTS, sistemas de pensión (AFP/ONP), comisión | `Dado afiliación_nueva Cuando se guarda Entonces EXCLUDE previene solapamiento` | MUST | US-020 |
| **US-022** | Cese de empleado con propagación | Marcar como CESADO, disparar eventos (contratos, seguros, planilla) | `Dado cese Cuando POST Entonces disparar eventos` | MUST | US-020 |
| **US-023** | Importación masiva desde Excel | Cargar empleados bulk, detectar duplicados, reportar errores | `Dado Excel Cuando se importa Entonces valida DNI/duplicados` | MUST | US-020 |
| **US-024** | Historial laboral (job_histories) | Vista de puesto/sueldo vigente por fecha | `Dado cambio_contrato Cuando se aplica Entonces aparece en historial` | SHOULD | US-020 |
| **US-025** | Búsqueda y filtros | Búsqueda por nombre (TRGM), filtrar por estado, área, fecha ingreso | `Dado búsqueda Cuando GET /employees?name=maria Entonces retorna coincidencias` | SHOULD | US-020 |
| **US-026** | Contactos de emergencia | Múltiples contactos por empleado | `Dado contacto Cuando POST Entonces audita` | SHOULD | US-020 |
| **US-027** | Dependientes (hijos/cónyuge) | Para cálculo de asignación familiar | `Dado dependiente Cuando se registra Entonces computa en nómina` | MUST | US-020 |
| **US-028** | Datos de pensión vinculados | AFPs vigentes, comisión, CUSPP | `Dado afiliación Cuando es vigente Entonces usable en planilla` | MUST | US-021 |
| **US-029** | Catalogo ubigeo y direcciones | Normalizar departamento/provincia/distrito | `Dado ubigeo_id Cuando se asigna Entonces vinculado a INEI` | SHOULD | US-004 |
| **US-030** | Candidatos a rechazados | Empleados con status ACTIVO/CESADO/SUSPENDIDO | `Dado status Cuando POST Entonces se actualiza` | SHOULD | US-020 |

---

#### US-031 a US-045: EP-07 (Organización) — Detalle medio

| US | Título | Narrativa | CA (2–3) | Prioridad |
| --- | --- | --- | --- | --- |
| **US-031** | Gestionar empresas (companies) | Crear/editar razón social, RUC, representante legal | `Dado empresa Cuando CRUD Entonces audita` | MUST |
| **US-032** | Multi-RUC en la misma empresa | Mismo tenant, múltiples RUC con independencia fiscal | `Dado RUC1, RUC2 Cuando ambos en BD Entonces reportes por RUC` | MUST |
| **US-033** | Sedes/sucursales (branches) | Crear sedes con código, ubicación INEI, anexo SUNAT | `Dado sede Cuando POST Entonces con anexo T-Registro` | MUST |
| **US-034** | Divisiones/áreas | Jerarquía opcional, manager por división | `Dado división Cuando asigno manager Entonces ve empleados` | SHOULD |
| **US-035** | Puestos con riesgo SCTR | Catálogo: VALET, ANFITRION(A), etc. con nivel ALTO/BAJO | `Dado puesto Cuando SCTR requiere ENTONCES incluir en póliza` | MUST |
| **US-036** | Normalización de puestos | Canonicalizar variantes (`ANFITRION(A) PT` → `ANFITRION`) | `Dado variante Cuando asigno Entonces mapea a canonical` | SHOULD |
| **US-037** | Centros de costo | Opcional, para filtrado de reportes financieros | `Dado costo_center Cuando asigno Entonces disponible en consultas` | SHOULD |
| **US-038** | Catálogos activos/inactivos | Flag is_active para excluir deprecated sin borrar | `Dado is_active=false Cuando filtro Entonces no aparece` | MUST |

---

#### US-046 a US-065: EP-08 (Asistencia) — Detalle medio; EP-09 (Vacaciones) — Detalle medio

| US | Título | Narrativa | CA (2–3) | Prioridad |
| --- | --- | --- | --- | --- |
| **US-046** | Conector GeoVictoria: sincronizar marcaciones | Job BullMQ que importa diarios desde API REST | `Dado marcaciones_nuevas Cuando job ejecuta Entonces INSERT attendance_records` | MUST |
| **US-047** | Turnos y horarios | Crear turnos rotativos, asignar a empleados con vigencia | `Dado turno Cuando asigno Entonces vigencia con EXCLUDE` | MUST |
| **US-048** | Cálculo de tardanzas | Comparar check_in vs horario programado | `Dado entrada_tarde Cuando calcula Entonces es_late=true` | MUST |
| **US-049** | Horas extra (HE 25%/35%) | Detectar >8h/día, calcular sobre/nocturnidad | `Dado 10h/día Cuando calcula Entonces 2h HE 25%` | MUST |
| **US-050** | Cierre de período de asistencia | Validar completitud, generar totales por empleado | `Dado período Cuando cierre Entonces audita totales` | MUST |
| **US-051** | Corrección manual de asistencia | Con nota de justificación y auditoría | `Dado corrección Cuando PATCH Entonces audit_logs registra` | SHOULD |
| **US-052** | Vacaciones: devengue automático | 30 días/año, acumular en vacation_periods | `Dado ingreso Cuando mes_aniversario Entonces +2.5 días` | MUST |
| **US-053** | Solicitud de vacaciones/ausencias | Flujo empleado → jefe → RRHH → aprobación | `Dado solicitud Cuando aprobada Entonces descuenta saldo` | MUST |
| **US-054** | Récord vacacional | Tabla que rastrea: ganados, gozados, vendidos (máx 15), truncos | `Dado 30 ganados Cuando se venden 10 Entonces quedan 20` | MUST |
| **US-055** | Licencias (descanso médico, maternidad, paternidad) | Tipos no remunerados, con CITT EsSalud si aplica | `Dado descanso>20d Cuando se registra Entonces dispara suplencia` | SHOULD |
| **US-056** | Calendario de ausencias por equipo | Filtrar por division, ver visualmente | `Dado división Cuando GET /leave/calendar Entonces JSON de ausencias` | SHOULD |

---

### FASES 4, 5 y 6 — Detalle MINIMAL

#### US-057 a US-085 (Fases 4–6): ID, Título, Narrativa de una línea, Prioridad MoSCoW

| US | Título | Narrativa (1 línea) | Prioridad | Fase |
| --- | --- | --- | --- | --- |
| **US-057** | Conceptos de planilla CRUD | Crear/editar conceptos remunerativos, descuentos, aportes | MUST | 4 |
| **US-058** | Parámetros legales versionados | UIT, RMV, tasas AFP/ONP por vigencia | MUST | 4 |
| **US-059** | Abrir período de planilla | Crear payroll_period MENSUAL, GRATIFICACION, CTS, LIQUIDACION | MUST | 4 |
| **US-060** | Cálculo de planilla (motor núcleo) | Sueldo + HE + asig fam - AFP - renta 5ta - faltas → boleta | MUST | 4 |
| **US-061** | AFP con comisiones y topes | Aporte 10% + prima seguros + comisión flujo/mixta + tope asegurable | MUST | 4 |
| **US-062** | Renta de 5.ª categoría | Deducción 7 UIT, tramos 8/14/17/20/30%, retención mensual | MUST | 4 |
| **US-063** | CTS: depósitos semestrales | Depósito mayo/noviembre = 1/12 sueldo × 12 + 1/6 gratif × 12 | MUST | 4 |
| **US-064** | Gratificaciones (jul/dic) + bono 9% | Cálculo + bono EsSalud no descontado (Ley 30334) | MUST | 4 |
| **US-065** | Asignación familiar (10% RMV) | Si has_children_under18 → descuento conceptos, computable en planilla | MUST | 4 |
| **US-066** | Liquidación de beneficios | Cálculo al cese: CTS trunco, vacaciones no gozadas, gratificación proporcional | MUST | 4 |
| **US-067** | Ajustes manuales de boleta | Corrección de montos calculados con nota de auditoría | SHOULD | 4 |
| **US-068** | Aprobación y cierre de período | Workflow: ABIERTA → CALCULADA → APROBADA → PAGADA → CERRADA (inmutable) | MUST | 4 |
| **US-069** | Boleta PDF descargable | Generar boleta PDF con cálculos detallados | MUST | 4 |
| **US-070** | Exportación a archivo bancario | Formato de aseguradora (Scotiabank, BBVA, BCP…) | MUST | 4 |
| **US-071** | PLAME / T-Registro | Exportación SUNAT con códigos tablas 8, 22, ocupación, establecimiento | MUST | 4 |
| **US-072** | AFPnet | Envío información AFP (afiliaciones, aportes, descuentos) | SHOULD | 4 |
| **US-073** | Régimen de practicantes (Ley 28518) | Subvención (no remuneración), media subvención semestral, sin CTS | MUST | 4 |
| **US-074** | Snapshot de histórico de planilla | Capturar parámetros, tasas, variante de nómina para reproducibilidad | MUST | 4 |
| **US-075** | Reportes gerenciales: costo laboral | Excel con costo mes/año por área, división | SHOULD | 5 |
| **US-076** | Reportes gerenciales: rotación | Ingresos/ceses, tasa de rotación, promedio de permanencia | SHOULD | 5 |
| **US-077** | Reportes gerenciales: headcount | Cantidad de empleados activos, histórico | SHOULD | 5 |
| **US-078** | Portal empleado: mis boletas | GET /employees/me/payslips con descarga PDF | SHOULD | 5 |
| **US-079** | Portal empleado: saldo vacacional | GET /employees/me/vacation con desglose ganado/gozado/venta/trunco | SHOULD | 5 |
| **US-080** | Portal empleado: mis documentos | GET /employees/me/documents con descargas | SHOULD | 5 |
| **US-081** | Portal empleado: mis coberturas | GET /employees/me/insurances con seguros vigentes | SHOULD | 5 |
| **US-082** | Alertas de vencimiento de contratos | Job diario: 30, 15, 7 días antes del vencimiento | SHOULD | 5 |
| **US-083** | Alertas de vencimiento de pólizas | Job diario: SCTR, EPS, Ley de Vida | SHOULD | 5 |
| **US-084** | Backups automatizados y PITR | pg_dump diario, WAL archiving, restore probado | MUST | 6 |
| **US-085** | Manual operacional y runbooks | Documentación: qué hacer en crisis, procesos regulares, contactos | SHOULD | 6 |

---

## 5. Requisitos No Funcionales

| Categoría | Requisito | Métrica | Validación |
| --- | --- | --- | --- |
| **Seguridad** | PII cifrado en reposo (si requiere) | AES-256 o TDE de Postgres | Audit trail de accesos |
| **Seguridad** | HTTPS/TLS 1.2+ obligatorio en producción | Certificado válido | SSL Labs A+ |
| **Seguridad** | Rate limiting en endpoints | 100 req/min por IP, 10 req/min por usuario | Test de carga |
| **Seguridad** | OWASP top 10 cubierto | No SQL injection, XSS, CSRF, insecure deserialization | OWASP ZAP scan |
| **Seguridad** | Contraseñas >12 caracteres + hash bcryptjs/argon2 | Validación Zod + hash en BD | Test de contraseña débil rechazada |
| **Performance** | API response <500ms p95 (sin asincronía) | Endpoint GET /employees con 10k registros | Benchmark con Artillery |
| **Performance** | Job de generación PDF: <5s por documento | 10 PDFs en lote <50s total | Benchmark pdfmake |
| **Performance** | Consultas de planilla: <2s para 1000 empleados | SELECT payslips by period | EXPLAIN ANALYZE |
| **Disponibilidad** | RTO (Recovery Time Objective) <1h | Backup restaurable en <1h | Drill mensual |
| **Disponibilidad** | RPO (Recovery Point Objective) <5 min | WAL archiving + pg_dump cada 5 min | Logs de backup |
| **Escalabilidad** | BD soporta 10,000 empleados, 5 años de histórico | ~500 MB datos + ~2 GB logs | Load test con 100k registros |
| **Escalabilidad** | API stateless → escalable horizontalmente | Docker con múltiples replicas | Docker Compose con 2 APIs |
| **Auditoría** | Auditoría inmutable por 5 años (legal Perú) | Tabla audit_logs particionada, archivada después | Retención de backups >5 años |
| **Auditoría** | Snapshots de planilla cerrada inmutable | JSONB generation_snapshot en payslips | Test: intento UPDATE boleta cerrada = 403 |
| **Usabilidad** | UI responsive (mobile + desktop) | Bootstrap / Tailwind breakpoints | Manual QA |
| **Usabilidad** | Formularios con validación client + server | Zod en ambas puntas | Test de form inválido |
| **Documentación** | API OpenAPI completo con ejemplos | Swagger UI en /docs | CI valida spec |
| **Documentación** | README con "docker-compose up" probado | Step-by-step para dev nuevo | Nuevo dev test en <15 min |
| **Testing** | Cobertura mínima 70% en módulos críticos (contratos, planilla) | NYC coverage report | CI falla si <70% |
| **Testing** | E2E del flujo Excel → Contratos → Boleta | Supertest + Testcontainers | Suite de 5 E2E verde |
| **Logging** | Logs estructurados con requestId, user_id, table_name | Pino JSON en producción | CloudWatch / ELK compatible |
| **Compliance** | Cumplimiento SUNAT (PLAME, T-Registro, AFP) | Exportes generados per spec | Validación anual contra SUNAT |
| **Compliance** | Cumplimiento Ley 27806 (protección PII) | Auditoría, encriptación, consentimiento | Revisión anual |

---

## 6. Fuera de Alcance v1

**Explícitamente descartado para v1 (será evaluado post-lanzamiento):**

1. **Multi-tenant SaaS**: sistema es single-tenant (una empresa). No hay registro público, facturación, aislamiento de datos dinámico.
2. **Firma digital propia**: el sistema NO implementa firma digital. El contrato se genera con firma del empleador ya embebida; el empleado firma en plataforma externa (por definir con cliente).
3. **Captura de marcaciones in-house**: NO construir app de móvil ni reloj biométrico. El sistema se conecta a GeoVictoria (SaaS ya contratado) para obtener marcaciones.
4. **Régimen MYPE**: el motor de planilla cubre régimen general (D.Leg. 728). MYPE (pequeña empresa con beneficios reducidos) queda fuera. Si se requiere, será fase 4.1.
5. **Recibos por honorarios**: el sistema gestiona empleados regulares y practicantes. Locación de servicios está fuera.
6. **App móvil**: el frontend es SPA (Vite + React) responsive. No hay app nativa iOS/Android.
7. **Integración de tiempo real con aseguradora**: los reportes se generan mensualmente. No hay suscripción a eventos de aseguradora.
8. **Machine learning / predicción**: no hay modelos predictivos (rotación, comisiones dinámicas, etc.).

---

## 7. Supuestos y Preguntas Abiertas para el Cliente

### Supuestos (aceptados)

1. **Única empresa, múltiples RUC:** el cliente tiene o puede tener varias razones sociales bajo el mismo sistema. No es multi-tenant SaaS.
2. **OneDrive es canal permanente:** Microsoft 365 es la herramienta corporativa; la ingestión de Excel seguirá siendo central.
3. **GeoVictoria para marcaciones:** la API REST ya está contratada y es confiable para traer datos diarios.
4. **Normativa peruana estable (v1):** D.Leg. 728, Ley 28518, tasas AFP/ONP no cambiarán drásticamente en 6 meses. Pueden actualizarse pero con parámetro de BD.
5. **Inglés/español:** la interfaz backend es en inglés (estándar dev), los reportes/labels frontend en español (contexto laboral local).

### Preguntas abiertas (requieren respuesta cliente)

1. **¿Cuál es la plataforma de firmas digital que usa RRHH actualmente?** (para investigar API de integración post-v1)
2. **¿Cuál es el email corporativo de la aseguradora SCTR para envío de reportes mensuales?**
3. **¿Credenciales de acceso a GeoVictoria API?** (endpoint base, API key, esquema de datos de marcaciones)
4. **¿Estructura actual de datos de empleados en Excel?** (ejemplo de archivo con datos reales anonimizados para validar parser)
5. **¿Cuál es la UIT y RMV vigentes para 2026?** (valores para seed inicial)
6. **¿Existen otros proveedores de seguros además de SCTR?** (EPS, Ley de Vida: quiénes son)
7. **¿Número máximo de empleados esperados en v1?** (para sizing de BD y estimación de performance)
8. **¿Cuántos RUC/sedes/divisiones en el catálogo inicial?**
9. **¿Se requiere SSO con Microsoft Entra ID para RRHH?** (decidir en Fase 0 si lo incluimos o queda Fase 6)
10. **¿Dónde se desplegará (VPS específico, Azure, hosted service)?** (para provisioning de BD, backups, etc.)

---

## 8. Métricas de Éxito del Producto

| Métrica | Target v1 | Validación |
| --- | --- | --- |
| **Reducción de tiempo RRHH en procesamiento mensual** | 80% (15–20 horas → 2–3) | Encuesta post-deployment |
| **Precisión de cálculo de planilla** | 100% (0 errores manuales) | Comparación celda por celda con planilla antigua |
| **Disponibilidad del sistema** | 99.5% (horas de negocio) | Uptime monitoring |
| **Tiempo desde ingreso de empleado hasta contrato generado** | <30 minutos | Benchmark del flujo |
| **Adopción de portal empleado** | 80% de empleados acceden ≥1x/mes | Analytics |
| **Satisfacción de RRHH** | NPS ≥7 | Survey post-lanzamiento |
| **Costo de operación (BD + infra + soporte)** | <5% del costo actual (4+ SaaS desconectados) | Comparativa de facturas |

---

## 9. Criterios de Aceptación Generales (DoD por sprint)

- [ ] Todos los tests verdes en CI (lint, type-check, unit, integration).
- [ ] Coverage mínimo 70% en módulos nuevos (código de negocio, no plumbing).
- [ ] Sin secretos versionados (.env en .gitignore, API keys en vault, PII anonimizada).
- [ ] PR con descripción, link a issues, cambios de BD documentados.
- [ ] Uno o más reviewers autorizan merge.
- [ ] Migraciones Prisma revisadas y reversibles.
- [ ] Documentación actualizada (README, arquitectura, runbooks si aplica).
- [ ] Funcionalidad es desplegable en staging y se verifica manualmente.

---

## 10. Plan de Comunicación con Stakeholders

| Stakeholder | Frecuencia | Canal | Contenido |
| --- | --- | --- | --- |
| **Dueño del proyecto** | Semanal (viernes) | Video sync 30 min | Avance, blockers, decisiones pendientes |
| **Equipo RRHH** | Bi-semanal | Sprint review (prod/staging) | Demo de features, solicitud de feedback |
| **C-level (ejecutivos)** | Mensual | Email + dashboard | Hitos, inversión, ROI, timeline |
| **Proveedores (GeoVictoria, aseguradora)** | Ad-hoc | Email | Confirmación de APIs, credenciales, cambios de contrato |

---

## 11. Glosario

- **HRIS:** Human Resource Information System (sistema de gestión de recursos humanos).
- **D.Leg. 728:** Decreto Legislativo 728 (norma laboral peruana de contratación laboral).
- **Ley 28518:** Ley de practicantes.
- **SCTR:** Seguro Complementario de Trabajo de Riesgo (cubre accidentes/enfermedades laborales).
- **AFP:** Administradora de Fondos de Pensiones (sistema privado de pensiones).
- **ONP:** Oficina de Normalización Previsional (sistema público de pensiones).
- **EsSalud:** Seguro Social de Salud.
- **PLAME:** Planilla de Masivo de Empleados (reporte a SUNAT).
- **T-Registro:** Registro de trabajadores ante SUNAT.
- **CTS:** Compensación por Tiempo de Servicios (beneficio social, depósito semestral).
- **RMV:** Remuneración Mínima Vital (salario mínimo nacional).
- **UIT:** Unidad Impositiva Tributaria (parámetro anual SUNAT para cálculos tributarios).
- **Bounded Context:** límite de dominio en DDD, módulo independiente con responsabilidad clara.
- **Hexagonal Architecture:** patrón que aísla dominio (casos de uso) de adaptadores (BD, HTTP, etc.).

---

## 12. Apéndices

### A. Matriz de Trazabilidad: Épicas → OKRs de Negocio

| OKR de Negocio | Épicas que lo cumplen | Métrica |
| --- | --- | --- |
| **O1: Eliminar Excel como fuente de verdad de empleados** | EP-02, EP-06, EP-07 | 100% de datos en BD, cero Excels vivos |
| **O2: Automatizar 100% la nómina mensual** | EP-04, EP-10, EP-11 | Cero ajustes manuales, error zero vs real |
| **O3: Cumplimiento automático SUNAT** | EP-11, EP-12 | PLAME/T-Registro generados sin revisar |
| **O4: Reducir riesgo de seguridad PII** | EP-01, EP-02, EP-14 | Auditoría 100%, encriptación PII, backups probados |
| **O5: Costo laboral visible en tiempo real** | EP-08, EP-09, EP-12 | Dashboard de costo mensual por división |

### B. Referencias a Normativa Peruana

- [D.Leg. 728 — Ley de Relaciones Laborales](https://www.sbs.gob.pe/)
- [Ley 28518 — Ley de Modalidades Formativas Laborales](https://www.trabajo.gob.pe/)
- [Ley 26790 — SCTR (D. Suplementario)](https://www.sbs.gob.pe/)
- [D.Leg. 688 — Ley de Vida](https://www.sbs.gob.pe/)
- [Ley 30334 — Bono Extraordinario EsSalud](https://www.congreso.gob.pe/)
- [SUNAT — PLAME y T-Registro](https://www.sunat.gob.pe/)

### C. Comparativa con Stack Alternativo Descartado

| Aspecto | Stack Recomendado | NestJS (descartado) | Razón |
| --- | --- | --- | --- |
| Setup inicial | <2 días (Express + TS) | 1 semana (decoradores, DI) | Velocidad de time-to-value |
| Curva de aprendizaje | Media (Express conocido) | Alta (NestJS + dominio) | 1 dev, deadline ajustado |
| Reporte de errores | Simple (middleware centralizado) | Complejo (filters + interceptors) | Mantenibilidad |
| Migración desde actual | Directa (renombrar carpetas) | Reescribir 100% | Riesgo operacional |
| Escalado futuro | Fácil migrar módulos a servicios | Ya servicios-ready | Si crece, se migra después |

---

**Fin del Product Backlog**

---

## Historial de Cambios

| Versión | Fecha | Cambios |
|---|---|---|
| 1.0 | 2026-07-08 | Documento inicial completo: 85 historias, 15 épicas, roadmap 9–11 meses |

---

**Documento aprobado por:** Product Manager Kontrak (2026-07-08)  
**Próxima revisión:** 2026-08-05 (después de Fase 0)
