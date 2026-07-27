# Arquitectura Kontrak HRIS — Clean Architecture + DDD en Monolito Modular

> Documento de referencia de arquitectura. Reúne todas las decisiones acordadas
> para poder retomar el proyecto en otro ambiente sin perder contexto.
>
> **Proyecto:** Kontrak HRIS (Sistema de RR.HH. para Apparka, Perú)
> **Rama:** `feat/hris-system`
> **Última actualización:** 2026-07-27

---

## 1. Stack tecnológico

| Capa | Tecnología |
|---|---|
| Runtime | Node.js + TypeScript |
| Framework HTTP | Express 5 |
| ORM | Prisma 7 (adaptador `PrismaPg`) |
| Base de datos | PostgreSQL |
| Gestor de paquetes | pnpm |
| Validación | Zod 4 |
| Hash de contraseñas | bcryptjs (cost 12) |
| Tokens | jsonwebtoken 9 (access) + `crypto` (refresh opaco) |
| Tests | Vitest |
| SO de desarrollo | Windows 11 |

---

## 2. Decisión de arquitectura

El proyecto usa **tres ideas complementarias** (no compiten, se combinan):

| Concepto | Qué aporta |
|---|---|
| **Monolito modular** | Un solo desplegable. Dividido en **módulos = Bounded Contexts** aislados. Cada módulo se comunica con los demás **solo** a través de su `index.ts` público (barrel). Nunca se importan internals de otro módulo. |
| **Clean Architecture** | Define las **capas** (`domain` / `application` / `infrastructure` / `presentation`) y la **regla de dependencia hacia adentro**. |
| **DDD (tactical)** | Define el **contenido rico** de la capa `domain`: Value Objects, Entities, Aggregates, Domain Services, invariantes de negocio. |

**Resumen mental:** Clean te dice *cómo separar en capas*; DDD te dice *qué poner dentro del dominio*; el monolito modular te dice *cómo agrupar por contexto de negocio*.

### Módulos (Bounded Contexts)

```
auth · employees · contracts · payroll · leave ·
documents · attendance · insurance · notifications · reports
```

---

## 3. Reglas fundamentales (invariantes)

### 3.1 Regla de dependencia (Clean Architecture)

```
presentation ──► application ──► domain ◄── infrastructure
```

- `domain` **no importa nada** de las otras capas ni de librerías externas (ni Prisma, ni bcrypt, ni Express).
- `application` solo conoce **puertos** (interfaces del dominio), nunca implementaciones concretas.
- `infrastructure` implementa esos puertos (adaptadores).
- `presentation` traduce HTTP ↔ casos de uso.
- **Las flechas siempre apuntan hacia el dominio.**

### 3.2 Comunicación entre módulos (Monolito Modular)

- ✅ Un módulo importa de otro **solo** vía su `index.ts` público.
- ❌ Nunca se importan carpetas internas (`otro-modulo/domain/...`).

### 3.3 Regla platform ↔ módulos

- ✅ `módulos → platform` (los módulos usan la infraestructura compartida).
- ❌ `platform → módulos` (platform **nunca** importa de un módulo).

---

## 4. `platform/` vs `shared/` (kernel compartido)

Ambos son transversales, pero se distinguen por **estado / I-O**:

| | `platform/` | `shared/` |
|---|---|---|
| Naturaleza | **Con estado / I-O** (conexiones, bootstrap) | **Puro / sin estado** (funciones, constantes) |
| Ejemplos | `database/prisma.ts`, `config/env.ts`, `http/server.ts`, `http/middlewares/error-handler.ts`, `logger/logger.ts` | `constants/http.ts`, `constants/app-error-code.ts`, `utils/catch-error.ts`, `utils/app-error.ts`, `utils/formatCurrency.ts` |
| Regla | Agnóstico del negocio, compartido por todos los módulos | Utilidades puras sin I-O |

**Mnemónico:** `shared` = *funciones/constantes*; `platform` = *conexiones/bootstrap*.

> ⚠️ Lo que **NO** va en `platform`: middlewares de negocio (`authenticate`/`authorize` → van en `auth/presentation/middlewares/`), reglas de negocio, hashing/JWT.

---

## 5. Estructura de carpetas (raíz)

```
src/
├── modules/                 ← Bounded Contexts (negocio)
│   ├── auth/
│   ├── employees/
│   ├── contracts/
│   └── ...
├── platform/                ← kernel compartido con estado / I-O
│   ├── database/prisma.ts
│   ├── config/env.ts
│   ├── http/server.ts
│   ├── http/middlewares/error-handler.ts
│   └── logger/logger.ts
├── shared/                  ← kernel compartido puro / sin estado
│   ├── constants/
│   └── utils/
└── types/
    └── express.d.ts         ← augmentación de req.user
```

---

## 6. Anatomía de un módulo (4 capas con DDD)

```
modules/auth/
├── domain/                       ← DDD vive aquí
│   ├── value-objects/            (Email, PlainPassword, HashedPassword)
│   ├── entities/                 (User = Aggregate Root, RefreshToken)
│   ├── errors/                   (errores de dominio, sin HTTP)
│   ├── ports/                    (interfaces: repositorios + servicios técnicos)
│   └── types.ts
├── application/                  ← casos de uso (orquestan, no contienen reglas)
│   ├── login.use-case.ts
│   ├── refresh-token.use-case.ts
│   └── logout.use-case.ts
├── infrastructure/               ← adaptadores que implementan los puertos
│   ├── persistence/
│   │   ├── prisma-user.repository.ts
│   │   ├── prisma-refresh-token.repository.ts
│   │   └── mappers/user.mapper.ts       (fila Prisma ⇄ entidad de dominio)
│   └── security/
│       ├── bcrypt-password-hasher.ts
│       ├── jwt-token-signer.ts
│       └── crypto-refresh-token-generator.ts
├── presentation/                 ← HTTP
│   ├── controllers/
│   ├── routes/
│   ├── schemas/                  (Zod)
│   └── middlewares/              (authenticate, authorize)
└── index.ts                      ← composition root (barrel público)
```

**Principio clave DDD:** la lógica de negocio vive en las **Entities / Value Objects**, no en los use cases. El caso de uso solo **orquesta**.

---

## 7. Patrones DDD tácticos usados

| Patrón | En este proyecto |
|---|---|
| **Value Object** | Inmutable y autovalidado: `Email`, `PlainPassword`, `HashedPassword`. Constructor privado + factory `create()`. |
| **Entity** | Tiene identidad y ciclo de vida: `User`, `RefreshToken`. |
| **Aggregate Root** | `User` controla sus invariantes (lockout, estado activo). Se accede al agregado solo por su raíz. |
| **Repository (puerto)** | Abstracción tipo colección del agregado. Se define en `domain/ports`, se implementa en `infrastructure`. |
| **Mapper** | Traduce entre la fila de Prisma y la entidad rica. El dominio nunca ve un objeto Prisma. |
| **Domain Error** | Errores del negocio sin acoplarse a HTTP (`InvalidCredentialsError`, `AccountLockedError`). |
| **Domain Service** | Lógica que no pertenece a una sola entidad (usar con moderación; preferir métodos en el agregado). |

---

## 8. Módulo `auth` en detalle

Cubre las historias de usuario del **Sprint 1 (Fase 0)**:

- **US-007** — Autenticación JWT + refresh token.
- **US-008** — RBAC (middlewares `authenticate` / `authorize`).
- **US-009** — Auditoría (audit log).

> **US-004** (seed de catálogos RBAC: roles, permisos, role_permissions) ya está ✅.

### 8.1 Diseño de tokens

| Token | Tipo | Contenido | Almacenamiento |
|---|---|---|---|
| **Access** | JWT (stateless) | Solo `sub` = userId. Roles/permisos se resuelven en el middleware vía DB (para que las revocaciones sean inmediatas). | No se guarda |
| **Refresh** | Opaco, 256-bit aleatorio (`crypto.randomBytes(32).toString('hex')`) | — | Se guarda **hasheado** (sha256) en DB. `RefreshToken.tokenHash` es `@unique`. |

**Distinción de hashing:**
- **Contraseñas → bcrypt** (cost 12, salteado, lento; entrada de baja entropía).
- **Refresh tokens → sha256** (rápido, determinista; alta entropía y se busca por `WHERE token_hash = ...`).

### 8.2 Rotación de refresh + detección de reúso (OWASP)

- Campos: `RefreshToken.replacedBy` + `tokenFamilyId`.
- Al refrescar: se marca el token viejo como reemplazado y se emite uno nuevo en la misma familia.
- Si se **reutiliza** un token ya reemplazado → se **revoca toda la familia** (posible robo).

### 8.3 Política de bloqueo de cuenta (lockout)

- Campos en `User`: `failedLoginAttempts` + `lockedUntil`.
- Política: `MAX_ATTEMPTS = 5`, `LOCK_MINUTES = 15`.
- **La invariante vive dentro del agregado `User`**, no en un service externo.

---

## 9. Pseudocódigo del dominio de `auth`

> Pseudocódigo de referencia. Guía la implementación; no es TypeScript final.

### 9.1 Value Object — `Email`

```
class Email:
  private constructor(value)              # constructor privado
  static create(raw) -> Email:
    normalized = raw.trim().toLowerCase()
    if not matchesEmailRegex(normalized):
        throw InvalidEmailError
    return new Email(normalized)
  get value()
  equals(other) -> boolean
```

### 9.2 Value Object — `PlainPassword`

```
class PlainPassword:
  private constructor(value)
  static create(raw) -> PlainPassword:
    if raw.length < MIN_PASSWORD_LENGTH:   # p.ej. 8
        throw WeakPasswordError
    # (opcional: exigir mayúscula/número/símbolo)
    return new PlainPassword(raw)
  get value()
```

### 9.3 Aggregate Root — `User`

```
class User:
  private props { id, email: Email, passwordHash, failedLoginAttempts,
                  lockedUntil, isActive }

  # comportamiento de dominio (no getters/setters tontos)

  isLocked(now) -> boolean:
    return lockedUntil != null AND lockedUntil > now

  registerFailedLogin(now):                     # muta estado + aplica política
    this.failedLoginAttempts += 1
    if this.failedLoginAttempts >= MAX_ATTEMPTS:   # 5
        this.lockedUntil = now + LOCK_MINUTES      # 15 min
        this.failedLoginAttempts = 0

  registerSuccessfulLogin():
    this.failedLoginAttempts = 0
    this.lockedUntil = null

  ensureActive():
    if not this.isActive: throw AccountInactiveError
```

### 9.4 Errores de dominio

```
InvalidEmailError
WeakPasswordError
InvalidCredentialsError
AccountLockedError
AccountInactiveError
RefreshTokenReuseError
```

### 9.5 Puertos (interfaces) — versión corregida

```
interface IUserRepository:
  findByEmail(email: Email) -> Promise<User | null>
  findById(id: string)      -> Promise<User | null>
  save(user: User)          -> Promise<void>

interface IRefreshTokenRepository:
  save(token: RefreshToken)               -> Promise<void>
  findByHash(tokenHash: string)           -> Promise<RefreshToken | null>
  revokeFamily(tokenFamilyId: string)     -> Promise<void>

interface IPasswordHasher:
  hash(plain: string)             -> Promise<string>
  verify(plain: string, hash: string) -> Promise<boolean>   # ← boolean, no string

interface ITokenSigner:
  signAccess(payload: AccessPayload) -> string
  verifyAccess(token: string)        -> AccessPayload

interface IRefreshTokenGenerator:
  generate() -> string          # crypto.randomBytes(32).toString('hex')
  hash(token: string) -> string # sha256
```

### 9.6 Tipos

```
type AccessPayload = { sub: string }

type AuthenticatedUser = {
  id: string
  email: string
  roles: string[]
  permissions: string[]
}
```

---

## 10. Pseudocódigo de la capa `application` (Login)

```
LoginUseCase.execute(rawEmail, rawPassword, ctx { ip, userAgent }):
  email = Email.create(rawEmail)                 # VO valida formato
  user  = userRepo.findByEmail(email)
  if user == null: throw InvalidCredentialsError

  user.ensureActive()
  if user.isLocked(now): throw AccountLockedError

  ok = passwordHasher.verify(rawPassword, user.passwordHash)
  if not ok:
      user.registerFailedLogin(now)              # ← regla en el dominio
      userRepo.save(user)
      throw InvalidCredentialsError

  user.registerSuccessfulLogin()
  userRepo.save(user)

  # emitir tokens
  accessToken  = tokenSigner.signAccess({ sub: user.id })
  refreshPlain = refreshGen.generate()
  refreshHash  = refreshGen.hash(refreshPlain)
  refreshTokenRepo.save(new RefreshToken({
      tokenHash: refreshHash, userId: user.id,
      tokenFamilyId: newUuid(), expiresAt: now + REFRESH_TTL,
      ip: ctx.ip, userAgent: ctx.userAgent }))

  return { accessToken, refreshToken: refreshPlain }
```

---

## 11. Composition Root (`index.ts` del módulo)

El `index.ts` de cada módulo **instancia los adaptadores concretos y los inyecta** en los casos de uso; luego expone el router público.

```
# modules/auth/index.ts (composition root)

# 1. adaptadores (infrastructure) — reutilizan platform, no crean conexiones
userRepo        = new PrismaUserRepository(prisma)      # prisma de platform
refreshRepo     = new PrismaRefreshTokenRepository(prisma)
passwordHasher  = new BcryptPasswordHasher()
tokenSigner     = new JwtTokenSigner(env)
refreshGen      = new CryptoRefreshTokenGenerator()

# 2. casos de uso (application) — reciben puertos por inyección
loginUseCase    = new LoginUseCase(userRepo, refreshRepo, passwordHasher,
                                   tokenSigner, refreshGen)

# 3. presentation
authController  = new AuthController(loginUseCase, ...)
export authRouter   # se monta en el router raíz de la app
```

> ⚠️ `PrismaUserRepository` **no crea su propia conexión**: reutiliza el cliente
> Prisma de `platform/database/prisma.ts` (evita múltiples pools de conexión).

---

## 12. Convenciones de nombres

- Interfaces (puertos): prefijo `I` en PascalCase → `IUserRepository`, `IPasswordHasher`.
- Archivos: kebab-case + sufijo por tipo → `user.repository.port.ts`, `bcrypt-password-hasher.ts`, `login.use-case.ts`.
- Value Objects: `*.vo.ts`. Entidades: `*.entity.ts`. Errores: `*.errors.ts`.

---

## 13. Dependencias y variables de entorno

### 13.1 Instalar

```bash
pnpm add -D @types/jsonwebtoken      # jsonwebtoken v9 no trae tipos propios
```

> `bcryptjs@3` ya incluye sus tipos.
> Nota jsonwebtoken v9: `expiresIn` tiene un quirk de tipado (`ms.StringValue`);
> castear con `SignOptions` si TS se queja.

### 13.2 Variables de entorno (agregar / descomentar en `platform/config/env.ts`)

```
JWT_ACCESS_SECRET     (string, .min(32))
JWT_REFRESH_SECRET    (string, .min(32))
JWT_ACCESS_EXPIRES    (default '15m')
JWT_REFRESH_EXPIRES   (default '7d')
BOOTSTRAP_ADMIN_EMAIL
BOOTSTRAP_ADMIN_PASSWORD
```

> `env.ts` usa validación fail-fast con Zod y **solo loguea el nombre** de la
> variable en caso de error, nunca su valor.

> ⚠️ **Seguridad:** el `.env` contiene secretos reales (Azure, SMTP, DB). No
> imprimir valores; releer el archivo antes de editarlo.

---

## 14. Flags pendientes en los stubs actuales

Detalles a corregir en los puertos ya escritos:

1. `password-hasher.port.ts`: `verify(...)` devuelve `Promise<string>` → debe ser **`Promise<boolean>`**. Nombre `IpasswordHasher` → **`IPasswordHasher`**.
2. `refresh-token-repository.port.ts`: `findByHash(...)` devuelve `Promise<void>` → debe devolver **`Promise<RefreshToken | null>`**. `save()` debe recibir la entidad: `save(token: RefreshToken)`.
3. `user.repositorty.port.ts`: typo en el **nombre del archivo** (`repositorty` → `repository`). Interfaz vacía; agregar `findByEmail`, `findById`, `save`.

---

## 15. Checklist de pendientes (Sprint 1 / Auth)

- [ ] Instalar `@types/jsonwebtoken`.
- [ ] Descomentar/agregar variables JWT + bootstrap admin en `env.ts`.
- [ ] Corregir los 3 puertos (sección 14).
- [ ] Modelar `domain/`: Value Objects, entidades `User` / `RefreshToken`, errores.
- [ ] Implementar `infrastructure/`: repos Prisma + mappers + adaptadores de seguridad.
- [ ] Implementar `application/`: `LoginUseCase` (y luego refresh/logout).
- [ ] Implementar `presentation/`: controller, rutas, schema Zod, middlewares `authenticate`/`authorize`.
- [ ] `index.ts` composition root + montar router en la app.
- [ ] `seedAdminUser()` (bootstrap) — enfoque por confirmar.
- [ ] US-008 (RBAC) y US-009 (auditoría) tras el slice de Login.

### Slices sugeridos (orden)

1. **Login** end-to-end (domain → application → infra → presentation).
2. Middlewares `authenticate` + `authorize` (US-008).
3. Rotación de refresh (use case + detección de reúso).
4. Logout.

---

## 16. Fuentes de planificación (source of truth)

**Oficiales (Opción A):**
- `docs/scrum/01-product-backlog.md` (EP-01…15, US-001…085, Gherkin).
- `docs/scrum/02-plan-de-sprints.md` (17 sprints).
- `docs/plan_sistema_rrhh_hris.md`.

**Subordinados:**
- `docs/sprint/sprint-1.md`.
- `docs/diseno_bd_fase0.md`.
