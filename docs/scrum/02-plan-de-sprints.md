# Kontrak HRIS — Plan de Sprints

**Proyecto:** Kontrak HRIS (Transformación del generador de contratos en HRIS completo para Perú)  
**Versión:** 1.0  
**Fecha:** 2026-07-08  
**Scrum Master:** Rol facilitador  
**Desarrollador:** Raul Quispe (1 desarrollador full-stack)

---

## 1. Marco de Trabajo: Scrum Adaptado a 1 Desarrollador

### 1.1 Contexto y Decisión

Scrum está diseñado para equipos, pero Raul es un solo desarrollador trabajando en full-stack. La solución es adaptar Scrum manteniendo **los principios clave** (iteraciones, inspección, adaptación) mientras se eliminan o fusionan las ceremonias que tienen sentido solo con múltiples personas.

### 1.2 Adaptación: "Scrum Solitario"

#### Ceremonias que se mantienen:

| Ceremonia | Formato adaptado | Frecuencia | Duración | Participantes | Propósito |
|---|---|---|---|---|---|
| **Sprint Planning** | Sesión de planificación con el Product Owner (dueño del negocio) | Cada 2 semanas (domingo 19:00 o lunes antes de comenzar) | 1-1.5 horas | Raul + PO | Acordar qué features entran en el sprint, objetivos, riesgos |
| **Daily Standup** | Reporte escrito asincrónico (no formal/síncrono); registro en tablero GitHub Projects | Diariamente en morning commit message o 9 a.m. | 5 minutos de escritura | Raul (auto-reporte) | Detectar blockers temprano, mantener visibility |
| **Sprint Review** | Demo en vivo de lo completado; feedback del dueño del negocio | Viernes final del sprint, 16:00 | 1 hora | Raul + PO | Validar entregables, recopilar feedback de negocio, gestionar expectativas |
| **Sprint Retrospective** | Reflexión breve escrita en Markdown (no larga junta); se aca aún después de review | Viernes final del sprint, luego de review (30-45 min) | 30 minutos | Raul + PO (opcional) | Identificar qué mejorar en proceso, velocidad real, ajustes |

#### Ceremonias adaptadas/eliminadas:

| Ceremonia original | Qué sucede en Scrum solitario |
|---|---|
| Daily scrum formal de 15 min | Reemplazo: GitHub Issues + Projects Kanban con estado (TODO/In Progress/Review/Done). Al final de cada día Raul hace un self-check: ¿avancé? ¿tengo blockers? Escribe 1-2 líneas en el tablero. Sincronización con PO solo si hay riesgo. |
| Sprint Backlog visual en wall/Jira | GitHub Projects (gratis, integrado al repo). Columnas: Backlog, Ready (DoR cumplido), In Sprint, In Progress, Review, Done. Automático con PRs y issues. |
| Orientación técnica grupal | No hay; Raul consulta vía PR reviews o sync ocasional con PO si hay decisión de arquitectura. |

#### Herramienta: GitHub Projects (gratuita, integrada)

- **Tablero:** vista Kanban en https://github.com/RaulQD/kontrak-backend/projects
- **Workflow:** Issues vinculados a PRs automáticamente; `close issue` en commit message cierra en el tablero
- **Métricas:** GitHub Projects + Actions para recopilar velocity (PRs merged/sprint), burndown (issues cerrados por día)
- **Documentación de sprint:** este documento + archivo SPRINT_N.md en `docs/scrum/sprints/` con detalle de cada semana

### 1.3 Cómo se gestiona el scope creep

**Riesgo crítico en Scrum solitario:** el PO puede presionar para agregar cosas sin límite, o Raul sobre-compromete.

**Mitigación:**
1. **Capacidad = velocidad x duración.** Se asume velocidad inicial (ver 1.4), se calcula carga máxima. Si hay cambio de requisitos, se renegocia la fecha de release o se saca algo del sprint. No "meterse horas extras".
2. **Definition of Ready (DoR) estricta.** Una historia solo entra a sprint si cumple DoR; esto evita que historias mal definidas consuman tiempo de desarrollo.
3. **Sprint Review = veto del PO.** Si algo no es acceptable según criterios, vuelve al backlog; el desarrollador no pierde tiempo refinando "a medias".
4. **Retro de velocidad.** Cada 3 sprints se ajusta el plan si la velocidad real difiere en >20% de la asumida.

---

## 2. Parámetros del Plan

### 2.1 Duración de Sprints

**2 semanas (10 días hábiles laborales)** — equilibrio entre feedback rápido y tiempo para desarrollo profundo.

- Lunes 2026-07-13 inicia Sprint 1
- Domingo anterior es planning con PO
- Viernes de cierre: review + retro

### 2.2 Capacidad Realista de 1 Desarrollador

**Horas/semana alocadas:**

```
Horas totales: 40 horas/semana
Menos:
  - Soporte / urgencias: 5% (2 horas)
  - Meetings (planning 1.5h bi-semanal, review 1h, retro 0.5h): 1.5 horas/semana promedio
  - Documentación, investigación no-codificante: 3 horas
  - Descansos, overhead: 4 horas
  = ~28 horas/semana de desarrollo puro
```

**Estimación en story points:** asumiendo que 1 story point ≈ 4-5 horas de trabajo de desarrollo completo (código + tests + documentación):
- 28 horas / 4.5 horas por punto ≈ **6–7 puntos/semana**
- **Sprint de 2 semanas = 12–14 puntos/sprint**

Pero para una **velocidad sostenible** (sin quemarse), asumimos: **20–26 puntos/sprint** como objetivo inicial, calibrando a la baja después de sprints 1–2 si es necesario.

> **Nota:** Esta es una HIPÓTESIS. Después de Sprint 2–3 se mide la velocidad real y se ajusta el plan. Si la media es 18 pts/sprint, todo se retrasa ~10%.

### 2.3 Escala de Estimación: Fibonacci

| Puntos | Significado | Esfuerzo estimado |
|---|---|---|
| 1 | Trivial (PR menor, bump de versión, config) | <2 horas |
| 2 | Muy pequeño (endpoint simple, CRUD sin lógica) | 2–4 horas |
| 3 | Pequeño (endpoint con validación, servicios simples, tests básicos) | 4–8 horas |
| 5 | Mediano (lógica de negocio, integración, tests) | 8–16 horas |
| 8 | Grande (motor de cálculo, integración compleja, refactor importante) | 16–32 horas |
| 13 | Muy grande (rara vez en un sprint solo; normalmente es spike + US separada) | 32–50 horas |

**Regla:** ningún item >8 puntos entra a sprint sin estar ya desglosado en subtareas <5 puntos.

### 2.4 Velocidad Asumida: Hipótesis de Calibración

**Sprint initial (S1–S3): 22 puntos/sprint (midpoint)**

```
Justificación:
- Rampup inicial: código nuevo, arquitectura aún no completamente definida → -2 pts
- 1 dev (sin paralelismo): posibilidad de context switch por bloqueadores
- Pero con stack sólido (Prisma, pnpm, TS): no hay setup costoso

Valores por rango de confianza:
- Optimista (S1): 24–26 pts (todo fluyó, pocas sorpresas)
- Realista (S2–3): 20–22 pts (algunas sorpresas, refinamiento de requisitos)
- Pesimista (S3 hacia adelante): 18–20 pts (deuda acumulada, cambios de alcance)

Replanificación:
- Si velocidad real S1+S2 promedio < 18 pts: reducir plane del backlog ~10%, ajustar fechas hacia adelante
- Si velocidad real S1+S2 promedio > 25 pts: acelerar, re-negotiar hitos
```

### 2.5 Total de Story Points del Backlog

**Estimación de todas las 85 US:**

| Fase | Historias | Estimación (pts) | Justificación |
|---|---|---|---|
| **Fase 0** (Fundaciones) | US-001 a US-006 (6) | 3+3+2+2+1+2 = **13 pts** | Arquitectónica pura, sin lógica de negocio compleja |
| **Fase 1** (Migración) | US-007 a US-019 (13) | 3+2+2+3+3+2+2+3+3+2+3+2+1 = **36 pts** | JWT, RBAC, almacenamiento, PDF, orquestador — integración pura con lógica conocida |
| **Fase 2** (Empleados) | US-020 a US-037 (18) | 5+3+3+5+2+2+2+3+3+2+3+3+3+2+2+2+2+1 = **47 pts** | CRUD con validaciones, importación, maestría |
| **Fase 3** (Asistencia) | US-038 a US-055 (18) | 3+3+3+3+3+3+2+5+5+3+3+3+3+3+3+3+2+2 = **57 pts** | Integración GeoVictoria (spike), cálculo de tardanzas, flujos de ausencias |
| **Fase 4** (Planilla) | US-057 a US-074 (18) | 1+2+2+13+5+5+3+3+3+8+2+5+2+3+3+3+3+2 = **71 pts** | Motor de cálculo (CRÍTICO), AFP, quinta categoría, CTS, gratificaciones |
| **Fase 5** (Reportes/Portal) | US-075 a US-083 (9) | 3+3+3+3+3+3+3+3+3 = **27 pts** | Reportes gerenciales, portal de autoservicio |
| **Fase 6** (Hardening) | US-084 a US-085 (2) | 3+2 = **5 pts** | Backups, documentación operacional |
| **TOTAL** | **85** | **256 pts** | ~9–12 meses a 22 pts/sprint = 11–14 sprints por fase; total ~25 sprints |

---

## 3. Definition of Ready (DoR)

Una historia de usuario **NO entra a sprint** si no cumple **todos** estos criterios:

### DoR Checklist

- [ ] **Criterios de aceptación claros y testables:** al menos 2–3 escenarios Gherkin o bullet points específicos. "Crear un CRUD" es vago; "Crear endpoint POST /employees con validación de DNI y email, retorna 201 + location header" es claro.
- [ ] **Dependencias identificadas:** ¿de qué otras US depende? ¿Hay bloqueadores? Si no puedo empezar hoy, vuelve al refinement.
- [ ] **Tamaño estimado:** 1–8 puntos. Si estimo >8, la splitteo en dos historias menores.
- [ ] **Notas técnicas incluidas:** ¿qué tabla BD afecta? ¿API externa involucrada? ¿Migraciones? ¿Tests? Todo documentado en la US.
- [ ] **Spike o investigación resuelta (si aplica):** si la US depende de una decisión aún sin responder (ej. "cuál es el endpoint de GeoVictoria?"), el spike debe estar completado **antes** de que la US entre a sprint.
- [ ] **Aceptable por el PO:** el requisito no es conflictivo con otros, ni requiere cambios scope a último minuto.

### Herramienta: Plantilla de GitHub Issues

Toda US se crea como GitHub Issue con esta plantilla (`.github/ISSUE_TEMPLATE/us.md`):

```markdown
## User Story: [US-XXX] Título

### Narrativa
Como [rol], quiero [acción], para que [valor de negocio]

### Criterios de aceptación
- [ ] Escenario 1: ...
- [ ] Escenario 2: ...

### Notas técnicas
- Tabla(s): ...
- Dependencias: US-001, US-003
- Estimación inicial: X pts

### Tasks (si está desglosada)
- [ ] Subtarea 1
- [ ] Subtarea 2

### Labels
`fase-0`, `epic-01-fundaciones`, `ready-to-sprint`
```

---

## 4. Definition of Done (DoD)

Un item se marca "DONE" cuando **todos estos checks** están verdes:

### DoD Checklist

- [ ] **Código escrito** en rama `feature/[us-number]-title`, siguiendo estructura modular hexagonal.
- [ ] **TypeScript compila sin errores:** `npm run type-check` pasa.
- [ ] **Tests pasan:** al menos 70% de cobertura en módulos nuevos. `npm run test` verde. Para servicios de aplicación: test unitario + integración si toca BD.
  - Unitarios (sin BD): servicios de dominio, validadores Zod, funciones puras.
  - Integración (con BD): repositorios, orquestadores, endpoints HTTP (Testcontainers + PostgreSQL real).
- [ ] **Linter pasa:** `npm run lint -- --fix` corre sin errores (ESLint + Prettier).
- [ ] **Migraciones Prisma** (si hay cambio de esquema): `npm run prisma:migrate:dev` corre sin error en BD limpia; SQL es reversible (comentario de rollback incluido).
- [ ] **Documentación mínima:** README del módulo actualizado, o comentario en código si es tricky. Cambios de BD documentados en PR.
- [ ] **PR description** completa: problema → solución, qué cambió, cómo testeé, notas de deploy/rollback.
- [ ] **Desplegable:** `docker-compose up` levanta la app con la feature; se puede hacer E2E rápido.
- [ ] **Code review** aprobado por (idealmente) otro dev o PO si es alto riesgo.
- [ ] **Merge a main** y cierre de issue automático.

### Excepciones por fase

**Fase 0–1 (Fundaciones e integración actual):** DoD completo, sin excepciones. Estos sprints sientan la base.

**Fase 2–3:** DoD completo excepto: si una US es un endpoint muy simple (ej. GET /positions), se puede aceptar cobertura >60% (vs >70%).

**Fase 4+ (Planilla, reportes):** DoD íntegro para código de cálculo; para reportes se acepta >60% si la validación es por manual QA.

---

## 5. Estimación Completa del Backlog

### Tabla maestra: Todas las 85 US

| US | Título | Épica | Prioridad | Fase | Dependencias | Pts | Notas |
|---|---|---|---|---|---|---|---|
| **US-001** | PostgreSQL 16 + Prisma inicializados | EP-01 | MUST | 0 | — | **3** | Schema núcleo 16 tablas, seed |
| **US-002** | Docker multi-stage + docker-compose | EP-01 | MUST | 0 | US-001 | **3** | API, worker, Postgres, Redis |
| **US-003** | Validación env con Zod al arranque | EP-01 | MUST | 0 | US-001 | **2** | fail-fast, .env.example |
| **US-004** | Seed de catálogos | EP-01 | MUST | 0 | US-001 | **2** | roles, permisos, tipos contrato, conceptos planilla, ubigeo |
| **US-005** | Estructura hexagonal de módulos | EP-01 | MUST | 0 | — | **1** | carpetas, ESLint boundaries |
| **US-006** | Servidor HTTP + middlewares | EP-01 | MUST | 0 | US-003, US-005 | **2** | Express, Pino, CORS, error handler RFC 7807 |
| **US-007** | JWT access + refresh token | EP-02 | MUST | 1 | US-001, US-006 | **3** | endpoints login/refresh, persistencia refresh_tokens |
| **US-008** | RBAC con permisos granulares | EP-02 | MUST | 1 | US-007 | **2** | middleware de protección, filtro de alcance |
| **US-009** | Auditoría de cambios sensibles | EP-02 | MUST | 1 | US-001, US-007 | **2** | triggers PostgreSQL, audit_logs |
| **US-010** | Recuperación de contraseña | EP-02 | SHOULD | 1 | US-007 | **2** | forgot-password + reset-password endpoints |
| **US-011** | Puerto FileStorage y adaptor OneDrive | EP-03 | MUST | 1 | US-005, US-002 | **3** | interfaz + OneDriveStorageAdapter + LocalStorageAdapter |
| **US-012** | Migración Puppeteer → pdfmake | EP-03 | MUST | 1 | US-011 | **5** | plantillas convertidas, performance <10s/10 PDFs |
| **US-013** | ContractGenerationService | EP-03 | MUST | 1 | US-011, US-012 | **3** | caso de uso, coordinación validación → PDF → storage → BD |
| **US-014** | Orquestador ingestión OneDrive | EP-03 | MUST | 1 | US-011, US-013 | **3** | job cada 10 min, detección tipo, validación, importación |
| **US-015** | Adendas como casos de uso separados | EP-03 | MUST | 1 | US-013, US-014 | **2** | AddendumGenerationService, validación solapamiento |
| **US-016** | Modelo de documentos + metadata | EP-04 | MUST | 1 | US-001 | **1** | tabla generated_documents, SHA256, snapshot JSONB |
| **US-017** | Upload de documentos del legajo | EP-04 | SHOULD | 1 | US-011, US-016 | **2** | endpoint POST /employees/:id/documents, validación MIME |
| **US-018** | Pólizas y cobertura de empleados | EP-05 | MUST | 1 | US-001 | **2** | tablas insurance_policies + employee_insurances, EXCLUDE |
| **US-019** | Reporte SCTR mensual | EP-05 | MUST | 1 | US-018, US-014 | **3** | job BullMQ, Excel + email a aseguradora, sctr_declarations |
| **US-020** | CRUD de empleados completo | EP-06 | MUST | 2 | US-009 | **5** | POST/GET/PATCH/DELETE, auditoría, filtros |
| **US-021** | Datos bancarios y afiliaciones | EP-06 | MUST | 2 | US-020 | **3** | múltiples cuentas sueldo/CTS, AFP/ONP, EXCLUDE vigencias |
| **US-022** | Cese de empleado | EP-06 | MUST | 2 | US-020 | **3** | marcar CESADO, disparar eventos (contratos, seguros) |
| **US-023** | Importación masiva desde Excel | EP-06 | MUST | 2 | US-020 | **5** | cargar bulk, detectar duplicados, validar DNI |
| **US-024** | Historial laboral (job_histories) | EP-06 | SHOULD | 2 | US-020 | **2** | vista puesto/sueldo por fecha |
| **US-025** | Búsqueda y filtros | EP-06 | SHOULD | 2 | US-020 | **2** | TRGM índice, filtro estado/área/fecha ingreso |
| **US-026** | Contactos de emergencia | EP-06 | SHOULD | 2 | US-020 | **2** | 1..N por empleado |
| **US-027** | Dependientes (hijos/cónyuge) | EP-06 | MUST | 2 | US-020 | **3** | para asignación familiar, T-Registro |
| **US-028** | Datos de pensión vinculados | EP-06 | MUST | 2 | US-021 | **3** | AFPs vigentes, comisión, CUSPP |
| **US-029** | Catálogo ubigeo y direcciones | EP-06 | SHOULD | 2 | US-004 | **2** | normalizar departamento/provincia/distrito |
| **US-030** | Estados de empleado (ACTIVO/CESADO) | EP-06 | SHOULD | 2 | US-020 | **1** | status enum |
| **US-031** | Datos del empleador (singleton) | EP-07 | MUST | 2 | US-001 | **2** | editar razón social, RUC, representante legal; una sola fila |
| ~~**US-032**~~ | ~~Multi-RUC en la misma empresa~~ | EP-07 | — | — | — | **0** | **eliminada 13/08/2026**: un solo RUC (migración `drop_companies`) |
| **US-033** | Sedes/sucursales (branches) | EP-07 | MUST | 2 | US-031 | **3** | CRUD sedes, anexo SUNAT, ubicación INEI |
| **US-034** | Divisiones/áreas | EP-07 | SHOULD | 2 | US-031 | **3** | jerarquía opcional, manager por división |
| **US-035** | Puestos con riesgo SCTR | EP-07 | MUST | 2 | US-031 | **2** | catálogo con nivel ALTO/BAJO |
| **US-036** | Normalización de puestos | EP-07 | SHOULD | 2 | US-035 | **2** | canonicalizar variantes |
| **US-037** | Centros de costo | EP-07 | SHOULD | 2 | US-031 | **2** | opcional, para filtrado reportes |
| **US-038** | Catálogos activos/inactivos | EP-07 | MUST | 2 | US-031 | **1** | flag is_active |
| **US-046** | Conector GeoVictoria: sincronizar marcaciones | EP-08 | MUST | 3 | — | **3** | **SPIKE** (ver 6.1); job BullMQ, INSERT attendance_records |
| **US-047** | Turnos y horarios | EP-08 | MUST | 3 | US-001 | **3** | crear turnos, asignar con vigencia, EXCLUDE |
| **US-048** | Cálculo de tardanzas | EP-08 | MUST | 3 | US-046, US-047 | **3** | check_in vs horario |
| **US-049** | Horas extra (25%/35%) | EP-08 | MUST | 3 | US-046, US-047 | **3** | detectar >8h, calcular sobre |
| **US-050** | Cierre período asistencia | EP-08 | MUST | 3 | US-046 | **3** | validar, generar totales |
| **US-051** | Corrección manual asistencia | EP-08 | SHOULD | 3 | US-046 | **3** | con nota + auditoría |
| **US-052** | Vacaciones: devengue automático | EP-09 | MUST | 3 | US-020 | **5** | 30 días/año, acumular, job mensual |
| **US-053** | Solicitud de vacaciones/ausencias | EP-09 | MUST | 3 | US-052 | **5** | flujo empleado → jefe → RRHH → aprobación |
| **US-054** | Récord vacacional | EP-09 | MUST | 3 | US-052 | **3** | ganados, gozados, vendidos (máx 15), truncos |
| **US-055** | Licencias | EP-09 | SHOULD | 3 | US-052 | **3** | descanso médico, maternidad, paternidad |
| **US-056** | Calendario de ausencias | EP-09 | SHOULD | 3 | US-052 | **2** | filtrar por división, vista JSON |
| **US-057** | Conceptos de planilla CRUD | EP-10 | MUST | 4 | US-001 | **1** | crear/editar conceptos |
| **US-058** | Parámetros legales versionados | EP-10 | MUST | 4 | US-004 | **2** | UIT, RMV, tasas AFP/ONP |
| **US-059** | Abrir período de planilla | EP-10 | MUST | 4 | US-001 | **2** | crear payroll_period |
| **US-060** | Cálculo motor núcleo | EP-10 | MUST | 4 | US-059 | **13** | **CRÍTICO:** sueldo + HE + asig fam - AFP - renta 5ta → boleta |
| **US-061** | AFP con comisiones | EP-10 | MUST | 4 | US-060 | **5** | aporte 10% + prima + comisión + tope asegurable |
| **US-062** | Renta 5.ª categoría | EP-10 | MUST | 4 | US-060 | **5** | 7 UIT deducción, tramos, retención mensual |
| **US-063** | CTS: depósitos semestrales | EP-10 | MUST | 4 | US-060 | **3** | mayo/noviembre, depósito, constancia |
| **US-064** | Gratificaciones + bono EsSalud | EP-10 | MUST | 4 | US-060 | **3** | jul/dic, bono 9% (Ley 30334) |
| **US-065** | Asignación familiar (10% RMV) | EP-10 | MUST | 4 | US-060 | **3** | has_children_under18 → descuento |
| **US-066** | Liquidación de beneficios | EP-10 | MUST | 4 | US-060 | **8** | al cese: CTS trunco, vacaciones, gratificación proporcional |
| **US-067** | Ajustes manuales de boleta | EP-10 | SHOULD | 4 | US-060 | **2** | corrección con nota |
| **US-068** | Aprobación y cierre de período | EP-10 | MUST | 4 | US-059 | **5** | workflow ABIERTA → ... → CERRADA |
| **US-069** | Boleta PDF | EP-11 | MUST | 4 | US-060 | **3** | generar boleta PDF |
| **US-070** | Exportación archivo bancario | EP-11 | MUST | 4 | US-060 | **3** | formato Scotiabank, BBVA, BCP |
| **US-071** | PLAME / T-Registro | EP-11 | MUST | 4 | US-060 | **3** | exportar con códigos SUNAT |
| **US-072** | AFPnet | EP-11 | SHOULD | 4 | US-060 | **2** | envío AFP |
| **US-073** | Régimen practicantes (Ley 28518) | EP-10 | MUST | 4 | US-060 | **3** | subvención, media subvención, sin CTS |
| **US-074** | Snapshot histórico planilla | EP-10 | MUST | 4 | US-060 | **2** | capturar parámetros, reproducibilidad |
| **US-075** | Reportes: costo laboral | EP-12 | SHOULD | 5 | US-060 | **3** | Excel costo mes/año por área |
| **US-076** | Reportes: rotación | EP-12 | SHOULD | 5 | US-020 | **3** | ingresos/ceses, tasa rotación |
| **US-077** | Reportes: headcount | EP-12 | SHOULD | 5 | US-020 | **3** | cantidad activos, histórico |
| **US-078** | Portal: mis boletas | EP-13 | SHOULD | 5 | US-069 | **3** | GET /employees/me/payslips |
| **US-079** | Portal: saldo vacacional | EP-13 | SHOULD | 5 | US-052 | **3** | GET /employees/me/vacation |
| **US-080** | Portal: mis documentos | EP-13 | SHOULD | 5 | US-017 | **3** | GET /employees/me/documents |
| **US-081** | Portal: mis coberturas | EP-13 | SHOULD | 5 | US-018 | **3** | GET /employees/me/insurances |
| **US-082** | Alertas vencimiento contratos | EP-13 | SHOULD | 5 | US-001 | **3** | job diario: 30, 15, 7 días |
| **US-083** | Alertas vencimiento pólizas | EP-13 | SHOULD | 5 | US-018 | **3** | job diario: SCTR, EPS, Vida Ley |
| **US-084** | Backups automatizados PITR | EP-14 | MUST | 6 | US-001 | **3** | pg_dump diario, WAL archiving, restore probado |
| **US-085** | Manual operacional | EP-14 | SHOULD | 6 | — | **2** | documentación procesos, runbooks |

**TOTAL: 256 puntos**

---

## 6. Spikes y Investigaciones (Desriesgo)

### 6.1 Spike: GeoVictoria API Integration

**US asociada:** US-046 (Conector GeoVictoria)  
**Riesgo:** API de marcaciones es nueva, puede haber autenticación desconocida, límites de rate, formato de datos sorpresa.

**Spike propuesto:**
- **Duración:** 2–3 días (est. 5 pts)
- **Ubicación:** Sprint 6 (Fase 3, antes de US-046)
- **Actividades:**
  1. Contactar cliente/GeoVictoria: obtener credenciales, URL base, documentación API
  2. Autenticar y traer 1 marcación de prueba
  3. Modelar response JSON → schema Zod
  4. Documentar en `docs/integrations/geovictoria.md` con ejemplos
- **Deliverable:** documento de integración + código PoC de autenticación + ejemplo de payload

### 6.2 Spike: Plataforma de Firmas Digital del Cliente

**US asociada:** Futura (EP-15, fase 6)  
**Riesgo:** cliente aún no define qué plataforma usa para firmas digitales (eSignature).

**Spike propuesto:**
- **Duración:** 2 días (est. 3 pts)
- **Ubicación:** Sprint 2 (inicio de Fase 1), paralelo a otra tarea
- **Actividades:**
  1. Preguntar cliente: ¿qué proveedor de firmas? (DocuSign, eSignature.io, local)
  2. Investigar API de ese proveedor
  3. Diseño de contrato de integración (webhook de firma completada, vinculación a BD)
- **Deliverable:** decisión documentada + esbozo de arquitectura

### 6.3 Spike: Formato Real de Datos de Empleados para Migración

**US asociada:** US-023 (Importación masiva)  
**Riesgo:** estructura actual del Excel es desconocida (aunque hay referencias en el código).

**Spike propuesto:**
- **Duración:** 1 día (est. 2 pts)
- **Ubicación:** Sprint 4 (Fase 2)
- **Actividades:**
  1. Conseguir ejemplo anónimizado del Excel actual
  2. Mapear columnas → campos de `employees`, `contracts`, `employee_bank_accounts`
  3. Documentar en `docs/data-migration/excel-schema.md`
- **Deliverable:** mapper Zod + tests de validación

### 6.4 Spike: Decisión SSO Entra ID

**US asociada:** EP-15 (fase 6, opcional)  
**Riesgo:** cliente aún no confirma si quiere Entra ID para RRHH.

**Spike propuesto:**
- **Duración:** 1 día (est. 2 pts)
- **Ubicación:** Sprint 2 o 3, como decisión de arquitectura previa
- **Actividades:**
  1. Revisión de doc: "¿se requiere SSO Entra ID?" (sección 7.2 del plan)
  2. Si sí: PoC de configuración `passport-azure-ad` y middleware
  3. Si no: confirmar que autenticación local JWT es aceptable
- **Deliverable:** decisión + PR de PoC si procede

---

## 7. Plan de Sprints: Secuencia Completa

### Convención de fechas

```
Sprint N: lunes DDmm al viernes DDmm
Planning: domingo antes, 19:00 (reunión virtual Raul + PO)
Review + Retro: viernes última semana, 16:00–17:30
```

---

### FASE 0: Fundaciones (Semanas 1–2)

#### Sprint 1: Infraestructura y Base de Datos

**Fechas:** lunes 2026-07-13 a viernes 2026-07-24  
**Fase:** Fase 0  
**Objetivo:** Levantar stack completo (BD, Docker, servidor HTTP, estructura hexagonal) para poder desarrollar las demás épicas. Fin del sprint: `docker-compose up` trae BD + API en puerto 3000.

**US asignadas:**

| US | Título | Pts | Dependencia |
|---|---|---|---|
| **US-001** | PostgreSQL 16 + Prisma | **3** | — |
| **US-002** | Docker multi-stage + docker-compose | **3** | US-001 |
| **US-003** | Validación env con Zod | **2** | US-001 |
| **US-004** | Seed de catálogos | **2** | US-001 |
| **US-005** | Estructura hexagonal | **1** | — |
| **US-006** | Servidor HTTP + middlewares | **2** | US-003, US-005 |

**Total: 13 pts** (dentro de 20–26 rango)

**Subtareas (desglose fino para Fase 0):**

**US-001: PostgreSQL 16 + Prisma (3 pts)**
- [ ] Crear `prisma/schema.prisma` con 16 tablas núcleo (companies, employees, contracts, etc.)
- [ ] Definir ENUMs PostgreSQL (document_type, contract_status, etc.)
- [ ] Crear migración inicial: `npx prisma migrate dev --name init`
- [ ] Validar integridad referencial: FK, UNIQUE con soft-delete
- [ ] Seed básico: roles, permisos, 1 empresa test
- [ ] Documentar en `docs/database/schema.md` con diagrama ER
- [ ] Test: insertar empleado, contrato, validar constraints
- [ ] Gitignore correcto (.env, .env.local)

**US-002: Docker (3 pts)**
- [ ] Crear `Dockerfile` multi-stage: builder → runtime
- [ ] Stage builder: instala deps, compila TS
- [ ] Stage runtime: solo node + dist/, sin node_modules de dev
- [ ] Crear `docker-compose.yml` con 4 servicios: api, worker, postgres, redis
- [ ] Volúmenes nombrados para persistencia BD y Redis
- [ ] Health checks en cada servicio
- [ ] `.dockerignore` para excluir node_modules, .git, .env
- [ ] Test: `docker-compose up --build`, esperar 2 min, validar 4 servicios UP
- [ ] Documentar en README: "docker-compose up"
- [ ] Escaneo de vulnerabilidades con Trivy

**US-003: Validación env (2 pts)**
- [ ] Crear `src/config/env.ts` con schema Zod
- [ ] Validar 15+ variables: DATABASE_URL, JWT_SECRET, BREVO_API_KEY, etc.
- [ ] Fail-fast: lanzar error en arranque si falta crítica
- [ ] No loguear valores sensibles (solo presencia)
- [ ] Crear `.env.example` con templates
- [ ] Test: simular variable faltante, verificar exit code 1
- [ ] Documentación en README con descripción de cada variable

**US-004: Seed (2 pts)**
- [ ] `prisma/seed.ts`: insertar roles (SUPER_ADMIN, HR_ADMIN, MANAGER, EMPLOYEE)
- [ ] Insertar permisos: employees:read, contracts:create, payroll:approve, etc.
- [ ] Insertar 5 contract_types con legal_basis (D.Leg. 728)
- [ ] Insertar 20+ payroll_concepts (SUELDO_BASICO, AFP_DESCTO, ESSALUD, etc.)
- [ ] Insertar 5 pension_systems (AFP_INTEGRA, AFP_PRIMA, AFP_PROFUTURO, AFP_HABITAT, ONP)
- [ ] Insertar afp_rates versionadas (valid_from=2026-01-01, contribution_pct=10%)
- [ ] Insertar ubigeo INEI (carga desde CSV o JSON)
- [ ] Insertar UIT 2026 ($4,600) y RMV ($1,500) como parámetros
- [ ] `npm run seed` idempotente (upsert, sin duplicados)
- [ ] Test: verificar conteos mínimos post-seed

**US-005: Estructura hexagonal (1 pt)**
- [ ] Crear carpeta `src/modules/{employees,contracts,documents,auth,attendance,leave,payroll,insurance,reports}`
- [ ] Crear carpeta `src/platform/{database,http,queue,storage,email,pdf}`
- [ ] Cada módulo con estructura: domain/, application/, infrastructure/, api/, index.ts
- [ ] Crear path aliases en `tsconfig.json`: @modules/*, @platform/*, @shared/*
- [ ] Configurar ESLint con regla de límites (eslint-plugin-boundaries)
- [ ] Crear README en `src/modules/` explicando arquitectura
- [ ] Linter pasa sin warnings

**US-006: Servidor HTTP (2 pts)**
- [ ] Crear `src/index.ts` que invoque `parseConfig()` al arranque
- [ ] Crear `src/platform/http/app.ts` con Express builder
- [ ] Middlewares: morgan, json, requestId (AsyncLocalStorage), pino-http, CORS, helmet, rate limiting
- [ ] Middleware de error centralizado: captura AppError + genérico Error → RFC 7807
- [ ] Endpoint GET /health → {status: "up", uptime: "..."}
- [ ] Test: GET /health retorna 200 + JSON
- [ ] Test: endpoint inexistente retorna 404 + RFC 7807
- [ ] Test: endpoint que lanza AppError retorna status HTTP correcto
- [ ] Documentación en `docs/http/middleware.md`

**Entregable al fin del sprint:**
- `docker-compose up` levanta 4 servicios en <2 min
- GET /health retorna 200
- BD tiene 16 tablas, seed ejecutado
- `npm run type-check`, `npm run lint`, `npm test` todas verdes
- Documentación inicial completa

---

#### Sprint 2: Autenticación, RBAC y Almacenamiento

**Fechas:** lunes 2026-07-28 a viernes 2026-08-08  
**Fase:** Fase 0 → 1  
**Objetivo:** Seguridad: JWT auth con refresh tokens, RBAC con middlewares, inicio de FileStorage. Fin del sprint: autenticación real y middleware de protección funcionan.

**US asignadas:**

| US | Título | Pts | Dependencia |
|---|---|---|---|
| **US-007** | JWT access + refresh token | **3** | US-001, US-006 |
| **US-008** | RBAC + permisos granulares | **2** | US-007 |
| **US-009** | Auditoría de cambios | **2** | US-001, US-007 |
| **US-010** | Recuperación de contraseña | **2** | US-007 |
| **US-011** | Puerto FileStorage + adaptor OneDrive | **3** | US-005, US-002 |
| **SPIKE** | Plataforma de firmas del cliente (investigación) | **3** | — |

**Total: 15 pts** (+ 3 del spike = 18 pts; cómodo)

**Subtareas (Fase 0–1):**

**US-007: JWT (3 pts)**
- [ ] Crear tabla `refresh_tokens(user_id, token_hash, expires_at, revoked_at)`
- [ ] Endpoint POST /auth/login(email, password)
- [ ] Validar email/password, hashear con bcryptjs
- [ ] Generar JWT accessToken (15 min, {sub, email, permissions, iat, exp})
- [ ] Generar UUID refreshToken, hashear, guardar en BD
- [ ] Retornar accessToken + refreshToken + expiresIn (900 segundos)
- [ ] Cookie httpOnly + secure (prod) + SameSite=Strict
- [ ] Endpoint POST /auth/refresh con refreshToken
- [ ] Validar refresh no revocado, generar nuevo acceso + refresh rotativo
- [ ] Endpoint DELETE /users/:id/sessions (admin) para revocar todas las sesiones de un usuario
- [ ] Test: login exitoso → JWT válido; refresh expirado → 401; contraseña incorrecta → no enumera usuario

**US-008: RBAC (2 pts)**
- [ ] Middleware `requirePermission(code)` que lee `req.user.permissions` del JWT
- [ ] Retornar 403 Forbidden si permiso ausente
- [ ] Filtro de alcance en repositorios (ej. MANAGER solo ve su división)
- [ ] Test: EMPLOYEE intenta acceder a recursos de otra división → 403
- [ ] Test: SUPER_ADMIN puede acceder a todo
- [x] ~~Implementar scope por company_id en `user_roles`~~ — **sin objeto desde el 13/08/2026**: una sola razón social (migración `drop_companies`)

**US-009: Auditoría (2 pts)**
- [ ] Trigger PostgreSQL AFTER INSERT/UPDATE/DELETE en tablas sensibles (employees, contracts, payslips)
- [ ] Trigger lee `app.current_user_id` (inyectado por Prisma middleware)
- [ ] INSERT en audit_logs(user_id, action, table_name, record_id, old_data, new_data, ip, occurred_at)
- [ ] Test: crear empleado → audit_logs registra INSERT
- [ ] Test: cambiar sueldo → audit_logs registra old/new
- [ ] Documentación sobre user_id en contexto de transacción

**US-010: Recuperación de contraseña (2 pts)**
- [ ] Endpoint POST /auth/forgot-password(email)
- [ ] Generar token UUID, hashear, guardar en tabla `password_resets(token_hash, user_id, expires_at)`
- [ ] Enviar email con link: https://app/reset?token=<token> (valida 1 hora)
- [ ] Endpoint POST /auth/reset-password(token, password_new, password_confirm)
- [ ] Validar token, actualizar password, borrar token, revocar sesiones
- [ ] Test: token expirado → 401; token válido → actualiza contraseña; sesiones revocadas

**US-011: FileStorage (3 pts)**
- [ ] Crear interfaz `IFileStorage` con métodos: put(key, buffer), getStream(key), delete(key), getSignedUrl(key)
- [ ] Adaptador OneDriveStorageAdapter (wrapping código actual)
- [ ] Adaptador LocalStorageAdapter (para tests, escribe a directorio local)
- [ ] Inyección en DI container para elegir adaptador por env
- [ ] Tabla `generated_documents` con metadatos: hash SHA256, mime_type, size_bytes, storage_provider, storage_path
- [ ] Test: put/get/delete en ambos adaptadores
- [ ] Documentación en `docs/storage/file-storage.md`

**SPIKE: Plataforma de firmas (3 pts)**
- [ ] Contactar cliente: ¿cuál es el proveedor de firmas?
- [ ] Investigar API: autenticación, webhook, flujo de firma
- [ ] Documentar decisión en `docs/integrations/digital-signatures.md`
- [ ] Esbozo de integración (arquitectura, no código)
- [ ] Decidir si entra a Fase 6 (EP-15)

**Entregable al fin del sprint:**
- POST /auth/login funciona, JWT válido
- Middleware de RBAC protege endpoints
- Auditoría registra cambios en audit_logs
- FileStorage carga/descarga en OneDrive
- Spike de firmas documentada

---

### FASE 1: Migración de Contratos (Semanas 3–6)

#### Sprint 3: PDFs y Orquestación

**Fechas:** lunes 2026-08-11 a viernes 2026-08-22  
**Fase:** Fase 1  
**Objetivo:** Completar migración Puppeteer → pdfmake, crear ContractGenerationService, orquestador de ingestión OneDrive. Fin: sistema puede generar PDFs y procesar Excels sin Puppeteer.

**US asignadas:**

| US | Título | Pts | Dependencia |
|---|---|---|---|
| **US-012** | Migración Puppeteer → pdfmake | **5** | US-011 |
| **US-013** | ContractGenerationService | **3** | US-011, US-012 |
| **US-014** | Orquestador ingestión OneDrive | **3** | US-011, US-013 |
| **US-016** | Modelo de documentos | **1** | US-001 |

**Total: 12 pts** (justo en el rango)

**Subtareas:**

**US-012: Migración pdfmake (5 pts)**
- [ ] Crear `platform/pdf/pdfmake.generator.ts`
- [ ] Convertir 8 tipos de documento (templates.ts) de Handlebars HTML a definición pdfmake
- [ ] Crear definiciones modulares por tipo: contract-full-time, contract-suplencia, addendum-suplencia, etc.
- [ ] Generar PDFs de 10 contratos de prueba: <10 segundos total
- [ ] Remover referencias a Puppeteer del flujo (lifecycle management)
- [ ] Test visual: comparar 3 PDFs generados con pdfmake vs Puppeteer (inspección manual)
- [ ] Reducir imagen Docker: sin Chromium, <250MB
- [ ] Documentación en `docs/pdf/pdfmake.md`

**US-013: ContractGenerationService (3 pts)**
- [ ] Servicio en `modules/contracts/application/contract-generation.service.ts`
- [ ] Método: generateContract(employeeId, contractTypeId, contractData)
- [ ] Flujo: validación → carga plantilla → genera PDF → almacena en OneDrive → registra en BD
- [ ] Enqueuea job BullMQ para generación en lote
- [ ] Endpoint POST /contracts/generate → 202 Accepted + jobId
- [ ] GET /jobs/:jobId → estado (processing, completed, failed)
- [ ] Test unitario: validación sin BD
- [ ] Test integración: genera PDF real, almacena en local, registra en BD

**US-014: Orquestador ingestión (3 pts)**
- [ ] Job BullMQ: "ingest-onedrive-files" cada 10 minutos
- [ ] Listar archivos en carpeta "subir excel" de OneDrive
- [ ] Detectar tipo: CONTRATOS vs ADENDAS (por encabezados)
- [ ] Validar Excel: extensión, tamaño, estructura
- [ ] Registrar en `import_batches(file_name, sha256, kind, status=PROCESSING)`
- [ ] Registrar errores en `import_batch_rows`
- [ ] Enviar email a RRHH con contadores ok/error
- [ ] Reintentos automáticos BullMQ con backoff exponencial
- [ ] Test E2E: subir Excel a OneDrive → esperar 15 min → verificar import_batches

**US-016: Modelo documentos (1 pt)**
- [ ] Tabla `generated_documents`: id, kind, entity_table, entity_id, employee_id, file_name, mime_type, size_bytes, sha256, storage_provider, storage_path, generation_snapshot JSONB, created_at, created_by
- [ ] Índice (entity_table, entity_id)
- [ ] Función para calcular SHA256 de buffer
- [ ] Test: registrar contrato generado, query por hash para detectar duplicados

**Entregable:**
- Sistema genera PDFs sin Puppeteer, <10s/10 docs
- Orquestador procesa Excels cada 10 minutos
- import_batches y import_batch_rows trazables en BD

---

#### Sprint 4: Adendas y Finalizar Fase 1

**Fechas:** lunes 2026-08-25 a viernes 2026-09-05  
**Fase:** Fase 1  
**Objetivo:** Adendas como servicio separado, documentos legajo, seguros. Fin: todas las épicas de Fase 1 completas.

**US asignadas:**

| US | Título | Pts | Dependencia |
|---|---|---|---|
| **US-015** | Adendas (AddendumGenerationService) | **2** | US-013, US-014 |
| **US-017** | Upload documentos legajo | **2** | US-011, US-016 |
| **US-018** | Pólizas y cobertura de empleados | **2** | US-001 |
| **US-019** | Reporte SCTR mensual | **3** | US-018, US-014 |
| **US-010** (rezagada) | Recuperación de contraseña | **2** | US-007 |

**Total: 11 pts** (ajustado, Sprint 2 quedó en 15 con spike)

**Subtareas:**

**US-015: Adendas (2 pts)**
- [ ] Servicio `modules/contracts/application/addendum-generation.service.ts`
- [ ] Método: generateAddendum(contractId, addendumData)
- [ ] Validación: solapamiento de fechas, continuidad de contrato
- [ ] Tipos de adenda: SUPLENCIA, INCREMENTO_ACTIVIDAD, CAMBIO_REMUNERACION, etc.
- [ ] Test: validar límite 36 meses para INCREMENTO_ACTIVIDAD
- [ ] Test: rechazar adenda solapada

**US-017: Legajo digital (2 pts)**
- [ ] Tabla `employee_documents(employee_id, document_kind, file_name, storage_path, expires_at)`
- [ ] Endpoint POST /employees/:id/documents (Multer, validación MIME/tamaño)
- [ ] Almacenar en OneDrive/legajo/:employee_id/
- [ ] Endpoint GET /employees/:id/documents (list) + GET /employees/:id/documents/:doc_id (descarga)
- [ ] Endpoint GET /employees/me/documents (empleado ve sus docs)
- [ ] Test: subir PDF, verificar en OneDrive, descarga correcta

**US-018: Seguros (2 pts)**
- [ ] Tablas `insurance_policies, employee_insurances`
- [ ] Endpoint CRUD /insurance/policies
- [ ] Endpoint POST /insurance/policies/:id/enrollments (alta de empleado)
- [ ] EXCLUDE constraint previene solapamiento
- [ ] Test: alta en póliza → no se puede solapar con otra del mismo tipo

**US-019: Reporte SCTR (3 pts)**
- [ ] Endpoint POST /insurance/reports/sctr?year=2026&month=7
- [ ] Job BullMQ que genera Excel con estructura aseguradora (DNI, Nombres, Sueldo, Riesgo)
- [ ] Tabla `sctr_declarations(policy_id, period_year/month, employees_count, total_declared_salary, document_id)`
- [ ] Email enviado a insurance_providers.contact_email
- [ ] Tabla `email_logs` con trazabilidad
- [ ] Test: generar reporte, verificar Excel, email enviado

**Entregable:**
- Fase 1 completa: contratos, adendas, documentos, seguros
- Sistema puede procesar Excels y generar todos los artefactos (sin Puppeteer)
- Auditoría, auth, almacenamiento funcionan

---

### FASE 2: Maestro de Empleados (Semanas 7–9)

#### Sprint 5: CRUD Empleados e Importación

**Fechas:** lunes 2026-09-08 a viernes 2026-09-19  
**Fase:** Fase 2  
**Objetivo:** Sistema de empleados central: CRUD, datos bancarios, importación masiva. Fin: BD es la fuente de verdad de empleados, no solo Excel.

**US asignadas:**

| US | Título | Pts | Dependencia |
|---|---|---|---|
| **US-020** | CRUD de empleados | **5** | US-009 |
| **US-021** | Datos bancarios y afiliaciones | **3** | US-020 |
| **US-022** | Cese de empleado | **3** | US-020 |
| **US-023** | Importación masiva desde Excel | **5** | US-020 |

**Total: 16 pts** (cómodo)

**Subtareas similares a las anteriores — nivel de detalle desciende aquí (Fase 2 es medio)**

---

### FASE 3: Asistencia y Vacaciones (Semanas 10–13)

#### Sprint 6: Spike GeoVictoria + Turnos

**Fechas:** lunes 2026-10-06 a viernes 2026-10-17  
**Fase:** Fase 3  
**Objetivo:** Investigar e integrar GeoVictoria para marcaciones, crear turnos. Fin: spike completo, lista para implementar sincronización.

**US asignadas:**

| US | Título | Pts |
|---|---|---|
| **SPIKE** | GeoVictoria API (investigación) | **5** |
| **US-047** | Turnos y horarios | **3** |

**Total: 8 pts** (ligero, concentra en spike y diseño)

#### Sprint 7: Marcaciones y Asistencia

**Fechas:** lunes 2026-10-20 a viernes 2026-10-31  
**Fase:** Fase 3  
**Objetivo:** Sincronizar marcaciones de GeoVictoria, cálculo de tardanzas y HE. Fin: sistema trae datos reales de asistencia.

**US asignadas:**

| US | Título | Pts |
|---|---|---|
| **US-046** | Conector GeoVictoria | **3** |
| **US-048** | Cálculo tardanzas | **3** |
| **US-049** | Horas extra | **3** |
| **US-050** | Cierre período asistencia | **3** |

**Total: 12 pts**

#### Sprint 8: Vacaciones y Licencias

**Fechas:** lunes 2026-11-03 a viernes 2026-11-14  
**Fase:** Fase 3  
**Objetivo:** Sistema completo de vacaciones (devengue, solicitudes, aprobación) y licencias. Fin: récord vacacional funciona automáticamente.

**US asignadas:**

| US | Título | Pts |
|---|---|---|
| **US-052** | Devengue automático vacaciones | **5** |
| **US-053** | Solicitud de vacaciones | **5** |
| **US-054** | Récord vacacional | **3** |
| **US-055** | Licencias | **3** |

**Total: 16 pts**

---

### FASE 4: Planilla (Semanas 14–22, **CAMINO CRÍTICO**)

#### Sprint 9: Fundaciones de Planilla

**Fechas:** lunes 2026-11-17 a viernes 2026-11-28  
**Fase:** Fase 4  
**Objetivo:** Conceptos, parámetros, períodos abiertos. Fin: esquema y datos base para cálculo.

**US asignadas:**

| US | Título | Pts |
|---|---|---|
| **US-057** | Conceptos de planilla | **1** |
| **US-058** | Parámetros versionados (UIT, RMV) | **2** |
| **US-059** | Abrir período de planilla | **2** |

**Total: 5 pts** (ligero, prepara para el motor)

#### Sprint 10: Motor de Cálculo (CRÍTICO)

**Fechas:** lunes 2026-12-01 a viernes 2026-12-12  
**Fase:** Fase 4  
**Objetivo:** Implementar motor de cálculo de nómina: sueldo + HE + asig familiar - AFP - quinta. **SPIKE + US:**

**US asignadas:**

| US | Título | Pts |
|---|---|---|
| **SPIKE** | Validación de fórmulas de cálculo vs SUNAT (2 días estudio) | **3** |
| **US-060** | Motor de cálculo núcleo | **13** |

**Total: 16 pts** (dedicado al motor)

**Notas:**
- US-060 es la más crítica del proyecto: debe reproducir exacto las boletas manuales del cliente
- Spike incluye: revisar planilla antigua, validar contra SUNAT PLAME, documentar fórmulas
- Desglose en subtareas menores:
  - Subtarea 1: cálculo sueldo base (30 días)
  - Subtarea 2: asignación familiar
  - Subtarea 3: descuentos por faltas
  - Subtarea 4: integración con HE, asistencia
  - Subtarea 5: tests exhaustivos

#### Sprint 11: AFP y Quinta Categoría

**Fechas:** lunes 2026-12-15 a viernes 2026-12-26  
**Fase:** Fase 4  
**Objetivo:** Cálculos previsionales más complejos: AFP (aporte, prima, comisión, tope), renta 5.ª (7 UIT deducción, tramos).

**US asignadas:**

| US | Título | Pts |
|---|---|---|
| **US-061** | AFP (aporte + prima + comisión + tope) | **5** |
| **US-062** | Renta 5.ª categoría | **5** |
| **US-065** | Asignación familiar (10% RMV) | **3** |

**Total: 13 pts**

#### Sprint 12: CTS, Gratificación, Liquidación

**Fechas:** lunes 2027-01-12 a viernes 2027-01-23  
**Fase:** Fase 4  
**Objetivo:** Beneficios especiales peruanos: CTS (mayo/noviembre), gratificaciones (julio/diciembre), liquidación al cese.

**US asignadas:**

| US | Título | Pts |
|---|---|---|
| **US-063** | CTS: depósitos semestrales | **3** |
| **US-064** | Gratificaciones + bono EsSalud | **3** |
| **US-066** | Liquidación de beneficios | **8** |

**Total: 14 pts**

#### Sprint 13: Aprobación y Exportes

**Fechas:** lunes 2027-01-26 a viernes 2027-02-06  
**Fase:** Fase 4  
**Objetivo:** Cierre de período, boletas PDF, exportes PLAME/banco/AFP.

**US asignadas:**

| US | Título | Pts |
|---|---|---|
| **US-068** | Aprobación y cierre período | **5** |
| **US-069** | Boleta PDF | **3** |
| **US-070** | Exportación archivo bancario | **3** |
| **US-071** | PLAME / T-Registro | **3** |
| **US-074** | Snapshot histórico de planilla | **2** |

**Total: 16 pts**

#### Sprint 14: Practicantes y Ajustes

**Fechas:** lunes 2027-02-09 a viernes 2027-02-20  
**Fase:** Fase 4  
**Objetivo:** Régimen de practicantes (Ley 28518), ajustes manuales de boletas.

**US asignadas:**

| US | Título | Pts |
|---|---|---|
| **US-073** | Régimen practicantes | **3** |
| **US-067** | Ajustes manuales de boleta | **2** |
| **US-072** | AFPnet | **2** |

**Total: 7 pts** (ligero, cierra la Fase 4)

---

### FASE 5: Reportes y Portal (Semanas 23–24)

#### Sprint 15: Reportes Gerenciales

**Fechas:** lunes 2027-02-23 a viernes 2027-03-06  
**Fase:** Fase 5  
**Objetivo:** Reportes Excel/PDF para gerencia: costo laboral, rotación, headcount.

**US asignadas:**

| US | Título | Pts |
|---|---|---|
| **US-075** | Reportes: costo laboral | **3** |
| **US-076** | Reportes: rotación | **3** |
| **US-077** | Reportes: headcount | **3** |

**Total: 9 pts**

#### Sprint 16: Portal del Empleado

**Fechas:** lunes 2027-03-09 a viernes 2027-03-20  
**Fase:** Fase 5  
**Objetivo:** Autoservicio: boletas, saldo vacacional, documentos, coberturas, alertas.

**US asignadas:**

| US | Título | Pts |
|---|---|---|
| **US-078** | Portal: mis boletas | **3** |
| **US-079** | Portal: saldo vacacional | **3** |
| **US-080** | Portal: mis documentos | **3** |
| **US-081** | Portal: mis coberturas | **3** |
| **US-082** | Alertas vencimiento contratos | **3** |
| **US-083** | Alertas vencimiento pólizas | **3** |

**Total: 18 pts** (concentrado, pero doable)

---

### FASE 6: Hardening y Finalización (Semanas 25–26)

#### Sprint 17: Backups, Documentación, Go-Live

**Fechas:** lunes 2027-03-23 a viernes 2027-04-03  
**Fase:** Fase 6  
**Objetivo:** Backups automatizados, documentación operacional, último testing.

**US asignadas:**

| US | Título | Pts |
|---|---|---|
| **US-084** | Backups + PITR | **3** |
| **US-085** | Manual operacional | **2** |
| **Buffer/Debt** | Refinement, fixes, go-live prep | **5** |

**Total: 10 pts**

---

## 8. Resumen de Sprints

| # | Fechas | Fase | Objetivo | Pts | Velocity |
|---|---|---|---|---|---|
| 1 | 07/13–07/24 | 0 | Infra + BD + Docker + HTTP | 13 | 13 |
| 2 | 07/28–08/08 | 0–1 | Auth + RBAC + Storage | 15 (+3 spike) | 15 |
| 3 | 08/11–08/22 | 1 | PDFs + Orquestación | 12 | 12 |
| 4 | 08/25–09/05 | 1 | Adendas + Seguros | 11 | 11 |
| 5 | 09/08–09/19 | 2 | Empleados + Importación | 16 | 16 |
| 6 | 10/06–10/17 | 3 | Spike GeoVictoria + Turnos | 8 | 8 |
| 7 | 10/20–10/31 | 3 | Marcaciones + Tardanzas | 12 | 12 |
| 8 | 11/03–11/14 | 3 | Vacaciones + Licencias | 16 | 16 |
| 9 | 11/17–11/28 | 4 | Fundaciones Planilla | 5 | 5 |
| 10 | 12/01–12/12 | 4 | Motor de Cálculo (crítico) | 13 (+3 spike) | 13 |
| 11 | 12/15–12/26 | 4 | AFP + Quinta | 13 | 13 |
| 12 | 01/12–01/23 | 4 | CTS + Gratif + Liquidación | 14 | 14 |
| 13 | 01/26–02/06 | 4 | Aprobación + Boletas + Exportes | 16 | 16 |
| 14 | 02/09–02/20 | 4 | Practicantes + Ajustes | 7 | 7 |
| 15 | 02/23–03/06 | 5 | Reportes Gerenciales | 9 | 9 |
| 16 | 03/09–03/20 | 5 | Portal Empleado | 18 | 18 |
| 17 | 03/23–04/03 | 6 | Backups + Docs + Go-Live | 10 | 10 |

**Total sprints: 17**  
**Total story points: 256 + spikes**  
**Promedio velocity: 15 pts/sprint** (conservador, real será 20–22)  
**Duración total: ~8.5 meses** (desde 2026-07-13 a 2027-04-03)

---

## 9. Gestión de Riesgos por Sprint

### Matriz de Riesgos (del plan maestro, sección 7.1)

**9 riesgos P0/P1 identificados, mapeo a sprints y mitigación:**

| Riesgo | Descripción | Probabilidad | Impacto | Sprint(s) afectado(s) | Acción mitigadora |
|---|---|---|---|---|---|
| 1 | Complejidad del motor de nómina | Media | Crítico | S10, S11, S12, S13 | Spike de validación (S10); mockear funciones antes de cálculo real; tests exhaustivos |
| 2 | Cambios de normativa SUNAT | Baja | Crítico | S10+ (todas planilla) | Parámetros versionados en BD (UIT, tasas); aislar fórmulas en funciones puras |
| 3 | API GeoVictoria inestable/cambia | Media | Alto | S6, S7 | Spike en S6; mock para testing; circuit breaker + reintentos BullMQ |
| 4 | Scope creep: cliente pide features mid-sprint | Alta | Medio | Todos | DoR estricta; sprint review = veto; replanificación cada 3 sprints |
| 5 | PII comprometida en código/logs | Alta | Crítico | S1–S2 (auth) | Validación env, auditoría, no loguear secretos; revisar signatures.ts |
| 6 | Performance de planilla <1000 empleados | Media | Alto | S10–S13 | Tests de carga; índices en BD; query analysis (EXPLAIN ANALYZE) |
| 7 | Falla de migraciones de BD | Baja | Crítico | Todos | Migraciones reversibles; backups pre-cambio; dry-run en staging |
| 8 | Desviación de velocidad real vs asumida | Media | Medio | S2–S3 (calibración) | Medir velocidad real; replan si desviación >20%; comunicar PO |
| 9 | Conflicto entre Fase 1 (actual) y Fase 2+ (BD) | Media | Alto | S3–S5 | import_batches en BD como puente; Excel → BD, no al revés |

### Acciones concretas por sprint

**Sprint 1–2 (Riesgos 5, 7, 8):**
- [ ] Remover PII de `constants.ts` y `signatures.ts` (mover a env cifrado)
- [ ] Revisar logs: no loguear contraseñas, API keys, sueldos
- [ ] Ejecutar migraciones Prisma 2 veces (crear + rollback) para validar reversibilidad
- [ ] Comunicar velocidad real al PO post-S2

**Sprint 6–7 (Riesgos 2, 3):**
- [ ] Spike GeoVictoria: obtener credenciales reales, probar API
- [ ] Diseñar circuit breaker + retry policy para GeoVictoria (no blockear planilla si marcaciones fallan)
- [ ] Documentar tasas AFP/RMV/UIT como parámetros versionados

**Sprint 9–10 (Riesgos 1, 2, 6):**
- [ ] Pre-spike: validar planilla manual cliente vs SUNAT exportes (PLAME, T-Registro)
- [ ] Aislar cálculos en funciones puras testables
- [ ] Load test: BD con 1000 empleados, calcular planilla, medir latencia
- [ ] Si >2s, agregar índices / particionar

**Todos los sprints (Riesgo 4):**
- [ ] Sprint Review con PO es veto final: si algo no es "acceptable" per DoD, vuelve al backlog
- [ ] Cada issue tiene labels de prioridad MoSCoW; SHOULD/COULD pueden quitarse sin impacto crítico
- [ ] Replanificación formal si velocity real promedio (S1+S2+S3) difiere >20% de asumida

---

## 10. Métricas de Seguimiento

### Burndown/Burnup por Fase

**Medición:** no por sprint (con 1 dev es ruido), sino **por fase completa** (2–8 sprints). Gráfica en `docs/scrum/metrics/phase-N-burndown.csv`.

| Fase | Duración (sprints) | Total pts | Tasa sostenible | Δ % real vs plan | Hito fin (fechas) |
|---|---|---|---|---|---|
| Fase 0 | 2 | 28 | 22 pts/spr | ±10% | 2026-08-08 |
| Fase 1 | 2 | 36 | 22 pts/spr | ±10% | 2026-09-05 |
| Fase 2 | 1 | 47 | 22 pts/spr | ±10% | 2026-09-19 |
| Fase 3 | 3 | 57 | 22 pts/spr | ±10% | 2026-11-14 |
| Fase 4 | 6 | 71 | 22 pts/spr | ±10% | 2027-02-20 |
| Fase 5 | 2 | 27 | 22 pts/spr | ±10% | 2027-03-20 |
| Fase 6 | 1 | 10 | 22 pts/spr | ±10% | 2027-04-03 |

### Velocity móvil

**Fórmula:** promedio de story points completados en los últimos 3 sprints.

```
V_movil(S_n) = (pts_S(n-2) + pts_S(n-1) + pts_S(n)) / 3
```

**Criterio de replanificación:**
- Si V_movil(S3) < 18 (20% menos de 22): reducir backlog 10%, ajustar fechas +1–2 meses
- Si V_movil(S3) > 25 (13% más de 22): acelerar; re-negotiar hitos
- Si 18–25: se mantiene plan

### Desviación del roadmap

**Métrica:** varianza acumulada de fechas de hitos.

```
Desvio_fase_N = |fecha_real_fin - fecha_plan_fin| / fecha_plan_fin
```

**Tolerancia:** ±10%. Si desvio >10% acumulado, invocar replanificación formal con PO.

### Criterio de aceptación de cierre de fase

Todas las US de la fase están en estado "DONE" (DoD 100% cumplido):
- [ ] Código merged a main
- [ ] Tests verdes (70%+ cobertura)
- [ ] Documentación actualizada
- [ ] Desplegable en staging

---

## 11. Hitos de Negocio y Releases

### Release Schedule (incrementos de valor al dueño)

| Hito | Fase | Fecha Fin | Entregable | Valor Negocio | Usuarios Afectados |
|---|---|---|---|---|---|
| **MVP-0: Infraestructura** | 0 | 2026-08-08 | BD + auth + Docker | Plataforma estable, CI/CD setup | Dev |
| **MVP-1: Contratos Digitales** | 1 | 2026-09-05 | Generación contratos/adendas sin Puppeteer, OneDrive, auditoría | 100% de generación automatizada, sin errores manuales | RRHH |
| **MVP-2: Maestro de Empleados** | 2 | 2026-09-19 | CRUD empleados, importación masiva, datos bancarios | BD centralizada, Excel es canal de importación, no fuente | RRHH |
| **MVP-3: Asistencia Real** | 3 | 2026-11-14 | Marcaciones vía GeoVictoria, cálculo tardanzas, vacaciones | Integración con reloj biométrico, récord vacacional automático | RRHH + Empleados |
| **MVP-4: Planilla Automatizada** | 4 | 2027-02-20 | Motor de cálculo nómina, boletas PDF, exportes SUNAT | 0 errores vs planilla manual, 15–20 horas RRHH ahorradas/mes | RRHH + Finanzas |
| **MVP-5: Portal + Reportes** | 5 | 2027-03-20 | Autoservicio empleado (boletas, vacaciones, docs), reportes gerenciales | Reduce carga RRHH aún más, visibilidad en costo laboral | Empleados + Gerencia |
| **GA: Hardening + Go-Live** | 6 | 2027-04-03 | Backups automatizados, documentación operacional, manual | Sistema listo para producción | Ops |

### Ceremonia de "Release Planning" (cada MVP)

Antes del viernes final de cada fase:
- [ ] Review de todos los items completados
- [ ] Valida DoD 100%
- [ ] Define si hay "breaking changes" o datos que migrar
- [ ] Comunica al PO qué valor se libera y a qué usuarios
- [ ] Planifica demo con stakeholders (RRHH, finanzas, empleados si aplica)
- [ ] Decide: ¿release a staging ahora, o esperar siguiente fase?

---

## 12. Plan de Comunicación Scrum

### Reuniones Recurrentes

| Ceremonia | Frecuencia | Día/Hora | Duración | Participantes | Notas |
|---|---|---|---|---|---|
| **Sprint Planning** | Cada 2 semanas | Domingo 19:00 o lunes 08:00 | 1.5 horas | Raul + PO | Sync presencial o video; define sprint goal |
| **Daily Standup (asincrónico)** | Diaria | Mañana, 09:00 commit | 5 min | Raul | GitHub Projects + issue comments; alert si blocker |
| **Sprint Review (Demo)** | Cada 2 semanas | Viernes 16:00 | 1 hora | Raul + PO | Demo en vivo; feedback; aceptación de features |
| **Sprint Retro** | Cada 2 semanas | Viernes 16:45 | 30 min | Raul + PO (opcional) | Reflexión escrita en Markdown; mejoras de proceso |
| **Replanificación (si necesario)** | Cada 3 sprints | Ad-hoc | 1 hora | Raul + PO + stakeholders | Si velocity real desviación >20% o cambio scope |
| **Sync con PO** | Semanal (viernes) | Viernes 17:00 | 15 min | Raul + PO | Actualizaciones, decisiones rápidas, escalations |

### Artefactos

| Artefacto | Ubicación | Frecuencia | Responsable |
|---|---|---|---|
| **Product Backlog** | `docs/scrum/01-product-backlog.md` | Actualizado antes de cada planning | PO + Raul |
| **Sprint Backlog** | GitHub Projects (Kanban) | Actualizado diariamente | Raul |
| **Burndown/Burnup** | `docs/scrum/metrics/phase-N-burndown.csv` | Automatizado (GitHub Actions) | GitHub |
| **Retrospectiva** | `docs/scrum/sprints/retro-S{N}.md` | Escrita viernes de retro | Raul |
| **Release Notes** | `docs/releases/MVP-N.md` | Al cierre de cada fase | Raul + PO |

### Escalaciones

**Blocker durante sprint:**
1. Raul identifica en daily standup / GitHub issue
2. Comenta en issue con @PO y label `blocker`
3. PO responde en <24h (o sync urgente si es crítico)
4. Si es decisión arquitectónica: llamada con Raul + stakeholders

**Cambio scope mid-sprint:**
1. PO propone con justificación en issue
2. Raul evalúa impacto: ¿cuántos puntos de qué historia hay que sacar?
3. Si el tradeoff es aceptable: modifica sprint backlog
4. Si no: issue va a backlog para siguiente sprint, se anota en retro

---

## 13. Observaciones al Backlog

### Posibles Vacíos Detectados

Durante el análisis de esta fase, se identificaron potenciales historias no explícitas en el Product Backlog que podrían requerirse:

| Área | Posible Historia | Fase | Impacto | Decisión |
|---|---|---|---|---|
| **Testing de cálculos** | "Crear suite de validación de planilla contra SUNAT" | 4 | Alto | SPIKE en S10; si no entra, marcar como debt técnica |
| **Integración Entra ID** | "SSO con Microsoft Entra ID" (si cliente lo requiere) | 6 | Medio | SPIKE en S2 (decisión); si SÍ: add ~3 US en Fase 6 |
| **Encriptación PII en reposo** | "Cifrar datos sensibles en BD" (sueldos, DNI) | 0 o 6 | Medio | SHOULD; evaluar post-MVP-1 (puede dejarse para GA) |
| **Multi-idioma** | "Internacionalización (ES/EN)" | 6 | Bajo | SHOULD; probablemente no en v1 |
| **Performance de búsqueda** | "Búsqueda fulltext de empleados" | 5 | Bajo | Incluida en US-025; si es compleja, spike separado |
| **Provisioning de datos iniciales** | "Script de migración de datos antiguos a BD" | 1 | Medio | Parte de US-023; revisar complejidad real |

**Acción:** si cliente requiere alguno de estos post-planning, crearemos US específica y la negociaremos en siguiente retro.

---

## 14. Anexo A: Template de Sprint Goal

Cada sprint tiene un **objetivo de negocio en una frase**, visible en Planning y en tablero GitHub:

```
### Sprint N: [Objetivo]

**Fase:** Fase X  
**Fechas:** YYYY-MM-DD a YYYY-MM-DD  
**Objetivo (1 frase de valor):** 
[Descripción del valor entregado]

**Incremento esperado:**
- [Feature 1 completada]
- [Feature 2 completada]
- [Riesgo X mitigado]

**DoD:** 
- Código merged a main
- Tests >70% cobertura
- Documentación actualizada
```

---

## 15. Anexo B: Checklist de Cierre de Sprint

**Viernes final del sprint, antes de Review:**

- [ ] Todas las issues del sprint movidas a Done (DoD cumplido)
- [ ] PRs mergeadas y cerradas
- [ ] Tests verdes en CI (`npm test` + `npm run type-check` + `npm run lint`)
- [ ] Migraciones Prisma ejecutadas y reversibles
- [ ] Documentación de módulos actualizada (README, arquitectura si es nuevo)
- [ ] Release notes draft escrito (para MVP)
- [ ] Demo prepared (features visibles, sin errores obvios)
- [ ] Staging deployment ejecutado exitosamente (si aplica)

---

## 16. Anexo C: Reglas de Estimación Revisadas

Para future refinements, aquí están las reglas de estimación aplicadas:

1. **1 pt:** trivial, <2h, ej. bump versión, config mínima
2. **2 pts:** pequeño, 2–4h, ej. endpoint GET simple, tipo CRUD sin lógica
3. **3 pts:** pequeño-mediano, 4–8h, ej. endpoint POST con validación, servicio simple con tests
4. **5 pts:** mediano, 8–16h, ej. lógica de negocio, integración con dependencia externa, tests completos
5. **8 pts:** grande, 16–32h, ej. motor de cálculo, refactor importante, integración compleja
6. **13 pts:** muy grande (rara vez en 1 sprint), 32–50h, ej. motor de nómina completo

**Regla de splitting:** si una US estimada >8 pts entra a sprint, **debe estar pre-desglosada** en subtareas <5 pts.

---

## Resumen Ejecutivo

| Métrica | Valor |
|---|---|
| **Total Historias** | 85 (+ spikes) |
| **Total Story Points** | 256 pts |
| **Sprints Planeados** | 17 |
| **Duración Total** | ~8.5 meses (2026-07-13 a 2027-04-03) |
| **Velocidad Asumida** | 22 pts/sprint (a calibrar tras S2) |
| **Fases** | 7 (Fase 0–6) |
| **Releases (MVPs)** | 7 (MVP-0 a GA) |
| **Riesgos Mapeados** | 9 P0/P1, con acciones concretas por sprint |
| **Metodología** | Scrum adaptado a 1 dev (bi-semanal planning + retro, daily asincrónico) |

---

**Fin del Plan de Sprints**

**Documento validado por:**  
- Scrum Master (facilitador): [Rol]
- Product Manager: [Responsable de backlog]  
- Desarrollador: Raul Quispe  
- Dueño del proyecto: [Stakeholder clave]

**Próxima revisión:** Post-Sprint 3 (2026-08-22) — replanificación si velocity real desviación >20%
