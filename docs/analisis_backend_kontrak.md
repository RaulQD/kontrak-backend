# Analisis integral del backend Kontrak

Fecha del analisis: 2026-05-28  
Proyecto: `kontrak-backend`  
Stack detectado: Node.js, TypeScript, Express 5, Microsoft Graph/OneDrive, Puppeteer, ExcelJS, Brevo, Zod, Pino.

## 1. Resumen ejecutivo

El backend ya tiene una base razonablemente ordenada: separa `api`, `core`, `domain`, `infrastructure` y `shared`; compila correctamente con TypeScript; y el lint no reporta errores bloqueantes. El flujo principal esta claro: subir o detectar archivos Excel, validarlos, generar contratos/reportes, subir resultados a OneDrive y enviar notificaciones.

El mayor problema no es que el sistema este "mal", sino que esta en una mitad de refactor: ya existen capas, adaptadores, validadores y orquestador, pero todavia hay responsabilidades mezcladas, dependencias directas creadas con `new`, logica de infraestructura dentro de dominio/core, y varias rutas funcionales sin pruebas automatizadas.

Prioridad maxima:

1. Corregir bugs funcionales en el orquestador.
2. Agregar tests del flujo critico Excel -> contratos/reportes -> OneDrive.
3. Resolver vulnerabilidades de dependencias reportadas por `npm audit`.
4. Sacar configuraciones sensibles/hardcodeadas a variables de entorno.
5. Reducir dependencia de Puppeteer o centralizar su ciclo de vida.

## 2. Estado tecnico verificado

Comandos ejecutados:

| Comando | Resultado |
|---|---|
| `npm.cmd run type-check` | OK |
| `npm.cmd run lint` | OK con 13 warnings |
| `npm.cmd audit --audit-level=low` | 7 vulnerabilidades: 6 moderadas, 1 alta |
| `rg --files -g "*test*" -g "*spec*"` | No se encontraron tests |

Metricas aproximadas:

| Metrica | Valor |
|---|---:|
| Archivos TypeScript en `src` | 100 |
| Lineas TypeScript en `src` | 9,768 |
| Archivo mas grande | `src/domain/contracts/templates/templates.ts` con 3,050 lineas |
| Orquestador principal | `src/core/orchestration/file-processing.orchestrator.ts` con 525 lineas |

Distribucion por capas:

| Carpeta | Archivos TS |
|---|---:|
| `api` | 11 |
| `config` | 3 |
| `core` | 25 |
| `domain` | 18 |
| `infrastructure` | 20 |
| `services` | 1 |
| `shared` | 18 |
| `types` | 1 |

## 3. Arquitectura actual

La arquitectura intenta seguir una separacion por capas:

```text
src/
  api/              Controladores, rutas y middlewares Express
  core/             Orquestacion, procesadores y notificaciones
  domain/           Servicios de Excel, contratos, validaciones y plantillas
  infrastructure/   OneDrive, email, browser/Puppeteer
  shared/           Utilidades, constantes y tipos compartidos
  config/           Configuracion y contenedor basico de servicios
```

Fortalezas:

- Hay una intencion clara de arquitectura limpia.
- El acceso a OneDrive esta encapsulado en `OneDriveStorageAdapter`.
- Existe `FileProcessingOrchestrator`, que concentra el flujo automatizado.
- Zod se usa para validar empleados y adendas.
- TypeScript esta en modo `strict`.
- Hay logger estructurado con Pino.

Problemas:

- El orquestador hace demasiado: valida, descarga, detecta tipo de Excel, procesa, sube, elimina, arma folders, envia emails y construye HTML.
- Los controladores instancian servicios directamente, dificultando tests y reemplazos.
- Hay dependencias de Puppeteer repartidas en controladores, dominio, infraestructura y servicios.
- `ServiceContainer` es muy basico y no gobierna todas las dependencias.
- Existe un servicio legacy `src/services/file-storage.service.ts` junto a la abstraccion nueva de storage.

## 4. Hallazgos criticos

### 4.1. El procesador de cuenta sueldo se ejecuta pero no entra al resultado final

Archivo: `src/core/orchestration/file-processing.orchestrator.ts`

En las lineas 166-180 se ejecutan 7 promesas, incluyendo:

```ts
this.salaryAccountProcessor.processEmployees(employees, browser)
```

Pero solo se destructuran 6 resultados y `salaryAccountResult` no se usa. Luego `allResults` solo combina contratos, SCTR, SCTR APE, vida ley, fotocheck y FOLA. Esto provoca que el resultado de cuenta sueldo no se refleje correctamente en el resumen general ni en la politica de exito/fallo.

Impacto:

- Puede haber errores de cuenta sueldo que no afecten el resultado final.
- El sistema puede eliminar el Excel original aunque un paso haya fallado.
- Las notificaciones pueden reportar exito incompleto.

Recomendacion:

- Destructurar el resultado de `salaryAccountProcessor`.
- Incluirlo en `allResults` o definir formalmente que ese procesador tiene side effects separados.
- Evitar que `SalaryAccountProcessor` suba directamente a OneDrive si el patron del resto es "generar stream y dejar que el orquestador suba".

### 4.2. Streams reutilizados despues de subir a OneDrive

Archivo: `src/core/orchestration/file-processing.orchestrator.ts`

Primero se suben los streams en el loop de lineas 196-241. Despues, en las lineas 267-274, se intenta convertir `sctrResult.contracts[0]?.stream` y `sctrApeResult.contracts[0]?.stream` a Buffer para adjuntarlos por email.

En Node.js, un `Readable` normalmente se consume una sola vez. Si `uploadFile()` ya leyo el stream, el buffer posterior puede quedar vacio o no disponible.

Impacto:

- Correos SCTR/SCTR APE pueden salir sin adjunto.
- El resultado puede ser intermitente segun el tipo de stream.

Recomendacion:

- Generar Buffer antes de subir.
- O cambiar `ContractResult` para transportar `buffer` cuando el documento se reutiliza.
- O crear una utilidad `cloneReadableFromBuffer`.

### 4.3. Los tipos de contrato invalidos se ignoran silenciosamente

Archivo: `src/domain/excel/services/validation.service.ts`

En las lineas 40-41:

```ts
if (!CONTRACT_TYPES.includes(rawContractType as ContractType)) {
  return { errors: [] };
}
```

Esto descarta la fila sin error y sin empleado valido.

Impacto:

- El usuario puede cargar una fila invalida y el sistema simplemente procesara menos empleados.
- Se pierde trazabilidad de errores del Excel.
- Riesgo operativo alto porque RRHH podria pensar que todos fueron importados.

Recomendacion:

- Retornar un `ValidationError` indicando tipo de contrato invalido.
- Incluir la fila, campo y valor recibido.

### 4.4. Puppeteer no siempre se cierra si falla la preview

Archivo: `src/api/controllers/contract.controller.ts`

En `previewContractPdf`, lineas 31-48, se abre un browser con `puppeteer.launch()`, pero no hay `finally` para cerrarlo.

Impacto:

- Fugas de procesos Chromium.
- Consumo creciente de memoria.
- Riesgo de caidas en servidor bajo uso continuo.

Recomendacion:

- Usar `BrowserManager`.
- O envolver en `try/finally`.
- Mejor aun: migrar gradualmente a `pdfmake`, como ya sugiere `docs/migration_to_pdfmake.md`.

### 4.5. `ImageGeneratorService` tambien puede filtrar browser si falla

Archivo: `src/domain/contracts/services/image-generator.service.ts`

Se abre Puppeteer en lineas 7-10 y se cierra al final, pero no hay `try/finally`. Si falla `setContent`, `page.$` o `screenshot`, el browser queda abierto.

Recomendacion:

- Usar `try/finally`.
- Escapar HTML generado desde datos de empleados para evitar inyeccion de markup.

### 4.6. Scheduler no coincide con el comentario y no es configurable

Archivo: `src/infrastructure/onedrive/scheduler/onedrive.scheduler.ts`

El comentario dice "lunes a viernes de 8 a 23 horas", pero el default real es:

```ts
start(cronExpression: string = '*/1 * * * *')
```

Eso corre cada minuto, todos los dias, todo el dia.

Impacto:

- Consumo innecesario de recursos.
- Procesamiento fuera de horario esperado.
- Mayor cantidad de llamadas a Microsoft Graph.

Recomendacion:

- Mover cron a `ONEDRIVE_CRON_SCHEDULE`.
- Documentar zona horaria.
- Usar una expresion que realmente refleje horario laboral si ese es el requisito.

## 5. Seguridad

### 5.1. Vulnerabilidades de dependencias

`npm audit` reporta:

| Paquete | Severidad | Nota |
|---|---|---|
| `tmp` | Alta | Path traversal |
| `nodemailer` | Moderada | SMTP command injection |
| `brace-expansion` | Moderada | DoS |
| `qs` | Moderada | DoS |
| `uuid` via `exceljs` | Moderada | Bounds check |
| `ws` | Moderada | Memory disclosure |

Recomendacion:

1. Ejecutar `npm audit fix` y revisar diff.
2. Para fixes con breaking changes, crear rama separada.
3. Validar especialmente `exceljs`, `nodemailer` y dependencias transitivas.

### 5.2. Correos hardcodeados

Archivo: `src/core/orchestration/file-processing.orchestrator.ts`

Lineas 457-458 y 476-477 contienen destinatarios fijos:

```ts
to: ['raul@prodequa.com'],
cc: ['kevindev2026@outlook.com'],
```

Recomendacion:

- Usar variables como `EMAIL_SCTR_TO`, `EMAIL_SCTR_CC`, `EMAIL_SCTR_APE_TO`, `EMAIL_SCTR_APE_CC`.
- Validarlas en startup.

### 5.3. Sender hardcodeado

Archivos:

- `src/infrastructure/email/services/brevo-email.service.ts`
- `src/core/notifications/services/email-notification.service.ts`

Se usan correos fijos como sender/from. Esto deberia estar en configuracion.

### 5.4. Error handler expone mensajes internos

Archivo: `src/api/middlewares/error-handle.middleware.ts`

Para errores no controlados retorna:

```ts
errors: error.message
```

En produccion podria exponer detalles internos.

Recomendacion:

- En produccion devolver mensaje generico.
- Loggear detalles con correlation id.

### 5.5. `.env` existe localmente

El archivo `.env` existe en el workspace, pero esta incluido en `.gitignore`. No lo lei para evitar exponer secretos. Es correcto que este ignorado.

Riesgo adicional:

- `package-lock.json` tambien esta en `.gitignore`, pero aparece modificado y versionado. Para aplicaciones Node, conviene versionarlo de forma consistente para builds reproducibles.

## 6. Calidad de codigo y mantenibilidad

### 6.1. Orquestador demasiado grande

`file-processing.orchestrator.ts` tiene 525 lineas y multiples responsabilidades.

Refactor sugerido:

- `FileProcessingOrchestrator`: solo coordina flujo.
- `ProcessingResultAssembler`: combina resultados.
- `OutputFolderResolver`: decide carpetas destino.
- `ReportEmailDispatcher`: envia adjuntos.
- `OriginalFilePolicyExecutor`: aplica eliminacion/reintentos.
- `StreamBufferService`: transforma streams/buffers de forma controlada.

### 6.2. Dependencias creadas con `new`

Ejemplos:

- Controladores crean servicios directamente.
- `EmailNotificationService` crea `BrevoEmailService`.
- `OneDriveServices` crea procesadores directamente.

Impacto:

- Tests unitarios mas dificiles.
- Menor control de mocks.
- Cambiar implementaciones requiere tocar muchas clases.

Recomendacion:

- Fortalecer `ServiceContainer` o migrar a un contenedor DI simple.
- Inyectar interfaces en constructores.

### 6.3. Duplicidad entre API manual y flujo automatizado

Hay logica de generacion en:

- `ContractService.downloadZipStream`
- `ExcelToContractProcessor`
- `PDFGeneratorService`
- plantillas directas en `contracts.ts`

Recomendacion:

- Hacer que endpoints manuales usen los mismos procesadores del flujo automatizado.
- Evitar dos formas distintas de generar el mismo documento.

### 6.4. Archivos grandes de templates

`templates.ts` tiene 3,050 lineas y `contracts.ts` 425 lineas.

Recomendacion:

- Separar por tipo de contrato/documento.
- Versionar plantillas con nombres explicitos.
- Agregar pruebas snapshot o golden files para documentos criticos.

### 6.5. Nombres y typos

Ejemplos:

- `addendum-contract.processort.ts` parece typo de `processor`.
- `succes.template.ts` deberia ser `success.template.ts`.
- `array.utits.ts` deberia ser `array.utils.ts`.
- `sendSuccessNotificacion` mezcla ingles/espanol y tiene typo.
- `generateLetterNoSubectToControl` tiene typo en `Subject`.

Recomendacion:

- Corregir gradualmente con exports compatibles si el cambio afecta imports.

## 7. API y validacion

Endpoints principales detectados:

- `GET /`
- `GET /api/health`
- `POST /api/contracts/download-zip`
- `POST /api/contracts/preview`
- `POST /api/excel/upload`
- `GET /api/excel/excel-to-image`
- `POST /api/excel/download-lawlife`
- `POST /api/excel/download-sctr`
- `POST /api/excel/download-photocheck`
- `POST /api/addendum/upload`

Observaciones:

- `POST /api/contracts/preview` no usa `schemaValidatorMiddleware`.
- `GET /api/excel/excel-to-image` lee `req.body`, lo cual es atipico para GET.
- Falta documentacion formal OpenAPI/Swagger.
- No hay autenticacion ni autorizacion visible en rutas.
- No hay rate limiting.

Recomendacion:

- Cambiar `excel-to-image` a `POST`.
- Validar `preview` con Zod.
- Documentar contratos de API con OpenAPI.
- Agregar autenticacion si el backend no esta totalmente aislado por red privada.

## 8. Observabilidad y operacion

Fortalezas:

- Uso de Pino.
- Logs en pasos importantes del flujo.
- Health endpoint disponible.

Mejoras:

- Agregar `requestId`/correlation id por request y por archivo procesado.
- Medir duracion por etapa: descarga, parseo, PDF, upload, email.
- Registrar conteos por tipo de documento.
- Agregar endpoint de readiness que valide dependencias criticas opcionalmente.
- Evitar `console.info` directo en CORS; usar logger.

## 9. Configuracion

Problemas:

- Variables criticas no se validan centralizadamente.
- `config.cors.origins` puede ser string o array, aunque `cors.config.ts` recalcula por separado.
- Cron, correos y sender estan hardcodeados.
- `.env.example` no incluye Brevo/SMTP, scheduler ni correos de reportes.

Recomendacion:

- Crear `env.schema.ts` con Zod.
- Validar al iniciar la app.
- Falla rapida si faltan variables requeridas.
- Actualizar `.env.example`.

Variables sugeridas:

```env
ONEDRIVE_CRON_SCHEDULE=
EMAIL_SENDER=
EMAIL_SENDER_NAME=
EMAIL_SCTR_TO=
EMAIL_SCTR_CC=
EMAIL_SCTR_APE_TO=
EMAIL_SCTR_APE_CC=
SMTP_BREVO_API_KEY=
PUPPETEER_HEADLESS=
PUPPETEER_TIMEOUT_MS=
```

## 10. Testing

Estado actual:

- No hay archivos `test` o `spec`.
- `package.json` tiene `"test": "echo \"Error: no test specified\" && exit 1"`.
- Type-check y lint funcionan.

Tests prioritarios:

1. `ValidationService`: contrato invalido, DNI duplicado, campos requeridos, fechas.
2. `ExcelParserServices`: encabezados faltantes, Excel vacio, Excel corrupto.
3. `ExcelFileValidator`: extension, temporal `~$`, tamano.
4. `FileProcessingOrchestrator`: exito total, fallo parcial, fallo validacion, fallo upload, no eliminar original si falla algo.
5. `OneDriveStorageAdapter`: mock de Microsoft Graph.
6. `PDFGeneratorService`: al menos pruebas de seleccion de plantilla por tipo.

Herramientas sugeridas:

- Vitest o Jest.
- Supertest para API.
- Nock/MSW para Graph/Brevo si se hacen pruebas de integracion.

## 11. Performance y recursos

Riesgos:

- Puppeteer es costoso para servidor.
- Se abren browsers en varias rutas sin un gestor unico.
- Muchos documentos se generan en paralelo por batches y por procesadores; puede saturar CPU/memoria.
- `downloadFileAsStream` internamente descarga a `ArrayBuffer`, luego crea stream. No es streaming real desde Graph.

Recomendacion:

- Definir limites de concurrencia por tipo de documento.
- Centralizar browser y pages en un pool controlado.
- Convertir flujos de documentos reutilizables a Buffer cuando se requiera upload + email.
- Evaluar migracion a `pdfmake` por fases, empezando por documentos menos complejos.

## 12. Datos y archivos binarios

Se observan assets binarios nuevos dentro de `src/assets`:

- `2.1 Adendas de contratos SUPLENCIA (1).doc`
- `Plantilla_Aperturas_CuentaSueldoyCTS 1.xlsm`

Riesgos:

- `.gitignore` ignora `*.xls` y `*.xlsx`, pero no `*.xlsm` ni `*.doc`.
- Guardar plantillas Office dentro de `src` mezcla codigo con binarios.

Recomendacion:

- Mover plantillas a `assets/templates` o storage externo.
- Definir si deben versionarse.
- Actualizar `.gitignore` si no deben entrar al repo.

## 13. Roadmap recomendado

### Fase 1: Estabilizacion inmediata

- Corregir `salaryAccountProcessor` no integrado.
- Corregir reutilizacion de streams SCTR/SCTR APE.
- Cambiar contrato invalido para que retorne error.
- Agregar `try/finally` a usos directos de Puppeteer.
- Mover correos hardcodeados a variables de entorno.
- Actualizar `.env.example`.

### Fase 2: Seguridad y operacion

- Ejecutar `npm audit fix` en rama separada.
- Resolver upgrades con breaking changes manualmente.
- Ocultar mensajes internos en produccion.
- Agregar correlation id.
- Configurar cron desde entorno.

### Fase 3: Tests del flujo principal

- Instalar framework de testing.
- Crear mocks para storage, email y browser.
- Cubrir el orquestador con casos de exito/fallo.
- Agregar test de validacion Excel.

### Fase 4: Refactor de arquitectura

- Reducir `FileProcessingOrchestrator`.
- Unificar controladores con procesadores.
- Formalizar DI.
- Separar resolucion de carpetas y envio de correos.

### Fase 5: Documentacion y entrega

- Crear `README.md`.
- Crear `docs/API.md`.
- Crear `docs/CONFIGURATION.md`.
- Crear `docs/DEPLOYMENT.md`.
- Documentar setup Azure/OneDrive/Brevo.

## 14. Checklist accionable

- [ ] Corregir bug de `salaryAccountProcessor`.
- [ ] Evitar reutilizar streams consumidos.
- [ ] Reportar error para tipo de contrato invalido.
- [ ] Cerrar Puppeteer con `finally`.
- [ ] Cambiar `GET /api/excel/excel-to-image` a `POST`.
- [ ] Validar `POST /api/contracts/preview`.
- [ ] Sacar correos y sender a env vars.
- [ ] Agregar env schema con Zod.
- [ ] Actualizar `.env.example`.
- [ ] Resolver `npm audit`.
- [ ] Crear tests unitarios de validacion.
- [ ] Crear tests del orquestador con mocks.
- [ ] Documentar endpoints.
- [ ] Definir estrategia de plantillas binarias.

## 15. Conclusion

Kontrak Backend tiene una buena direccion arquitectonica y ya compila correctamente. El riesgo principal esta en la confiabilidad operativa: hay flujos sin tests, algunos errores pueden quedar ocultos y Puppeteer puede consumir recursos si algo falla. La mejor mejora no seria reescribir todo, sino estabilizar el flujo critico, agregar pruebas alrededor del orquestador y continuar el refactor por fases pequenas.

El orden recomendado es: primero bugs funcionales, luego seguridad/configuracion, despues tests, y finalmente refactor de arquitectura.
