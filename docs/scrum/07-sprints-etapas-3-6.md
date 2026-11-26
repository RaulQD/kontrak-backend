# Kontrak HRIS (Apparka) — Sprints 12 a 29 (Etapas 3 a 6)

**Documento:** 07-sprints-etapas-3-6
**Fecha:** 2026-11-15
**Deriva de:** `05-plan-de-implementacion.md`
**Viene de:** `06-sprints-etapas-0-2.md` (mismas convenciones, capacidad y Definición de Hecho)

Estos sprints son una proyección, no un compromiso. Cada ticket trae narrativa, puntos, dependencias, criterios de aceptación esenciales y su Definición de Hecho; las subtareas se escriben en el refinamiento del sprint anterior, como establece la regla de detalle progresivo del `README.md`. Las fechas suponen 8 puntos por sprint y se recalculan al cerrar cada MVP.

Las reglas legales citadas (tasas, topes, plazos) se validan con el contador de Apparka antes de codificarlas, y sus valores viven en `legal_parameters`, nunca en el código.

---

## 1. Resumen

| Sprint | Fechas (2027) | Etapa | Objetivo | Tickets | Pts |
|---|---|---|---|---|---|
| 12 | 19/04 – 30/04 | 3 | Reporte SCTR desde la BD | US-018, US-019, TASK-16, SPIKE-GEO | 8 |
| 13 | 03/05 – 14/05 | 4 | Saldo vacacional calculado | US-052, US-054 | 8 |
| 14 | 17/05 – 28/05 | 4 | Solicitudes con aprobación; licencias | US-053, US-055 | 8 |
| 15 | 31/05 – 11/06 | 4 | Turnos y marcaciones de GeoVictoria | US-047, US-046, US-056 | 8 |
| 16 | 14/06 – 25/06 | 4 | Tardanzas y horas extra | US-048, US-049, TASK-17 | 7 |
| 17 | 28/06 – 09/07 | 4 | **MVP-3:** cierre de asistencia | US-050, US-051, US-057 | 7 |
| 18 | 12/07 – 23/07 | 5 | Insumos del empleado para planilla | US-021, US-027, US-058 | 8 |
| 19 | 26/07 – 06/08 | 5 | Pensión, periodo e historial laboral | US-028, US-059, US-024 | 7 |
| 20 | 09/08 – 20/08 | 5 | Motor: ingresos | US-060a, US-065 | 8 |
| 21 | 23/08 – 03/09 | 5 | Motor: descuentos, aportes y boleta | US-060b, US-060c | 8 |
| 22 | 06/09 – 17/09 | 5 | AFP completa y snapshot | US-061, US-074 | 7 |
| 23 | 20/09 – 01/10 | 5 | Renta de quinta categoría | US-062, US-067 | 7 |
| 24 | 04/10 – 15/10 | 5 | Gratificaciones y CTS | US-064, US-063, US-072 | 8 |
| 25 | 18/10 – 29/10 | 5 | Liquidación de beneficios | US-066 | 8 |
| 26 | 01/11 – 12/11 | 5 | Cierre de periodo y boleta PDF | US-068, US-069 | 8 |
| 27 | 15/11 – 26/11 | 5 | Archivos para bancos y SUNAT | US-070, US-071 | 6 |
| 28 | 29/11 – 10/12 | 5 | **MVP-4:** planilla cuadrada contra la real | US-073, TASK-18 | 8 |
| 29 | 13/12 – 24/12 | 6 | Operación y primer reporte | US-084, US-085, US-077 | 8 |

Total: 137 puntos. Quedan 41 puntos en la bolsa de opcionales (§6).

---

## 2. Etapa 3 — Seguros

### Sprint 12 — 19/04 al 30/04

**Objetivo:** el reporte SCTR mensual sale de la BD, sin Excel de entrada.

#### US-018 · Pólizas y coberturas

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-05 | Alta | 2 | `modules/insurance`, `prisma` | US-020b |

Como administrador de seguros, quiero registrar las pólizas (SCTR salud y pensión, EPS, Vida Ley) con su vigencia y dar de alta o baja a los colaboradores, para saber quién está cubierto en cada fecha.

- Dos pólizas del mismo tipo no pueden tener vigencias solapadas; lo impide una restricción de la BD.
- El alta de un colaborador exige que esté `ACTIVO` y que la fecha caiga dentro de la vigencia de la póliza.
- La cobertura de un colaborador en una misma póliza no se solapa consigo misma.
- Consultar la cobertura a una fecha dada devuelve exactamente a los colaboradores vigentes ese día.

**Definición de Hecho**
- [ ] Migración con las restricciones de no solapamiento, con su reversa.
- [ ] Tests de solapamiento de pólizas y de coberturas.
- [ ] e2e con matriz de permisos y `docs/api/insurance.md` creado.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

#### US-019 · Reporte SCTR mensual

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-05 | Alta | 3 | `modules/insurance` | US-018, TASK-15 |

Como asistente de seguros, quiero generar el reporte SCTR del mes y enviarlo a la aseguradora desde el sistema, para dejar de armarlo a mano.

- El reporte de un periodo incluye a los colaboradores con cobertura vigente y puesto de riesgo, con su sueldo y nivel de riesgo.
- El Excel conserva el formato que hoy produce el processor heredado; el test de caracterización de TASK-11 lo verifica.
- El envío por correo queda registrado en `sctr_declarations` con periodo, fecha, destinatario y documento generado.
- Regenerar un periodo crea una declaración nueva; no modifica la anterior.

**Definición de Hecho**
- [ ] El test de caracterización de TASK-11 pasa con datos leídos de la BD.
- [ ] e2e del trabajo con el correo simulado.
- [ ] RRHH validó el reporte de un mes real contra el que arma hoy.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

#### TASK-16 · Baja de cobertura al cesar

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Tarea | EP-05 | Alta | 1 | `modules/insurance` | US-018, US-022 |

- `insurance` consume `EmployeeTerminated` y cierra las coberturas del colaborador en la fecha de cese.
- El colaborador cesado no aparece en el reporte del periodo siguiente.

**Definición de Hecho**
- [ ] Test del consumidor del evento.
- [ ] e2e: tras el cese, el colaborador no aparece en el periodo siguiente.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

#### SPIKE-GEO · Conector de GeoVictoria

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Spike | EP-08 | Bloqueante | 2 | `modules/attendance` | Decisión D6 |

Tiempo fijo: 2 días. Entrega `docs/attendance/spike-geovictoria.md` con: autenticación, endpoints de marcaciones, límites de uso, cómo se identifica al colaborador (documento o código) y si acepta altas y ceses desde fuera. Termina con US-046 confirmada o re-estimada.

**Definición de Hecho**
- [ ] `docs/attendance/spike-geovictoria.md` mergeado.
- [ ] US-046 confirmada o re-estimada en este documento.
- [ ] D6 marcada como resuelta en `05` §5.

**Criterio de cierre de la Etapa 3:** el reporte SCTR de un mes generado desde la BD coincide con el que RRHH arma hoy.

---

## 3. Etapa 4 — Vacaciones y asistencia (MVP-3)

### Sprint 13 — 03/05 al 14/05

**Objetivo:** cada colaborador tiene su saldo vacacional calculado.

#### US-052 · Devengue de vacaciones

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-09 | Alta | 5 | `modules/leave` (nuevo), `prisma` | US-020b, TASK-15 |

Como analista de RRHH, quiero que el sistema acumule las vacaciones de cada colaborador, para conocer su saldo sin hojas de cálculo.

- Cada colaborador acumula 30 días por año de servicio, a razón de 2.5 días por mes, contados desde su fecha de ingreso.
- Un trabajo mensual actualiza los periodos; ejecutarlo dos veces en el mismo mes no duplica.
- Los colaboradores importados reciben un saldo inicial que RRHH puede cargar y que queda auditado.
- El cálculo es una función pura, con tests de ingresos a mitad de mes, años bisiestos y cese.

**Definición de Hecho**
- [ ] Tests de la función de devengue con los casos listados.
- [ ] Test de que el trabajo mensual no duplica al repetirse.
- [ ] Migración aplicada, con su reversa.
- [ ] Saldos iniciales cargados y conciliados con RRHH por escrito.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

#### US-054 · Récord vacacional

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-09 | Alta | 3 | `modules/leave` | US-052 |

Como analista de RRHH, quiero ver por colaborador los días ganados, gozados, vendidos y truncos, para responder consultas y calcular liquidaciones.

- El récord muestra por periodo: ganados, gozados, vendidos, pendientes y fecha límite de goce.
- La venta de vacaciones no supera 15 días por periodo; lo demás responde 422.
- Al cesar, los días del periodo incompleto se marcan como truncos.

**Definición de Hecho**
- [ ] Tests del límite de venta y del marcado de días truncos.
- [ ] e2e del récord por colaborador.
- [ ] `docs/api/leave.md` creado.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

### Sprint 14 — 17/05 al 28/05

**Objetivo:** el colaborador pide vacaciones y el flujo de aprobación descuenta el saldo.

#### US-053 · Solicitud de vacaciones y ausencias

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-09 | Alta | 5 | `modules/leave` | US-054, US-008b |

Como colaborador, quiero solicitar mis vacaciones y que mi jefe y RRHH las aprueben, para tener una respuesta registrada.

- La solicitud recorre `SOLICITADA` → `APROBADA_JEFE` → `APROBADA_RRHH`, o `RECHAZADA` con motivo. Una transición inválida responde 409.
- No se puede solicitar más días que el saldo disponible, ni fechas que se solapen con otra solicitud vigente.
- El jefe solo ve y aprueba las solicitudes de su división (alcance de US-008b).
- Al aprobarse en RRHH, el saldo se descuenta en la misma transacción.
- Cada cambio de estado notifica por correo al solicitante.
- Permisos: `vacaciones:solicitar`, `vacaciones:aprobar`, `vacaciones:leer`.

**Definición de Hecho**
- [ ] Tests unitarios de todas las transiciones de la solicitud.
- [ ] e2e del flujo completo con los tres roles.
- [ ] Correos verificados con el transporte simulado.
- [ ] `docs/api/leave.md` actualizado.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

#### US-055 · Licencias

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-09 | Media | 3 | `modules/leave` | US-053 |

Como analista de RRHH, quiero registrar descansos médicos y licencias de maternidad y paternidad, para que la asistencia y la planilla los reconozcan.

- Cada tipo de licencia tiene su duración y si es remunerada, definidas en un catálogo editable.
- Un descanso médico guarda el número de certificado y su documento en el legajo.
- Al superar los días de descanso médico a cargo del empleador en el año, el estado del colaborador pasa a `SUBSIDIADO`.
- Una licencia no se solapa con vacaciones aprobadas del mismo colaborador.

**Definición de Hecho**
- [ ] Catálogo de licencias sembrado y validado con el contador.
- [ ] Tests de solapamiento con vacaciones y del paso a `SUBSIDIADO`.
- [ ] e2e de registro con certificado adjunto.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

### Sprint 15 — 31/05 al 11/06

**Objetivo:** las marcaciones llegan solas y se comparan contra un turno.

#### US-047 · Turnos y horarios

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-08 | Alta | 3 | `modules/attendance` (nuevo), `prisma` | US-020b |

Como analista de RRHH, quiero definir turnos y asignarlos a colaboradores con vigencia, para saber qué horario le corresponde a cada uno cada día.

- Un turno define hora de entrada, hora de salida, refrigerio y días de la semana.
- La asignación de un colaborador a turnos no se solapa en el tiempo; lo impide una restricción de la BD.
- Consultar el horario de un colaborador en una fecha devuelve un único turno o ninguno.

**Definición de Hecho**
- [ ] Migración con la restricción de no solapamiento, con su reversa.
- [ ] Tests de la consulta de turno por fecha.
- [ ] e2e y `docs/api/attendance.md` creado.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

#### US-046 · Sincronización de marcaciones de GeoVictoria

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-08 | Alta | 3 | `modules/attendance` | SPIKE-GEO, TASK-15 |

Como analista de RRHH, quiero que las marcaciones de GeoVictoria entren al sistema automáticamente, para no exportarlas a mano.

- Un trabajo repetible trae las marcaciones nuevas y las guarda sin duplicar, aunque se ejecute dos veces sobre el mismo rango.
- Una marcación de alguien que no existe en la BD se guarda como no asignada y aparece en un reporte, no se descarta.
- Un fallo de la API se reintenta con espera creciente y no bloquea el resto del sistema.
- El cliente HTTP vive detrás de un puerto; los tests usan un adaptador simulado.

**Definición de Hecho**
- [ ] Tests con el adaptador simulado: sin duplicados, marcaciones no asignadas y reintento.
- [ ] Probado contra la API real en el entorno de pruebas.
- [ ] Hay una guía de qué hacer cuando la sincronización falla.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

#### US-056 · Calendario de ausencias

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-09 | Media | 2 | `modules/leave` | US-053 |

- `GET /api/leave/calendar?divisionId=&from=&to=` devuelve vacaciones y licencias aprobadas del rango.
- Respeta el alcance: el jefe solo consulta su división.

**Definición de Hecho**
- [ ] e2e con alcance por división.
- [ ] `docs/api/leave.md` actualizado.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

### Sprint 16 — 14/06 al 25/06

**Objetivo:** el sistema calcula tardanzas y horas extra por día.

#### US-048 · Cálculo de tardanzas

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-08 | Alta | 3 | `modules/attendance` | US-046, US-047 |

- La tardanza es la diferencia entre la hora de entrada del turno y la primera marcación, descontada la tolerancia configurada.
- Un día con turno y sin marcación se clasifica como falta, salvo que exista vacación o licencia aprobada.
- El cálculo es una función pura con tests de turnos que cruzan la medianoche.

**Definición de Hecho**
- [ ] Tests de la función: tolerancia, turno que cruza la medianoche, y falta frente a licencia.
- [ ] Validado con una semana real de marcaciones revisada por RRHH.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

#### US-049 · Horas extra

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-08 | Alta | 3 | `modules/attendance` | US-046, US-047 |

- El tiempo trabajado por encima de la jornada del turno se registra como horas extra, separado en el tramo de las dos primeras horas y el tramo posterior.
- Las sobretasas de cada tramo se leen de `legal_parameters`.
- Las horas extra requieren aprobación antes de pasar a planilla.

**Definición de Hecho**
- [ ] Tests por cada tramo de horas extra.
- [ ] Sobretasas sembradas en `legal_parameters` con su referencia legal, validadas con el contador.
- [ ] e2e de la aprobación de horas extra.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

#### TASK-17 · Refinamiento de la Etapa 5

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Tarea | EP-10 | Alta | 1 | planificación | Decisión D7 |

- Las historias US-057 a US-074 quedan re-estimadas y con criterios de aceptación completos.
- Contabilidad entregó las planillas reales de uno o dos meses, con sus boletas.
- Están listados los conceptos remunerativos y descuentos que Apparka usa realmente.

**Definición de Hecho**
- [ ] US-057 a US-074 actualizadas en este documento con puntos y criterios de aceptación completos.
- [ ] Planillas reales recibidas y guardadas en la ubicación acordada, fuera del repositorio.
- [ ] Calendario de la Etapa 5 recalculado en `05` §4.

### Sprint 17 — 28/06 al 09/07

**Objetivo (MVP-3):** un mes de asistencia se cierra con totales por colaborador.

#### US-050 · Cierre de periodo de asistencia

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-08 | Alta | 3 | `modules/attendance` | US-048, US-049 |

- El cierre exige que no queden días sin clasificar ni marcaciones sin asignar; si quedan, responde 409 con la lista.
- Al cerrar se guardan los totales por colaborador: días trabajados, faltas, minutos de tardanza y horas extra por tramo.
- Un periodo cerrado no admite cambios. Reabrirlo requiere un permiso específico y queda auditado.
- `attendance` expone por su `index.ts` la lectura de totales de un periodo cerrado, que es lo que consumirá `payroll`.

**Definición de Hecho**
- [ ] e2e de cierre bloqueado y de cierre exitoso.
- [ ] Test de que un periodo cerrado rechaza cambios.
- [ ] La lectura pública de totales está documentada.
- [ ] Un mes real quedó cerrado en el entorno de pruebas.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

#### US-051 · Corrección manual de asistencia

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-08 | Media | 3 | `modules/attendance` | US-046 |

- Una corrección exige una nota de justificación; sin ella responde 422.
- La marcación original se conserva; la corrección es un registro aparte.
- La auditoría guarda el valor anterior, el nuevo y la nota.

**Definición de Hecho**
- [ ] e2e de corrección con y sin nota.
- [ ] Auditoría verificada por e2e.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

#### US-057 · Conceptos de planilla

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-10 | Alta | 1 | `modules/payroll` (nuevo), `prisma` | TASK-17 |

- Cada concepto tiene código, nombre, tipo (ingreso, descuento, aporte del empleador), si es afecto a pensión, a renta de quinta y a EsSalud, y su código PLAME.
- El seed carga los conceptos que Apparka usa, levantados en TASK-17.

**Definición de Hecho**
- [ ] Migración aplicada, con su reversa.
- [ ] Seed de conceptos validado por contabilidad.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

**Criterio de cierre del MVP-3:** una solicitud de vacaciones recorre todo el flujo y descuenta el saldo; un mes de asistencia se sincroniza, se corrige y se cierra.

---

## 4. Etapa 5 — Planilla (MVP-4)

Alcance: régimen general (D.Leg. 728) y practicantes (Ley 28518). El motor se escribe como funciones puras: reciben al colaborador, la asistencia cerrada y los parámetros legales vigentes, y devuelven las líneas de la boleta. No acceden a la BD.

### Sprint 18 — 12/07 al 23/07

**Objetivo:** el colaborador tiene los datos que la planilla necesita.

#### US-021 · Cuentas bancarias y afiliaciones

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-06 | Alta | 3 | `modules/employees`, `prisma` | US-020b |

- Un colaborador tiene una cuenta de sueldo y una de CTS vigentes a la vez, con historial de las anteriores.
- Las vigencias de un mismo tipo de cuenta no se solapan.
- El número de cuenta se oculta sin el permiso `colaborador:leer_sensible`.

**Definición de Hecho**
- [ ] Migración con la restricción de vigencias, con su reversa.
- [ ] e2e con y sin el permiso de datos sensibles.
- [ ] `docs/api/employees.md` actualizado.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

#### US-027 · Derechohabientes

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-06 | Alta | 3 | `modules/employees`, `prisma` | US-020b |

- Se registran cónyuge e hijos con documento, fecha de nacimiento y vínculo.
- `hasChildrenUnder18` deja de editarse a mano: se deriva de los hijos registrados y de la fecha consultada.
- Los datos de derechohabientes requieren `colaborador:leer_sensible`.

**Definición de Hecho**
- [ ] Migración aplicada, con su reversa.
- [ ] Test de la derivación de `hasChildrenUnder18` a una fecha dada.
- [ ] Queda decidido y ejecutado qué pasa con el valor booleano ya guardado.
- [ ] e2e con matriz de permisos.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

#### US-058 · Parámetros legales versionados

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-10 | Alta | 2 | `modules/organization` | US-004d |

- Consultar un parámetro a una fecha devuelve el valor vigente ese día.
- Registrar un valor nuevo cierra la vigencia del anterior; nunca se edita un valor pasado.
- Cada valor exige su referencia legal. Requiere el permiso de parámetros legales y audita.

**Definición de Hecho**
- [ ] Tests de consulta por fecha y de cierre de vigencia.
- [ ] e2e de permisos y de auditoría.
- [ ] Valores vigentes sembrados, con la referencia legal verificada por el contador.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

### Sprint 19 — 26/07 al 06/08

**Objetivo:** existe el periodo de planilla y el historial de puesto y sueldo.

#### US-028 · Datos de pensión

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-06 | Alta | 3 | `modules/employees`, `prisma` | US-021 |

- Cada colaborador tiene un sistema de pensiones vigente: ONP o una AFP, con su tipo de comisión y su CUSPP.
- El catálogo de AFP guarda aporte, prima de seguro y comisión con vigencia por fecha.
- Un cambio de AFP cierra la afiliación anterior.

**Definición de Hecho**
- [ ] Migración aplicada, con su reversa.
- [ ] Catálogo de AFP sembrado con las tasas vigentes, verificadas por el contador.
- [ ] Tests del cambio de afiliación.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

#### US-059 · Periodo de planilla

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-10 | Alta | 2 | `modules/payroll`, `prisma` | US-057 |

- Un periodo tiene tipo (mensual, gratificación, CTS, liquidación), mes y estado.
- No puede haber dos periodos abiertos del mismo tipo y mes.
- Un periodo mensual solo se abre si el periodo de asistencia de ese mes está cerrado.

**Definición de Hecho**
- [ ] Migración aplicada, con su reversa.
- [ ] Tests de las dos restricciones de apertura.
- [ ] e2e y `docs/api/payroll.md` creado.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

#### US-024 · Historial laboral

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-06 | Media | 2 | `modules/employees`, `prisma` | TASK-09, US-013a |

- Cada cambio de puesto, sede, división o sueldo genera un registro con su fecha de inicio.
- Consultar el puesto y el sueldo de un colaborador a una fecha pasada devuelve el valor vigente ese día.

**Definición de Hecho**
- [ ] Migración aplicada, con su reversa.
- [ ] Test de la consulta de puesto y sueldo a una fecha pasada.
- [ ] Los colaboradores existentes tienen su registro inicial de historial.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

### Sprint 20 — 09/08 al 20/08

**Objetivo:** el motor calcula los ingresos de un mes.

#### US-060a · Motor de cálculo: ingresos

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-10 | Crítica | 5 | `modules/payroll` | US-059, US-050, US-024 |

- Dado un colaborador con sueldo, días trabajados, faltas y horas extra del periodo cerrado, el motor devuelve sus líneas de ingreso.
- Los días no trabajados por falta se descuentan de forma proporcional.
- Ingresos y ceses a mitad de mes se calculan por los días correspondientes.
- Todo importe se maneja con decimales exactos; ningún cálculo usa números de coma flotante.
- La suite incluye al menos 20 casos tomados de las boletas reales de TASK-17.

**Definición de Hecho**
- [ ] Al menos 20 casos reales en la suite, en verde.
- [ ] Cobertura de ramas del motor de 90 % o más.
- [ ] Ningún importe pasa por `Number`: verificado en la revisión del PR.
- [ ] `docs/payroll/formulas.md` describe cada línea de ingreso.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

#### US-065 · Asignación familiar

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-10 | Alta | 3 | `modules/payroll` | US-060a, US-027, US-058 |

- Un colaborador con hijos menores de 18 años registrados recibe la asignación como línea de ingreso.
- El importe es el porcentaje de la remuneración mínima vigente en la fecha del periodo.
- No depende de los días trabajados ni se multiplica por la cantidad de hijos.

**Definición de Hecho**
- [ ] Tests con y sin hijos menores, y con cambio de remuneración mínima.
- [ ] Importe validado con contabilidad contra una boleta real.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

### Sprint 21 — 23/08 al 03/09

**Objetivo:** el motor produce una boleta completa de un mes regular.

#### US-060b · Motor de cálculo: descuentos y aportes

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-10 | Crítica | 5 | `modules/payroll` | US-060a, US-028 |

- El motor calcula el descuento de pensión según el sistema del colaborador y el aporte de EsSalud a cargo del empleador.
- La base de cada descuento se arma solo con los conceptos marcados como afectos.
- El neto es ingresos menos descuentos, y nunca es negativo: si lo fuera, el cálculo se detiene con un error que nombra al colaborador.
- Los casos reales de TASK-17 cuadran al céntimo.

**Definición de Hecho**
- [ ] Los casos reales de TASK-17 cuadran al céntimo.
- [ ] Tests de las bases afectas por concepto.
- [ ] `docs/payroll/formulas.md` describe descuentos y aportes.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

#### US-060c · Motor de cálculo: ejecución y boleta persistida

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-10 | Crítica | 3 | `modules/payroll` | US-060b, TASK-15 |

- Calcular un periodo es un trabajo asíncrono que procesa a todos los colaboradores activos y guarda una boleta por cada uno.
- El fallo de un colaborador no detiene a los demás, y queda en el reporte del periodo.
- Recalcular un periodo abierto reemplaza las boletas en borrador; un periodo cerrado no se recalcula.
- Requiere `calculo:ejecutar_borrador`.

**Definición de Hecho**
- [ ] e2e del trabajo de cálculo sobre un periodo de prueba.
- [ ] Test de que el fallo de un colaborador no detiene a los demás.
- [ ] e2e de permisos.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

### Sprint 22 — 06/09 al 17/09

**Objetivo:** la pensión privada se calcula completa y cada boleta es reproducible.

#### US-061 · AFP con comisiones y tope

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-10 | Alta | 5 | `modules/payroll` | US-060b |

- El descuento de AFP se separa en tres líneas: aporte obligatorio, prima de seguro y comisión.
- La prima de seguro respeta la remuneración máxima asegurable vigente.
- La comisión se calcula según el tipo que eligió el colaborador.
- Las tasas se toman del catálogo de AFP a la fecha del periodo.

**Definición de Hecho**
- [ ] Tests por tipo de comisión y del tope asegurable.
- [ ] Casos reales de colaboradores de al menos dos AFP distintas.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

#### US-074 · Snapshot de la boleta

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-10 | Alta | 2 | `modules/payroll` | US-060c |

- Cada boleta guarda los datos del colaborador, los totales de asistencia y todos los parámetros legales usados.
- Con el snapshot, la boleta se recalcula y da el mismo resultado aunque los parámetros hayan cambiado después.

**Definición de Hecho**
- [ ] Test de reproducibilidad: se cambia un parámetro y la boleta recalculada desde su snapshot da el mismo resultado.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

### Sprint 23 — 20/09 al 01/10

**Objetivo:** la retención de renta de quinta categoría se calcula mes a mes.

#### US-062 · Renta de quinta categoría

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-10 | Alta | 5 | `modules/payroll` | US-060b, US-058 |

- La retención mensual sigue el procedimiento de SUNAT: proyección de la remuneración anual, deducción de 7 UIT, aplicación de la escala progresiva y reparto según el mes.
- La proyección considera las gratificaciones y las retenciones ya efectuadas en el año.
- Un colaborador que ingresa a mitad de año puede declarar las rentas y retenciones de su empleador anterior.
- Los tests cubren cada tramo de la escala y cada grupo de meses.

**Definición de Hecho**
- [ ] Tests por cada tramo de la escala y por cada grupo de meses.
- [ ] Casos reales validados por contabilidad.
- [ ] `docs/payroll/formulas.md` describe el procedimiento.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

#### US-067 · Ajustes manuales de boleta

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-10 | Media | 2 | `modules/payroll` | US-060c |

- Un ajuste es una línea adicional con concepto, importe y nota obligatoria, solo sobre un periodo abierto.
- El ajuste recalcula bases y neto. Audita con autor y motivo.

**Definición de Hecho**
- [ ] e2e de ajuste sobre periodo abierto y de rechazo sobre periodo cerrado.
- [ ] Auditoría verificada por e2e.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

### Sprint 24 — 04/10 al 15/10

**Objetivo:** el sistema calcula los dos beneficios semestrales.

#### US-064 · Gratificaciones

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-10 | Alta | 3 | `modules/payroll` | US-060b |

- En julio y diciembre cada colaborador recibe una remuneración por el semestre completo, o la parte proporcional a los meses trabajados.
- La bonificación extraordinaria se calcula sobre la gratificación, con la tasa que corresponde según el colaborador esté en EsSalud o en una EPS.
- La gratificación no está afecta a descuento de pensión.

**Definición de Hecho**
- [ ] Tests de semestre completo, semestre parcial y de las dos tasas de bonificación.
- [ ] Casos reales de una gratificación ya pagada.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

#### US-063 · CTS

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-10 | Alta | 3 | `modules/payroll` | US-060b, US-064 |

- La remuneración computable incluye el sueldo, la asignación familiar y un sexto de la última gratificación.
- El depósito semestral es proporcional a los meses y días trabajados en el semestre.
- El periodo de CTS produce el detalle por colaborador con la cuenta de CTS vigente (US-021).

**Definición de Hecho**
- [ ] Tests de semestre completo y parcial.
- [ ] Casos reales de un depósito ya efectuado.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

#### US-072 · Archivo para AFPnet

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-11 | Media | 2 | `modules/payroll` | US-061 |

- De un periodo cerrado se exporta el archivo de aportes en el formato que acepta AFPnet.
- El total del archivo coincide con la suma de las líneas de AFP de las boletas.

**Definición de Hecho**
- [ ] Test de que el total del archivo coincide con las boletas.
- [ ] El archivo fue aceptado por el validador de AFPnet.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

### Sprint 25 — 18/10 al 29/10

**Objetivo:** al cesar un colaborador el sistema calcula lo que se le debe.

#### US-066 · Liquidación de beneficios sociales

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-10 | Alta | 8 | `modules/payroll` | US-063, US-064, US-054, US-022 |

- A partir de un cese registrado se genera una liquidación con CTS trunca, vacaciones truncas y no gozadas, y gratificación trunca.
- Cada componente muestra su base, su periodo y su fórmula, para que RRHH pueda explicarlo.
- La liquidación toma los días de vacaciones del récord (US-054) y los marca como liquidados.
- Se genera el documento PDF y queda en el legajo.
- Los casos de prueba salen de liquidaciones reales de Apparka.

Esta historia ocupa el sprint completo. Si al refinarla supera los 8 puntos, se parte por componente.

**Definición de Hecho**
- [ ] Liquidaciones reales de Apparka en la suite, cuadradas al céntimo.
- [ ] e2e desde el cese hasta el documento en el legajo.
- [ ] RRHH aprobó el PDF de la liquidación.
- [ ] `docs/payroll/formulas.md` describe cada componente.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

### Sprint 26 — 01/11 al 12/11

**Objetivo:** un periodo se aprueba, se cierra y entrega boletas.

#### US-068 · Aprobación y cierre de periodo

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-10 | Alta | 5 | `modules/payroll` | US-060c |

- El periodo recorre `ABIERTO` → `CALCULADO` → `APROBADO` → `CERRADO`. Una transición inválida responde 409.
- Aprobar requiere `calculo:aprobar`, y quien calculó no puede aprobar su propio cálculo.
- Un periodo cerrado es inmutable: ninguna boleta, ajuste ni parámetro suyo se modifica.
- Corregir un periodo cerrado se hace con un periodo de ajuste nuevo.

**Definición de Hecho**
- [ ] Tests unitarios de todas las transiciones del periodo.
- [ ] e2e de inmutabilidad del periodo cerrado.
- [ ] e2e de que quien calculó no puede aprobar.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

#### US-069 · Boleta de pago en PDF

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-11 | Alta | 3 | `modules/payroll`, `platform/pdf` | US-068, US-012 |

- Al cerrar el periodo se genera una boleta PDF por colaborador, guardada con `FileStorage` y registrada en `generated_documents`.
- La boleta muestra los datos del empleador, del colaborador, los ingresos, los descuentos, los aportes del empleador y el neto.
- Solo se generan boletas de periodos cerrados.

**Definición de Hecho**
- [ ] RRHH y contabilidad aprobaron el formato de la boleta.
- [ ] e2e de generación al cierre y de rechazo en periodo abierto.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

### Sprint 27 — 15/11 al 26/11

**Objetivo:** del periodo cerrado salen los archivos para pagar y declarar.

#### US-070 · Archivo de pagos para el banco

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-11 | Alta | 3 | `modules/payroll` | US-068, US-021 |

- Se exporta el archivo de abonos en el formato del banco con el que opera Apparka, reutilizando el processor de cuentas sueldo heredado.
- El total del archivo coincide con la suma de los netos del periodo.
- Un colaborador sin cuenta de sueldo vigente aparece en una lista de excepciones, no se omite en silencio.

**Definición de Hecho**
- [ ] Test de que el total coincide con los netos.
- [ ] El archivo fue aceptado en una carga de prueba en la banca por internet del banco.
- [ ] Test de la lista de excepciones.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

#### US-071 · Archivos para PLAME y T-Registro

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-11 | Alta | 3 | `modules/payroll` | US-068 |

- Se exportan los archivos de un periodo cerrado con los códigos SUNAT de concepto, ocupación y establecimiento.
- Un dato obligatorio faltante (por ejemplo, un puesto sin código de ocupación) detiene la exportación con la lista de lo que falta.

**Definición de Hecho**
- [ ] Los archivos fueron aceptados por la herramienta de SUNAT en una carga de prueba.
- [ ] Test de la detención por datos faltantes.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

### Sprint 28 — 29/11 al 10/12

**Objetivo (MVP-4):** una planilla real se reproduce con diferencia cero.

#### US-073 · Régimen de practicantes

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-10 | Alta | 3 | `modules/payroll` | US-060b |

- El régimen de cada colaborador (general o practicante) decide qué reglas del motor aplican.
- El practicante percibe una subvención, no una remuneración: no genera CTS, gratificación ni asignación familiar.
- Recibe media subvención adicional por cada seis meses de modalidad formativa.

**Definición de Hecho**
- [ ] Tests del régimen de practicantes.
- [ ] Caso real de un practicante de Apparka, validado por contabilidad.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

#### TASK-18 · Corrida en paralelo contra la planilla real

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Tarea | EP-10 | Crítica | 5 | `modules/payroll` | Todas las historias de la etapa. Decisión D7 |

- Se calcula en el sistema un mes que contabilidad ya pagó, con los mismos datos de entrada.
- Un reporte compara colaborador por colaborador y línea por línea contra la planilla real.
- Cada diferencia queda explicada: error del sistema (se corrige), error de la planilla original (lo confirma contabilidad) o dato de entrada distinto.
- El criterio de salida es diferencia cero en el neto de todos los colaboradores del mes.

**Definición de Hecho**
- [ ] Reporte de comparación archivado, con cada diferencia explicada y cerrada.
- [ ] Las correcciones del sistema que salieron de la corrida están mergeadas.
- [ ] Contabilidad dio su conformidad por escrito.

**Criterio de cierre del MVP-4:** una planilla mensual real cuadra al céntimo; el periodo cerrado es inmutable; cada boleta es reproducible desde su snapshot.

---

## 5. Etapa 6 — Operación y cierre

### Sprint 29 — 13/12 al 24/12

**Objetivo:** el sistema se puede operar y recuperar sin el desarrollador.

#### US-084 · Respaldos con recuperación a un punto en el tiempo

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-14 | Alta | 3 | operación | TASK-10 |

- Además del respaldo diario, se archivan los registros de transacciones para recuperar la BD a cualquier momento de los últimos días.
- Una recuperación a un momento elegido se ejecutó y documentó.
- La retención de planillas cerradas cumple el plazo legal de conservación.
- Un respaldo fallido genera una alerta por correo.

**Definición de Hecho**
- [ ] Una recuperación a un momento elegido se ejecutó y quedó documentada.
- [ ] La alerta se probó provocando un respaldo fallido.
- [ ] `docs/operacion/backups.md` actualizado.

#### US-085 · Manual de operación

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-14 | Media | 2 | `docs/operacion` | — |

- Describe despliegue, variables de entorno, respaldos, restauración, revisión de trabajos fallidos y alta de usuarios.
- Una persona que no escribió el sistema lo despliega desde cero siguiendo solo el manual.

**Definición de Hecho**
- [ ] Manual mergeado en `docs/operacion`.
- [ ] Un tercero desplegó el sistema siguiendo solo el manual, y sus hallazgos están corregidos.

#### US-077 · Reporte de dotación

| Tipo | Épica | Prioridad | Pts | Componente | Depende de |
|---|---|---|---|---|---|
| Historia | EP-12 | Media | 3 | `modules/reports` | US-020b, US-024 |

- Devuelve la cantidad de colaboradores activos por sede, división y puesto a una fecha dada, y su evolución mensual.
- Se descarga en Excel. Respeta el alcance de US-008b.

**Definición de Hecho**
- [ ] e2e con alcance por división.
- [ ] RRHH validó el Excel contra un mes conocido.
- [ ] PR revisado y mergeado a `develop`, con `lint`, `type-check`, tests, `depcruise` y e2e en verde.

---

## 6. Bolsa de opcionales

Historias sin sprint asignado. Entran cuando un sprint cierra antes de tiempo o cuando el dueño las prioriza sobre lo planificado.

| Clave | Historia | Pts | Depende de |
|---|---|---|---|
| US-009b | Triggers de auditoría, `GET /audit-logs` y auditoría de lecturas | 2 | US-009a |
| US-010 | Recuperación de contraseña | 2 | US-007 |
| US-025 | Búsqueda sin acentos y filtros por área y fecha de ingreso | 2 | US-020a |
| US-026 | Contactos de emergencia | 2 | US-020b |
| US-029 | Normalización de direcciones con ubigeo | 2 | US-004d |
| US-030 | Estados `SUSPENDIDO`, `VACACIONES` y `SUBSIDIADO` | 1 | US-020b |
| US-036 | Normalización de variantes de puestos | 2 | US-035 |
| US-037 | Centros de costo | 2 | US-031 |
| US-075 | Reporte de costo laboral | 3 | US-068 |
| US-076 | Reporte de rotación | 3 | US-022 |
| US-078 | Portal: mis boletas | 3 | US-069 |
| US-079 | Portal: mi saldo vacacional | 3 | US-054 |
| US-080 | Portal: mis documentos | 3 | US-017 |
| US-081 | Portal: mis coberturas | 3 | US-018 |
| US-083 | Alertas de vencimiento de pólizas | 3 | US-018 |
| US-086 (nueva) | Plantillas de contrato editables: cláusulas guardadas en la BD con versiones, editables sin desplegar código | 5 | US-012, US-031 |

US-086 no está en el backlog `01`: nace el 2026-11-16 de la necesidad de cambiar el texto de una cláusula sin tocar `templates.ts`. Corresponde al motor de generación documental del plan maestro (§4.8, tablas `document_templates` y `template_versions`). Su estimación es preliminar, y cada contrato generado debe guardar la versión de plantilla que usó.

US-009b lleva la auditoría de lecturas de datos sensibles, que `04-us-020-maestro-empleados.md` §10 (R3) vincula a la Ley 29733. Conviene priorizarla antes de cargar datos de salud (US-055) y de derechohabientes (US-027).
