import {
  generateAddendumIncrementoActividadesPDF,
  generateAddendumReplacementForPDF,
  generateNoSubjectToControlPDF,
  generatePartTimeContract,
  generatePlanillaContract,
  generateSubsidioContract,
} from '../templates/contracts';
import { Browser } from 'puppeteer';
import { AppError } from '../../../shared/utils/app-error';
import {
  ContractType,
  EmployeeData,
} from '../../../shared/types/employees.interface';
import { logger } from '../../../shared/utils/logger';
import { Readable } from 'stream';
import { AddendumType } from '../../excel/constants/contract-field';
import { AddendumData } from '../../../shared/types/addendum.interface';

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
  ): Promise<{ stream: Readable; filename: string }> {
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
      let stream: Readable;

      // Generar según el tipo de contrato
      switch (contractType.toLowerCase()) {
        case 'planilla':
          stream = await generatePlanillaContract(employeeData, browser);
          break;
        case 'subsidio':
          stream = await generateSubsidioContract(employeeData, browser);
          break;
        case 'part time':
        case 'parttime':
          stream = await generatePartTimeContract(employeeData, browser);
          break;
        default:
          throw new Error(`Tipo de contrato desconocido: ${contractType}`);
      }

      const filename = `${employeeData.dni}.pdf`;
      return { stream, filename };
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
  async generateLetterNoSubectToControl(
    employeeData: EmployeeData,
    browser: Browser,
  ): Promise<{ stream: Readable; filename: string } | null> {
    if (
      employeeData.workingCondition?.toUpperCase() !== 'NO SUJETO A CONTROL'
    ) {
      return null;
    }
    logger.info(
      { dni: employeeData.dni },
      'Iniciando la generacion de la carta de no sujeto a control',
    );
    const stream = await generateNoSubjectToControlPDF(employeeData, browser);
    return { stream, filename: `${employeeData.dni}.pdf` };
  }
  async generateAddendumPDF(
    employeeData: AddendumData,
    contractType: AddendumType,
    browser: Browser,
  ): Promise<{ stream: Readable; filename: string }> {
    logger.info(
      { dni: employeeData.documentNumber },
      'Iniciando la generacion de la adenda de incremento de actividades',
    );
    if (!employeeData || !employeeData.documentNumber) {
      throw new AppError(
        'Faltand datos del empleado   para visualizar el contrato',
        400,
      );
    }
    try {
      let stream: Readable;

      switch (contractType.toLowerCase()) {
        case 'por inicio o incremento de actividad':
          stream = await generateAddendumIncrementoActividadesPDF(
            employeeData,
            browser,
          );
          break;
        case 'de suplencia':
          stream = await generateAddendumReplacementForPDF(
            employeeData,
            browser,
          );
          break;
        default:
          throw new Error(`Tipo de contrato desconocido: ${contractType}`);
      }
      const filename = `${employeeData.documentNumber}.pdf`;
      return { stream, filename };
    } catch (error) {
      if (error instanceof Error) {
        logger.error(
          {
            err: error,
            message: error.message,
            stack: error.stack,
            dni: employeeData.documentNumber,
          },
          'Error generando PDF',
        );
      }
      throw error;
    }
  }
}
