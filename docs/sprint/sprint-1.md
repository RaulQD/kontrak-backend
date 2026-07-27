# Plan Fase 0 — Fundaciones HRIS (Monolito Modular + Clean Architecture)

> **Duración:** 3 semanas (3 sprints de 1 semana) · **Equipo:** 1 desarrollador
> **Stack:** Node.js + TypeScript + Express + Prisma 7 + PostgreSQL + pnpm
> **Premisa:** el dominio legal peruano es el corazón del sistema — las reglas de CTS, gratificaciones, vacaciones y contratos modales viven en la capa Domain como lógica pura y testeable.

---

## PARTE A — PLAN TÉCNICO

## 1. Decisiones técnicas clave

| Área | Decisión | Por qué |
|------|----------|---------|
| Estructura | **Repo único** con carpetas de módulos (NO monorepo pnpm workspaces) | Un solo deployable; workspaces agregan fricción sin beneficio real en un monolito |
| Capas | Clean Architecture por módulo: `domain / application / infrastructure / presentation` | El dominio legal debe ser puro y testeable sin Prisma/Express |
| Fronteras | **dependency-cruiser** en CI | Las reglas de capas se hacen cumplir con linting estático, no con paquetes |
| Módulo ejemplo | **legal-parameters** primero | Es el más simple, es el corazón legal compartido, y prueba el patrón de comunicación entre módulos |
| ORM | Prisma 7, migraciones con `--create-only` para SQL manual | CHECKs, índices parciales, EXCLUDE y triggers no se expresan en Prisma |
| Auth | JWT access 15 min + refresh rotativo con `family_id` y detección de reuso | Patrón OWASP; reuso detectado → se revoca toda la familia |
| Hashing | **argon2id** | Ganador PHC, superior a bcrypt |
| Auditoría | **Decorator en capa application** (no trigger de BD) | El trigger no conoce al actor JWT ni puede auditar lecturas (Ley 29733 exige auditar lecturas de datos sensibles) |
| Testing | **Vitest + Supertest + Testcontainers** (Postgres real) | Cobertura objetivo: >80% global, **>95% en dominio** |
| PKs | UUID **v7** (ordenable temporalmente) | Mejor para índices que v4; generar en app con `uuidv7` npm si la extensión no está |

## 2. Estructura del repositorio

```
kontrak-backend/
├─ src/
│  ├─ main.ts                        # bootstrap: crea app, conecta DI, arranca server
│  ├─ app.ts                         # ensambla Express, middlewares globales, routers
│  ├─ config/
│  │  ├─ env.ts                      # validación de env con zod (falla al arrancar si falta algo)
│  │  ├─ container.ts                # composition root / DI manual
│  │  └─ constants.ts
│  ├─ shared/                        # SHARED KERNEL (sin lógica de ningún módulo)
│  │  ├─ domain/                     # Entity, AggregateRoot, ValueObject, DomainEvent,
│  │  │                              # Result<T,E>, DomainError
│  │  ├─ application/                # UseCase<In,Out>, Clock (puerto de reloj)
│  │  ├─ infrastructure/
│  │  │  ├─ database/prisma.ts       # PrismaClient singleton
│  │  │  ├─ http/                    # errorMapper, asyncHandler, responses
│  │  │  ├─ logging/logger.ts        # pino con correlationId
│  │  │  └─ crypto/                  # PasswordHasher (puerto) + Argon2PasswordHasher
│  │  └─ types/
│  ├─ contracts/                     # CONTRATOS ENTRE MÓDULOS (PublicApi de cada uno)
│  │  ├─ identity/IdentityPublicApi.ts
│  │  └─ legal-parameters/LegalParametersPublicApi.ts
│  ├─ modules/
│  │  ├─ legal-parameters/           # MÓDULO EJEMPLO (Sprint 1)
│  │  │  ├─ domain/ application/ infrastructure/ presentation/
│  │  │  └─ index.ts                 # expone el PublicApi + registra el router
│  │  ├─ identity/                   # Sprint 2
│  │  ├─ collaborators/              # placeholder (fase posterior)
│  │  ├─ contracts-lifecycle/        # placeholder
│  │  ├─ compensation/               # placeholder
│  │  ├─ documents/                  # placeholder
│  │  ├─ attendance/                 # placeholder
│  │  └─ compliance/                 # placeholder
│  └─ audit/                         # transversal: decorator + repositorio de auditoría
├─ prisma/
│  ├─ schema/                        # prismaSchemaFolder: un .prisma por bounded context
│  ├─ migrations/
│  └─ seed/                          # index.ts, rbac.seed.ts, legal-parameters.seed.ts
├─ test/
│  ├─ integration/
│  ├─ helpers/                       # testDb.ts (Testcontainers), factories/
│  └─ setup.ts
├─ .dependency-cruiser.cjs
├─ .github/workflows/ci.yml
├─ docker-compose.yaml
├─ vitest.config.ts
└─ package.json
```

## 3. Reglas de dependencia

**Entre capas (dentro de un módulo):**

```
presentation → application → domain
infrastructure → application, domain   (implementa puertos)
domain → (nada; solo shared/domain)
application → domain, shared           (NO infrastructure, NO prisma, NO express)
```

**Entre módulos:**

- Un módulo **solo** puede importar de `src/contracts/<otroModulo>` (nunca `modules/<otro>/domain` ni `/infrastructure`).
- Comunicación por interfaces `PublicApi` inyectadas vía DI. Ej.: `compensation` consumirá `legalParams.getParameterAt('ESSALUD_RATE', fecha)` sin conocer Prisma → **la regla legal queda pura y testeable con un fake**.
- `shared/` puede importarse desde cualquier capa; `shared` nunca importa de `modules/`.

**Enforcement — `.dependency-cruiser.cjs`:**

```js
forbidden: [
  { name: 'domain-no-infra', severity: 'error',
    from: { path: 'src/modules/[^/]+/domain' },
    to:   { path: 'src/modules/[^/]+/(infrastructure|presentation)' } },
  { name: 'app-no-prisma', severity: 'error',
    from: { path: 'src/modules/[^/]+/application' },
    to:   { path: '(node_modules/@prisma|node_modules/express)' } },
  { name: 'cross-module-only-via-contracts', severity: 'error',
    from: { path: 'src/modules/([^/]+)/' },
    to:   { path: 'src/modules/(?!$1)[^/]+/(?!.*index\\.ts)',
            pathNot: 'src/contracts/' } },
]
```

## 4. Anatomía del módulo vertical de ejemplo: `legal-parameters`

**Por qué este módulo:** puro valor + vigencia temporal, sin dependencias de otros módulos, y sirve de plantilla que copiarán `identity` y el resto.

### 4.1 Domain — Value Objects

```ts
// domain/value-objects/ParameterCode.ts
export class ParameterCode extends ValueObject<{ value: string }> {
  private static ALLOWED = ['RMV', 'UIT', 'ESSALUD_RATE', 'ONP_RATE'] as const;
  static create(raw: string): Result<ParameterCode, InvalidParameterCodeError> {
    if (!this.ALLOWED.includes(raw as any))
      return Result.fail(new InvalidParameterCodeError(raw));
    return Result.ok(new ParameterCode({ value: raw }));
  }
}

// domain/value-objects/EffectivePeriod.ts — intervalo [validFrom, validTo)
export class EffectivePeriod extends ValueObject<{ from: Date; to: Date | null }> {
  static create(from: Date, to: Date | null): Result<EffectivePeriod, InvalidPeriodError> {
    if (to && to <= from) return Result.fail(new InvalidPeriodError());
    return Result.ok(new EffectivePeriod({ from, to }));
  }
  contains(date: Date): boolean {
    return date >= this.props.from && (this.props.to === null || date < this.props.to);
  }
}
```

Regla de dominio clave: **no pueden solaparse dos periodos vigentes del mismo `code`** — se valida en un domain service y se refuerza en BD con `EXCLUDE` (§6).

### 4.2 Application — Puerto + Caso de uso

```ts
export interface LegalParameterRepository {
  findEffective(code: ParameterCode, at: Date): Promise<LegalParameter | null>;
  findOverlapping(code: ParameterCode, period: EffectivePeriod): Promise<LegalParameter[]>;
  save(param: LegalParameter): Promise<void>;
}

export class GetEffectiveParameter implements UseCase<Input, LegalParamDTO> {
  constructor(private readonly repo: LegalParameterRepository,
              private readonly clock: Clock) {}   // Clock inyectado = vigencia 100% testeable
  async execute(input: Input): Promise<Result<LegalParamDTO, DomainError>> { /* ... */ }
}
```

### 4.3 Infrastructure — Prisma

```ts
export class PrismaLegalParameterRepository implements LegalParameterRepository {
  async findEffective(code: ParameterCode, at: Date) {
    const row = await this.prisma.legalParameter.findFirst({
      where: { code: code.value, validFrom: { lte: at },
               OR: [{ validTo: null }, { validTo: { gt: at } }] },
      orderBy: { validFrom: 'desc' },
    });
    return row ? LegalParameterMapper.toDomain(row) : null;  // nunca expone el modelo Prisma
  }
}
```

### 4.4 Presentation + PublicApi

- Ruta: `GET /legal-parameters/:code/effective?at=YYYY-MM-DD` con `authenticate` + `authorize('legal_params:read')`, validación con zod.
- `contracts/legal-parameters/LegalParametersPublicApi.ts`: `getParameterAt(code, date)` — es lo único que otros módulos pueden importar.
- Mapeo de errores centralizado en `shared/infrastructure/http/errorMapper.ts` (DomainError → HTTP status).

## 5. CI y hooks locales

**`.github/workflows/ci.yml`:**

```yaml
name: ci
on: { pull_request: {}, push: { branches: [main] } }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint                  # eslint
      - run: pnpm depcruise             # fronteras de arquitectura
      - run: pnpm typecheck             # tsc --noEmit
      - run: pnpm prisma:validate
      - run: pnpm prisma:migrate:check  # migrate diff --exit-code: schema == migraciones
      - run: pnpm test                  # vitest (unit + integración con Testcontainers)
```

**Hooks (husky + lint-staged):**

- `pre-commit` → `lint-staged` (eslint --fix + prettier solo en archivos staged).
- `pre-push` → `pnpm typecheck && pnpm depcruise` (barato; los tests completos van en CI).

## 6. Prisma 7 + PostgreSQL

- **Migraciones versionadas** siempre; jamás `db push` fuera de prototipado local.
- **Flujo `--create-only`** para lo que Prisma no modela; se edita el `migration.sql` a mano:
  - `CHECK (valid_to IS NULL OR valid_to > valid_from)`
  - `EXCLUDE USING gist (code WITH =, tstzrange(valid_from, valid_to) WITH &&)` — anti-solapamiento (requiere `CREATE EXTENSION btree_gist`)
  - Triggers `set_updated_at` e inmutabilidad donde aplique retención legal.
- **Convenciones:** modelos PascalCase singular + `@@map("snake_case_plural")`; campos camelCase + `@map`; dinero/tasas `Decimal` (nunca float); `createdAt/updatedAt/deletedAt`.
- **Soft delete + inmutabilidad** (retención 5 años, Ley 29733): `deletedAt` + extensión Prisma que traduce delete → update; sin DELETE físico para el rol de app en tablas críticas.
- **Seeds idempotentes** (upsert) ejecutables con `prisma db seed` y reutilizables en tests.

## 7. Auth (módulo `identity`)

**Tablas:** `users` (con `failed_login_count`, `locked_until`), `roles`, `permissions`, `role_permissions`, `user_roles`, `refresh_tokens` (con `token_hash`, `family_id`, `revoked_at`, `replaced_by`, `user_agent`, `ip`).

**Flujo de tokens:**

- Access JWT TTL **15 min**, payload mínimo (`sub`, `roles`, `permissions`, `jti`).
- Refresh token aleatorio de 256 bits, **guardado hasheado**, TTL 7-30 días, en **cookie httpOnly + Secure + SameSite=Strict**.
- **Rotación:** cada refresh revoca el token usado y emite uno nuevo dentro de la misma `family_id` (transaccional, para evitar condición de carrera).
- **Detección de reuso:** si llega un refresh ya revocado → robo asumido → se revoca **toda la familia** y se fuerza re-login.

**Autorización por permiso, no por rol** (`authorize('legal_params:read')`) — permite reconfigurar roles sin tocar código.

**Protección:** rate limit en `/auth/login` (ej. 5 intentos / 15 min por IP+email → 429) + lockout de cuenta (`locked_until`) tras N fallos — doble capa contra rotación de IP.

## 8. Tabla `legal_parameters`

```
legal_parameters(
  id uuid PK,
  code text NOT NULL,                 -- 'RMV','UIT','ESSALUD_RATE','ONP_RATE'
  value numeric(12,4) NOT NULL,
  unit text NOT NULL,                 -- 'PEN','RATE'
  valid_from timestamptz NOT NULL,
  valid_to timestamptz NULL,          -- null = vigente
  legal_reference text,               -- ej. 'D.S. 007-2022-TR' (OBLIGATORIA)
  created_at, updated_at, created_by
)
-- CHECK (valid_to IS NULL OR valid_to > valid_from)
-- EXCLUDE USING gist (code WITH =, tstzrange(valid_from, valid_to) WITH &&)
-- INDEX (code, valid_from DESC)
```

**Seed inicial (valores Perú — VERIFICAR contra el decreto vigente antes de commitear):**

| Código | Valor | Nota |
|--------|-------|------|
| `RMV` | S/ 1,130.00 | Verificar último decreto a la fecha |
| `UIT` | S/ 5,350 (2025) | Confirmar la UIT del año en curso |
| `ESSALUD_RATE` | 9% (0.09) | Aporte del **empleador** |
| `ONP_RATE` | 13% (0.13) | Aporte del **trabajador** |

> ⚠️ Los valores históricos se cargan con sus periodos cerrados para permitir cálculos retroactivos. Las tablas AFP se seedean en fase posterior (estructura comisión/prima/aporte, cambian mensualmente).

## 9. Audit log

```
audit_logs(
  id uuid PK,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  actor_id uuid NULL,            -- user que ejecuta (null = sistema)
  actor_ip text, user_agent text,
  action text NOT NULL,          -- 'auth.login.success','legal_parameter.read',...
  resource_type text NOT NULL,
  resource_id text NULL,
  outcome text NOT NULL,         -- 'SUCCESS'|'FAILURE'
  metadata jsonb NULL,
  correlation_id text
)
-- append-only: sin UPDATE/DELETE para el rol de app
```

**Captura:** decorator/wrapper `withAudit(useCase, meta)` en la capa application. El actor y el `correlation_id` se leen de un `AsyncLocalStorage` poblado por middleware de request. (El trigger de BD no conoce al actor JWT ni captura lecturas.)

**Qué se audita en Fase 0:** `auth.login.success/failure`, `auth.refresh.reuse_detected`, `auth.logout`, CRUD de RBAC, cambios y **lecturas** de `legal_parameters`.

## 10. Testing

- **Vitest** (runner), **Supertest** (HTTP sin puerto real), **Testcontainers** (`@testcontainers/postgresql`) con migraciones aplicadas.
- Fallback local Windows: Postgres de test fijo en docker-compose si Testcontainers falla; en CI (Linux) siempre Testcontainers.
- Unit de dominio: `*.spec.ts`, sin I/O; `FixedClock` para vigencias. Integración: `*.int.spec.ts`, truncado de tablas entre tests.
- Factories en `test/helpers/factories/` (no fixtures estáticos).
- Umbrales en `vitest.config.ts` (falla CI si baja): **global >80%, dominio >95%**.

---

## PARTE B — PLAN SCRUM

## 11. Epics

| Epic | Descripción | Sprint |
|------|-------------|--------|
| **E1 Fundaciones Arquitectónicas** | Estructura, Clean Architecture, Prisma + PostgreSQL, CI, módulo ejemplo | Sprint 1 |
| **E2 Sistema de Identidad** | Auth JWT, RBAC, refresh rotativo, protección fuerza bruta | Sprint 2 |
| **E3 Auditoría y Cierre** | audit_logs, decorator, seed legal, husky, health, env, checklist | Sprint 3 |

---

## SPRINT 1 — Fundaciones (31 SP)

> **Sprint Goal:** establecer la base del monolito modular con Clean Architecture, Prisma 7 + PostgreSQL, módulo `legal-parameters` funcional end-to-end con tests, y CI robusta.

### Historia 1.1 — Estructura de carpetas y módulos base (3 SP)

*Como* arquitecto del backend *quiero* la estructura base del monolito modular *para* que los bounded contexts se desarrollen de forma independiente.

**Criterios de aceptación:**

```gherkin
Given un repositorio en la rama de trabajo
When creo la estructura: src/shared/, src/contracts/, src/modules/ (7 contexts), src/audit/, src/config/
Then la estructura queda creada y documentada (README por carpeta con su propósito)
And .gitignore actualizado (node_modules, .env, coverage, prisma generated)
```

### Historia 1.2 — dependency-cruiser + reglas de capas (5 SP)

*Como* desarrollador *quiero* validar las reglas de dependencia entre capas *para* prevenir violaciones arquitectónicas desde el día 1.

```gherkin
Given dependency-cruiser instalado y .dependency-cruiser.cjs con las reglas de §3
When ejecuto pnpm depcruise
Then no hay violaciones
And CI ejecuta depcruise y falla el build si aparece alguna
And un import de modules/A/domain hacia modules/B/infrastructure produce error
```

### Historia 1.3 — Prisma 7 + PostgreSQL + docker-compose (5 SP)

```gherkin
Given docker-compose.yaml con PostgreSQL
When ejecuto docker-compose up -d
Then PostgreSQL responde en localhost:5432 y DATABASE_URL apunta a hris_dev
And prisma validate pasa sin errores
And genero una migración con --create-only y edito el SQL manual (extensión btree_gist, CHECKs, EXCLUDE)
And prisma migrate deploy la aplica sin errores
```

### Historia 1.4 — CI GitHub Actions (8 SP)

```gherkin
Given el workflow .github/workflows/ci.yml de §5
When hago push o abro PR
Then corre en secuencia: lint → depcruise → typecheck → prisma validate → migrate diff --exit-code → tests + cobertura
And cualquier paso fallido bloquea el merge (status rojo)
And migrate diff detecta "schema editado sin migración generada"
```

### Historia 1.5 — Módulo `legal-parameters` completo (5 SP)

```gherkin
Given la anatomía de §4 (domain, application, infrastructure, presentation, PublicApi)
When implemento la entidad LegalParameter, los VO ParameterCode y EffectivePeriod,
     el caso de uso GetEffectiveParameter (con Clock inyectado),
     el PrismaLegalParameterRepository y el controller con validación zod
Then GET /legal-parameters/RMV/effective?at=2026-07-12 responde 200 con el parámetro vigente
And un código inválido responde 400 y un parámetro sin vigencia responde 404
And LegalParametersPublicApi queda consumible por otro módulo vía DI
And la regla de no-solapamiento se valida en dominio y en BD (EXCLUDE)
```

### Historia 1.6 — Tests del módulo (5 SP)

```gherkin
# Unit de dominio (sin BD):
Given EffectivePeriod [2025-01-01, 2026-01-01)
Then contains(2025-01-01) = true y contains(2026-01-01) = false (intervalo semiabierto)
And EffectivePeriod con to <= from falla al crearse

Given repo fake in-memory con RMV vigente y FixedClock en 2026-07-12
When ejecuto GetEffectiveParameter({ code: 'RMV' })
Then devuelve el valor vigente; y con fecha fuera de vigencia devuelve ParameterNotEffectiveError

# Integración (Testcontainers + migraciones + seed):
When GET /legal-parameters/RMV/effective?at=<fecha vigente> → 200 con value correcto
And GET con fecha sin vigencia → 404; código inexistente → 400/404
And un INSERT con periodo solapado del mismo code es rechazado por la BD (EXCLUDE)

# Cobertura: dominio del módulo >= 95%, módulo >= 90%, global >= 80% (umbral en CI)
```

---

## SPRINT 2 — Identidad (30 SP)

> **Sprint Goal:** autenticación JWT completa (access 15 min + refresh rotativo con detección de reuso), RBAC con 3 roles base y protección contra fuerza bruta.

### Historia 2.1 — Schema identity (5 SP)

```gherkin
Given los modelos User, Role, Permission, RolePermission, UserRole, RefreshToken
      (User: email UNIQUE, password_hash, failed_login_count, locked_until, deleted_at;
       RefreshToken: token_hash, family_id, expires_at, revoked_at, replaced_by, ip, user_agent)
When genero la migración con --create-only
Then el SQL manual añade: CHECK expires_at > issued_at, índices (user_id, family_id) y (email, is_active),
     trigger set_updated_at
And prisma migrate deploy aplica todo sin errores
```

### Historia 2.2 — Login + tokens (8 SP)

```gherkin
# LoginUseCase
Given credenciales válidas
When POST /auth/login
Then 200 { access_token (JWT 15 min), expires_in: 900 }
And Set-Cookie: refresh_token=...; HttpOnly; Secure; SameSite=Strict
And el refresh se guarda HASHEADO en BD con family_id nueva

Given password incorrecta → 401 y failed_login_count incrementa
Given failed_login_count >= 5 → cuenta bloqueada (locked_until = now()+15min) → 429 con retry_after

# RefreshTokenUseCase (rotación transaccional)
Given refresh válido → nuevo access + nuevo refresh en la MISMA family_id; el anterior queda revoked/replaced_by
Given refresh expirado → 401 TOKEN_EXPIRED
Given refresh YA revocado (reuso) → se revoca TODA la familia + auditoría REFRESH_REUSE_DETECTED → 401
# Logout: revoca la familia completa
```

### Historia 2.3 — Middlewares authenticate / authorize (5 SP)

```gherkin
Given authenticate: extrae Bearer, verifica JWT, adjunta req.auth = { userId, permissions }
And authorize(permission): factory que exige el permiso puntual (NO el rol)
When request sin token → 401; con token pero sin permiso → 403; con permiso → pasa
And las rutas de legal-parameters quedan protegidas con authorize('legal_params:read')
```

### Historia 2.4 — Rate limiting + lockout (5 SP)

```gherkin
Given express-rate-limit sobre POST /auth/login (por IP+email)
When se exceden los intentos → 429 { retry_after_seconds }
And el lockout por cuenta (locked_until) actúa como segunda capa contra rotación de IP
```

### Historia 2.5 — Seed RBAC (4 SP)

```gherkin
Given seeds idempotentes (upsert, NUNCA delete-all en producción)
When ejecuto prisma db seed
Then existen roles RRHH_ADMIN / JEFE_AREA / COLABORADOR con sus permisos granulares recurso:accion
And existe un usuario admin inicial con password argon2id LEÍDA DE ENV (nunca hardcodeada en el repo)
```

### Historia 2.6 — Tests de seguridad (3 SP)

```gherkin
# Unit: LoginUseCase (ok / password mala / cuenta bloqueada), RefreshTokenUseCase (ok / expirado / reuso)
# Integración:
When login → refresh → logout con cookies reales
Then el flujo completo funciona y el reuso de un refresh revocado revoca la familia (verificado en BD)
And usuario COLABORADOR recibe 403 en endpoints de administración
# Cobertura: dominio identity >= 95%
```

---

## SPRINT 3 — Auditoría y cierre (27 SP)

> **Sprint Goal:** auditoría append-only con decorator en application, seed legal peruano verificado, hardening (husky, health, env) y checklist de cierre de la Fase 0.

### Historia 3.1 — Tabla `audit_logs` (3 SP)

```gherkin
Given el diseño de §9 (actor_id, action, resource_type/id, outcome, metadata jsonb, correlation_id)
When genero la migración con --create-only
Then índices (actor_id, occurred_at), (action, occurred_at), (resource_type, resource_id)
And la tabla es append-only: REVOKE UPDATE, DELETE para el rol de la app
```

### Historia 3.2 — Decorator `@Auditable` / `withAudit` (5 SP)

```gherkin
Given un wrapper en capa application que envuelve casos de uso
And un middleware de request que puebla AsyncLocalStorage con { userId, ip, userAgent, correlationId }
When un caso de uso auditado se ejecuta (éxito o fallo)
Then se inserta un registro en audit_logs con actor, acción, recurso, outcome y correlation_id
And el decorator es testeable de forma aislada (AuditRecorder es un puerto)
```

### Historia 3.3 — Aplicar auditoría a eventos críticos (5 SP)

```gherkin
Then quedan auditados: auth.login.success / auth.login.failure / auth.logout /
     auth.refresh.reuse_detected, CRUD de RBAC (user.create, role.assign, permission.grant),
     cambios en legal_parameters (create/close) y LECTURAS de legal_parameters vía PublicApi
And los tests de integración verifican que cada evento genera su registro con datos completos
```

### Historia 3.4 — Seed legal peruano verificado (3 SP)

```gherkin
Given los valores de §8: RMV S/ 1,130 · UIT S/ 5,350 (2025) · ESSALUD_RATE 9% · ONP_RATE 13%
When ejecuto prisma db seed
Then cada fila tiene legal_reference (decreto/resolución) y valid_from correctos
And los valores fueron verificados contra la norma vigente ANTES del commit
And GET /legal-parameters/RMV/effective devuelve el valor esperado
```

> ⚠️ **Regla innegociable:** nunca commitear un parámetro legal sin verificarlo contra el decreto. (En la generación de este plan, un agente propuso RMV S/ 1,500 y ONP 10% — incorrectos. El riesgo es real.)

### Historia 3.5 — Hooks husky (3 SP)

```gherkin
When git commit → pre-commit corre lint-staged (eslint --fix + prettier en staged)
When git push → pre-push corre typecheck + depcruise y bloquea si falla
```

### Historia 3.6 — Health check + env con zod (4 SP)

```gherkin
Given config/env.ts con zod (DATABASE_URL url, JWT_SECRET min 32 chars, PORT, TTLs...)
When falta o es inválida una variable → el proceso NO arranca y loguea los issues
And GET /health responde 200 { status, uptime, checks: { database: SELECT 1, ... } }
And si la BD está caída responde 503 con status degraded
```

### Historia 3.7 — Checklist de cierre (4 SP)

**La Fase 0 está cerrada cuando todo esto es verificable:**

- [ ] Estructura `shared/`, `contracts/`, `modules/`, `audit/` + depcruise verde
- [ ] `legal-parameters` end-to-end + PublicApi consumible por otro módulo vía DI
- [ ] Migración con CHECK + EXCLUDE aplicada vía `--create-only`; `migrate diff --exit-code` verde
- [ ] Soft delete + inmutabilidad activos en tablas de retención
- [ ] Login argon2id + access 15 min + refresh rotativo en cookie httpOnly
- [ ] Test de integración prueba que el reuso de refresh revoca la familia
- [ ] RBAC (5 tablas) + `authenticate`/`authorize(permission)` operativos
- [ ] Rate limit (429) + lockout de cuenta funcionando
- [ ] Seed legal con RMV, UIT, EsSalud 9%, ONP 13% + `legal_reference` verificada
- [ ] `audit_logs` append-only + decorator auditando los eventos de la historia 3.3
- [ ] CI completa verde; husky activo; cobertura global >80% y dominio >95% (umbral forzado)
- [ ] `env.ts` valida con zod y el arranque falla si falta algo
- [ ] `docker-compose` + README con setup local funcional; `GET /health` responde

---

## 12. Ceremonias adaptadas a 1 desarrollador (~4 h/semana)

| Ceremonia | Día/Hora | Duración | Contenido |
|-----------|----------|----------|-----------|
| **Sprint Planning** | Lunes 09:30 | 1.5 h | Mini-retro del sprint anterior, refinar criterios, seleccionar historias ≤30 SP, escribir Sprint Goal |
| **Daily asíncrono** | 08:00 y 16:00 | 5 min × 2 | Diario escrito en issue fijado: ayer / hoy / bloqueadores. Bloqueador se resuelve el mismo día o se convierte en SPIKE |
| **Refinement** | Miércoles 14:00 | 1 h | Preparar historias del siguiente sprint (DoR), estimar, documentar decisiones en ADL |
| **Sprint Review** | Viernes 16:30 | 1 h | Demo contra criterios de aceptación historia por historia; lo no cumplido va al backlog |
| **Retrospective** | Viernes 17:30 | 30 min | 3 columnas (mantener / mejorar / experimentar) + 1-2 acciones concretas + check de energía (1-10) |

## 13. Definition of Done / Definition of Ready

**DoD — una historia está terminada cuando:**

1. Código en rama `feature/FASE0-NNN-slug`
2. Tests unit (dominio >95%) + integración cuando toca endpoint/repositorio
3. CI verde completa (lint, depcruise, typecheck, prisma validate, migrate diff, tests)
4. PR con template: descripción, criterios como checkboxes, cobertura
5. Auto-review del PR antes de merge
6. Migraciones validadas si hubo cambios de schema
7. Merge a main + rama eliminada

**DoR — una historia está lista para entrar al sprint cuando:**

1. Criterios de aceptación en Given/When/Then, verificables
2. Story Points estimados (Fibonacci; regla práctica: 1 SP ≈ 1 h, 8 SP ≈ 6 h)
3. Dependencias y bloqueadores identificados
4. Contexto técnico definido (módulo, tablas, endpoints, si es `security`)

## 14. Tablero y convenciones

- **Herramienta:** GitHub Projects (integrado con Issues/PRs, gratuito).
- **Columnas:** `Backlog → Sprint Backlog → In Progress → Ready for Review → Review → Done` — **WIP máximo 2** en In Progress.
- **Labels:** `epic/*`, `sprint/1|2|3`, `type/feature|bug|refactor|spike|doc`, `module/*`, `priority/*`, `security`, `status/ready|blocked`.
- **Ramas:** `feature/FASE0-NNN-slug` (NNN = número de issue). Ej.: `feature/FASE0-005-jwt-authentication`.
- **Commits:** `[FASE0-NNN] Mensaje imperativo` (50-72 chars).
- **PR template** (`.github/pull_request_template.md`): descripción, `Closes #NNN`, criterios verificados con checkboxes, testing (unit/integración/manual), checklist DoD.
- **Burndown manual:** tabla en `docs/sprint/sprint-N-burndown.md` actualizada el viernes (día / SP completados / SP restantes).

## 15. Riesgos y mitigaciones

### De gestión

| Riesgo | Prob. | Impacto | Mitigación |
|--------|-------|---------|------------|
| Burnout del dev único | Alta | Crítico | Capacidad conservadora (28 SP), sin fines de semana, check de energía en el diario; si energía <5 dos días seguidos, reducir capacidad |
| Bloqueo por decisión arquitectónica | Media | Alto | SPIKE time-boxed si la duda dura >1 h; decisiones documentadas en ADL |
| Scope creep mid-sprint | Media | Medio | Solo bugs P0 entran al sprint; ideas nuevas → backlog |
| Deuda técnica | Media | Alto | Umbral de cobertura en CI; si cae <80%, pausar features |

### Técnicos

| Riesgo | Mitigación |
|--------|------------|
| Prisma no expresa CHECK/EXCLUDE → tentación de validar solo en app | `--create-only` obligatorio; EXCLUDE en BD como fuente dura; test que intenta insertar solapamiento |
| Testcontainers/Docker inestable en Windows local | Fallback docker-compose con Postgres de test fijo; Testcontainers en CI Linux |
| Fronteras entre módulos se erosionan | dependency-cruiser bloqueando merge desde el día 1 |
| Rotación de refresh con condición de carrera | Revoke+issue en una transacción; test de reuso concurrente |
| Valores legales incorrectos en seed | `legal_reference` obligatoria + verificación contra el decreto antes del commit |
| Cifrado de campos sensibles (Ley 29733) no diseñado aún | Definir ya la convención (`FieldEncryptor` como puerto en shared) aunque se implemente después |
| Sobre-ingeniería | DI manual, solo legal-parameters e identity completos, el resto placeholders; NO implementar cálculos legales todavía |
| UUID v7 sin soporte nativo en la versión de Postgres | Generar en app con `uuidv7` npm |

## 16. Secuenciación resumen

| Semana | Sprint | Entregable central |
|--------|--------|--------------------|
| 1 | Sprint 1 (31 SP) | Arquitectura validada sobre el módulo más simple: `legal-parameters` end-to-end + CI |
| 2 | Sprint 2 (30 SP) | `identity` completo: RBAC + JWT + refresh rotativo + rate limit |
| 3 | Sprint 3 (27 SP) | Auditoría + seed legal verificado + hardening + checklist de cierre |

**Total: 88 SP / 19 historias / 3 semanas.** Al cierre, la Fase 1 (módulo Colaboradores/legajo) puede iniciar sobre una base con fronteras forzadas, auth production-ready y el patrón de módulo ya probado dos veces.
