import { logger } from '../../../../utils/logger';

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Verifica si el archivo excede el tamaño máximo permitido
 * @returns true si el archivo es inválido (demasiado grande)
 */
export const isFileTooLarge = (file: {
  name: string;
  size: number;
}): boolean => {
  if (file.size && file.size > MAX_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    logger.warn(
      `⏭️ Archivo demasiado grande: ${file.name} (${sizeMB}MB, máx: 10MB)`,
    );
    return true;
  }

  return false;
};
