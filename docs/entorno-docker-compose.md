# Entorno local con Docker Compose (para usar Prisma)

> Guía para levantar la infraestructura local del proyecto **Kontrak HRIS** en
> otro ambiente. Pensada para que la **codifiques tú mismo** copiando los bloques.
>
> **Última actualización:** 2026-07-27

---

## 1. Aclaración importante: Prisma NO va en Docker

**Prisma no es un servicio que se levante en un contenedor.** Es una librería
cliente (ORM) que corre **dentro de tu app Node.js**. Lo que Prisma necesita para
funcionar es una **base de datos PostgreSQL** corriendo en algún lado.

Por eso, en el otro ambiente:

```
Docker levanta  →  PostgreSQL  (y Redis, y herramientas de apoyo)
Tu app Node.js  →  usa Prisma para conectarse a ese PostgreSQL
```

Es decir: **Docker Compose = la base de datos + servicios de apoyo. Prisma = se
instala con `pnpm install` y corre con tu app.**

---

## 2. Requisitos previos

- **Docker Desktop** instalado y corriendo (Windows/Mac/Linux).
- **Node.js + pnpm** para la app (Prisma se instala con las dependencias).

Verifica Docker:

```bash
docker --version
docker compose version
```

---

## 3. Análisis: ¿qué servicios necesita el stack?

| Servicio | ¿Para qué? | ¿Requerido? |
|---|---|---|
| **PostgreSQL 16** | Base de datos principal. Es el destino de Prisma. **Sin esto, Prisma no funciona.** | ✅ **Obligatorio** |
| **Redis 7** | Cola de jobs con **BullMQ** (módulo `notifications`, scheduler de OneDrive, tareas en background). Tu `env.ts` ya contempla `REDIS_URL`. | 🟡 Recomendado (se usará pronto) |
| **Mailpit** | Buzón SMTP falso para **probar correos en local** sin enviar emails reales por Brevo. | 🟢 Opcional (dev) |
| **Adminer** | GUI web ligera para inspeccionar PostgreSQL. | 🟢 Opcional (Prisma Studio ya cubre esto) |

> **Nota sobre GUIs:** Prisma trae su propia GUI integrada (`pnpm prisma studio`),
> así que **Adminer es redundante** salvo que prefieras una interfaz SQL clásica.

### Servicios que NO se dockerizan (son SaaS externos)

Estos son servicios en la nube; se consumen vía API con credenciales, no se
levantan en Docker:

- **Brevo** (envío real de correos por SMTP/API en producción).
- **Azure / OneDrive** (Microsoft Graph, almacenamiento de documentos).

En local, para los correos usa **Mailpit** en lugar de Brevo.

---

## 4. `docker-compose.yaml` — versión recomendada

Copia este contenido en un archivo `docker-compose.yaml` en la raíz del proyecto:

```yaml
services:
  # ── PostgreSQL: la base de datos que usa Prisma ─────────────────────
  db:
    image: postgres:16-alpine
    container_name: kontrak_postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: kontrak
      POSTGRES_PASSWORD: kontrak_dev_password
      POSTGRES_DB: kontrak_db
    ports:
      # host:contenedor — si el 5432 del host está libre, deja 5432:5432.
      # Si ya tienes un PostgreSQL nativo ocupando el 5432, usa 5433:5432
      # (y ajusta el puerto en DATABASE_URL).
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U kontrak -d kontrak_db']
      interval: 5s
      timeout: 5s
      retries: 10

  # ── Redis: backend de colas para BullMQ (notifications, jobs) ───────
  redis:
    image: redis:7-alpine
    container_name: kontrak_redis
    restart: unless-stopped
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data
    command: ['redis-server', '--appendonly', 'yes']
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 5s
      timeout: 5s
      retries: 10

  # ── Mailpit: buzón SMTP local para probar correos (opcional) ────────
  mailpit:
    image: axllent/mailpit:latest
    container_name: kontrak_mailpit
    restart: unless-stopped
    ports:
      - '8025:8025'   # UI web  → http://localhost:8025
      - '1025:1025'   # SMTP    → apunta aquí tu config de correo en local

  # ── Adminer: GUI web para PostgreSQL (opcional; Prisma Studio ya sirve) ──
  adminer:
    image: adminer:latest
    container_name: kontrak_adminer
    restart: unless-stopped
    ports:
      - '8080:8080'   # http://localhost:8080
    depends_on:
      db:
        condition: service_healthy

volumes:
  postgres_data:
  redis_data:
```

> Los servicios `mailpit` y `adminer` son opcionales. Si no los quieres, elimina
> esos bloques. Los volúmenes `postgres_data` y `redis_data` **persisten los datos**
> aunque apagues los contenedores.

---

## 5. Variables de entorno que deben COINCIDIR con el compose

En tu `.env`, la `DATABASE_URL` tiene que usar **las mismas credenciales** del
servicio `db` del compose:

```env
# Coincide con POSTGRES_USER / POSTGRES_PASSWORD / POSTGRES_DB del compose
DATABASE_URL="postgresql://kontrak:kontrak_dev_password@localhost:5432/kontrak_db?schema=public"

# Redis (BullMQ)
REDIS_URL="redis://localhost:6379"
```

> ⚠️ Si mapeaste el puerto de Postgres a `5433:5432`, cambia también el puerto en
> la URL: `...@localhost:5433/kontrak_db...`.

Para el correo en local con **Mailpit**, apunta tu configuración SMTP a:

```env
SMTP_HOST=localhost
SMTP_PORT=1025
# Mailpit no requiere usuario/contraseña en local
```

> El resto de secretos reales (Azure, Brevo API key de producción, etc.) **no se
> tocan** para el entorno local — se dejan como estén o vacíos si no los usas.

---

## 6. Flujo de trabajo con Prisma (una vez levantado Docker)

```bash
# 1. Levantar la infraestructura (Postgres, Redis, etc.)
docker compose up -d

# 2. Instalar dependencias del proyecto (incluye Prisma)
pnpm install

# 3. Generar el cliente de Prisma a partir del schema
pnpm prisma generate

# 4. Aplicar el schema a la base (crea las tablas)
pnpm prisma migrate dev        # crea/aplica migraciones en desarrollo
#   — o, si aún no usas migraciones formales —
pnpm prisma db push            # empuja el schema directo (sin historial)

# 5. Cargar los catálogos base (roles, permisos, etc.)
pnpm prisma db seed            # o el script "seed" del package.json

# 6. (Opcional) Abrir la GUI de Prisma para ver los datos
pnpm prisma studio             # http://localhost:5555
```

> **Orden mental:** primero Docker (base de datos viva) → luego Prisma
> (generar → migrar → seed). Si Prisma no encuentra la base, es casi siempre
> porque Docker no está arriba o la `DATABASE_URL` no coincide.

---

## 7. Comandos útiles de Docker Compose

```bash
docker compose up -d            # levantar en segundo plano
docker compose ps               # ver estado / salud de los servicios
docker compose logs -f db       # ver logs de Postgres en vivo
docker compose stop             # detener sin borrar datos
docker compose down             # detener y eliminar contenedores (datos se conservan)
docker compose down -v          # ⚠️ detener y BORRAR volúmenes (datos incluidos)
```

Accesos web (con la versión recomendada):

- **Mailpit** (correos de prueba): http://localhost:8025
- **Adminer** (GUI SQL): http://localhost:8080
  - Sistema: `PostgreSQL` · Servidor: `db` · Usuario: `kontrak` · Contraseña: `kontrak_dev_password` · Base: `kontrak_db`
- **Prisma Studio**: http://localhost:5555 (tras `pnpm prisma studio`)

---

## 8. Nota sobre el compose actual del repo

El `docker-compose.yaml` que ya existe en el repo tiene una **inconsistencia menor**:
el comentario dice *"5433 en el host porque hay un PostgreSQL nativo de Windows
ocupando el 5432"*, pero el mapeo real es `5432:5432`.

- En tu **ambiente actual** (con Postgres nativo en 5432): usa `5433:5432` y pon
  `5433` en la `DATABASE_URL`.
- En el **otro ambiente** (sin Postgres nativo, el 5432 está libre): `5432:5432`
  funciona sin cambios.

---

## 9. Resumen

| Necesito... | Lo levanta... |
|---|---|
| Base de datos para Prisma | **Docker** (servicio `db`, Postgres 16) |
| Colas / jobs (BullMQ) | **Docker** (servicio `redis`) |
| Probar correos sin enviar reales | **Docker** (servicio `mailpit`, opcional) |
| Ver/editar datos | `pnpm prisma studio` (o Adminer) |
| El ORM Prisma en sí | `pnpm install` — **no es un contenedor** |
| Brevo / Azure / OneDrive | **Nada**: son SaaS externos, se usan por API |
