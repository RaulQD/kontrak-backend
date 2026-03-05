/**
 * Resultado del procesamiento de un archivo individual (ej. un PDF generado)
 */
export interface ItemProcessingResult {
  success: boolean;
  filename: string;
  error?: string;
}

/**
 * Resultado completo del procesamiento de un archivo Excel
 */
export interface ProcessingResult {
  /** Si todo el procesamiento fue exitoso */
  success: boolean;

  /** Nombre del archivo procesado */
  fileName: string;

  /** Resultados individuales de cada contrato */
  items: ItemProcessingResult[];

  /** Total de items procesados */
  totalProcessed: number;

  /** Total de items exitosos */
  successCount: number;

  /** Total de items fallidos */
  failureCount: number;

  /** Tiempo de procesamiento en ms */
  processingTimeMs?: number;

  /** Mensaje de error general si aplica */
  errorMessage?: string;
}

/**
 * Factory para crear resultados de procesamiento
 */
export const ProcessingResultFactory = {
  success(fileName: string, items: ItemProcessingResult[]): ProcessingResult {
    const successCount = items.filter((i) => i.success).length;
    return {
      success: successCount === items.length,
      fileName,
      items,
      totalProcessed: items.length,
      successCount,
      failureCount: items.length - successCount,
    };
  },

  failure(fileName: string, errorMessage: string): ProcessingResult {
    return {
      success: false,
      fileName,
      items: [],
      totalProcessed: 0,
      successCount: 0,
      failureCount: 0,
      errorMessage,
    };
  },
};
