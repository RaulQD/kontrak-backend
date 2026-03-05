import { ProcessingResult } from '../../result/processing-result.interface';

/**
 * Define políticas de procesamiento configurables
 * Permite cambiar comportamiento sin modificar código
 */
export interface ProcessingPolicy {
  /**
   * Determina si se debe eliminar el archivo original después del procesamiento
   * @param result Resultado del procesamiento
   * @returns true si debe eliminarse
   */
  shouldDeleteOriginal(result: ProcessingResult): boolean;

  /**
   * Determina si se debe reintentar en caso de fallo
   * @param result Resultado del procesamiento
   * @param attempt Número de intento actual
   * @returns true si debe reintentarse
   */
  shouldRetry(result: ProcessingResult, attempt: number): boolean;

  /**
   * Obtiene el número máximo de reintentos
   */
  getMaxRetries(): number;

  /**
   * Determina si se debe notificar sobre el resultado
   * @param result Resultado del procesamiento
   * @returns true si debe notificarse
   */
  shouldNotify(result: ProcessingResult): boolean;
}
