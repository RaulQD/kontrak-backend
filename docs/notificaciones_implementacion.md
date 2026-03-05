# 📬 Sistema de Notificaciones - Guía de Implementación

## Paso 1: Definir tipos de notificación

| Escenario | Descripción |
|-----------|-------------|
| **Éxito total** | Todos los contratos generados correctamente |
| **Éxito parcial** | Algunos fallaron, otros sí |
| **Error de validación** | Excel con errores |
| **Error crítico** | Fallo del sistema |

---

## Paso 2: Estructura de datos

### Datos comunes:
- Fecha/hora del procesamiento
- Nombre del archivo Excel
- Total de empleados

### Datos por tipo:
- **Éxito**: contratos, anexos, tratamientos generados
- **Errores**: lista (DNI, campo, mensaje)

---

## Paso 3: Crear templates HTML

Ubicación: `src/core/notifications/templates/`

| Template | Color | Uso |
|----------|-------|-----|
| `success.template.ts` | Verde | Éxito total |
| `partial-success.template.ts` | Amarillo | Éxito parcial |
| `validation-error.template.ts` | Rojo | Errores de validación |
| `critical-error.template.ts` | Rojo oscuro | Errores críticos |

---

## Paso 4: Crear EmailNotificationService

Ubicación: `src/core/notifications/services/email-notification.service.ts`

### Métodos:
- `sendSuccessNotification(data)`
- `sendPartialSuccessNotification(data)`
- `sendValidationErrorNotification(data)`
- `sendCriticalErrorNotification(data)`

---

## Paso 5: Crear interfaz NotificationData

Ubicación: `src/core/notifications/types/notification.types.ts`

### Campos:
- fileName
- processedAt
- totalEmployees
- successCount
- failureCount
- errors[]
- generatedFiles[]

---

## Paso 6: Integrar en orchestrator

Ubicación: `src/core/orchestration/file-processing.orchestrator.ts`

### Lógica:
```
SI successCount == total → Enviar éxito
SI successCount > 0 Y failureCount > 0 → Enviar parcial
SI failureCount == total → Enviar error
SI excepción → Enviar crítico
```

---

## Paso 7: Configurar destinatarios

Variables de entorno:
- `EMAIL_RRHH`
- `EMAIL_SUPERVISOR`
- `EMAIL_TI`

---

## Paso 8: Agregar al ServiceContainer

En `src/config/service.container.ts`:
- Agregar `EmailNotificationService` como singleton
- Inyectar en orchestrator

---

## Paso 9: Probar escenarios

| Excel | Resultado esperado |
|-------|-------------------|
| Válido completo | Email de éxito |
| Con algunos errores | Email parcial |
| Todos errores | Email de error |
| Corrupto | Email crítico |

---

## Estructura final

```
src/core/notifications/
├── services/
│   └── email-notification.service.ts
├── templates/
│   ├── success.template.ts
│   ├── partial-success.template.ts
│   ├── validation-error.template.ts
│   └── critical-error.template.ts
└── types/
    └── notification.types.ts
```
