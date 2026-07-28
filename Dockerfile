# ──────────────────────────────────────────────────────────────
# Stage 1: deps — instala TODAS las dependencias (dev incluidas)
# ──────────────────────────────────────────────────────────────
FROM node:24-bookworm-slim AS deps

RUN npm install -g pnpm@11.17.0
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# --ignore-scripts: evita que "prepare:husky" falle(no hay .git en la imagen)"
RUN pnpm install --frozen-lockfile --ignore-scripts


# ------------------------------------------------------------
#  Stage 2: build - genera cliente Prisma + compila TypeScript
# ------------------------------------------------------------
FROM deps AS build
# prisma.config.ts lee DATABASE_URL; generate no conecta, pero le damos un dummy
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
COPY prisma.config.ts tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
RUN pnpm prisma generate && pnpm build

# ──────────────────────────────────────────────────────────────
# Stage 3: prod-deps — solo dependencias de producción
# ──────────────────────────────────────────────────────────────
FROM node:24-bookworm-slim AS prod-deps
RUN npm install -g pnpm@11.17.0
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod --ignore-scripts


# ──────────────────────────────────────────────────────────────
# Stage 4: runtime — imagen final mínima
# ──────────────────────────────────────────────────────────────
FROM node:24-bookworm-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
RUN mkdir -p temp/uploads temp/pdfs temp/zips generated_contracts \
    && chown -R node:node /app
USER node

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD node -e "fetch('http://localhost:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "dist/index.js"]