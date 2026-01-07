import { Browser } from 'puppeteer';
import { ExcelGeneratorServices } from '../../../services/excel-generator.service';
import { PDFGeneratorService } from '../../../services/pdf-generator.service';
import { logger } from '../../../utils/logger';
import { OneDriveStorageAdapter } from '../adapters/onedrive-storage.adapter';
import { OneDriveDriveItem } from '../types/onedrive-api.types';
import { BrowserManager } from '../../../infrastructure/browser/browser-manager';
import { ExcelFileValidator } from '../validators/implementations/excel-file.validator';
import { FileValidator } from '../validators/interfaces/file-validator.interface';
import { FileStorageService } from '../storage';

export class OneDriveServices {
  private USER_EMAIL: string;
  private isProcessing: boolean = false;
  private enterFile: string;
  private outFile: string;
  private generateExcelService: ExcelGeneratorServices;
  private pdfGeneratorServices: PDFGeneratorService;
  private storage: FileStorageService; // ← Ahora usa la interfaz
  private browserManager: BrowserManager;
  private fileValidator: FileValidator;

  constructor(storage?: FileStorageService) {
    this.USER_EMAIL = process.env.ONEDRIVE_USER_EMAIL || '';
    this.enterFile = 'subir excel';
    this.outFile = 'contratos';
    this.generateExcelService = new ExcelGeneratorServices();
    this.pdfGeneratorServices = new PDFGeneratorService();
    this.storage = storage ?? new OneDriveStorageAdapter();
    this.browserManager = BrowserManager.getInstance();
    this.fileValidator = new ExcelFileValidator();
  }
  public async vigilarYProcesar() {
    if (this.isProcessing) {
      logger.info('⏳ Ya hay un proceso en ejecución, esperando...');
      return;
    }
    this.isProcessing = true;
    logger.info('Buscando archivo en ONEDRIVE...');
    try {
      const browser = await this.browserManager.getBrowser();
      const files = await this.storage.getFiles(this.enterFile);
      // Files is already an array of FileMetadata with id and name properties
      if (!files || files.length === 0) {
        logger.info('📭 No hay archivos para procesar');
        return;
      }
      logger.info(`✨ Se encontraron ${files.length} archivos para procesar.`);
      for (const file of files) {
        await this.procesarArchivoIndividual(file, browser);
      }
    } catch (error) {
      logger.error(` Error general en vigilancia: ${error}`);
    } finally {
      await this.browserManager.closeBrowser();
      this.isProcessing = false;
      logger.info('🔓 Proceso finalizado, listo para siguiente ejecución');
    }
  }
  private async procesarArchivoIndividual(
    file: OneDriveDriveItem,
    browser: Browser,
  ) {
    // Usar el nuevo validador de clase
    const validationResult = this.fileValidator.validate({
      name: file.name,
      size: file.size,
    });

    if (!validationResult.isValid) {
      // El validador ya logueó los errores internamente
      return;
    }

    try {
      const stream = await this.storage.downloadFile(file.id);
      logger.info(`   ✅ Descarga exitosa. Tamaño: ${stream.length} bytes`);
      const resultadoProcesamiento =
        await this.generateExcelService.processingExcel(stream, file.name);
      logger.info(
        `✅ Datos procesados. Empleados encontrados: ${resultadoProcesamiento.employees.length}`,
      );

      const pdfResults = [];
      let allSuccess = true;

      for (const employees of resultadoProcesamiento.employees) {
        try {
          const { buffer: pdfBuffer, filename } =
            await this.pdfGeneratorServices.generateContract(
              employees,
              employees.contractType,
              browser,
            );
          await this.subirPdfAOneDrive(pdfBuffer, filename);
          logger.info(`   📄 Subido: ${filename}`);
          pdfResults.push({
            success: true,
            filename,
          });
        } catch (error) {
          allSuccess = false;
          pdfResults.push({
            success: false,
            filename: employees.dni,
            error,
          });
          logger.error(`   ❌ Error en PDF ${employees.dni}: ${error}`);
        }
      }
      if (allSuccess) {
        await this.storage.deleteFile(file.id);
        logger.info(`🗑️ Excel eliminado (100% exitoso)`);
      } else {
        logger.warn(
          `⚠️ Algunos PDFs fallaron. Excel NO eliminado para reintento.`,
        );
        logger.warn(
          `   Exitosos: ${pdfResults.filter((r) => r.success).length}/${pdfResults.length}`,
        );
      }
    } catch (error) {
      logger.error({ error }, 'Error general en vigilancia');
    }
  }

  private async subirPdfAOneDrive(buffer: Buffer, nombreArchivo: string) {
    // Usamos put para subir. Si existe, lo sobrescribe (o crea versión nueva)
    await this.storage.uploadFile(buffer, this.outFile, nombreArchivo);
  }
}
