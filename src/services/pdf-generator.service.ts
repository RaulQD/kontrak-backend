import PDFDocument from 'pdfkit';
import { logger } from '../utils/logger';
import { format } from 'date-fns';
import { EmployeeData } from '../types/employees.types';
import { formatCurrency } from '../utils/formatCurrency';
import {
  generatePartTimeContract,
  generatePlanillaContract,
} from '../template/contracts';

/**
 * Servicio para generar PDFs de contratos
 */
export class PDFGeneratorService {
  /**
   * Genera un contrato PDF basado en el tipo de contrato
   */
  async generateContract(
    employeeData: EmployeeData,
    contractType: string,
  ): Promise<{ buffer: Buffer; filename: string }> {
    logger.info(
      { dni: employeeData.dni, contractType },
      '📄 Generando contrato PDF',
    );

    try {
      let buffer: Buffer;

      // Generar según el tipo de contrato
      switch (contractType.toLowerCase()) {
        case 'planilla':
          buffer = await generatePlanillaContract(employeeData);
          break;
        case 'subsidio':
          buffer = await this.generateSubsidioContract(employeeData);
          break;
        case 'part time':
        case 'parttime':
          buffer = await generatePartTimeContract(employeeData);
          break;
        case 'ape':
          buffer = await this.generateApeContract(employeeData);
          break;
        default:
          throw new Error(`Tipo de contrato desconocido: ${contractType}`);
      }

      const filename = `${employeeData.dni}.pdf`;

      logger.info({ filename }, '✅ Contrato PDF generado exitosamente');

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
          '❌ Error generando PDF',
        );
      }
      throw error;
    }
  }

  /**
   * GENERAR UN DOCUMENTO ANEXO EN PDF BASDO EN LA LISTA DE LOS EMPLEADOS
   */
  // async generateDataTreatmentPDF(data: EmployeeData): Promise<Buffer> {
  //   const employeMap = data.map
  // }
  /**
   * Genera contrato de Planilla
   */

  /**
   * Genera contrato de Subsidio
   */
  private async generateSubsidioContract(data: EmployeeData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Título
      doc
        .fontSize(16)
        .font('Helvetica-Bold')
        .text('CONTRATO DE TRABAJO CON SUBSIDIO TEMPORAL', { align: 'center' })
        .moveDown(1.5);

      // Fecha
      const currentDate = format(new Date(), 'dd/MM/yyyy');
      doc
        .fontSize(11)
        .font('Helvetica')
        .text(`Fecha: ${currentDate}`, { align: 'right' })
        .moveDown(1);

      // Datos del beneficiario
      doc
        .fontSize(13)
        .font('Helvetica-Bold')
        .text('DATOS DEL BENEFICIARIO')
        .moveDown(0.5);

      doc.fontSize(11).font('Helvetica');

      const fullName =
        `${data.name || ''} ${data.lastNameFather || ''} ${data.lastNameMother || ''}`
          .trim()
          .replace(/\s+/g, ' ');

      doc
        .text(`Nombre completo: ${fullName}`)
        .text(`DNI: ${data.dni || ''}`)
        .text(`Dirección: ${data.address || ''}`)
        .text(`Distrito: ${data.district || ''}`)
        .text(`Provincia: ${data.province || ''}`)
        .moveDown(1);

      // Condiciones del subsidio
      doc
        .fontSize(13)
        .font('Helvetica-Bold')
        .text('CONDICIONES DEL SUBSIDIO')
        .moveDown(0.5);

      doc.fontSize(11).font('Helvetica');

      const startDate = data.entryDate || '';
      const salary = data.salary
        ? formatCurrency(Number(data.salary))
        : 'S/ 0.00';

      doc
        .text(`Fecha de inicio: ${startDate}`)
        .text('Duración: Temporal (sujeto a evaluación)')
        .text(`Monto del subsidio: ${salary}`)
        .text('Tipo: Subsidio temporal')
        .moveDown(1);

      // Términos y condiciones
      doc
        .fontSize(13)
        .font('Helvetica-Bold')
        .text('TÉRMINOS Y CONDICIONES')
        .moveDown(0.5);

      doc.fontSize(11).font('Helvetica');

      const terms = [
        '1. Este subsidio es de carácter temporal y puede ser renovado previa evaluación.',
        '2. El beneficiario deberá cumplir con las condiciones establecidas para mantener el subsidio.',
        '3. Los pagos se realizarán mensualmente según calendario establecido.',
        '4. El subsidio no incluye beneficios laborales de planilla.',
      ];

      terms.forEach((term) => {
        doc.text(term, { align: 'justify' }).moveDown(0.3);
      });

      doc.moveDown(2);

      // Firmas
      const pageWidth = doc.page.width;
      const margin = doc.page.margins.left;
      const signatureWidth = 150;
      const signatureY = doc.y;

      doc
        .fontSize(11)
        .text('_____________________', margin + 50, signatureY)
        .text('Firma del Beneficiario', margin + 50, signatureY + 20, {
          width: signatureWidth,
          align: 'center',
        });

      doc
        .text(
          '_____________________',
          pageWidth - margin - signatureWidth - 50,
          signatureY,
        )
        .text(
          'Firma del Responsable',
          pageWidth - margin - signatureWidth - 50,
          signatureY + 20,
          { width: signatureWidth, align: 'center' },
        );

      doc.end();
    });
  }

  /**
   * Genera contrato Part-time
   */
  private async generatePlanillaContract(data: EmployeeData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Título
      doc
        .fontSize(16)
        .font('Helvetica-Bold')
        .text('CONTRATO DE TRABAJO A TIEMPO PARCIAL', { align: 'center' })
        .moveDown(1.5);

      // Fecha
      const currentDate = format(new Date(), 'dd/MM/yyyy');
      doc
        .fontSize(11)
        .font('Helvetica')
        .text(`Fecha: ${currentDate}`, { align: 'right' })
        .moveDown(1);

      // Datos del empleado
      doc
        .fontSize(13)
        .font('Helvetica-Bold')
        .text('DATOS DEL EMPLEADO')
        .moveDown(0.5);

      doc.fontSize(11).font('Helvetica');

      const fullNameComplete =
        `${data.name || ''} ${data.lastNameFather || ''} ${data.lastNameMother || ''}`
          .trim()
          .replace(/\s+/g, ' ');

      doc
        .text(`Nombre completo: ${fullNameComplete}`)
        .text(`DNI: ${data.dni || ''}`)
        .text(`Dirección: ${data.address || ''}`)
        .text(`Distrito: ${data.district || ''}`)
        .moveDown(1);

      // Condiciones laborales
      doc
        .fontSize(13)
        .font('Helvetica-Bold')
        .text('CONDICIONES LABORALES')
        .moveDown(0.5);

      doc.fontSize(11).font('Helvetica');

      const fullName =
        `${data.name || ''} ${data.lastNameFather || ''} ${data.lastNameMother || ''}`
          .trim()
          .replace(/\s+/g, ' ');

      const salary = data.salary
        ? formatCurrency(Number(data.salary))
        : 'S/ 0.00';

      doc
        .text(`Fecha de ingreso: ${data.entryDate}`)
        .text(`Remuneración: ${salary}`)
        .text('Tipo de contrato: Tiempo Parcial')
        .text('Jornada: 4 horas diarias')
        .text('Horario: Según programación semanal')
        .moveDown(1);

      // Cláusulas
      doc.fontSize(13).font('Helvetica-Bold').text('CLÁUSULAS').moveDown(0.5);

      doc.fontSize(11).font('Helvetica');

      const clauses = [
        '1. El trabajador laborará en jornada parcial según horario establecido.',
        '2. La remuneración es proporcional a las horas trabajadas.',
        '3. El trabajador gozará de beneficios proporcionales según la legislación vigente.',
        '4. Los horarios podrán ser ajustados previo acuerdo entre las partes.',
      ];

      clauses.forEach((clause) => {
        doc.text(clause, { align: 'justify' }).moveDown(0.3);
      });

      doc.moveDown(2);

      // Firmas
      const pageWidth = doc.page.width;
      const margin = doc.page.margins.left;
      const signatureWidth = 150;
      const signatureY = doc.y;

      doc
        .fontSize(11)
        .text('_____________________', margin + 50, signatureY)
        .text('Firma del Empleado', margin + 50, signatureY + 20, {
          width: signatureWidth,
          align: 'center',
        });

      doc
        .text(
          '_____________________',
          pageWidth - margin - signatureWidth - 50,
          signatureY,
        )
        .text(
          'Firma del Empleador',
          pageWidth - margin - signatureWidth - 50,
          signatureY + 20,
          { width: signatureWidth, align: 'center' },
        );

      doc.end();
    });
  }

  /**
   * Genera contrato APE
   */
  private async generateApeContract(data: EmployeeData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Título
      doc
        .fontSize(16)
        .font('Helvetica-Bold')
        .text('CONTRATO APE', { align: 'center' })
        .fontSize(14)
        .text('(ACTIVIDAD PROFESIONAL ESPECÍFICA)', { align: 'center' })
        .moveDown(1.5);

      // Fecha
      const currentDate = format(new Date(), 'dd/MM/yyyy');
      doc
        .fontSize(11)
        .font('Helvetica')
        .text(`Fecha: ${currentDate}`, { align: 'right' })
        .moveDown(1);

      // Datos del profesional
      doc
        .fontSize(13)
        .font('Helvetica-Bold')
        .text('DATOS DEL PROFESIONAL')
        .moveDown(0.5);

      doc.fontSize(11).font('Helvetica');

      const fullName =
        `${data.name || ''} ${data.lastNameFather || ''} ${data.lastNameMother || ''}`
          .trim()
          .replace(/\s+/g, ' ');

      doc
        .text(`Nombre completo: ${fullName}`)
        .text(`DNI: ${data.dni || ''}`)
        .text(`Dirección: ${data.address || ''}`)
        .moveDown(1);

      // Condiciones del contrato
      doc
        .fontSize(13)
        .font('Helvetica-Bold')
        .text('CONDICIONES DEL CONTRATO')
        .moveDown(0.5);

      doc.fontSize(11).font('Helvetica');

      const startDate = data.entryDate || '';
      const salary = data.salary
        ? formatCurrency(Number(data.salary))
        : 'S/ 0.00';

      doc
        .text(`Fecha de inicio: ${startDate}`)
        .text(`Honorarios: ${salary}`)
        .text('Modalidad: Actividad Profesional Específica')
        .text('Régimen: Independiente')
        .moveDown(1);

      // Obligaciones
      doc
        .fontSize(13)
        .font('Helvetica-Bold')
        .text('OBLIGACIONES')
        .moveDown(0.5);

      doc.fontSize(11).font('Helvetica');

      const obligations = [
        '1. El profesional se compromete a realizar las actividades específicas acordadas.',
        '2. Los honorarios serán cancelados según lo establecido en el cronograma de pagos.',
        '3. El profesional es responsable de sus propios impuestos y contribuciones.',
        '4. No existe relación de dependencia laboral.',
      ];

      obligations.forEach((obligation) => {
        doc.text(obligation, { align: 'justify' }).moveDown(0.3);
      });

      doc.moveDown(2);

      // Firmas
      const pageWidth = doc.page.width;
      const margin = doc.page.margins.left;
      const signatureWidth = 150;
      const signatureY = doc.y;

      doc
        .fontSize(11)
        .text('_____________________', margin + 50, signatureY)
        .text('Firma del Profesional', margin + 50, signatureY + 20, {
          width: signatureWidth,
          align: 'center',
        });

      doc
        .text(
          '_____________________',
          pageWidth - margin - signatureWidth - 50,
          signatureY,
        )
        .text(
          'Firma del Contratante',
          pageWidth - margin - signatureWidth - 50,
          signatureY + 20,
          { width: signatureWidth, align: 'center' },
        );

      doc.end();
    });
  }
}
