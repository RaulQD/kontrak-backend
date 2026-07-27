# Planificación Scrum — Kontrak HRIS

Planificación completa de la conversión de `kontrak-backend` en un HRIS para Perú, derivada del plan maestro [`../plan_sistema_rrhh_hris.md`](../plan_sistema_rrhh_hris.md) (ver especialmente §7.2 Decisiones resueltas).

| Documento | Contenido | Elaborado por |
|---|---|---|
| [`01-product-backlog.md`](./01-product-backlog.md) | Visión, personas, 15 épicas (EP-01…EP-15), 85 historias de usuario (US-001…US-085) con criterios de aceptación Gherkin, prioridades MoSCoW, RNF, fuera de alcance y preguntas abiertas al cliente | agente `product-manager` |
| [`02-plan-de-sprints.md`](./02-plan-de-sprints.md) | Marco Scrum adaptado a 1 dev, estimación de las 85 US (256 pts), 17 sprints con fechas (2026-07-13 → 2027-04-03), subtareas técnicas de Fases 0–1, DoR/DoD, spikes, riesgos por sprint, métricas e hitos de release | agente `scrum-master` |

## Reglas de mantenimiento

- **Detalle progresivo**: las US de Fases 4–6 tienen detalle mínimo y estimación preliminar a propósito; se refinan en el grooming del sprint anterior a su fase. No es un vacío, es la práctica correcta.
- **Velocidad = hipótesis**: los 22 pts/sprint se calibran con la velocidad real de los sprints 1–2. Si tras 3 sprints la desviación supera el 20%, se replanifica el calendario completo y se comunica al dueño.
- **Cambios de alcance**: entran al backlog y se priorizan en el siguiente planning — nunca a mitad de sprint.
- Este directorio es la fuente de verdad de la planificación; el tablero operativo vive en GitHub Projects.

## Empezar hoy

1. Crear el GitHub Project (Kanban) en el repo.
2. Cargar las US del Sprint 1 como Issues con etiqueta `sprint-1` (ver §7 del plan de sprints).
3. Responder las preguntas abiertas al cliente (§7 del backlog) — varias bloquean spikes tempranos.
