# Estado actual del proyecto — ¿En qué HU estamos?

> Generado el 2026-07-27 a partir del análisis de `docs/` (arquitectura, scrum, sprints)
> y del código real en `src/`, `prisma/` y el historial de git.
>
> **Rama activa:** `develop` (PR #24 de `feat/hris-system` mergeado el 2026-07-27)

---

## TL;DR

**Estamos iniciando la US-007 — Autenticación JWT (access + refresh token)**, la primera
historia del **Sprint 2 "Autenticación, RBAC y Almacenamiento"** (2026-07-28 → 2026-08-08).

- Del **Sprint 1** (Fase 0 — Fundaciones: US-001 a US-006) está sólido el **núcleo de BD
  (16 tablas + migraciones) y el seed RBAC**; pero **ninguna US cumple el DoD completo**
  (faltan tests, docs, Dockerfile, wiring del nuevo `env.ts`, y el server HTTP nuevo no
  existe — el que corre es el legacy). Ver detalle verificado en §2.
- El trabajo en curso es el **módulo `auth`** siguiendo Clean Architecture + DDD: ya existen
  los *stubs* de los puertos del dominio (`src/modules/auth/domain/ports/`), pero todavía
  no hay entidades, casos de uso, adaptadores ni capa HTTP.
- El documento `docs/arquitectura-clean-ddd-monolito-modular.md` (actualizado hoy) es la
  guía de implementación de este avance; su **sección 15** es el checklist vivo de pendientes.

---

## 1. Contexto: dónde está parado el proyecto

El repo tiene dos "vidas" conviviendo:

| Parte | Ubicación | Estado |
|---|---|---|
| **Sistema legacy** (generador de contratos/adendas, Excel, OneDrive, emails, SCTR) | `src/api/`, `src/core/`, `src/domain/`, `src/infrastructure/`, `src/services/` | Funcional, en producción de facto. No se toca por ahora. |
| **Nuevo HRIS** (monolito modular + Clean Architecture + DDD) | `src/modules/`, `src/platform/`, `prisma/` | En construcción. Es donde está el avance actual. |

La planificación oficial (source of truth) es:

- `docs/scrum/01-product-backlog.md` — 15 épicas, 85 historias (US-001…US-085).
- `docs/scrum/02-plan-de-sprints.md` — 17 sprints (2026-07-13 → 2027-04-03).
- `docs/plan_sistema_rrhh_hris.md` — plan maestro.

---

## 2. Sprint 1 (2026-07-13 → 2026-07-24) — verificación US por US

> Verificado contra las subtareas del plan oficial (`02-plan-de-sprints.md` §7, Sprint 1)
> revisando el código real. El sprint terminó por calendario, pero **ninguna US cumple
> el DoD completo** (el DoD exige tests + docs). Lo estructural (BD + seed RBAC) sí está.

### Resumen

| US | Historia | Pts | Estado real |
|---|---|---|---|
| **US-001** | PostgreSQL 16 + Prisma | 3 | 🟡 **~80%** — schema y migraciones sólidos; faltan tests, doc ER y empresa test |
| **US-002** | Docker multi-stage + compose | 3 | 🔴 **~40%** — solo Postgres+Redis de dev; sin Dockerfile de la app |
| **US-003** | Validación env con Zod | 2 | 🟡 **~60%** — `env.ts` bien hecho pero **no cableado al arranque**; `.env.example` desactualizado |
| **US-004** | Seed de catálogos | 2 | 🟡 **~50%** — RBAC completo; contract_types y legal_parameters comentados; sin ubigeo |
| **US-005** | Estructura hexagonal | 1 | 🔴 **~30%** — solo `auth` (parcial) y `employees` (vacío); sin aliases ni boundaries |
| **US-006** | Servidor HTTP + middlewares | 2 | 🔴 **No iniciada** para el HRIS — el server que corre es 100% legacy |

### Detalle por US

**US-001 — PostgreSQL + Prisma** 🟡
- ✅ `prisma/schema.prisma` con **exactamente las 16 tablas núcleo**: Company, Branch, Division, Position, Ubigeo, Employee, ContractType, Contract, User, Role, Permission, RolePermission, UserRole, RefreshToken, AuditLog, LegalParameters.
- ✅ 6 ENUMs (SctrRiskLevel, DocumentType, EmployeeStatus, SexType, MaritalStatus, ContractStatus).
- ✅ 9 migraciones versionadas (última `20260723062334_legal_parameters`).
- ✅ Soft-delete `deletedAt` en las 7 tablas que lo requieren (Company, Branch, Division, Position, Employee, Contract, User).
- ✅ `.gitignore` correcto (.env, node_modules, prisma generated).
- ❌ Sin `docs/database/schema.md` ni diagrama ER.
- ❌ Sin test de constraints (insertar empleado/contrato). El único test del repo es `formatCurrency.test.ts`.
- ❌ Seed no incluye la "1 empresa test".

**US-002 — Docker** 🔴
- ✅ `docker-compose.yaml`: `postgres:16-alpine` + `redis:7-alpine`, volúmenes nombrados, healthchecks, restart policy.
- ❌ No existe `Dockerfile` (multi-stage builder→runtime) ni `.dockerignore`.
- ❌ Compose no tiene los servicios `api` ni `worker` (el plan pedía 4 servicios).
- ❌ Sin escaneo Trivy.
- ⚠️ Bug menor: el comentario dice "5433 en el host porque hay un PostgreSQL nativo ocupando el 5432", pero el mapeo real es `'5432:5432'` — comentario y mapeo no coinciden.

**US-003 — Validación env con Zod** 🟡
- ✅ `src/config/env.ts` correcto: Zod, fail-fast con `process.exit(1)`, solo loguea nombre de variable (nunca el valor), incluye `DATABASE_URL`, `REDIS_URL`, `JWT_ACCESS_SECRET/REFRESH_SECRET` (min 32), TTLs con defaults.
- ⚠️ **No está cableado al bootstrap**: `src/index.ts` sigue usando el config legacy (`src/config/index.ts`, `process.env` sin validar). Hoy `env.ts` solo lo importa `src/platform/database/prisma.ts`, así que el fail-fast **no protege el arranque del server**.
- ⚠️ `.env.example` existe pero solo tiene variables legacy (CORS, Azure, límites) — **faltan** `DATABASE_URL`, `JWT_*`, `REDIS_URL`.
- ❌ Solo 9 variables validadas (el plan pedía 15+; las de Azure/SMTP siguen fuera de `env.ts`).
- ❌ Sin test de "variable faltante → exit 1".

**US-004 — Seed de catálogos** 🟡
- ✅ RBAC completo e idempotente (upsert): **5 roles** (SUPER_ADMIN, HR_ADMIN, HR_ANALYST, MANAGER, EMPLOYEE), **29 permisos** granulares `recurso:accion`, matriz `role_permissions` (SUPER_ADMIN = todos, resuelto en seed).
- ❌ `seedContractTypes()` y `seedLegalParameters()` están **comentados** (`prisma/seed.ts:210-211`) — no hay tipos de contrato con base legal ni UIT/RMV sembrados.
- ❌ Sin seed de ubigeo (la tabla existe, está vacía).
- ❌ Sin payroll_concepts ni pension_systems/AFP — razonable diferirlos (sus tablas son de fases posteriores), pero el plan los listaba aquí.
- ❌ Sin test de conteos post-seed. Sin usuario admin bootstrap.

**US-005 — Estructura hexagonal** 🔴
- 🟡 Solo existen 2 de 9 módulos: `auth` (solo `domain/ports` + `types.ts`) y `employees` (un `index.ts` **vacío**). Faltan contracts, documents, attendance, leave, payroll, insurance, reports (aunque sea como placeholders).
- 🟡 `platform/` solo tiene `database/prisma.ts` — faltan http, queue, storage, email, pdf.
- ❌ Path aliases (`@modules/*`, `@platform/*`, `@shared/*`) comentados en `tsconfig.json:35`.
- ❌ Sin `eslint-plugin-boundaries` ni dependency-cruiser — **las fronteras de arquitectura no se hacen cumplir con nada** hoy.
- ❌ Sin README de arquitectura en `src/modules/`.

**US-006 — Servidor HTTP + middlewares** 🔴
- El server que corre es el **legacy completo**: `src/index.ts` → `src/services/app.ts` + `src/api/` (con el scheduler de OneDrive). No existe `src/platform/http/`.
- ✅ Hay un `GET /api/health` pero es el del legacy (`src/api/routes/index.ts:10`), no el nuevo con checks de BD.
- ❌ Sin RFC 7807, requestId/AsyncLocalStorage, pino-http, helmet ni rate limiting.
- ❌ Sin tests de health/404/AppError, sin `docs/http/middleware.md`.

### Extras verificados (fuera de las US pero relevantes)

- **Tests globales:** 1 solo archivo (`formatCurrency.test.ts`). La cobertura exigida por el DoD no existe aún.
- **Husky:** `pre-commit` activo con `lint-staged + type-check` ✅ (adelanto del plan); no hay `pre-push`.
- **CI:** retirada temporalmente por billing de GitHub (commit `e6cba94`, 2026-07-24). Deuda: re-activarla.
- **Scripts:** `seed`, `lint`, `type-check`, `test` existen en `package.json` ✅.

### Implicación

El **Sprint Goal** del Sprint 1 era: "`docker-compose up` trae BD + API en puerto 3000".
Hoy se cumple a medias: la BD sí levanta con compose; la API que corre en 3000 es la
**legacy**, no la nueva plataforma HTTP. La deuda de US-003 (wiring), US-005 (boundaries)
y US-006 (platform/http) **conviene saldarla como parte del slice de Login de US-007**,
porque el módulo `auth` necesita justamente ese server nuevo para montar sus rutas.

---

## 3. HU EN CURSO: US-007 — JWT access + refresh token (Sprint 2)

**Sprint 2:** 2026-07-28 → 2026-08-08 · US-007 (3 pts), US-008 (2), US-009 (2), US-010 (2), US-011 (3) + spike de firmas.

El módulo `auth` cubrirá las tres primeras historias del sprint:

- **US-007** — Autenticación JWT + refresh token rotativo ← **avance actual**
- **US-008** — RBAC (middlewares `authenticate` / `authorize`)
- **US-009** — Auditoría (audit log)

### 3.1 Lo que YA existe del módulo `auth`

```
src/modules/auth/
└── domain/
    ├── ports/
    │   ├── password-hasher.port.ts        ← stub (con flaws, ver 3.2)
    │   ├── refresh-token-repository.port.ts ← stub (con flaws)
    │   ├── token-generator.port.ts        ← OK (IRefreshTokenGenerator)
    │   ├── token-signer.port.ts           ← OK (ITokenSigner)
    │   └── user.repositorty.port.ts       ← stub vacío + typo en el nombre
    └── types.ts                           ← AccessPayload, authenticatedUser
```

Además ya está listo el soporte de infraestructura que `auth` necesita:
tablas `users / roles / permissions / role_permissions / user_roles / refresh_tokens /
audit_logs` en Prisma, seed RBAC, variables JWT en `env.ts` y el cliente Prisma
compartido en `src/platform/database/prisma.ts`.

### 3.2 Flaws pendientes en los stubs (sección 14 del doc de arquitectura)

1. `password-hasher.port.ts` — `verify()` debe devolver `Promise<boolean>` (hoy `Promise<string>`); renombrar `IpasswordHasher` → `IPasswordHasher` y exportar la interfaz.
2. `refresh-token-repository.port.ts` — `findByHash()` debe devolver `Promise<RefreshToken | null>` (hoy `void`); `save()` debe recibir la entidad. Falta `revokeFamily(tokenFamilyId)`.
3. `user.repositorty.port.ts` — typo en el nombre del archivo (`repositorty` → `repository`); la interfaz está vacía: agregar `findByEmail`, `findById`, `save`.

### 3.3 Lo que falta para cerrar US-007 (checklist, sección 15 de la arquitectura)

- [ ] Instalar `@types/jsonwebtoken`.
- [ ] Corregir los 3 puertos (arriba).
- [ ] **Domain:** Value Objects (`Email`, `PlainPassword`, `HashedPassword`), entidades
      `User` (aggregate root con lockout: 5 intentos / 15 min) y `RefreshToken`,
      errores de dominio.
- [ ] **Infrastructure:** `PrismaUserRepository`, `PrismaRefreshTokenRepository`, mappers,
      `BcryptPasswordHasher` (cost 12), `JwtTokenSigner`, `CryptoRefreshTokenGenerator`
      (refresh opaco 256-bit, guardado con sha256).
- [ ] **Application:** `LoginUseCase` → luego `RefreshTokenUseCase` (rotación + detección
      de reúso OWASP: reúso ⇒ revocar toda la familia) → `LogoutUseCase`.
- [ ] **Presentation:** controller, rutas, schemas Zod, middlewares `authenticate`/`authorize`.
- [ ] `index.ts` composition root del módulo + montar router en la app.
- [ ] `seedAdminUser()` bootstrap (variables `BOOTSTRAP_ADMIN_*` aún no están en `env.ts`).

### 3.4 Orden de slices acordado

1. **Login end-to-end** (domain → application → infrastructure → presentation) ← siguiente paso inmediato
2. Middlewares `authenticate` + `authorize` (US-008)
3. Rotación de refresh + detección de reúso
4. Logout

---

## 4. Discrepancias entre documentos (para tener en cuenta)

| Tema | `docs/sprint/sprint-1.md` | Fuente oficial (`docs/scrum/` + arquitectura) |
|---|---|---|
| Plan de Fase 0 | 3 sprints propios (legal-parameters → identity → auditoría), 88 SP | Sprint 1 = US-001…006, Sprint 2 = US-007…011. **Manda la fuente oficial**; `sprint-1.md` es subordinado. |
| Hashing de contraseñas | argon2id | **bcryptjs cost 12** (decisión vigente en la arquitectura) |
| Nombre del módulo de auth | `identity` | **`auth`** (así está en `src/modules/auth`) |
| Módulo ejemplo primero | `legal-parameters` | Se fue directo a `auth`; la tabla `legal_parameters` ya existe pero sin módulo propio todavía |
| Numeración US-007/008/009 | La arquitectura los llama "Sprint 1 (Fase 0)" | El plan de sprints los ubica en **Sprint 2** (las fechas del plan son las que valen) |

También queda pendiente de decisión/re-activación: **CI en GitHub Actions** (retirada por billing) y **dependency-cruiser / ESLint boundaries** para hacer cumplir las fronteras entre módulos.

---

## 5. Próximo paso concreto

Arrancar el **slice 1 (Login end-to-end)** de la US-007:

1. Corregir los 3 puertos con flaws.
2. Modelar `domain/` de `auth` (VOs + `User` + `RefreshToken` + errores).
3. `LoginUseCase` + adaptadores + `POST /auth/login`.
