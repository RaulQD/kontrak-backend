import PDFDocument, { underline } from 'pdfkit';
import { logger } from '../validators/logger';
import { format } from 'date-fns';
import { EmployeeData } from '../types/employees.types';
import path from 'path';
import { formatCurrency } from '../utils/formatCurrency';

/**
 * Servicio para generar PDFs de contratos usando PDFKit
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
          buffer = await this.generatePlanillaContract(employeeData);
          break;
        case 'subsidio':
          buffer = await this.generateSubsidioContract(employeeData);
          break;
        case 'part time':
        case 'parttime':
          buffer = await this.generatePartTimeContract(employeeData);
          break;
        case 'ape':
          buffer = await this.generateApeContract(employeeData);
          break;
        default:
          throw new Error(`Tipo de contrato desconocido: ${contractType}`);
      }

      const filename = `${employeeData.dni}_contrato_${contractType.toLowerCase().replace(/\s+/g, '')}.pdf`;

      logger.info({ filename }, '✅ Contrato PDF generado exitosamente');

      return { buffer, filename };
    } catch (error) {
      logger.error({ error, dni: employeeData.dni }, '❌ Error generando PDF');
      throw error;
    }
  }

  /**
   * Genera contrato de Planilla
   */
  private async generatePlanillaContract(data: EmployeeData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4' });
      doc.page.margins.top = 48.12; // 2.05 cm
      doc.page.margins.bottom = 33.89; // 0.49 cm
      doc.page.margins.left = 45.69; // 1.23 cm
      doc.page.margins.right = 45.69; // 1.55 cm

      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
      const arialNormal = path.join(__dirname, '../fonts/ARIAL.TTF');
      const arialBold = path.join(__dirname, '../fonts/ARIALBD.TTF');

      doc.registerFont('Arial Bold', arialBold);
      doc.registerFont('Arial Normal', arialNormal);

      // Título
      doc
        .fontSize(8)
        .font('Arial Bold')
        .text('CONTRATO DE TRABAJO DE TIEMPO PARCIAL', {
          align: 'center',
          underline: true,
        })
        .moveDown(1);

      const fullName =
        `${data.lastNameFather || ' '} ${data.lastNameMother || ' '} ${data.name || ''}`
          .trim()
          .replace(/\s+/g, ' ');
      //PARRAFO INTRODUCTORIO
      const contractText = `Conste por el presente documento, que se suscribe por duplicado con igual tenor y valor, el `;
      //text
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text(contractText, { continued: true })
        .font('Arial Bold')
        .text('Contrato de Trabajo a Tiempo Parcial, ', {
          continued: true,
          align: 'justify',
        })
        .font('Arial Normal')
        .text(
          'que, al amparo de lo dispuesto en el Texto Único Ordenado del Decreto Legislativo Nº 728 (Decreto Supremo Nº 003-97-TR, Ley de Productividad y Competitividad Laboral) y el Decreto Supremo N’ 002-97-TR, celebran, de una parte, la empresa ',
          { continued: true, align: 'justify' },
        )
        .font('Arial Bold')
        .text('INVERSIONES URBANÍSTICAS OPERADORA S.A., ', {
          continued: true,
          align: 'justify',
        })
        .font('Arial Normal')
        .text(
          'con R.U.C. Nº 20603381697, con domicilio en Calle Dean Valdivia N°148 Int.1401 Urb. Jardín (Edificio Platinium), Distrito de San Isidro, Provincia y Departamento de Lima, debidamente representada por la Sra. Catherine Susan Chang López identificado con D.N.I. Nº 42933662  y por la Sra. Maria Estela Guillen Cubas, identificada con DNI Nº 10346833, según poderes inscritos en la Partida Electrónica 14130887 del Registro de Personas Jurídicas de Lima, a quien en adelante se le denominará “EL EMPLEADOR”; y de otra parte, el Sr.(a). ',
          { continued: true, align: 'justify' },
        )
        .font('Arial Bold')
        .text(`${fullName} `, { continued: true })
        .font('Arial Normal')
        .text('identificado con ', { continued: true })
        .font('Arial Bold')
        .text(`DNI N° ${data.dni || ''}, `, { continued: true })
        .font('Arial Normal')
        .text('de nacionalidad peruana, con domicilio en ', {
          continued: true,
        })
        .font('Arial Bold')
        .text(`${data.address || ''}, `, { continued: true })
        .font('Arial Normal')
        .text('Distrito de ', { continued: true })
        .font('Arial Bold')
        .text(`${data.district || ''}, `, { continued: true })
        .font('Arial Normal')
        .text('Provincia de ', { continued: true })
        .font('Arial Bold')
        .text(`${data.province} `, { continued: true })
        .font('Arial Normal')
        .text('y Departamento de ', { continued: true })
        .font('Arial Bold')
        .text(`${data.department} `, { continued: true })
        .font('Arial Normal')
        .text(
          'a quien en adelante se le denominará “EL TRABAJADOR”; en los términos y condiciones siguientes:',
        )
        .moveDown(1);
      //titulo Nro 1
      doc
        .fontSize(8)
        .font('Arial Bold')
        .text('PRIMERO: PARTES DEL CONTRATO', {
          align: 'left',
          underline: true,
        })
        .moveDown(1);

      //Parrafo 1.1
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('1.1       ', { continued: true, align: 'justify' })
        .font('Arial Bold')
        .text('EL EMPLEADOR ', { continued: true })
        .font('Arial Normal')
        .text(
          'es una sociedad anónima debidamente constituida e inscrita en la Partida No. 14130887 del Registro de ',
          { align: 'justify' },
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'Personas Jurídicas de la Ciudad de Lima, cuyo objeto social es la prestación de servicios de administració, promoción,',
          { align: 'justify' },
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'desarrollo y operación de playas de estacionamiento, sistemas de peaje y actividades conexas.',
        )
        .moveDown(0.5);
      // Párrafo 1.2
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('1.2       ', { continued: true, align: 'justify' })
        .font('Arial Bold')
        .text('EL EMPLEADOR ', { continued: true })
        .font('Arial Normal')
        .text(
          'para realizar actividades comerciales y de servicios en las distintas divisiones de negocios, requiere contar ',
          { continued: true, align: 'justify' },
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('contratar personal que desempeñará labores a tiempo parcial.')
        .moveDown(0.5);

      // Párrafo 1.3
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('1.3       ', { continued: true, align: 'justify' })
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text(
          'declara estar capacitado y no tener impedimento físico ni legal para desempeñar las funciones que',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('le encomienda ', { continued: true })
        .font('Arial Bold')
        .text('EL EMPLEADOR ', { continued: true })
        .font('Arial Normal')
        .text('en el marco del presente ', {
          continued: true,
          align: 'justify',
        })
        .font('Arial Bold')
        .text('CONTRATO.', { align: 'justify' })
        .moveDown(1);
      // Texto 2
      doc
        .fontSize(8)
        .font('Arial Bold')
        .text('SEGUNDA: OBJETO DEL CONTRATO', {
          align: 'left',
          underline: true,
        })
        .moveDown(1);
      //Parrafo 2.1
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('2.1       ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text('Por el presente documento ', {
          continued: true,
          align: 'justify',
        })
        .font('Arial Bold')
        .text('EL EMPLEADOR ', { continued: true })
        .font('Arial Normal')
        .text('contrata a ', { continued: true })
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text('para que ocupe realice actividades de ', { continued: true })
        .font('Arial Bold')
        .text(`${data.position} `, { continued: true })
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'asumiendo las responsabilidades propias del puesto y de acuerdo a las estipulaciones contenidas en este Contrato.',
        )
        .moveDown(0.5);
      //parrafor 2.2
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('2.2       ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text(
          'Las partes reconocen y declaran que el cargo de EL TRABAJADOR está sujeto a fiscalización inmediata.',
          { align: 'justify' },
        )
        .moveDown(1);
      //text 3
      doc
        .fontSize(8)
        .font('Arial Bold')
        .text('TERCERO: PLAZO', { align: 'left', underline: true })
        .moveDown(1);
      //parrafo 3.1
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('3.1       ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text(
          'Atendiendo a las características propias del Contrato a Tiempo Parcial, ',
          { continued: true },
        )
        .font('Arial Bold')
        .text('EL EMPLEADOR ', { continued: true })
        .font('Arial Normal')
        .text('contrata a ', { continued: true })
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('por un plazo indeterminado.')
        .moveDown(0.5);

      //Parrafo 3.2
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('3.2       ', { continued: true, align: 'justify' })
        .font('Arial Bold')
        .text('EL EMPLEADOR y/o EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text(
          'podrán dar por terminado el presente contrato, sin expresión de causa, bastando',
          { continued: true },
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'para ello la comunicación previa a la otra parte con una anticipación de 05 (cinco) días calendarios.',
        )
        .moveDown(1);

      //parrafo 4
      doc
        .fontSize(8)
        .font('Arial Bold')
        .text('CUARTO: JORNADA DE TRABAJO', { align: 'left', underline: true })
        .moveDown(1);

      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('4.1       ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text('En relación a la Jornada de Trabajo, ', { continued: true })
        .font('Arial Bold')
        .text('EL EMPLEADOR y EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text('acuerdan que ', { continued: true })
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text('cumplirá')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'una jornada menor a cuatro (04) horas diarias en promedio a la semana, de conformidad con lo dispuesto en los artículos',
          { continued: true },
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          '11 y 12 del Decreto Supremo 001-96-TR, que aprueba el Reglamento de Ley de Fomento al Empleo, y las demás normas',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('que regulan el contrato de trabajo a tiempo parcial.')
        .moveDown(1);
      //text 5
      doc
        .fontSize(8)
        .font('Arial Bold')
        .text('QUINTO: REMUNERACION', { underline: true, align: 'left' })
        .moveDown(1);

      //parrafo 5.1
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('5.1       ', { continued: true, align: 'justify' })
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text(
          'recibíra por la prestación  integra y oportuna de sus servicios, una renumeración brutal mensual ',
        )
        .font('Arial Normal')
        .text('            ', { continued: true, align: 'justify' })
        .font('Arial Bold')
        .text(`${formatCurrency(Number(data.salary))} `, { continued: true })
        .font('Arial Bold')
        .text(`${data.salaryInWords} `, { continued: true })
        .font('Arial Normal')
        .text(
          'más la asignación familiar correspondiente de ser el caso, de la cual se',
        )
        .font('Arial Normal')
        .text('            ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text(
          'deducirán las aportaciones y descuentos por tributos establecidos en la ley que resulten aplicables.',
        )
        .moveDown(0.5);

      // parrafo 5.2
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('5.2       ', { continued: true })
        .font('Arial Normal')
        .text('Adicionalmente, ', { continued: true })
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text(
          'tendrá derecho al pago de beneficios tales como las gratificaciones legales en los ',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'meses de julio y diciembre, de acuerdo a la legislación laboral vigente y sus respectivas modificaciones, al convenio ',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('celebrado o a las que ', { continued: true })
        .font('Arial Bold')
        .text('EL EMPLEADOR, ', { continued: true })
        .font('Arial Normal')
        .text('a título de liberalidad, le otorgue.')
        .moveDown(0.5);
      //parrafo 5.3
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('5.3       ', { continued: true, align: 'justify' })
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text(
          'declara conocer que por sus horas de labor no le alcanza el derecho a la protección contra el despido ',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('arbitrario y a la compensación por tiempo de servicios.')
        .moveDown(0.5);
      //parrafo 5.4
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('5.4       ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text('Será de cargo de ', { continued: true })
        .font('Arial Bold')
        .text('EL TRABAJADOR', { continued: true })
        .font('Arial Normal')
        .text(
          ' el pago del Impuesto a la Renta, los aportes al Sistema Nacional o Privado de ',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('Pensiones, las que en caso corresponda serán retenidas por ', {
          continued: true,
        })
        .font('Arial Bold')
        .text('EL EMPLEADOR, ', { continued: true })
        .font('Arial Normal')
        .text('así como cualquier otro tributo o carga')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'social que grave las remuneraciones del personal dependiente en el país.',
        )
        .moveDown(0.5);
      //parrafo 5.5
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('5.5       ', { continued: true })
        .font('Arial Normal')
        .text(
          'Ambas partes acuerdan que la forma y fecha de pago de la remuneración podrá ser modificada por ',
          { continued: true },
        )
        .font('Arial Bold')
        .text('EL EMPLEADOR')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('de acuerdo con sus necesidades operativas')
        .moveDown(1);

      // Título Nro 6
      doc
        .fontSize(8)
        .font('Arial Bold')
        .text('SEXTO: PRINCIPALES OBLIGACIONES DE EL TRABAJADOR', {
          align: 'left',
          underline: true,
        })
        .moveDown(1);

      //descripción
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('Por medio del presente documento, ', {
          continued: true,
          align: 'justify',
        })
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text('se obliga, referencialmente a:')
        .moveDown(0.5);
      // Párrafo 6.1
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('6.1       ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text(
          'Prestar sus servicios, cumpliendo con las funciones, órdenes e instrucciones que imparta o señale ',
          { continued: true },
        )
        .font('Arial Bold')
        .text('EL EMPLEADOR ', { continued: true })
        .font('Arial Normal')
        .text('o')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'sus representantes, para realizar las actividades que correspondan a su cargo.',
        )
        .moveDown(0.5);
      // Párrafo 6.2
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('6.2       ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text(
          'La prestación laboral deberá ser efectuada de manera personal, no pudiendo ',
          { continued: true },
        )
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text('ser reemplazado ni ')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('asistido por terceros, debiendo ', { continued: true })
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text(
          'cumplir con las funciones inherentes al puesto encomendado y las ',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'labores adicionales y/o anexas que fuese necesario ejecutar y sean requeridas y/o determinadas por ',
          { continued: true },
        )
        .font('Arial Bold')
        .text('EL EMPLEADOR.')
        .moveDown(0.5);

      // Párrafo 6.3
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('6.3       ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text(
          'Prestar sus servicios con responsabilidad, prontitud, esmero y eficiencia, aportando su conocimiento y experiencia',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'profesional en el cumplimiento de los objetivos y estrategias de ',
          { continued: true },
        )
        .font('Arial Bold')
        .text('EL EMPLEADOR.')
        .moveDown(0.5);

      //Parrafo 6.4
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('6.4       ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text(
          'Cumplir estrictamente la legislación peruana en materia laboral, el Reglamento Interno de Trabajo, el Reglamento',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'de Seguridad y Salud en el Trabajo, el Reglamento de Hostigamiento Sexual y demás disposiciones, directivas, circulares,',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('reglamentos, normas, etc., que expida ', {
          continued: true,
        })
        .font('Arial Bold')
        .text('EL EMPLEADOR ', { continued: true })
        .font('Arial Normal')
        .text('declarando conocer todas aquellas que se encuentren vigentes.')
        .moveDown(0.5);
      //parrafor 6.5
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('6.5       ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text(
          'No ejecutar por su cuenta o en su beneficio, sea en forma directa o indirecta, actividad o negociaciones dentro del giro de',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Bold')
        .text('EL EMPLEADOR, ', { continued: true })
        .font('Arial Normal')
        .text(
          'en cualquier forma o naturaleza, inclusive fuera de la jornada de trabajo y en días inhábiles o',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('festivos. ', { continued: true })
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text(
          'declara entender que el incumplimiento a lo antes mencionado constituye una infracción',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'de los deberes esenciales que emanan de su vínculo laboral, por lo que en el caso de no cumplir con su compromiso,',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('tal acto será considerado como una falta grave.')
        .moveDown(0.5);

      //parrafor 6.6
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('6.6       ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text(
          'Devolver en forma inmediata todos los materiales (documentos, informes, bienes, herramientas, vestimenta, etc.) que',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'se le entreguen con ocasión del trabajo prestado si la relación laboral concluyese por cualquier causa.',
        )
        .moveDown(0.5);
      //parrafo 6.7
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('6.7       ', { continued: true, align: 'justify' })
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text(
          'se obliga a respetar los procedimientos de evaluación de rendimiento y desempeño laboral que',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('establecido ', { continued: true })
        .font('Arial Bold')
        .text('EL EMPLEADOR, ', { continued: true })
        .font('Arial Normal')
        .text(
          'tiene con el objeto de valorar el nivel de eficiencia logrado por ',
          {
            continued: true,
          },
        )
        .font('Arial Bold')
        .text('EL TRABAJADOR ')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('en su puesto de trabajo.')
        .moveDown(0.5);
      //parrago 6.8
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('6.8       ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text(
          'Cualquier otra obligación prevista en este contrato, establecida por ',
          { continued: true },
        )
        .font('Arial Bold')
        .text('EL EMPLEADOR, ', { continued: true })
        .font('Arial Normal')
        .text('que se desprenda de su')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'condición de trabajador y aquellas previstas en las normas que resulten aplicables.',
        )
        .moveDown(1);

      // Título Nro 7
      doc
        .fontSize(8)
        .font('Arial Bold')
        .text('SÉTIMO: OBLIGACIONES DEL EMPLEADOR ', {
          align: 'left',
          underline: true,
        })
        .moveDown(1);
      //parrafo 7.1
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('7.1       ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text('Pagar a ', { continued: true })
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text(
          'todos los derechos y beneficios que le correspondan de acuerdo a lo dispuesto en la',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('legislación laboral vigente al momento del pago.')
        .moveDown(0.5);

      //parrafo 7.2
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('7.2       ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text('Registrar los pagos realizados a ', { continued: true })
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text(
          'en el Libro de Planillas de Remuneraciones de la Empresa y hacer',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('entrega oportuna de la boleta de pago.')
        .moveDown(0.5);
      //parrafo 7.3
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('7.3       ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text(
          'Poner en conocimiento de la Autoridad Administrativa de Trabajo el presente Contrato, para su conocimiento y registro,',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'en cumplimiento de lo dispuesto en el Texto Único Ordenado del Decreto Legislativo Nº 728 (Decreto Supremo Nº',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('003-97-TR, Ley de Productividad y Competitividad Laboral).')
        .moveDown(0.5);
      //parrafo 7.4
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('7.4       ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text('Retener de la remuneración bruta mensual de ', {
          continued: true,
        })
        .font('Arial Bold')
        .text('EL TRABAJADOR, ', { continued: true })
        .font('Arial Normal')
        .text('las sumas correspondientes al aporte')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'al Seguro Privado o Público de Pensiones, así como el Impuesto a la Renta.',
        )
        .moveDown(0.5);
      //parrafo 7.5
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('7.5       ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text(
          'Las otras contenidas en la legislación laboral vigente y en cualquier norma de carácter interno, incluyendo el',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'Reglamento Interno de Trabajo, el Reglamento de Seguridad y Salud en el Trabajo y el Reglamento de Hostigamiento',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('Sexual.')
        .moveDown(1);

      doc
        .fontSize(8)
        .font('Arial Bold')
        .text('OCTAVO: DECLARACIONES DE LAS PARTES ', {
          underline: true,
          align: 'left',
        })
        .moveDown(1);

      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('Las partes reconocen, acuerdan y declaran lo siguiente:')
        .moveDown(0.5);
      //parrafo 8.1
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('8.1       ', { continued: true, align: 'justify' })
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text(
          ' se encuentra sujeto al régimen laboral de la actividad privada y le son aplicables los derechos y',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('beneficios previstos en él.')
        .moveDown(0.5);
      //parrafo 8.2
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('8.2       ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text(
          'De acuerdo a la facultad establecida en el párrafo segundo del artículo 9 del Texto Único Ordenado de la Ley de',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('Productividad y Competitividad Laboral, ', {
          continued: true,
        })
        .font('Arial Bold')
        .text('EL EMPLEADOR ', { continued: true })
        .font('Arial Normal')
        .text('se reserva la facultad de modificar en lugar de la prestación')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'de los servicios, de acuerdo a las necesidades del negocio y observando el criterio de razonabilidad.',
        )
        .moveDown(0.5);
      //parrafo 8.3
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('8.3       ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text(
          'Sin perjuicio de las labores para las cuales ha sido contratado, las partes declaran que ',
          { continued: true },
        )
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text('prestará')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'todas aquellas actividades conexas o complementarias a las propias del cargo que ocupará, que razonablemente',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('correspondan.')
        .moveDown(0.5);
      //parrafo 8.4
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('8.4       ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text('Las partes convienen que ', { continued: true })
        .font('Arial Bold')
        .text('EL EMPLEADOR ', { continued: true })
        .font('Arial Normal')
        .text(
          'tiene facultades para organizar, fiscalizar, suprimir, modificar, reemplazar y',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'sancionar, de modo radical o no sustancial, la prestación  de servicios (tiempo, lugar, forma, funciones y modalidad) de',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Bold')
        .text('EL TRABAJADOR.')
        .moveDown(0.5);

      //parrafo 8.5
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('8.5       ', { continued: true, align: 'justify' })
        .font('Arial Bold')
        .text('EL TRABAJADOR y EL EMPLEDOR ', { continued: true })
        .font('Arial Normal')
        .text(
          'acuerdan que las Boletas de Pago de remuneraciones podrán ser selladas y',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('firmadas por el (los) representante (s) legal (es) de ', {
          continued: true,
        })
        .font('Arial Bold')
        .text('EL EMPLEADOR ', { continued: true })
        .font('Arial Normal')
        .text('con firma (s) digitalizada (s), una vez que la (s)')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'firma (s) sea (n) inscrita (s) en el Registro de Firmas a cargo del Ministerio de Trabajado que se implementará una vez ',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'que se aprueben las disposiciones para la implementación del registro de firmas. Al respecto, ',
          { continued: true },
        )
        .font('Arial Bold')
        .text('EL TRABAJADOR ')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'presta su consentimiento expreso para que su (s) Boleta (s) de Pago sea (n) suscritas por el (los) representante (s)',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('de ', { continued: true })
        .font('Arial Bold')
        .text('EL EMPLEADOR ', { continued: true })
        .font('Arial Normal')
        .text(
          'a través de firma (s) digital (es), una vez que ello sea implementado por el Ministerio de Trabajo.',
        )
        .moveDown(0.5);
      //parrafo 8.6
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('8.6       ', { continued: true, align: 'justify' })
        .font('Arial Bold')
        .text('EL TRABAJADOR y EL EMPLEADOR ', { continued: true })
        .font('Arial Normal')
        .text(
          'acuerdan que la entrega de la Boleta de Pago y demás documentos derivados',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'de la relación laboral podrán efectuarse a través del empleo de tecnologías de la información y comunicación, tales',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'como Intranet, Correo Electrónico u otro de similar naturaleza que implemente ',
          { continued: true },
        )
        .font('Arial Bold')
        .text('EL EMPLEADOR ', { continued: true })
        .font('Arial Normal')
        .text('prestando ', { continued: true })
        .font('Arial Bold')
        .text('EL', { align: 'justify' })
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Bold')
        .text('TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text('su consentimiento expreso para ello. Asimismo, ', {
          continued: true,
        })
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text('declara como su dirección')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Bold')
        .font('Arial Normal')
        .text('electrónica ', { continued: true })
        .font('Arial Bold')
        .text(`${data.email} `, { continued: true })
        .font('Arial Normal')
        .text(
          'en caso se implemente la entrega de Boletas de Pago, a través de',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('dicho medio; obligándose ', { continued: true })
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text('a informar por escrito a ', { continued: true })
        .font('Arial Bold')
        .text('EL EMPLEADOR ', { continued: true })
        .font('Arial Normal')
        .text('cualquier cambio de su')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('dirección electrónica.')
        .moveDown(1);

      //text 9
      doc
        .fontSize(8)
        .font('Arial Bold')
        .text('NOVENO: TÉRMINO DEL CONTRATO', {
          underline: true,
          align: 'left',
        })
        .moveDown(1);

      //parrago 9.1
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('9.1       ', { continued: true, align: 'justify' })
        .font('Arial Bold')
        .text('EL EMPLEADOR y/o EL TRABAJADOR, ', { continued: true })
        .font('Arial Normal')
        .text(
          'según corresponda podrán dar por terminado el presente contrato, sin',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'expresión de causa, bastando para ello la comunicación previa a la otra parte con una anticipación de 05 (cinco) días',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('calendarios. ')
        .moveDown(0.5);
      //parrafo 9.2
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('9.2       ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text(
          'Además, son causales de resolución del presente contrato las siguientes:',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('a)         ', { continued: true })
        .font('Arial Normal')
        .text('La voluntad concertada de las partes')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('b)         ', { continued: true })
        .font('Arial Normal')
        .text(
          'El incumplimiento de las obligaciones estipuladas en el presente documento. ',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('c)         ', { continued: true })
        .font('Arial Normal')
        .text('La comisión de falta grave por parte de ', { continued: true })
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text(' prevista en las normas que resulten aplicables.')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('d)         ', { continued: true })
        .font('Arial Normal')
        .text(
          'Cualquier otra causal prevista en este contrato o que se encuentre establecida en las normas aplicables. ',
        )
        .moveDown(2);
      //texto 10
      doc
        .fontSize(8)
        .font('Arial Bold')
        .text('DÉCIMO: PROPIEDAD INTELECTUAL', {
          underline: true,
          align: 'left',
        })
        .moveDown(1);
      //parrafo 10.1
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('10.1     ', { continued: true, align: 'justify' })
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text('cede y transfiere a ', { continued: true })
        .font('Arial Bold')
        .text('EL EMPLEADOR ', { continued: true })
        .font('Arial Normal')
        .text('en forma total, íntegra y exclusiva, los derechos patrimoniales')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'derivados de los trabajos e informes que sean realizados en  cumplimiento del presente contrato, quedando',
          { continued: true },
        )
        .font('Arial Bold')
        .text(' EL')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Bold')
        .text('TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text(
          'facultado para publicar o reproducir en forma íntegra o parcial dicha información.',
        )
        .moveDown(0.5);
      //parrafo 10.2
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('10.2     ', { continued: true, align: 'justify' })
        .font('Arial Bold')
        .text('EL TRABAJADOR, ', { continued: true })
        .font('Arial Normal')
        .text('en virtud del presente contrato laboral, cede en exclusiva a ', {
          continued: true,
        })
        .font('Arial Bold')
        .text('EL EMPLEADOR ', { continued: true })
        .font('Arial Normal')
        .text('todos los derechos')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'alienables sobre las creaciones de propiedad intelectual de las obras que sean creadas por él en el ejercicio de sus',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('funciones y cumplimiento de sus obligaciones.')
        .moveDown(0.5);
      //parrafo 10.3
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('10.3     ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text(
          'Por lo tanto, toda información creada u originada es de propiedad exclusiva de ',
          { continued: true },
        )
        .font('Arial Bold')
        .text('EL EMPLEADOR, ', { continued: true })
        .font('Arial Normal')
        .text('quedando')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text(
          'prohibido de reproducirla, venderla o suministrarla a cualquier persona natural o jurídica, salvo',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('autorización escrita de ', { continued: true })
        .font('Arial Bold')
        .text('EL EMPLEADOR. ', { continued: true })
        .font('Arial Normal')
        .text('Se deja constancia que la información comprende inclusive las')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('investigaciones, los borradores y los trabajos preliminares. ')
        .moveDown(0.5);
      //parrafo 10.4
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('10.4     ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text('En ese sentido, ', { continued: true })
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text('acepta que ', { continued: true })
        .font('Arial Bold')
        .text('EL EMPLEADOR ', { continued: true })
        .font('Arial Normal')
        .text('tiene plenas facultades para acceder, revisar y leer,')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'sin previa notificación, el íntegro del contenido de la información que se encuentre en cualquiera de los medios y/o',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('herramientas proporcionados por ', {
          continued: true,
        })
        .font('Arial Bold')
        .text('EL EMPLEADOR a EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text('para el cumplimiento de sus funciones.')
        .moveDown(0.5);
      //parrafo 10.5
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('10.5     ', { continued: true, align: 'justify' })
        .font('Arial Bold')
        .text('EL TRABAJADOR', { continued: true })
        .font('Arial Normal')
        .text(
          'declara que la remuneración acordada en el presente contrato comprende cualquier compensación',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'correspondiente a los compromisos asumidos en la presente cláusula.',
        )
        .moveDown(1);

      //TEXTO 11
      doc
        .fontSize(8)
        .font('Arial Bold')
        .text('DÉCIMO PRIMERO: USO DE CORREO ELECTRÓNICO', {
          underline: true,
          align: 'left',
        })
        .moveDown(1);
      //parrafo 11.1
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('11.1     ', { continued: true, align: 'left' })
        .font('Arial Bold')
        .text('EL EMPLEADOR ', { continued: true })
        .font('Arial Normal')
        .text(
          'facilitará a EL TRABAJADOR un nombre de usuario y una contraseña dentro del dominio:',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('@apparka.pe y/o cualquier dominio que pueda crear a futuro.')
        .moveDown(0.5);
      //parrafor 11.2
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('11.2     ', { continued: true, align: 'left' })
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text(
          'no podrá revelar su contraseña a otro personal o algún tercero, siendo plenamente responsable',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('por el uso de dicha herramienta de trabajo.', {
          continued: true,
        })
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text('reconoce y acepta que se encuentra prohibido el uso de')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'los recursos informáticos proporcionados por la empresa para fines particulares, no autorizado, tanto en horario laboral,',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('como fuera de él.')
        .moveDown(0.5);
      //Parrafor 11.3
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('11.3     ', { continued: true, align: 'left' })
        .font('Arial Normal')
        .text('En ese sentido, ', { continued: true })
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text('acepta que ', { continued: true })
        .font('Arial Bold')
        .text('LA EMPRESA ', { continued: true })
        .font('Arial Normal')
        .text('tiene plenas facultades para revisar y leer, sin previa')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'notificación, el contenido de la información almacenada, enviada o recibida mediante el uso de los sistemas de correo',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'electrónico. Al respecto, mediante la suscripción del presente contrato, se otorga a ',
          { continued: true },
        )
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text('copia de la')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          '“Política para el uso del correo electrónico y páginas web”, debiendo cumplir con los establecido en la misma, bajo',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('responsabilidad.')
        .moveDown(1);
      //texto 12
      doc
        .fontSize(8)
        .font('Arial Bold')
        .text('DÉCIMO SEGUNDA: EXCLUSIVIDAD', {
          underline: true,
          align: 'left',
        })
        .moveDown(1);
      //parrafo 12.1
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('12.1     ', { continued: true, align: 'justify' })
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text('es contratado de forma exclusiva por', { continued: true })
        .font('Arial Bold')
        .text('EL EMPLEADOR, ', { continued: true })
        .font('Arial Normal')
        .text('por lo que no podrá dedicarse a')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'otra actividad distinta de la que emana del presente contrato, salvo autorización previa, expresa y por escrito de',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Bold')
        .text('EL EMPLEADOR.')
        .moveDown(1);
      //text 13
      doc
        .fontSize(8)
        .font('Arial Bold')
        .text('DÉCIMO TERCERA: NO COMPETENCIA', {
          underline: true,
          align: 'left',
        })
        .moveDown(1);

      //parrafo 13.1
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('13.1     ', { continued: true, align: 'justify' })
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text('se compromete a no competir con ', { continued: true })
        .font('Arial Bold')
        .text('EL EMPLEADOR, ', { continued: true })
        .font('Arial Normal')
        .text('en los términos y condiciones que se')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('acuerdan a continuación:')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('a.        ', { continued: true })
        .font('Arial Normal')
        .text(
          'A no realizar ningún tipo de inversión en empresas o instituciones de cualquier tipo cuyas actividades puedan',
        )
        .font('Arial Normal')
        .text('                       ', { continued: true })
        .font('Arial Normal')
        .text('estar en conflicto con los intereses de ', {
          continued: true,
        })
        .font('Arial Bold')
        .text('EL EMPLEADOR.')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('b.        ', { continued: true })
        .font('Arial Normal')
        .text(
          'A no prestar servicios en forma dependiente o independiente para personas, instituciones o empresas que',
        )
        .font('Arial Normal')
        .text('                       ', { continued: true })
        .font('Arial Normal')
        .text('compiten, directa o indirectamente, con', {
          continued: true,
        })
        .font('Arial Bold')
        .text('EL EMPLEADOR.')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('c.        ', { continued: true })
        .font('Arial Normal')
        .text(
          'A no utilizar la información de carácter reservado que le fue proporcionada por ',
          { continued: true },
        )
        .font('Arial Bold')
        .text('EL EMPLEADOR ', { continued: true })
        .font('Arial Normal')
        .text('para')
        .font('Arial Normal')
        .text('                       ', { continued: true })
        .font('Arial Normal')
        .text(
          'desarrollar por cuenta propia o de terceros, actividades que compitan con las que realiza o planeara realizar',
        )
        .font('Arial Normal')
        .text('                       ', { continued: true })
        .font('Arial Bold')
        .text('EL EMPLEADOR.')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('d.        ', { continued: true })
        .font('Arial Normal')
        .text(
          'A no inducir o intentar influenciar, ni directa ni indirectamente, a ningún trabajador de ',
          { continued: true },
        )
        .font('Arial Bold')
        .text('EL EMPLEADOR ', { continued: true })
        .font('Arial Normal')
        .text('a que')
        .font('Arial Normal')
        .text('                       ', { continued: true })
        .font('Arial Normal')
        .text(
          'termine su empleo con el mismo, para que trabaje, dependiente o independientemente, para ',
          { continued: true },
        )
        .font('Arial Bold')
        .text('EL TRABAJADOR')
        .font('Arial Normal')
        .text('                       ', { continued: true })
        .font('Arial Normal')
        .text(
          'o para cualquier otra persona, entidad, institución o empresa, que compita con ',
          { continued: true },
        )
        .font('Arial Bold')
        .text('EL EMPLEADOR.')
        .moveDown(0.5);
      //parrafo 13.2
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('13.2     ', { continued: true })
        .font('Arial Normal')
        .text('Las obligaciones que ', { continued: true })
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text(
          'asume en virtud al literal c) de la presente cláusula, regirán indefinidamente, ',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('independientemente de la vigencia del presente contrato.')
        .moveDown(0.5);
      //parrafo 13.3
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('13.3     ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text('El incumplimiento por parte de ', { continued: true })
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text('de cualquiera de las obligaciones contenidas en la presente ')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('cláusula, facultará a ', { continued: true })
        .font('Arial Bold')
        .text('EL EMPLEADOR ', { continued: true })
        .font('Arial Normal')
        .text(
          'a iniciar las acciones legales que pudieran corresponder en defensa de sus',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'derechos y a obtener la indemnización por daños y perjuicios a que hubiera lugar.',
        )
        .moveDown(0.5);
      //parrafo 13.4
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('13.4     ', { continued: true })
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text(
          'declara que la remuneración acordada en la cláusula sétima comprende cualquier compensación',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'correspondiente a los compromisos asumidos en la presente cláusula.',
        )
        .moveDown(1);

      //texto 14
      doc
        .fontSize(8)
        .font('Arial Bold')
        .text('DÉCIMO CUARTO: RESERVA Y CONFIDENCIALIDAD', {
          underline: true,
          align: 'left',
        })
        .moveDown(1);
      //parrafo 14.1
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('14.1     ', { continued: true, align: 'justify' })
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text(
          'se compromete a mantener reserva y confidencialidad absoluta con relación a la información y',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('documentación obtenida con ocasión de su trabajo para ', {
          continued: true,
        })
        .font('Arial Bold')
        .text('EL EMPLEADOR, ', { continued: true })
        .font('Arial Normal')
        .text('en los términos y condiciones que se')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('acuerdan a continuación:')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('a.        ', { continued: true })
        .font('Arial Normal')
        .text(
          'A observar ante cualquier persona, entidad o empresa una discreción absoluta sobre cualquier actividad o',
        )
        .font('Arial Normal')
        .text('                       ', { continued: true })
        .font('Arial Normal')
        .text('información sobre ', { continued: true })
        .font('Arial Bold')
        .text('EL EMPLEADOR ', { continued: true })
        .font('Arial Normal')
        .text(
          'y/o sus representantes, a las que hubiera tenido acceso con motivo',
        )
        .font('Arial Normal')
        .text('                       ', { continued: true })
        .font('Arial Normal')
        .text('de la prestación de sus servicios para ', { continued: true })
        .font('Arial Bold')
        .text('EL EMPLEADOR.')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('b.        ', { continued: true })
        .font('Arial Normal')
        .text(
          'A no revelar a ninguna persona, entidad o empresa, ni usar para ningún propósito, en provecho propio o de',
        )
        .font('Arial Normal')
        .text('                       ', { continued: true })
        .font('Arial Normal')
        .text('terceros, cualquier información vinculada a ', {
          continued: true,
        })
        .font('Arial Bold')
        .text('EL EMPLEADOR ', { continued: true })
        .font('Arial Normal')
        .text('de cualquier naturaleza.')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('c.        ', { continued: true })
        .font('Arial Normal')
        .text('A no revelar a ninguna persona que preste servicios a ', {
          continued: true,
        })
        .font('Arial Bold')
        .text('EL EMPLEADOR, ', { continued: true })
        .font('Arial Normal')
        .text('ningún tipo de información')
        .font('Arial Normal')
        .text('                       ', { continued: true })
        .font('Arial Normal')
        .text('confidencial o de propiedad de ', { continued: true })
        .font('Arial Bold')
        .text('EL EMPLEADOR, ', { continued: true })
        .font('Arial Normal')
        .text('salvo que dicha persona necesite conocer tal información')
        .font('Arial Normal')
        .text('                       ', { continued: true })
        .font('Arial Normal')
        .text(
          'por razón de sus funciones. Si hubiese cualquier duda sobre lo que constituye información confidencial, o sobre',
        )
        .font('Arial Normal')
        .text('                       ', { continued: true })
        .font('Arial Normal')
        .text('si la información debe ser revelada y a quién, ', {
          continued: true,
        })
        .font('Arial Bold')
        .text('EL TRABAJADOR, ', { continued: true })
        .font('Arial Normal')
        .text('se obliga a solicitar autorización de sus')
        .font('Arial Normal')
        .text('                       ', { continued: true })
        .font('Arial Normal')
        .text('superiores.')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('d.        ', { continued: true })
        .font('Arial Normal')
        .text(
          'A no usar de forma inapropiada ni revelar información confidencial alguna o de propiedad de la persona, entidad',
        )
        .font('Arial Normal')
        .text('                       ', { continued: true })
        .font('Arial Normal')
        .text(
          'o empresa para la cual laboró con anterioridad a ser contratado por ',
          { continued: true },
        )
        .font('Arial Bold')
        .text('EL EMPLEADOR, ', { continued: true })
        .font('Arial Normal')
        .text('así como a no introducir')
        .font('Arial Normal')
        .text('                       ', { continued: true })
        .font('Arial Normal')
        .text('en las instalaciones de ', {
          continued: true,
        })
        .font('Arial Bold')
        .text('EL EMPLEADOR, ', { continued: true })
        .font('Arial Normal')
        .text('ningún documento que no haya sido publicado ni ninguna clase de')
        .font('Arial Normal')
        .text('                       ', { continued: true })
        .font('Arial Normal')
        .text(
          'bien que pertenezca a cualquiera de dichas personas, entidades o empresas,  sin su consentimiento previo.',
          { continued: true },
        )
        .font('Arial Bold')
        .text('EL')
        .font('Arial Normal')
        .text('                       ', { continued: true })
        .font('Arial Bold')
        .text('TRABAJADOR', { continued: true })
        .font('Arial Normal')
        .text(
          'se obliga igualmente a no violar ningún convenio de confidencialidad o sobre  derechos de',
        )
        .font('Arial Normal')
        .text('                       ', { continued: true })
        .font('Arial Normal')
        .text(
          'propiedad que haya firmado en conexión con tales personas, entidades o empresas.',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('d.        ', { continued: true })
        .font('Arial Normal')
        .text('A devolver a ', { continued: true })
        .font('Arial Bold')
        .text('EL EMPLEADOR, ', { continued: true })
        .font('Arial Normal')
        .text(
          'al concluir su prestación de servicios, sea cual fuere la causa, archivos,',
        )
        .font('Arial Normal')
        .text('                       ', { continued: true })
        .font('Arial Normal')
        .text(
          'correspondencia, registros o cualquier documento o material contenido o fijado en cualquier medio o soporte,',
        )
        .font('Arial Normal')
        .text('                       ', { continued: true })
        .font('Arial Normal')
        .text(
          'que se le hubiese proporcionado o que hubiesen sido creados en virtud de su relación de trabajo (incluyendo',
        )
        .font('Arial Normal')
        .text('                       ', { continued: true })
        .font('Arial Normal')
        .text(
          'copias de los mismos), así como todo bien que se le hubiese entregado, incluyendo (sin limitación) todo',
        )
        .font('Arial Normal')
        .text('                       ', { continued: true })
        .font('Arial Normal')
        .text(
          'distintivo de identificación, tarjetas de ingreso, uniforme, herramientas de trabajo y cualquier otro material',
        )
        .font('Arial Normal')
        .text('                       ', { continued: true })
        .font('Arial Normal')
        .text('otorgado.')
        .moveDown(0.5);
      //parrafor 14.2

      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('14.1     ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .font('');
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

      const startDate = data.entryDate
        ? format(new Date(data.entryDate), 'dd/MM/yyyy')
        : '';
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
  private async generatePartTimeContract(data: EmployeeData): Promise<Buffer> {
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

      const startDate = data.entryDate
        ? format(new Date(data.entryDate), 'dd/MM/yyyy')
        : '';
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
