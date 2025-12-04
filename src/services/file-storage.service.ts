import fs from 'fs/promises';
import path from 'path';
import { logger } from '../validators/logger';
import { formatDate } from 'date-fns';
import { config } from '../config';

export class FileStorageService {
  async ensureTempFolder(): Promise<void> {
    try {
      await fs.access(config.paths.temp);
      logger.debug({ path: config.paths.temp }, 'Carpeta temporal ya existe');
    } catch {
      await fs.mkdir(config.paths.temp, { recursive: true });
      logger.debug({ path: config.paths.temp }, 'Carpeta temporal creada');
    }
  }
  /**
   * Crea una carpeta única para una sesión de generación
   * Retorna la ruta de la carpeta creada
   */
  async createSessionFolder(): Promise<string> {
    //asegurar la carpeta
    await this.ensureTempFolder();
    // Crear nombre único para la sesión: session_YYYYMMDD_HHmmss_randomID
    const timeStamp = formatDate(new Date(), 'ddMMyyy_HHmmss');
    const sessionName = `contratos_${timeStamp}`;
    const sessionPath = path.join(config.paths.temp, sessionName);
    // Crear carpeta de sesión
    await fs.mkdir(sessionPath, { recursive: true });
    return sessionPath;
  }
  /**
   * Guarda un PDF organizado por tipo de contrato
   */
  async savePDF(
    sessionPath: string,
    contractType: string,
    filename: string,
    buffer: Buffer,
  ): Promise<string> {
    // Normalizar el tipo de contrato para nombre de carpeta
    const folderName = contractType.toLowerCase().replace(/\s+/g, '');
    const contractFolder = path.join(sessionPath, folderName);

    // Crear carpeta del tipo de contrato si no existe
    await fs.mkdir(contractFolder, { recursive: true });

    // Guardar el archivo
    const filePath = path.join(contractFolder, filename);
    await fs.writeFile(filePath, buffer);

    logger.info({ filePath }, '💾 PDF guardado en disco');

    return filePath;
  }
}
