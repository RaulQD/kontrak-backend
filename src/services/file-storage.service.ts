import fs from 'fs/promises';
import path from 'path';
import { logger } from '../utils/logger';
import { formatDate } from 'date-fns';
import { config } from '../config';

export class FileStorageService {
  /**
   * The function `ensureTempFolder` checks if a temporary folder exists and creates it if it doesn't.
   */
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
    const timeStamp = formatDate(new Date(), 'dd-MM-yyy_HHmmss');
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
  async getPdfByDNI(
    sessionPath: string,
    dni: string,
  ): Promise<{ buffer: Buffer; fileName: string } | null> {
    try {
      // Listar todas las subcarpetas (tipos de contrato)
      const entries = await fs.readdir(sessionPath, {
        withFileTypes: true,
      });
      //FILTRANDO SI ES DIRECTORIO O NO
      const contractFolders = entries
        .filter((entry) => entry.isDirectory())
        .map((folders) => folders.name);
      logger.debug(
        { contractFolders },
        `📁 Carpetas de contratos encontradas: ${contractFolders.length}`,
      );
      //buscar el pdf del empleado en todas las subcarpetas
      for (const folderName of contractFolders) {
        const contractFolderPath = path.join(sessionPath, folderName);
        try {
          // Listar archivos en la carpeta del tipo de contrato
          const file = await fs.readdir(contractFolderPath);
          // Buscar archivo que coincida con el patrón: {dni}_contrato_*.pdf
          const pdfFile = file.find((file) => {
            const fileName = file.toLocaleLowerCase();
            const dniLower = dni.toLocaleLowerCase();
            return (
              fileName.startsWith(`${dniLower}_contrato_`) &&
              fileName.endsWith('.pdf')
            );
          });
          if (pdfFile) {
            const pdfPath = path.join(contractFolderPath, pdfFile);
            const buffer = await fs.readFile(pdfPath);
            return { buffer, fileName: pdfFile };
          }
        } catch (error) {
          logger.warn(
            { error, folder: folderName },
            `⚠️ Error leyendo carpeta ${folderName}`,
          );
          continue; // Continuar con la siguiente carpeta
        }
      }
      // 4. Si llegamos aquí, no se encontró el PDF
      logger.warn({ dni, sessionPath }, '❌ PDF no encontrado');
      return null;
    } catch (error) {
      logger.error({ error, dni, sessionPath }, '❌ Error buscando PDF');
      throw error;
    }
  }
}
