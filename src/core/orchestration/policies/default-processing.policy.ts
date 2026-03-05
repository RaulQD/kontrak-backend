import { ProcessingPolicy } from './interfaces/processing-policy.interface';
import { ProcessingResult } from '../result/processing-result.interface';

/**
 * Política de procesamiento por defecto
 * - Elimina archivo si 100% exitoso
 * - No realiza reintentos automáticos
 * - Notifica siempre (errores y éxitos)
 */
export class DefaultProcessingPolicy implements ProcessingPolicy {
  private readonly maxRetries: number;

  constructor(maxRetries: number = 0) {
    this.maxRetries = maxRetries;
  }

  /**
   * Elimina el archivo original solo si TODOS los items fueron exitosos
   */
  shouldDeleteOriginal(result: ProcessingResult): boolean {
    return result.success && result.failureCount === 0;
  }

  /**
   * Por defecto no reintenta (maxRetries = 0)
   */
  shouldRetry(result: ProcessingResult, attempt: number): boolean {
    return !result.success && attempt < this.maxRetries;
  }

  getMaxRetries(): number {
    return this.maxRetries;
  }

  /**
   * Notifica siempre para mantener visibilidad
   */
  shouldNotify(_result: ProcessingResult): boolean {
    return true;
  }
}
