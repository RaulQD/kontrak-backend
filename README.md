# Kontrak Backend

Backend del sistema **Kontrak HRIS** (RR.HH. para Perú): gestión de colaboradores,
contratos, planilla y cumplimiento legal laboral. Convive con el sistema legacy de
generación de contratos/adendas desde Excel (OneDrive + plantillas PDF), que se irá
migrando por fases.

- **Planificación:** [`docs/scrum/`](./docs/scrum/) (backlog de 85 US y plan de 17 sprints)
- **Arquitectura:** [`docs/arquitectura-clean-ddd-monolito-modular.md`](./docs/arquitectura-clean-ddd-monolito-modular.md)
- **Estado actual del avance:** [`docs/estado-actual-avance.md`](./docs/estado-actual-avance.md)

## Stack

| Capa | Tecnología |
|------|------------|
| Runtime | Node.js ≥ 24 + TypeScript |
| Framework HTTP | Express 5 |
| ORM | Prisma 7 (adaptador `PrismaPg`) |
| Base de datos | PostgreSQL 16 (Docker) |
| Validación | Zod 4 |
| Tests | Vitest |
| Gestor de paquetes | pnpm 11 |

## Requisitos previos

- Node.js ≥ 24 y pnpm ≥ 11 (`npm i -g pnpm@11`)
- Docker + Docker Compose (en WSL2 no se necesita Docker Desktop)

## Setup local

```bash
# 1. Dependencias
pnpm install

# 2. Variables de entorno
cp .env.example .env    # completar valores (ver tabla más abajo)

# 3. Levantar infraestructura + API contenedorizada
docker compose up -d --build

# 4. Generar cliente Prisma, aplicar migraciones y sembrar catálogos
pnpm prisma generate
pnpm prisma migrate deploy
pnpm seed

# 5. Verificar
curl http://localhost:3000/api/health   # → 200
```

## Servicios y puertos

| Servicio | Contenedor | Puerto host | Notas |
|----------|------------|-------------|-------|
| API | `kontrak_api` | `3000` | Imagen multi-stage (ver `Dockerfile`) |
| PostgreSQL 16 | `kontrak_postgres` | `5433` | 5433 en el host porque el 5432 suele estar ocupado por otros proyectos |
| pgAdmin | `kontrak_pgadmin` | `5051` | UI web para la BD: `http://localhost:5051` |
| Redis | *(comentado)* | — | Se activa cuando exista BullMQ (worker) |

### Cómo conectarse a la base de datos

La regla de oro — el puerto depende de **desde dónde** te conectas:

| Quién se conecta | URL / datos |
|------------------|-------------|
| Tú desde el host (`pnpm prisma …`, `pnpm seed`, clientes SQL) | `postgresql://postgres:<password>@localhost:5433/kontrak_db` |
| El contenedor `api` (inyectado por compose) | `postgresql://postgres:<password>@db:5432/kontrak_db` |
| pgAdmin (registro de servidor) | Host `db` · puerto `5432` · usuario `postgres` |

> Dentro de la red de Docker el host es el nombre del servicio (`db`) y el puerto es
> el interno (`5432`). El `5433` solo existe en tu máquina.

## Variables de entorno

Definidas y validadas con Zod en `src/config/env.ts` (fail-fast: si falta una crítica,
el proceso no arranca). Las principales:

| Variable | Uso |
|----------|-----|
| `DATABASE_URL` | Conexión a PostgreSQL (desde el host: puerto `5433`) |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | Secretos JWT (mínimo 32 caracteres) |
| `JWT_ACCESS_EXPIRES` / `JWT_REFRESH_EXPIRES` | TTLs de tokens (defaults: `15m` / `7d`) |
| `PGADMIN_EMAIL` / `PGADMIN_PASSWORD` | Credenciales de acceso a pgAdmin |
| `ONEDRIVE_ENABLED` | `true` activa el scheduler legacy de OneDrive (requiere las `AZURE_*`) |
| `AZURE_TENANT_ID` / `AZURE_CLIENT_ID` / `AZURE_CLIENT_SECRET` | Integración Microsoft Graph / OneDrive (solo si `ONEDRIVE_ENABLED=true`) |

## Scripts

| Comando | Qué hace |
|---------|----------|
| `pnpm build` | Compila TypeScript a `dist/` |
| `pnpm start` | Arranca desde `dist/` |
| `pnpm test` / `pnpm test:watch` | Tests con Vitest |
| `pnpm seed` | Seed idempotente (roles, permisos, matriz RBAC) |
| `pnpm lint` / `pnpm lint:fix` | ESLint |
| `pnpm type-check` | `tsc --noEmit` |

## Estructura del repositorio

```
src/
├── modules/        ← HRIS nuevo: bounded contexts (auth, employees, …)
│                     con capas domain / application / infrastructure / presentation
├── platform/       ← kernel compartido con I/O (Prisma, config)
├── shared/         ← utilidades puras (constantes, helpers)
├── api/ core/ domain/ infrastructure/ services/
│                   ← sistema legacy de contratos (en migración por fases)
prisma/             ← schema (16 tablas), migraciones y seed
docs/               ← planificación, arquitectura y decisiones
```

El detalle de las reglas de capas y módulos está en
[`docs/arquitectura-clean-ddd-monolito-modular.md`](./docs/arquitectura-clean-ddd-monolito-modular.md).

## Decisiones conscientes (estado actual)

- **Servicio `worker` y Redis diferidos**: no hay colas todavía; el scheduler legacy de
  OneDrive corre dentro del propio API con `node-cron`. Redis queda comentado en el
  compose hasta que exista BullMQ.
- **OneDrive opcional en contenedor**: el API dockerizado corre con `ONEDRIVE_ENABLED`
  sin definir (scheduler apagado). En el host se activa con `ONEDRIVE_ENABLED=true`.
- **Puppeteer pendiente de reemplazo (US-012)**: la imagen Docker **no** incluye
  Chromium; los flujos de generación de PDF solo funcionan fuera del contenedor hasta
  decidir el reemplazo (pdfmake u otro).
- **CI desactivada temporalmente** (billing de GitHub Actions). Deuda: re-activar
  lint → type-check → tests al cerrar el tema de facturación.

## Convenciones

- Commits y ramas: ver [`docs/convencion-de-commits.md`](./docs/convencion-de-commits.md).
- Hooks: `pre-commit` corre `lint-staged` + `type-check` (husky).
