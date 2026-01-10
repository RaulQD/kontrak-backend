import { logger } from '../utils/logger';
import { ContractType, EmployeeData } from '../types/employees.interface';
import {
  generatePartTimeContract,
  generatePlanillaContract,
  generateSubsidioContract,
} from '../template/contracts';
import { AppError } from '../utils/app-error';
import { Browser } from 'puppeteer';

/**
 * Servicio para generar PDFs de contratos
 */
export class PDFGeneratorService {
  /**
   * Genera un contrato PDF basado en el tipo de contrato
   */
  async generateContract(
    employeeData: EmployeeData,
    contractType: ContractType,
    browser: Browser,
  ): Promise<{ buffer: Buffer; filename: string }> {
    logger.info(
      { dni: employeeData.dni, contractType },
      'Generando contrato PDF',
    );

    if (!employeeData || !employeeData.dni) {
      throw new AppError(
        'Faltand datos del empleado para visualizar el contrato',
        400,
      );
    }
    try {
      let buffer: Buffer;

      // Generar según el tipo de contrato
      switch (contractType.toLowerCase()) {
        case 'planilla':
          buffer = await generatePlanillaContract(employeeData, browser);
          break;
        case 'subsidio':
          buffer = await generateSubsidioContract(employeeData, browser);
          break;
        case 'part time':
        case 'parttime':
          buffer = await generatePartTimeContract(employeeData, browser);
          break;
        default:
          throw new Error(`Tipo de contrato desconocido: ${contractType}`);
      }

      const filename = `${employeeData.dni}.pdf`;
      return { buffer, filename };
    } catch (error) {
      if (error instanceof Error) {
        logger.error(
          {
            err: error,
            message: error.message,
            stack: error.stack,
            dni: employeeData.dni,
          },
          'Error generando PDF',
        );
      }
      throw error;
    }
  }
}
