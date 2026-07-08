# Guía de Migración: De Puppeteer a pdfmake

Esta guía detalla los pasos necesarios para reemplazar la generación de PDFs basada en **Puppeteer** por **pdfmake** en el proyecto Kontrak.

## Razón del Cambio
Puppeteer es potente pero consume muchos recursos (memoria y CPU) al levantar una instancia completa de Chromium. **pdfmake** genera PDFs directamente en Node.js de forma mucho más ligera y rápida.

---

## Paso 1: Instalación de Dependencias

Primero, debemos instalar `pdfmake` y sus tipos para TypeScript.

```bash
npm install pdfmake
npm install @types/pdfmake --save-dev
```

---

## Paso 2: Configuración de Fuentes

`pdfmake` requiere acceso a archivos de fuentes (`.ttf`). En un entorno de servidor, lo más común es apuntar a archivos físicos.

1. Crea una carpeta `assets/fonts` en la raíz (o dentro de `src/shared/assets/fonts`).
2. Descarga las fuentes necesarias (ej: Roboto, Arial).
3. Configura el objeto de fuentes en tu servicio:

```typescript
const fonts = {
  Roboto: {
    normal: 'path/to/Roboto-Regular.ttf',
    bold: 'path/to/Roboto-Medium.ttf',
    italics: 'path/to/Roboto-Italic.ttf',
    bolditalics: 'path/to/Roboto-MediumItalic.ttf'
  }
};
```

---

## Paso 3: Estrategia de Migración de Plantillas

A diferencia de Puppeteer, que usa HTML/Handlebars, `pdfmake` utiliza una **Definición de Documento (JSON)**.

### Ejemplo de Conversión

**Antes (HTML/Handlebars):**
```html
<div class="text-center bold underline">
    CONTRATO DE TRABAJO
</div>
<p>Conste por el presente documento el contrato de {{fullName}}...</p>
```

**Ahora (pdfmake JSON):**
```typescript
const docDefinition = {
  content: [
    { 
      text: 'CONTRATO DE TRABAJO', 
      style: 'header', 
      alignment: 'center', 
      decoration: 'underline',
      bold: true 
    },
    { 
      text: `Conste por el presente documento el contrato de ${data.fullName}...`,
      margin: [0, 10, 0, 0]
    }
  ],
  styles: {
    header: { fontSize: 12, bold: true }
  }
};
```

---

## Paso 4: Creación del Nuevo Servicio Generador

Debes modificar o crear un nuevo `PDFGeneratorService` que no dependa de `Browser`.

### Ejemplo de implementación base:

```typescript
import PdfPrinter from 'pdfmake';
import { Readable } from 'stream';

export class PDFMakeGenerator {
  private printer: PdfPrinter;

  constructor() {
    this.printer = new PdfPrinter(fonts);
  }

  generate(docDefinition: any): Readable {
    const pdfDoc = this.printer.createPdfKitDocument(docDefinition);
    
    // Convertir el stream de pdfkit a un Readable stream estándar
    const stream = new Readable({
      read() {}
    });

    pdfDoc.on('data', (chunk) => stream.push(chunk));
    pdfDoc.on('end', () => stream.push(null));
    pdfDoc.end();

    return stream;
  }
}
```

---

## Paso 5: Actualización de la Lógica de Negocio

### 1. Eliminar Puppeteer del flujo
En `PDFGeneratorService`, ya no necesitas recibir el parámetro `browser: Browser`.

### 2. Refactorizar `contracts.ts`
Las funciones como `generatePlanillaContract` deben dejar de usar `Handlebars` y `page.pdf()`, y pasar a retornar un objeto de definición de `pdfmake`.

---

## Paso 6: Limpieza (Cleanup)

Una vez que todos los contratos se generen con `pdfmake`:

1. **Desinstalar Puppeteer**:
   ```bash
   npm uninstall puppeteer
   ```
2. **Eliminar infraestructura de Browser**:
   Borra `src/infrastructure/browser/browser-manager.ts`.
3. **Eliminar variables de entorno**:
   Borra `PUPPETEER_EXECUTABLE_PATH` o similares de tu `.env`.

---

## Recomendación: Uso de librerías "HTML to pdfmake"
Si tienes muchas plantillas HTML complejas y no quieres reescribirlas manualmente a JSON, existen librerías como `html-to-pdfmake` que pueden ayudar a automatizar parte del proceso, aunque el resultado nativo siempre es más preciso.
