# Guía Completa de Refactoring: OneDrive Service

## 📚 Tabla de Contenidos

1. [Arquitectura por Capas - Explicación Detallada](#arquitectura-por-capas)
2. [Fase 1: Validadores](#fase-1-validadores)
3. [Fase 2: Storage Abstraction](#fase-2-storage-abstraction)
4. [Fase 3: Browser Manager](#fase-3-browser-manager)
5. [Fase 4: Orchestrator](#fase-4-orchestrator)
6. [Fase 5: Event System](#fase-5-event-system)
7. [Fase 6: Documentación Técnica para Entregas](#fase-6-documentación-técnica)
8. [Estructura de Carpetas Final](#estructura-de-carpetas-final)

---

## 🏗️ Arquitectura por Capas - Explicación Detallada

### Visión General

La arquitectura propuesta divide el sistema en **7 capas**, cada una con una responsabilidad única y bien definida. Las capas se comunican solo con las capas adyacentes, nunca saltando niveles.

```
┌─────────────────────────────────────────┐
│  Capa 7: Sistema de Eventos            │ ← Extensibilidad
├─────────────────────────────────────────┤
│  Capa 6: Monitoreo/Scheduler           │ ← Detección
├─────────────────────────────────────────┤
│  Capa 5: Orquestación                  │ ← Coordinación
├─────────────────────────────────────────┤
│  Capa 4: Gestión de Browser            │ ← Infraestructura Puppeteer
├─────────────────────────────────────────┤
│  Capa 3: Procesadores                  │ ← Lógica de Negocio
├─────────────────────────────────────────┤
│  Capa 2: Validadores                   │ ← Reglas de Negocio
├─────────────────────────────────────────┤
│  Capa 1: Storage (OneDrive)            │ ← Infraestructura Storage
└─────────────────────────────────────────┘
```

---

### Capa 1: Infraestructura de Almacenamiento

**Responsabilidad**: Abstraer completamente las operaciones de almacenamiento de archivos.

**¿Qué hace?**
- Comunicarse con OneDrive (o cualquier otro proveedor)
- Listar archivos en carpetas
- Descargar archivos
- Subir archivos
- Eliminar archivos
- Mover archivos entre carpetas

**¿Qué NO hace?**
- Validar archivos
- Decidir qué hacer con archivos
- Procesar contenido de archivos
- Conocer reglas de negocio

**Componentes**:

1. **FileStorageService** (Interfaz/Contrato)
   - Define TODAS las operaciones posibles con archivos
   - No sabe NADA de OneDrive, S3, o cualquier proveedor específico
   - Solo define "qué se puede hacer", no "cómo hacerlo"

2. **OneDriveStorageAdapter** (Implementación Concreta)
   - Implementa FileStorageService
   - Conoce Microsoft Graph API
   - Maneja autenticación con OneDrive
   - Maneja reintentos en fallos de red
   - Convierte errores de OneDrive a errores del dominio

3. **S3StorageAdapter** (Implementación Futura Opcional)
   - Implementa la misma interfaz FileStorageService
   - Usa AWS SDK
   - Permite cambiar de OneDrive a S3 sin tocar otras capas

**¿Por qué es importante?**
- Vendor lock-in: Sin esto, estás casado con OneDrive
- Testing: Puedes crear MockStorageAdapter para tests
- Flexibilidad: Cambiar proveedor es trivial
- Separation of Concerns: El negocio no sabe de infraestructura

**Relaciones**:
- **Consumida por**: Capa 5 (Orquestador)
- **Consume**: Microsoft Graph Client (o AWS SDK, etc.)
- **No sabe de**: Validaciones, procesamiento, browsers

---

### Capa 2: Validadores

**Responsabilidad**: Determinar si un archivo es válido para procesamiento.

**¿Qué hace?**
- Verificar extensión del archivo
- Verificar tamaño del archivo
- Verificar que no sea archivo temporal
- Verificar metadatos del archivo
- Retornar lista de errores o "OK"

**¿Qué NO hace?**
- Procesar archivos
- Descargar archivos
- Tomar decisiones de qué hacer con archivos inválidos
- Conocer de dónde vino el archivo

**Componentes**:

1. **FileValidator** (Interfaz)
   - Método: `validate(fileName, metadata)`
   - Retorna: `ValidationResult` (success: boolean, errors: string[])

2. **ExcelFileValidator** (Implementación)
   - Valida extensión (.xlsx, .xls)
   - Valida tamaño (< 10MB)
   - Valida que no sea temporal (~$ prefix)
   - Valida que no esté corrupto (opcional)

3. **CompositeValidator** (Patrón Composite)
   - Permite combinar múltiples validadores
   - Ejecuta todos en secuencia
   - Consolida todos los errores
   - Ejemplo: ExcelValidator + SizeValidator + TemporalValidator

4. **ValidationResult** (Objeto de Resultado)
   - Contiene si es válido
   - Lista de errores encontrados
   - Metadata adicional

**¿Por qué es importante?**
- Reutilización: Validadores pueden usarse en API HTTP también
- Testing: Fácil testear cada validador independientemente
- Extensibilidad: Agregar nueva validación no afecta otras capas
- Single Responsibility: Solo valida, no procesa

**Relaciones**:
- **Consumida por**: Capa 5 (Orquestador)
- **Consume**: Nada (solo recibe datos)
- **No sabe de**: Storage, procesamiento, browsers

---

### Capa 3: Procesadores

**Responsabilidad**: Transformar archivos Excel en contratos PDF.

**¿Qué hace?**
- Parsear Excel a datos estructurados
- Generar PDFs a partir de datos
- Coordinar la transformación completa
- Manejar errores parciales (algunos empleados fallan)
- Retornar resultados estructurados

**¿Qué NO hace?**
- Descargar archivos de OneDrive
- Validar si el archivo es Excel
- Subir PDFs a OneDrive
- Decidir si eliminar el Excel original
- Gestionar el browser de Puppeteer

**Componentes**:

1. **ContractProcessor** (Interfaz)
   - Método: `process(fileBuffer, fileName)`
   - Retorna: `ProcessingResult` (employees, pdfs, errors)

2. **ExcelToContractProcessor** (Implementación)
   - Usa ExcelParserService (ya existe)
   - Usa PDFGeneratorService (ya existe)
   - Coordina: Excel → Datos → PDFs
   - No conoce de dónde viene el Excel
   - No conoce a dónde van los PDFs

3. **BatchProcessor** (Wrapper)
   - Procesa múltiples empleados
   - Maneja errores parciales (continúa aunque fallen algunos)
   - Genera reporte consolidado
   - Tracking de éxitos/fallos

4. **ProcessingResult** (Objeto de Resultado)
   - Lista de empleados procesados
   - Lista de PDFs generados (buffer + nombre)
   - Lista de errores por empleado
   - Estadísticas (total, exitosos, fallidos)

**¿Por qué es importante?**
- Testeable: Puedes testear sin OneDrive ni browser real
- Reutilizable: Mismo procesador sirve para API HTTP
- Claro: Responsabilidad única muy definida
- Robusto: Manejo de errores parciales integrado

**Relaciones**:
- **Consumida por**: Capa 5 (Orquestador)
- **Consume**: ExcelParserService, PDFGeneratorService, Browser (inyectado)
- **No sabe de**: OneDrive, validaciones, notificaciones

---

### Capa 4: Gestión de Browser

**Responsabilidad**: Lifecycle completo de instancias de Puppeteer.

**¿Qué hace?**
- Crear instancias de browser bajo demanda
- Mantener browsers en estado "listo"
- Detectar browsers desconectados
- Cerrar browsers cuando ya no se usen
- Manejar errores de browser (crash, timeout)
- Pool de browsers (opcional, avanzado)

**¿Qué NO hace?**
- Usar el browser para generar PDFs (eso es del PDFGenerator)
- Decidir cuándo crear browsers
- Conocer para qué se usa el browser
- Validar o procesar archivos

**Componentes**:

1. **BrowserManager** (Singleton o Service)
   - Método: `getBrowser()` - Retorna browser listo
   - Método: `releaseBrowser(browser)` - Libera browser
   - Método: `closeAll()` - Cierra todos los browsers
   - Estado interno: referencia al browser actual

2. **BrowserPool** (Opcional, Avanzado)
   - Pool de N browsers pre-inicializados
   - Reutiliza browsers entre requests
   - Límite máximo de browsers concurrentes
   - Auto-recicla browsers después de X usos

3. **BrowserConfig**
   - Configuración de Puppeteer centralizada
   - headless, args, timeout, etc.
   - Cargado desde variables de entorno

**¿Por qué es importante?**
- Memory Leaks: Evita browsers huérfanos
- Performance: Reutiliza browsers costosos de crear
- Centralización: Un solo lugar gestiona Puppeteer
- Testing: Puedes inyectar mock browser

**Relaciones**:
- **Consumida por**: Capa 3 (Procesador) y Capa 5 (Orquestador)
- **Consume**: Puppeteer library
- **No sabe de**: OneDrive, Excel, validaciones

---

### Capa 5: Orquestación

**Responsabilidad**: Coordinar todo el flujo de procesamiento.

**¿Qué hace?**
- Recibe archivo detectado
- Llama al validador
- Si es válido, llama al procesador
- Si procesa OK, sube PDFs al storage
- Decide si eliminar archivo original
- Emite eventos de lo que pasó
- Maneja errores en cada paso

**¿Qué NO hace?**
- Detectar archivos (eso es Capa 6)
- Implementar validaciones
- Implementar procesamiento
- Gestionar browser
- Comunicarse con OneDrive directamente

**Componentes**:

1. **FileProcessingOrchestrator** (Servicio Principal)
   - Método: `processFile(fileMetadata)`
   - Coordina: Validar → Procesar → Guardar → Decidir
   - Delega TODAS las operaciones
   - Solo coordina, no implementa

2. **ProcessingPolicy** (Interfaz de Políticas)
   - Define: ¿Cuándo eliminar el archivo?
   - Define: ¿Cuántos reintentos?
   - Define: ¿Notificar errores?
   - Separación de "política" vs "ejecución"

3. **DefaultProcessingPolicy** (Implementación)
   - Política: Eliminar si 100% exitoso
   - Política: No reintentar automáticamente
   - Política: Notificar todos los errores

4. **StrictProcessingPolicy** (Implementación Alternativa)
   - Política: Solo eliminar si supervisión manual
   - Política: Reintentar 3 veces con backoff
   - Política: Solo notificar errores críticos

**¿Por qué es importante?**
- Clarity: El flujo está en UN solo lugar
- Testeable: Puedes mockear todas las dependencias
- Políticas Configurables: Diferentes clientes, diferentes reglas
- Extensible: Agregar step no rompe código existente

**Relaciones**:
- **Consumida por**: Capa 6 (Scheduler)
- **Consume**: Capa 1 (Storage), Capa 2 (Validator), Capa 3 (Processor), Capa 4 (BrowserManager)
- **Emite eventos a**: Capa 7 (Event System)

---

### Capa 6: Monitoreo y Scheduling

**Responsabilidad**: Detectar archivos nuevos y disparar procesamiento.

**¿Qué hace?**
- Ejecutar cada X segundos (cron)
- Consultar carpeta de OneDrive
- Detectar archivos nuevos
- Llamar al orquestador por cada archivo
- Controlar concurrencia (no procesar 2 archivos paralelos)

**¿Qué NO hace?**
- Procesar archivos
- Validar archivos
- Comunicarse directamente con OneDrive (solo usa orquestador)
- Generar PDFs

**Componentes**:

1. **FileWatcher**
   - Detecta archivos en carpeta específica
   - Filtra archivos ya procesados (opcional con DB)
   - Retorna lista de archivos a procesar

2. **ProcessingScheduler**
   - Ejecuta cada N segundos (configurable)
   - Llama a FileWatcher
   - Por cada archivo nuevo, llama a Orquestador
   - Maneja flag `isProcessing` para evitar overlaps

3. **ProcessingState** (Opcional)
   - Guarda estado de archivos procesados
   - Evita reprocesar el mismo archivo
   - Puede ser en memoria o DB

**¿Por qué es importante?**
- Separation: "Detectar" vs "Procesar" son cosas diferentes
- Scheduling Configurable: Fácil cambiar frecuencia
- Testing: Puedes probar scheduler sin procesar nada

**Relaciones**:
- **Consumida por**: index.ts (punto de entrada)
- **Consume**: Capa 5 (Orquestador)
- **No sabe de**: Storage específico, validaciones, procesamiento

---

### Capa 7: Sistema de Eventos

**Responsabilidad**: Extensibilidad sin modificar código existente.

**¿Qué hace?**
- Recibe eventos de negocio
- Despacha eventos a subscriptores
- Permite agregar nuevos handlers sin tocar orquestador
- Desacopla "qué pasó" de "qué hacer al respecto"

**¿Qué NO hace?**
- Procesar archivos
- Tomar decisiones de negocio
- Conocer implementaciones de handlers

**Componentes**:

1. **EventBus** (Patrón Pub/Sub)
   - Método: `publish(event)`
   - Método: `subscribe(eventType, handler)`
   - Mantiene mapa de eventos → handlers
   - Ejecuta handlers cuando se publica evento

2. **Event Types** (Enum o Constantes)
   - FileValidationFailed
   - FileProcessingStarted
   - FileProcessingCompleted
   - FileProcessingFailed
   - PdfGenerationFailed
   - AllPdfsGenerated

3. **Event Handlers**
   - **EmailNotificationHandler**: Envía emails
   - **OneDriveLogHandler**: Escribe logs en OneDrive
   - **MetricsHandler**: Actualiza métricas
   - **TeamsNotificationHandler**: Notifica en Teams
   - **DatabaseLogHandler**: Guarda en BD

4. **Event Object**
   - Tipo de evento
   - Timestamp
   - Metadata (fileName, errors, etc.)
   - Correlation ID (para tracing)

**¿Por qué es importante?**
- Open/Closed Principle: Extender sin modificar
- Desacoplamiento Total: Orquestador no conoce notificaciones
- Flexibilidad: Activar/desactivar handlers sin código
- Testing: Handlers se testean independientemente

**Relaciones**:
- **Consumida por**: Todos (cualquiera puede publicar eventos)
- **Consume**: Nada (los handlers consumen lo que quieran)
- **Subscriptores**: EmailNotifier, Logger, Metrics, etc.

---

## 🚀 Fase 1: Validadores

### Objetivo
Extraer toda la lógica de validación a componentes reutilizables y testeables.

### ¿Qué se hace en esta fase?

1. **Crear la interfaz FileValidator**
   - Define el contrato que todos los validadores deben cumplir
   - Un método `validate()` que recibe metadata y retorna resultado

2. **Crear ExcelFileValidator**
   - Implementa FileValidator
   - Valida extensión (.xlsx, .xls)
   - Valida tamaño (< 10MB)
   - Valida que no sea temporal (~$)
   - Retorna objeto con éxito/errores

3. **Crear ValidationResult**
   - Objeto que estandariza los resultados
   - Tiene: `isValid`, `errors[]`, `metadata`

4. **Modificar OneDriveService**
   - Reemplazar validaciones inline
   - Inyectar FileValidator en constructor
   - Llamar a `validator.validate()` en lugar de código inline

### Estructura de Carpetas (Fase 1)

```
src/
├── module/
│   ├── onedrive/
│   │   ├── services/
│   │   │   └── onedrive.service.ts         (modificado)
│   │   └── validators/                      (NUEVO)
│   │       ├── interfaces/
│   │       │   ├── file-validator.interface.ts
│   │       │   └── validation-result.interface.ts
│   │       └── implementations/
│   │           └── excel-file.validator.ts
│   └── provider/
│       └── onedrive.provider.ts
```

### Cambios en el Código (Conceptual)

**Antes**:
```
OneDriveService.procesarArchivo()
  ├─ if (!esExcel) return  // Validación inline
  ├─ if (muyGrande) return // Validación inline
  └─ procesar...
```

**Después**:
```
OneDriveService.procesarArchivo()
  ├─ result = validator.validate(file)
  ├─ if (!result.isValid) return
  └─ procesar...
```

### Beneficios Inmediatos

✅ Validaciones reusables (puedes usarlas en API HTTP también)  
✅ Fácil agregar nuevas validaciones  
✅ Testeable independientemente  
✅ Código más limpio en OneDriveService  

### Riesgo
🟢 **BAJO** - Solo extrae código existente sin cambiar comportamiento

---

## 🎯 Fase 2: Storage Abstraction

### Objetivo
Abstraer completamente OneDrive detrás de una interfaz genérica de almacenamiento.

### ¿Qué se hace en esta fase?

1. **Crear interfaz FileStorageService**
   - Define operaciones: list, download, upload, delete, move
   - Sin ninguna referencia a OneDrive
   - Genérica para cualquier storage

2. **Crear OneDriveStorageAdapter**
   - Implementa FileStorageService
   - Mueve TODA la lógica de Microsoft Graph API aquí
   - Maneja reintentos
   - Convierte errores de OneDrive a errores del dominio

3. **Crear tipos comunes**
   - FileMetadata: id, name, size, uploadedAt
   - StorageError: tipo, mensaje, retryable
   - FolderPath: path, permissions

4. **Modificar OneDriveService**
   - Ya no usa Microsoft Graph Client directamente
   - Inyecta FileStorageService (interfaz)
   - Llama a métodos abstractos: `storage.list()`, `storage.download()`

### Estructura de Carpetas (Fase 2)

```
src/
├── module/
│   ├── onedrive/
│   │   ├── services/
│   │   │   └── onedrive.service.ts         (modificado)
│   │   ├── validators/
│   │   │   ├── interfaces/
│   │   │   │   ├── file-validator.interface.ts
│   │   │   │   └── validation-result.interface.ts
│   │   │   └── implementations/
│   │   │       └── excel-file.validator.ts
│   │   └── storage/                         (NUEVO)
│   │       ├── interfaces/
│   │       │   ├── file-storage.service.interface.ts
│   │       │   ├── file-metadata.interface.ts
│   │       │   └── storage-error.interface.ts
│   │       └── adapters/
│   │           └── onedrive-storage.adapter.ts
│   └── provider/
│       └── onedrive.provider.ts             (ahora solo usado por adapter)
```

### Cambios en el Código (Conceptual)

**Antes**:
```
OneDriveService
  ├─ usa client.api('/drive/...')  // OneDrive específico
  └─ maneja errores de Graph API   // OneDrive específico
```

**Después**:
```
OneDriveService
  ├─ usa storage.list(folder)      // Genérico
  └─ usa storage.download(fileId)  // Genérico

OneDriveStorageAdapter
  ├─ implementa storage.list()
  └─ usa client.api('/drive/...') internamente
```

### Beneficios Inmediatos

✅ Testeable con MockStorageAdapter  
✅ Preparado para migrar a S3/Google Drive  
✅ OneDriveService no conoce Graph API  
✅ Reintentos centralizados en adapter  

### Riesgo
🟡 **MEDIO** - Toca bastante código de infraestructura

---

## 🔧 Fase 3: Browser Manager

### Objetivo
Centralizar completamente la gestión del lifecycle de Puppeteer.

### ¿Qué se hace en esta fase?

1. **Crear BrowserManager**
   - Singleton que gestiona UN browser compartido
   - Método: `getBrowser()` - retorna browser listo
   - Método: `closeBrowser()` - cierra y limpia
   - Detecta si browser está desconectado
   - Recrea browser automáticamente si se cae

2. **Crear BrowserConfig**
   - Configuración centralizada de Puppeteer
   - Lee de variables de entorno
   - headless, args, timeout, etc.

3. **Modificar OneDriveService**
   - Ya no tiene `ensureBrowser()` propio
   - Inyecta BrowserManager en constructor
   - Llama a `browserManager.getBrowser()`
   - Ya no es responsable de cerrar browser

4. **Modificar PDFGeneratorService** (si es necesario)
   - También recibe browser del manager
   - No crea browsers propios

### Estructura de Carpetas (Fase 3)

```
src/
├── infrastructure/                          (NUEVO - capa de infraestructura)
│   └── browser/
│       ├── browser-manager.ts
│       └── browser-config.ts
│
├── module/
│   ├── onedrive/
│   │   ├── services/
│   │   │   └── onedrive.service.ts         (modificado - ya no maneja browser)
│   │   ├── validators/
│   │   │   └── ...
│   │   └── storage/
│   │       └── ...
│   └── provider/
│       └── onedrive.provider.ts
```

### Cambios en el Código (Conceptual)

**Antes**:
```
OneDriveService
  ├─ ensureBrowser() internamente
  ├─ cierra browser en finally
  └─ puede tener memory leaks
```

**Después**:
```
OneDriveService
  ├─ browser = browserManager.getBrowser()
  └─ usa browser (el manager lo cierra)

BrowserManager (singleton)
  ├─ mantiene browser compartido
  ├─ lo recrea si se desconecta
  └─ lo cierra al terminar todo
```

### Beneficios Inmediatos

✅ No más browser memory leaks  
✅ Performance (browser es costoso de crear)  
✅ Un solo lugar maneja Puppeteer  
✅ Fácil agregar pool de browsers después  

### Riesgo
🟢 **BAJO** - Solo mueve código existente de lugar

---

## 🎼 Fase 4: Orchestrator

### Objetivo
Separar completamente la coordinación del flujo de la implementación técnica.

### ¿Qué se hace en esta fase?

1. **Crear FileProcessingOrchestrator**
   - Recibe: fileMetadata
   - Coordina: Validar → Procesar → Guardar → Decidir
   - Inyecta TODAS las dependencias (storage, validator, processor, etc.)
   - Solo coordina, DELEGA todo

2. **Crear ProcessingPolicy (interfaz)**
   - Define políticas configurables
   - ¿Eliminar archivo original?
   - ¿Cuántos reintentos?
   - ¿Notificar en qué casos?

3. **Crear DefaultProcessingPolicy**
   - Implementación por defecto
   - Elimina si 100% exitoso
   - No reintentos automáticos
   - Notifica todos los errores

4. **Crear ContractProcessor (interfaz)**
   - Abstrae el procesamiento Excel → PDFs
   - ExcelToContractProcessor lo implementa

5. **Modificar OneDriveService**
   - Se convierte en simple "scheduler"
   - Solo llama a orchestrator.process(file)
   - Ya no tiene lógica de coordinación

### Estructura de Carpetas (Fase 4)

```
src/
├── core/                                    (NUEVO - lógica de dominio)
│   ├── orchestration/
│   │   ├── file-processing.orchestrator.ts
│   │   ├── policies/
│   │   │   ├── processing-policy.interface.ts
│   │   │   ├── default-processing.policy.ts
│   │   │   └── strict-processing.policy.ts
│   │   └── results/
│   │       └── processing-result.interface.ts
│   │
│   └── processors/
│       ├── contract-processor.interface.ts
│       └── excel-to-contract.processor.ts
│
├── infrastructure/
│   └── browser/
│       ├── browser-manager.ts
│       └── browser-config.ts
│
├── module/
│   ├── onedrive/
│   │   ├── services/
│   │   │   └── onedrive.service.ts         (ahora muy simple)
│   │   ├── validators/
│   │   │   └── ...
│   │   └── storage/
│   │       └── ...
│   └── provider/
│       └── onedrive.provider.ts
│
└── services/                                (servicios existentes)
    ├── excel-generator.service.ts
    └── pdf-generator.service.ts
```

### Cambios en el Código (Conceptual)

**Antes**:
```
OneDriveService.procesarArchivo()
  ├─ validar
  ├─ descargar
  ├─ procesar Excel
  ├─ generar PDFs
  ├─ subir PDFs
  ├─ decidir si eliminar
  └─ logging todo
```

**Después**:
```
OneDriveService.vigilarYProcesar()
  └─ orchestrator.process(fileMetadata)

FileProcessingOrchestrator.process()
  ├─ validation = validator.validate()
  ├─ if !valid: return error
  ├─ buffer = storage.download()
  ├─ result = processor.process(buffer)
  ├─ storage.uploadMultiple(result.pdfs)
  ├─ if policy.shouldDelete(result): storage.delete()
  └─ return result
```

### Beneficios Inmediatos

✅ Flujo claro en UN solo lugar  
✅ Políticas configurables  
✅ Testeable con mocks de TODAS las dependencias  
✅ OneDriveService súper simple  
✅ Fácil entender el flujo completo  

### Riesgo
🔴 **ALTO** - Refactoring grande, mueve mucha lógica

**Mitigación**: Hacer en steps pequeños, testear cada step

---

## 🔔 Fase 5: Event System (Opcional)

### Objetivo
Permitir extensibilidad total sin modificar código existente.

### ¿Qué se hace en esta fase?

1. **Crear EventBus**
   - Sistema pub/sub simple
   - `publish(event)` - emite evento
   - `subscribe(eventType, handler)` - registra handler

2. **Definir Event Types**
   - FileValidationFailed
   - FileProcessingStarted
   - FileProcessingCompleted
   - FileProcessingFailed
   - PdfGenerationFailed

3. **Crear Event Handlers**
   - EmailNotificationHandler
   - OneDriveLogHandler
   - MetricsCollectorHandler
   - TeamsNotificationHandler

4. **Modificar Orchestrator**
   - Emite eventos en puntos clave
   - No conoce los handlers
   - Solo publica eventos

5. **Configurar Handlers**
   - En index.ts o config
   - Registrar handlers que quieras

### Estructura de Carpetas (Fase 5 - FINAL)

```
src/
├── core/                                    
│   ├── events/                              (NUEVO)
│   │   ├── event-bus.ts
│   │   ├── event-types.enum.ts
│   │   ├── events/
│   │   │   ├── file-validation-failed.event.ts
│   │   │   ├── file-processing-started.event.ts
│   │   │   ├── file-processing-completed.event.ts
│   │   │   └── file-processing-failed.event.ts
│   │   └── handlers/
│   │       ├── email-notification.handler.ts
│   │       ├── onedrive-log.handler.ts
│   │       ├── metrics-collector.handler.ts
│   │       └── teams-notification.handler.ts
│   │
│   ├── orchestration/
│   │   ├── file-processing.orchestrator.ts (modificado - emite eventos)
│   │   └── policies/
│   │       └── ...
│   │
│   └── processors/
│       └── ...
│
├── infrastructure/
│   └── browser/
│       └── ...
│
├── module/
│   ├── onedrive/
│   │   ├── services/
│   │   │   └── onedrive.service.ts
│   │   ├── validators/
│   │   │   └── ...
│   │   └── storage/
│   │       └── ...
│   └── provider/
│       └── onedrive.provider.ts
│
└── services/
    ├── excel-generator.service.ts
    └── pdf-generator.service.ts
```

### Cambios en el Código (Conceptual)

**Antes**:
```
Orchestrator.process()
  ├─ if error: logger.error()
  ├─ if error: sendEmail()
  ├─ if error: writeToOneDrive()
  └─ modificar código para cada nueva notificación
```

**Después**:
```
Orchestrator.process()
  ├─ if error: eventBus.publish(FileProcessingFailed)
  └─ los handlers reaccionan automáticamente

EmailHandler.onFileProcessingFailed()
  └─ envía email

OneDriveLogHandler.onFileProcessingFailed()
  └─ escribe log en OneDrive

MetricsHandler.onFileProcessingFailed()
  └─ actualiza métricas
```

### Beneficios Inmediatos

✅ Agregar notificaciones sin tocar orchestrator  
✅ Activar/desactivar handlers fácilmente  
✅ Cada handler se testea independientemente  
✅ Open/Closed Principle perfectamente aplicado  

### Riesgo
🟡 **MEDIO** - Agrega complejidad conceptual

---

## 📁 Estructura de Carpetas - Evolución Completa

### Estado Inicial (Antes del Refactoring)

```
src/
├── module/
│   ├── onedrive/
│   │   └── services/
│   │       └── onedrive.service.ts          (160 líneas, hace TODO)
│   └── provider/
│       └── onedrive.provider.ts
│
├── services/
│   ├── excel-generator.service.ts
│   ├── pdf-generator.service.ts
│   └── ... otros servicios ...
│
└── utils/
    └── logger.ts
```

**Problemas**:
- onedrive.service.ts hace 8 cosas diferentes
- 160 líneas en un solo archivo
- Difícil de testear
- Difícil de extender

---

### Después de Fase 1 (Validadores)

```
src/
├── module/
│   ├── onedrive/
│   │   ├── services/
│   │   │   └── onedrive.service.ts          (140 líneas)
│   │   └── validators/                      ✨ NUEVO
│   │       ├── interfaces/
│   │       │   ├── file-validator.interface.ts
│   │       │   └── validation-result.interface.ts
│   │       └── implementations/
│   │           └── excel-file.validator.ts
│   └── provider/
│       └── onedrive.provider.ts
```

**Mejoras**:
- Validaciones extraídas y reutilizables
- onedrive.service.ts más pequeño
- Validadores testeables independientemente

---

### Después de Fase 2 (Storage Abstraction)

```
src/
├── module/
│   ├── onedrive/
│   │   ├── services/
│   │   │   └── onedrive.service.ts          (100 líneas)
│   │   ├── validators/
│   │   │   └── ... (igual que antes)
│   │   └── storage/                          ✨ NUEVO
│   │       ├── interfaces/
│   │       │   ├── file-storage.service.interface.ts
│   │       │   ├── file-metadata.interface.ts
│   │       │   └── storage-error.interface.ts
│   │       └── adapters/
│   │           └── onedrive-storage.adapter.ts
│   └── provider/
│       └── onedrive.provider.ts
```

**Mejoras**:
- Abstracción de storage completa
- Preparado para multi-cloud
- Testeable con mocks

---

### Después de Fase 3 (Browser Manager)

```
src/
├── infrastructure/                           ✨ NUEVO
│   └── browser/
│       ├── browser-manager.ts
│       └── browser-config.ts
│
├── module/
│   ├── onedrive/
│   │   ├── services/
│   │   │   └── onedrive.service.ts          (80 líneas)
│   │   ├── validators/
│   │   │   └── ...
│   │   └── storage/
│   │       └── ...
│   └── provider/
│       └── onedrive.provider.ts
```

**Mejoras**:
- Browser gestionado centralmente
- No más memory leaks
- onedrive.service.ts aún más simple

---

### Después de Fase 4 (Orchestrator)

```
src/
├── core/                                     ✨ NUEVO
│   ├── orchestration/
│   │   ├── file-processing.orchestrator.ts
│   │   └── policies/
│   │       ├── processing-policy.interface.ts
│   │       ├── default-processing.policy.ts
│   │       └── strict-processing.policy.ts
│   │
│   └── processors/
│       ├── contract-processor.interface.ts
│       └── excel-to-contract.processor.ts
│
├── infrastructure/
│   └── browser/
│       └── ...
│
├── module/
│   ├── onedrive/
│   │   ├── services/
│   │   │   └── onedrive.service.ts          (30 líneas - solo scheduler)
│   │   ├── validators/
│   │   │   └── ...
│   │   └── storage/
│   │       └── ...
│   └── provider/
│       └── onedrive.provider.ts
```

**Mejoras**:
- Flujo de coordinación claro
- Políticas configurables
- onedrive.service.ts es solo scheduler
- Separación dominio vs infraestructura

---

### Estado Final - Después de Fase 5 (Event System)

```
src/
├── core/                                    
│   ├── events/                              ✨ NUEVO
│   │   ├── event-bus.ts
│   │   ├── event-types.enum.ts
│   │   ├── events/
│   │   │   ├── file-validation-failed.event.ts
│   │   │   ├── file-processing-started.event.ts
│   │   │   ├── file-processing-completed.event.ts
│   │   │   └── file-processing-failed.event.ts
│   │   └── handlers/
│   │       ├── email-notification.handler.ts
│   │       ├── onedrive-log.handler.ts
│   │       ├── metrics-collector.handler.ts
│   │       └── teams-notification.handler.ts
│   │
│   ├── orchestration/
│   │   ├── file-processing.orchestrator.ts
│   │   └── policies/
│   │       ├── processing-policy.interface.ts
│   │       ├── default-processing.policy.ts
│   │       └── strict-processing.policy.ts
│   │
│   └── processors/
│       ├── contract-processor.interface.ts
│       └── excel-to-contract.processor.ts
│
├── infrastructure/
│   ├── browser/
│   │   ├── browser-manager.ts
│   │   └── browser-config.ts
│   │
│   └── notifications/
│       ├── email/
│       │   └── email-sender.ts
│       └── teams/
│           └── teams-sender.ts
│
├── module/
│   ├── onedrive/
│   │   ├── services/
│   │   │   └── onedrive-scheduler.service.ts  (20 líneas)
│   │   │
│   │   ├── validators/
│   │   │   ├── interfaces/
│   │   │   │   ├── file-validator.interface.ts
│   │   │   │   └── validation-result.interface.ts
│   │   │   └── implementations/
│   │   │       ├── excel-file.validator.ts
│   │   │       └── size.validator.ts
│   │   │
│   │   └── storage/
│   │       ├── interfaces/
│   │       │   ├── file-storage.service.interface.ts
│   │       │   ├── file-metadata.interface.ts
│   │       │   └── storage-error.interface.ts
│   │       └── adapters/
│   │           ├── onedrive-storage.adapter.ts
│   │           └── s3-storage.adapter.ts (futuro)
│   │
│   └── provider/
│       └── onedrive.provider.ts
│
├── services/                                (servicios de dominio)
│   ├── excel-generator.service.ts
│   ├── pdf-generator.service.ts
│   └── ... otros servicios ...
│
└── utils/
    ├── logger.ts
    └── retry.ts
```

---

## 📊 Comparación: Antes vs Después

### Responsabilidades por Archivo

| Archivo | Antes | Después |
|---------|-------|---------|
| onedrive.service.ts | 8 responsabilidades, 160 líneas | 1 responsabilidad, 20 líneas |
| Validaciones | Inline mezcladas | Clase dedicada, 30 líneas |
| Storage OneDrive | Inline mezclado | Adapter dedicado, 60 líneas |
| Browser management | Inline mezclado | Manager dedicado, 30 líneas |
| Coordinación | Mezclada | Orchestrator dedicado, 80 líneas |

### Testabilidad

| Componente | Antes | Después |
|------------|-------|---------|
| Validaciones | Requiere OneDrive real | Mock, tests unitarios rápidos |
| Procesamiento | Requiere OneDrive + Browser | Mocks de ambos |
| Flujo completo | No testeable | Orchestrator con todos mocks |
| Notificaciones | Acopladas al servicio | Event handlers independientes |

### Extensibilidad

| Feature a Agregar | Antes | Después |
|-------------------|-------|---------|
| Nueva validación | Modificar onedrive.service | Crear nuevo validator |
| Cambiar a S3 | Reescribir onedrive.service | Crear S3Adapter |
| Email notificación | Modificar onedrive.service | Crear EmailHandler |
| Nueva política | Hardcode en service | Crear nueva Policy class |

---

## ✅ Checklist de Implementación

### Preparación
- [ ] Hacer backup / commit del código actual
- [ ] Tener tests existentes pasando (si los hay)
- [ ] Documentar comportamiento actual

### Fase 1: Validadores
- [ ] Crear carpeta `validators/interfaces/`
- [ ] Crear `file-validator.interface.ts`
- [ ] Crear `validation-result.interface.ts`
- [ ] Crear carpeta `validators/implementations/`
- [ ] Crear `excel-file.validator.ts`
- [ ] Escribir tests para el validator
- [ ] Modificar onedrive.service para usar validator
- [ ] Testear que funciona igual
- [ ] Commit

### Fase 2: Storage
- [ ] Crear carpeta `storage/interfaces/`
- [ ] Crear `file-storage.service.interface.ts`
- [ ] Crear tipos: FileMetadata, StorageError
- [ ] Crear carpeta `storage/adapters/`
- [ ] Crear `onedrive-storage.adapter.ts`
- [ ] Mover lógica Graph API al adapter
- [ ] Escribir tests con mock storage
- [ ] Modificar onedrive.service para usar storage
- [ ] Testear que funciona igual
- [ ] Commit

### Fase 3: Browser
- [ ] Crear carpeta `infrastructure/browser/`
- [ ] Crear `browser-manager.ts`
- [ ] Crear `browser-config.ts`
- [ ] Mover lógica de browser al manager
- [ ] Modificar onedrive.service para usar manager
- [ ] Modificar pdf-generator si es necesario
- [ ] Testear que no hay memory leaks
- [ ] Commit

### Fase 4: Orchestrator
- [ ] Crear carpeta `core/orchestration/`
- [ ] Crear `file-processing.orchestrator.ts`
- [ ] Crear carpeta `core/orchestration/policies/`
- [ ] Crear interfaces de políticas
- [ ] Crear `default-processing.policy.ts`
- [ ] Crear carpeta `core/processors/`
- [ ] Crear `contract-processor.interface.ts`
- [ ] Crear `excel-to-contract.processor.ts`
- [ ] Escribir tests del orchestrator con mocks
- [ ] Modificar onedrive.service para delegar
- [ ] Testear flujo completo
- [ ] Commit

### Fase 5: Events
- [ ] Crear carpeta `core/events/`
- [ ] Crear `event-bus.ts`
- [ ] Crear `event-types.enum.ts`
- [ ] Crear carpeta `core/events/handlers/`
- [ ] Crear handlers de notificación
- [ ] Modificar orchestrator para emitir eventos
- [ ] Registrar handlers en index.ts
- [ ] Testear eventos se disparan correctamente
- [ ] Commit

### Verificación Final
- [ ] Todos los tests pasan
- [ ] No hay memory leaks
- [ ] Performance igual o mejor
- [ ] Code coverage aumentó
- [ ] Documentación actualizada

---

## 📖 Fase 6: Documentación Técnica para Entregas

### Objetivo
Crear documentación completa para instalación, configuración, despliegue y troubleshooting del sistema.

### ¿Qué se documenta?

1. **README.md** - Guía de inicio rápido
2. **INSTALLATION.md** - Instalación detallada
3. **CONFIGURATION.md** - Variables de entorno y configuración
4. **DEPLOYMENT.md** - Guía de despliegue a producción
5. **TROUBLESHOOTING.md** - Solución de problemas comunes
6. **API.md** - Documentación de endpoints (si aplica)

### Estructura de Documentación

```
docs/
├── README.md                    # Inicio rápido
├── INSTALLATION.md              # Instalación paso a paso
├── CONFIGURATION.md             # Variables de entorno
├── DEPLOYMENT.md                # Despliegue a producción
├── TROUBLESHOOTING.md           # Problemas comunes
├── API.md                       # Endpoints disponibles
├── ARCHITECTURE.md              # Diagrama de arquitectura
└── guides/
    ├── onedrive-setup.md        # Configuración de OneDrive
    ├── azure-ad-setup.md        # Configuración de Azure AD
    └── puppeteer-setup.md       # Configuración de Puppeteer
```

### Contenido de Cada Documento

#### 1. README.md

```markdown
# Kontrak Backend

## Descripción
Sistema de generación automática de contratos PDF desde archivos Excel.

## Características
- Monitoreo automático de carpeta OneDrive
- Validación de archivos Excel
- Generación de contratos PDF
- Subida automática a OneDrive

## Requisitos
- Node.js >= 18
- npm >= 9
- Cuenta de Azure AD
- Cuenta de OneDrive

## Inicio Rápido
1. Clonar repositorio
2. Copiar `.env.example` a `.env`
3. Configurar variables de entorno
4. `npm install`
5. `npm run dev`
```

#### 2. INSTALLATION.md

```markdown
# Guía de Instalación

## Prerrequisitos

### Sistema Operativo
- Windows 10/11, macOS 12+, Ubuntu 20.04+

### Software Requerido
- Node.js 18.x o superior
- npm 9.x o superior
- Git

## Pasos de Instalación

### 1. Clonar Repositorio
git clone https://github.com/tu-org/kontrak-backend.git
cd kontrak-backend

### 2. Instalar Dependencias
npm install

### 3. Configurar Variables de Entorno
cp .env.example .env
# Editar .env con tus valores

### 4. Verificar Instalación
npm run build
npm run test

### 5. Iniciar en Desarrollo
npm run dev
```

#### 3. CONFIGURATION.md

```markdown
# Configuración del Sistema

## Variables de Entorno Requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3000` |
| `NODE_ENV` | Entorno | `development` / `production` |
| `AZURE_CLIENT_ID` | ID de aplicación Azure | `xxxx-xxxx-xxxx` |
| `AZURE_CLIENT_SECRET` | Secreto de Azure | `xxxxxxxx` |
| `AZURE_TENANT_ID` | ID del tenant | `xxxx-xxxx-xxxx` |
| `ONEDRIVE_USER_EMAIL` | Email del usuario OneDrive | `user@company.com` |

## Variables Opcionales

| Variable | Descripción | Default |
|----------|-------------|----------|
| `ONEDRIVE_CRON_SCHEDULE` | Frecuencia de monitoreo | `*/30 * * * * *` |
| `PUPPETEER_HEADLESS` | Modo headless | `true` |
| `MAX_FILE_SIZE_MB` | Tamaño máximo de archivo | `10` |
```

#### 4. DEPLOYMENT.md

```markdown
# Guía de Despliegue

## Despliegue en Render

### 1. Crear nuevo Web Service
- Conectar repositorio de GitHub
- Seleccionar rama `main`

### 2. Configurar Build
- Build Command: `npm install && npm run build`
- Start Command: `npm start`

### 3. Configurar Variables
- Agregar todas las variables de `.env`

### 4. Verificar Despliegue
- Revisar logs
- Probar endpoint de health

## Despliegue en Docker

docker build -t kontrak-backend .
docker run -p 3000:3000 --env-file .env kontrak-backend
```

#### 5. TROUBLESHOOTING.md

```markdown
# Solución de Problemas

## Errores Comunes

### Error: ONEDRIVE_USER_EMAIL no está configurado
**Causa**: Variable de entorno faltante
**Solución**: Agregar `ONEDRIVE_USER_EMAIL=tu@email.com` a `.env`

### Error: Access token expired
**Causa**: Token de Azure expirado
**Solución**: Verificar refresh token o regenerar credenciales

### Error: Puppeteer no puede iniciar
**Causa**: Dependencias de Chrome faltantes
**Solución**: 
- Linux: `apt-get install -y chromium-browser`
- Docker: Usar imagen con Chrome preinstalado

### Error: Archivo Excel demasiado grande
**Causa**: Archivo excede 10MB
**Solución**: Dividir archivo en partes más pequeñas

### Error: Carpeta no encontrada en OneDrive
**Causa**: La carpeta "subir excel" no existe
**Solución**: Crear carpeta manualmente en OneDrive
```

### Checklist de Documentación

- [ ] README.md completo
- [ ] INSTALLATION.md con pasos detallados
- [ ] CONFIGURATION.md con todas las variables
- [ ] DEPLOYMENT.md para Render/Docker
- [ ] TROUBLESHOOTING.md con errores comunes
- [ ] Diagramas de arquitectura actualizados
- [ ] Guía de OneDrive setup
- [ ] Guía de Azure AD setup

### Beneficios

✅ Onboarding rápido de nuevos desarrolladores  
✅ Referencia para troubleshooting  
✅ Facilita entregas a clientes  
✅ Reduce preguntas repetitivas  

### Riesgo
🟢 **BAJO** - Solo documentación, no afecta código

---

## 🎯 Conclusión

Este refactoring transforma tu código de:
- **Monolítico acoplado** → **Arquitectura limpia en capas**
- **160 líneas en un archivo** → **20-30 líneas por clase**
- **8 responsabilidades mezcladas** → **1 responsabilidad por clase**
- **Difícil de testear** → **100% testeable con mocks**
- **Difícil de extender** → **Extensible sin modificar código**

**No es urgente hacerlo TODO ahora**, pero cada fase que completes mejorará significativamente la mantenibilidad del sistema.
