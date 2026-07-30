# Convención de commits y ramas — Kontrak

> Basada en [Conventional Commits](https://www.conventionalcommits.org/es/), adaptada
> al flujo Scrum del proyecto (US del backlog en `docs/scrum/01-product-backlog.md`).

## 1. Formato del commit

```
tipo(ámbito): descripción en imperativo

[cuerpo opcional: el POR QUÉ del cambio]

[footer opcional: Refs US-XXX / Closes #NN]
```

**Ejemplo completo:**

```
feat(auth): implementar LoginUseCase con lockout de cuenta

La política de 5 intentos / 15 min vive en el agregado User, no en el
use case, para mantener la regla de negocio en el dominio.

Refs US-007
```

## 2. Tipos permitidos

| Tipo | Cuándo usarlo | Ejemplo |
|------|---------------|---------|
| `feat` | Nueva funcionalidad visible | `feat(auth): agregar endpoint POST /auth/login` |
| `fix` | Corrección de un bug | `fix(seed): corregir upsert duplicado de permisos` |
| `refactor` | Cambio interno sin alterar comportamiento | `refactor(contracts): extraer validador de adendas` |
| `docs` | Solo documentación | `docs: agregar convención de commits` |
| `test` | Agregar o corregir tests | `test(auth): cubrir bloqueo tras 5 intentos` |
| `chore` | Mantenimiento (deps, configs, tooling) | `chore: actualizar prisma a 7.9` |
| `build` | Build, Docker, empaquetado | `build(docker): agregar Dockerfile multi-stage` |
| `ci` | Pipelines y hooks | `ci: reactivar workflow de GitHub Actions` |
| `perf` | Mejora de rendimiento | `perf(excel): procesar filas en streaming` |
| `style` | Formato sin cambio de lógica | `style: aplicar prettier a módulos legacy` |

## 3. Ámbitos (scope)

Opcional pero recomendado. Usar el módulo o área tocada:

- **Módulos HRIS:** `auth`, `employees`, `contracts`, `payroll`, `leave`, `attendance`, `insurance`, `documents`, `reports`, `notifications`
- **Transversales:** `platform`, `shared`, `prisma`, `seed`, `docker`, `docs`, `scrum`
- **Sistema antiguo:** `legacy`

Si el cambio cruza varios ámbitos, elegir el dominante o omitir el scope.

## 4. Reglas del mensaje

1. **Imperativo, en español**: "agregar", "corregir", "eliminar" (no "agregado", "agregando", "se agrega").
2. **Subject ≤ 72 caracteres**, sin punto final, en minúsculas tras el `tipo(ámbito):`.
3. **Un cambio lógico por commit**: no mezclar un `feat` con un `refactor` no relacionado — se separan en dos commits.
4. **El cuerpo explica el porqué**, no el qué (el qué ya se ve en el diff). Se omite si es obvio.
5. **Referenciar la US** en el footer cuando el commit avanza una historia: `Refs US-007`. Si cierra un issue de GitHub: `Closes #12`.
6. **Breaking change** (raro en esta fase): agregar `!` → `feat(auth)!: cambiar formato del payload JWT`.

**Malos ejemplos (reales del historial, no repetir):**

| ❌ | Problema | ✅ |
|----|----------|----|
| `correciónde ci` | Sin tipo, typo, no dice qué corrige | `ci: corregir ruta del workflow de lint` |
| `agregando prisma y generando un panel de control` | Gerundio, dos cambios mezclados | `feat(prisma): agregar schema inicial` + `chore: configurar prisma studio` |
| `arreglos varios` | No dice nada | un commit por arreglo, cada uno con su tipo |

## 5. Ramas

```
tipo/us-XXX-slug-corto
```

| Tipo de rama | Uso | Ejemplo |
|--------------|-----|---------|
| `feature/` | Historia de usuario o parte de ella | `feature/us-007-jwt-login` |
| `fix/` | Corrección puntual | `fix/seed-permisos-duplicados` |
| `chore/` | Mantenimiento / tooling | `chore/us-002-docker-multistage` |
| `docs/` | Solo documentación | `docs/convencion-commits` |

Reglas:

- Siempre en minúsculas, palabras separadas por guiones.
- Salen de `develop` y vuelven a `develop` vía Pull Request.
- `main` solo recibe merges desde `develop` (releases).
- Borrar la rama tras el merge.

## 6. Flujo resumido

```bash
git checkout develop && git pull
git checkout -b feature/us-007-jwt-login
# ... commits siguiendo esta convención ...
git push -u origin feature/us-007-jwt-login
# PR → develop, con los criterios de aceptación de la US como checklist
```

El PR usa como descripción los criterios Gherkin de la US (ver DoD en
`docs/scrum/02-plan-de-sprints.md` §4).

## 7. Enforcement automático (opcional, pendiente)

Cuando se quiera hacer cumplir la convención con husky:

```bash
pnpm add -D @commitlint/cli @commitlint/config-conventional
echo "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.mjs
echo 'pnpm exec commitlint --edit "$1"' > .husky/commit-msg
```

Con eso, un commit que no cumpla el formato es rechazado antes de crearse.
