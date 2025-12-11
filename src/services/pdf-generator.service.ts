import PDFDocument from 'pdfkit';
import { logger } from '../validators/logger';
import { format } from 'date-fns';
import { EmployeeData } from '../types/employees.types';
import path from 'path';
import { formatCurrency } from '../utils/formatCurrency';
import { generatePlanillaContract } from '../template/contracts';

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
          buffer = await generatePlanillaContract(employeeData);
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

      const filename = `${employeeData.dni}.pdf`;

      logger.info({ filename }, '✅ Contrato PDF generado exitosamente');

      return { buffer, filename };
    } catch (error) {
      logger.error({ error, dni: employeeData.dni }, '❌ Error generando PDF');
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
  private async generatePlanillaContract(data: EmployeeData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4' });
      doc.page.margins.top = 30.12; // 2.05 cm
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
        );
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
        .text('contratar personal que desempeñará labores a tiempo parcial.');

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
        );
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
        .text('por un plazo indeterminado.');

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
        );

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
        .text('a título de liberalidad, le otorgue.');
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
        .text('arbitrario y a la compensación por tiempo de servicios.');
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
        );
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
        .text('se obliga, referencialmente a:');
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
        .text('declarando conocer todas aquellas que se encuentren vigentes.');
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
        .text('tal acto será considerado como una falta grave.');

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
        );
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
        .text('en su puesto de trabajo.');
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
        .text('legislación laboral vigente al momento del pago.');

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
        .text('entrega oportuna de la boleta de pago.');
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
        .text('003-97-TR, Ley de Productividad y Competitividad Laboral).');
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
        );
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
        .text('Las partes reconocen, acuerdan y declaran lo siguiente:');
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
        .text('beneficios previstos en él.');
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
        );
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
        .text('correspondan.');
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
        .text('EL TRABAJADOR.');

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
        );
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
        .text('calendarios. ');
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
        .moveDown(1);
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
        .text('funciones y cumplimiento de sus obligaciones.');

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
        .text('@apparka.pe y/o cualquier dominio que pueda crear a futuro.');
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
        .text('como fuera de él.');
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
        .text('EL EMPLEADOR.');
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
        .text('independientemente de la vigencia del presente contrato.');
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
        );
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
        .text('otorgado.');
      //parrafor 14.2

      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('14.1     ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text('Las obligaciones que ', { continued: true })
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text(
          'asume en los literales a), b), c) y d) de la presente cláusula, regirán',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'indefinidamente, independientemente de la vigencia del presente contrato.',
        );
      //parrafo 14.3
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('14.3     ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text('El incumplimiento por parte de ', { continued: true })
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text('de cualquiera de las obligaciones contenidas en la presente')
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
        );
      //parrafo 14.4
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('14.4     ', { continued: true, align: 'justify' })
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text(
          'declara que la remuneración acordada en la cláusula tercera comprende cualquier compensación',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'correspondiente a los compromisos asumidos en la presente cláusula.',
        )
        .moveDown(1);

      //texto 15
      doc
        .fontSize(8)
        .font('Arial Bold')
        .text(
          'DÉCIMO QUINTA: SEGURIDAD Y CONFIDENCIALIDAD EN EL TRATAMIENTO DE DATOS PERSONALES ',
          {
            underline: true,
            align: 'left',
          },
        )
        .moveDown(1);

      //parrafo 15.1
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('15.1     ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text('En caso ', { continued: true })
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text(
          'accediera a datos personales de cualquier índole como consecuencia de desarrollo de sus',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'labores, éste deberá cumplir la normativa interna aprobada por ',
          { continued: true },
        )
        .font('Arial Bold')
        .text('INVERSIONES URBANÍSTICAS OPERADORA S.A.')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'referida a La Protección de Datos Personales, que incluye la Ley N° 29733, y su Reglamento, aprobado por el',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('Decreto Supremo N° 003-2013-JUS.')
        .moveDown(0.5);

      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('            ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text('En cualquier caso, corresponde a ', { continued: true })
        .font('Arial Bold')
        .text('INVERSIONES URBANÍSTICAS OPERADORA S.A. ', { continued: true })
        .font('Arial Normal')
        .text('decidir sobre la finalidad y ')
        .font('Arial Normal')
        .text('            ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text('contenido del tratamiento de datos personales, limitándose ', {
          continued: true,
        })
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text('a utilizar éstos única y exclusivamente')
        .font('Arial Normal')
        .text('            ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text(
          'para el cumplimiento de sus funciones y conforme a las indicaciones de ',
          { continued: true },
        )
        .font('Arial Bold')
        .text('INVERSIONES URBANÍSTICAS')
        .font('Arial Normal')
        .text('            ', { continued: true, align: 'justify' })
        .font('Arial Bold')
        .text('OPERADORA S.A.')
        .moveDown(0.5);
      //parrafo 15.2
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('15.2     ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text('De esta forma, ', { continued: true })
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text('queda obligado a:')
        .moveDown(0.5);
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('a.        ', { continued: true })
        .font('Arial Normal')
        .text(
          'Tratar, custodiar y proteger los datos personales a los que pudiese acceder como consecuencia del ejercicio de',
        )
        .font('Arial Normal')
        .text('                       ', { continued: true })
        .font('Arial Normal')
        .text(
          'sus funciones, cumpliendo con las medidas de índole jurídica, técnica y organizativas establecidas en la Ley',
        )
        .font('Arial Normal')
        .text('                       ', { continued: true })
        .font('Arial Normal')
        .text(
          'N° 29733, y su Reglamento, así como en la normativa interna de ',
          { continued: true },
        )
        .font('Arial Bold')
        .text('INVERSIONES URBANÍSTICAS')
        .font('Arial Normal')
        .text('                       ', { continued: true })
        .font('Arial Bold')
        .text('OPERADORA S.A..')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('b.        ', { continued: true })
        .font('Arial Normal')
        .text(
          'Utilizar o aplicar los datos personales, exclusivamente, para la realización de sus funciones y, en su caso, de',
        )
        .font('Arial Normal')
        .text('                       ', { continued: true })
        .font('Arial Normal')
        .text('acuerdo con las instrucciones impartidas por ', {
          continued: true,
        })
        .font('Arial Bold')
        .text('INVERSIONES URBANÍSTICAS OPERADORA S.A..')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('c.        ', { continued: true })
        .font('Arial Normal')
        .text(
          'Mantener el deber de secreto y confidencialidad de los datos personales de manera indefinida; es decir, durante',
        )
        .font('Arial Normal')
        .text('                       ', { continued: true })
        .font('Arial Normal')
        .text(
          'la vigencia del presente contrato, así como una vez concluido éste.',
        )
        .moveDown(0.5);
      //parrafo 15.3
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('15.3     ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text('El incumplimiento de ', {
          continued: true,
        })
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text(
          'respecto de sus obligaciones vinculadas al tratamiento de datos personales, ',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'constituye incumplimiento de obligaciones laborales que dará lugar a la imposición de sanciones disciplinarias,',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'sin perjuicio de las responsabilidades penales, civiles y administrativas que su incumplimiento genere.',
        )
        .moveDown(1);
      //text 16
      doc
        .fontSize(8)
        .font('Arial Bold')
        .text(
          'DÉCIMO SEXTA: CUMPLIMIENTO DE LAS NORMAS DE CONDUCTA ÉTICA, RESPONSABILIDAD ADMINISTRATIVA DE',
          {
            underline: true,
            align: 'left',
          },
        )
        .font('Arial Bold')
        .text(
          'LAS PERSONAS JURÍDICAS, PREVENCIÓN DE LAVADO DE ACTIVOS Y FINANCIAMIENTO DEL TERRORISMO Y NORMAS QUE',
          {
            underline: true,
            align: 'left',
          },
        )
        .moveDown(1);

      //parrafo 16.1
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('16.1     ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text(
          'Lo establecido en la presente cláusula seguirá las disposiciones contenidas en la normativa de Responsabilidad',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'Administrativa de las Personas Jurídicas, aprobada por la Ley N° 30424, con las modificaciones incorporadas por el',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'Decreto Legislativo N° 1352, Ley N° 31740 y la Ley 30835, y de las normas sobre Prevención del Lavado de Activos',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'y Financiamiento del Terrorismo, aprobadas por la Ley N° 27693, y su reglamento, aprobado por el Decreto Supremo',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'N° 018-2006-JUS (en adelante, PLAFT), así como el correcto cumplimiento de la legislación peruana vigente en ',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'general, incluyendo reglamentos, directivas, regulaciones, jurisprudencia vinculante, decisiones, decretos, órdenes,',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'instrumentos y cualquier otra medida legislativa o decisión con fuerza de ley en el Perú de obligatorio cumplimiento',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('para el EMPLEADOR o el TRABAJADOR o cualquiera de ellas.')
        .moveDown(0.5);
      //parrafo 16.2
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('16.2     ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text(
          'El TRABAJADOR declara que no ha incumplido las normas anticorrupción vigentes, ni ofrecido, pagado o',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'comprometido a pagar, autorizado el pago de cualquier dinero directa o indirectamente, u ofrecido, entregado o',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'comprometido a entregar, autorizado a entregar directa o indirectamente, cualquier objeto de valor, a cualquier',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'funcionario gubernamental o a cualquier persona que busque el beneficio de un funcionario gubernamental. Asimismo,',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'declara que no ha sido sancionado ni investigado por la comisión de los delitos de lavado de activos, financiamiento ',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'del terrorismo, corrupción de funcionarios, apropiación ilícita, fraude financiero, defraudación tributaria. EL',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'TRABAJADOR se compromete a no  incurrir en ninguno de los delitos mencionados ni ningún otro ilícito penal en el',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'desarrollo de sus labores, ni siquiera cuando sea o pueda ser en beneficio del EMPLEADOR.',
        )
        .moveDown(0.5);
      //PARRAFOR 16.3
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('16.3     ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text(
          'Asimismo, mediante Decreto Legislativo N° 1385 ha sido modificado el Código Penal, a fin de sancionar penalmente',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'los actos de corrupción cometidos entre privados que afectan el normal desarrollo de las relaciones comerciales',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('y la competencia leal entre empresas.')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'Al respecto, EL TRABAJADOR declara conocer que está impedido de, directa o indirectamente, aceptar, recibir o',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'solicitar donativo, promesa o cualquier otra ventaja o beneficio indebido de cualquier naturaleza, para sí o para un',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'tercero para realizar u omitir un acto que permita favorecer a otro en la adquisición o comercialización de bienes o',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'mercancías, en la contratación de servicios comerciales o en las relaciones comerciales de su EMPLEADOR. ',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'Asimismo, EL TRABAJADOR declara conocer que está impedido de, directa o indirectamente, prometer, ofrecer o',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'conceder a accionistas, gerentes, directores, administradores, representantes legales, apoderados, empleados o',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'asesores de una persona jurídica de derecho privado, organización no gubernamental, asociación, fundación, comité,',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'incluidos los entes no inscritos o sociedades irregulares, una ventaja o beneficio indebido de cualquier naturaleza, para',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'ellos o para un tercero, como contraprestación para realizar u omitir un acto que permita favorecer a éste u otro en la',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'comercialización o adquisición de bienes o mercancías, en la contratación de servicios comerciales o en las relaciones',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('comerciales de su EMPLEADOR.')
        .moveDown(0.5);

      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'Asimismo, EL TRABAJADOR declara conocer que está impedido de, directa o indirectamente, aceptar, recibir o',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'solicitar donativo, promesa o cualquier otra ventaja o beneficio indebido de cualquier naturaleza para sí o para un',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'tercero para realizar u omitir un acto en perjuicio de su EMPLEADOR. Asimismo, EL TRABAJADOR declara conocer',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'que está impedido de, directa o indirectamente, prometer, ofrecer o conceder a accionistas, gerentes, directores,',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'administradores, representantes legales, apoderados, empleados o asesores de una persona jurídica de derecho',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'privado, organización no gubernamental, asociación, fundación, comité, incluidos los entes no inscritos o sociedades',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'irregulares, una ventaja o beneficio indebido de cualquier naturaleza, para ellos o para un tercero, como',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'contraprestación para realizar u omitir realizar u omitir un acto en perjuicio de su EMPLEADOR.',
        )
        .moveDown(0.5);

      //PARRAFOR 16.4
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('16.4     ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text(
          'Las Partes acuerdan que, durante el periodo de vigencia del Contrato, estarán obligadas a actuar en estricto',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'cumplimiento de la legislación vigente, quedando completamente prohibido, bajo cualquier circunstancia, realizar',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('actos que impliquen la vulneración de la ley penal.')
        .moveDown(0.5);

      //PARRAFOR 16.5
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('16.5     ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text(
          'Adicionalmente, EL TRABAJADOR se compromete a no cometer delitos estipulados en la Ley N°31740, los cuales se',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('encuentran relacionadas con las siguientes leyes:')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('•         ', { continued: true })
        .font('Arial Normal')
        .text('DL N°1106: Lavado de Activos')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('•         ', { continued: true })
        .font('Arial Normal')
        .text('Ley N°25475: Terrorismo')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('•         ', { continued: true })
        .font('Arial Normal')
        .text('Código Penal Peruano: Fraude en las Personas Jurídicas')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('•         ', { continued: true })
        .font('Arial Normal')
        .text('Código Penal Peruano: Delitos Contra El Patrimonio Cultural')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('•         ', { continued: true })
        .font('Arial Normal')
        .text('Decreto Legislativo N°813: Ley Penal Tributaria')
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('•         ', { continued: true })
        .font('Arial Normal')
        .text('Ley N°28008: Delitos Aduaneros')
        .moveDown(1);
      //TEXTO 17

      doc
        .fontSize(8)
        .font('Arial Bold')
        .text('DÉCIMO SETIMA: VALIDEZ', {
          underline: true,
          align: 'left',
        })
        .moveDown(1);
      //parrafo 17.1

      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('17.1     ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text(
          'Las partes ratifican que el presente contrato constituye un acto jurídico válido que no se encuentra afectado por causal',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'de invalidez o ineficacia alguna y se presentará al Ministerio de Trabajo y Promoción del Empleo dentro de los primeros',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('quince (15) días de celebrado.')
        .moveDown(1);

      //TEXTO 18
      doc
        .fontSize(8)
        .font('Arial Bold')
        .text('DÉCIMO OCTAVA: DE LOS EXÁMENES MÉDICOS', {
          underline: true,
          align: 'left',
        })
        .moveDown(1);
      //parrafo 18.1
      doc
        .fontSize(8)
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text(
          'se someterá obligatoriamente a los exámenes médicos que dispongan',
          { continued: true, align: 'justify' },
        )
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text(
          'y/o la ley, con la finalidad de verificar si éste se encuentra apto para desarrollar los servicios y funciones propios de su cargo. En este sentido, ambas Partes declaran que la conservación de la salud de EL TRABAJADOR es motivo determinante de la relación contractual.',
          { align: 'justify' },
        )
        .moveDown(1);

      //TEXTO 19
      doc
        .fontSize(8)
        .font('Arial Bold')
        .text('DÉCIMO NOVENA:', {
          underline: true,
          align: 'left',
          continued: true,
        })
        .font('Arial Bold')
        .text(
          'DE LAS RECOMENDACIONES EN MATERIA DE SEGURIDAD Y SALUD EN EL TRABAJO',
          {
            underline: false,
            align: 'left',
          },
        )
        .moveDown(1);
      //PARRAFO 19.1
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text(
          'De conformidad con lo establecido en el artículo 35° de la Ley N° 29783 – Ley de Seguridad y Salud en el Trabajo y, en calidad de anexo al presente contrato ',
          { continued: true, align: 'justify' },
        )
        .font('Arial Bold')
        .text('(ANEXO – 1), ', { continued: true })
        .font('Arial Normal')
        .text(
          'se incorpora la descripción de las recomendaciones de seguridad y salud en el trabajo, las mismas que ',
          { continued: true, align: 'justify' },
        )
        .font('Arial Bold')
        .text('EL TRABAJADOR ', { continued: true })
        .font('Arial Normal')
        .text(
          'deberá seguir y tomar en consideración de forma rigurosa durante la prestación de sus servicios.',
          { align: 'justify' },
        )
        .moveDown(1);

      //TEXTO 19
      doc
        .fontSize(8)
        .font('Arial Bold')
        .text('VIGÉSIMA: DOMICILIO', {
          underline: true,
          align: 'left',
        })
        .moveDown(1);
      //parrafo 19.1
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('18.1     ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text(
          'Para todos los efectos legales del presente Contrato, las partes fijan como sus domicilios, los señalados en la',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('introducción de este contrato.');

      //parrafo 20.2
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('18.2     ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text(
          'Cualquier cambio de domicilio deberá ser comunicado por escrito a la otra parte, mediante comunicación escrita,de lo',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'contrario se entenderá que todas las notificaciones se han realizado válidamente. ',
        )
        .moveDown(1);

      //TEXTO 19
      doc
        .fontSize(8)
        .font('Arial Bold')
        .text('VIGÉSIMA PRIMERA: SOLUCIÓN DE DISPUTAS', {
          underline: true,
          align: 'left',
        })
        .moveDown(1);

      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('19.1     ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text(
          'En el improbable caso de que lleguen a existir discrepancias, controversias o reclamaciones derivadas de la validez,',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'alcance, interpretación o aplicación del presente contrato, las partes se comprometen a poner el mejor de sus con el',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('fin de lograr una solución armoniosa a sus diferencias.');

      //parrafo 19.2
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text('19.2     ', { continued: true, align: 'justify' })
        .font('Arial Normal')
        .text(
          'Si lo señalado en el párrafo anterior resulta infructuoso para resolver el conflicto surgido, las partes convienen',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text(
          'renunciar al fuero judicial de sus domicilios o centros de trabajo, y se someten a la jurisdicción de los jueces del Distrito',
        )
        .font('Arial Normal')
        .text('            ', { continued: true })
        .font('Arial Normal')
        .text('del Distrito Judicial de Lima - Cercado.')
        .moveDown(1);

      //texto 20
      doc
        .fontSize(8)
        .font('Arial Bold')
        .text('VIGÉSIMA SEGUNDA: APLICACIÓN SUPLETORIA', {
          underline: true,
          align: 'left',
        })
        .moveDown(1);
      //parrfo 20.1
      doc
        .fontSize(8)
        .font('Arial Normal')
        .text(
          'En todo lo no previsto por el presente contrato, el vínculo laboral se regirá por las disposiciones laborales vigentes que regulan a los contratos de trabajo sujetos a modalidad, contenidas actualmente en el Texto único Ordenado del Decreto Legislativo Nº 728(Decreto Supremo Nº 003-97-TR, Ley de Productividad y Competitividad Laboral) y su Reglamento y por las disposiciones complementarias o modificatorias que pudieran darse en el futuro.',
          { align: 'justify' },
        )
        .moveDown(0.5);

      doc
        .fontSize(8)
        .font('Arial Normal')
        .text(
          'En señal de conformidad, las partes suscriben dos (02) ejemplares del presente contrato en la ciudad de LIMA, el día 24 julio 2025, quedando un ejemplar en poder del empleador y otro en poder del trabajador, quien declara haber recibido una copia del contrato y estar de acuerdo con su contenido.',
          { align: 'justify' },
        )
        .moveDown(8);

      // Firmas - Tres columnas en una sola línea
      const pageWidth = doc.page.width;
      const marginLeft = doc.page.margins.left;
      const marginRight = doc.page.margins.right;
      const availableWidth = pageWidth - marginLeft - marginRight;
      const columnWidth = availableWidth / 3;

      // Reducir el espacio antes de las firmas
      const signatureY = doc.y + 5; // Reducido de 40 a 20

      // Configuración de líneas
      const lineWidth = 150;
      const lineY = signatureY;

      // Posiciones X para cada columna
      const col1X = marginLeft;
      const col2X = marginLeft + columnWidth;
      const col3X = marginLeft + 2 * columnWidth;
      // Configuración de imágenes
      const imageWidth = 120;
      const imageHeight = 60;
      const imageY = lineY - imageHeight - 5; // Imagen arriba de la línea

      //obtener imagen con path
      const imagen1 = path.join(__dirname, '../assets/firma-empleador.png');
      // Agregar imagen de firma si existe
      try {
        doc.image(imagen1, col1X + 25, imageY, {
          width: imageWidth,
          height: imageHeight,
          fit: [imageWidth, imageHeight],
          align: 'center',
        });
      } catch (error) {
        // Si no hay imagen, solo mostrar línea
        console.info('No hay imagen de firma para empleador 1');
      }
      // COLUMNA 1 - EL EMPLEADOR
      doc
        .moveTo(col1X, lineY)
        .lineTo(col1X + lineWidth, lineY)
        .stroke();
      doc
        .fontSize(7)
        .font('Helvetica-Bold')
        .text('EL EMPLEADOR', col1X, lineY + 5, {
          width: lineWidth,
          align: 'center',
          continued: false,
        });

      doc
        .fontSize(7)
        .font('Helvetica')
        .text('NOMBRE: CATHERINE SUSAN CHANG', col1X, lineY + 18, {
          width: lineWidth,
          align: 'left',
          continued: false,
        });

      doc.text('LÓPEZ', col1X, lineY + 28, {
        width: lineWidth,
        align: 'left',
        continued: false,
      });

      doc.text('DNI N° 42933662', col1X, lineY + 38, {
        width: lineWidth,
        align: 'left',
        continued: false,
      });

      //AGREGAR IMAGEN 2
      const image2 = path.join(__dirname, '../assets/firma-empleador-2.png');
      try {
        doc.image(image2, col2X + 25, imageY, {
          width: imageWidth,
          height: imageHeight,
          fit: [imageWidth, imageHeight],
          align: 'center',
        });
      } catch (error) {
        // Si no hay imagen, solo mostrar línea
        console.info('No hay imagen de firma para empleador 2');
      }
      // COLUMNA 2 - EL EMPLEADOR
      doc
        .moveTo(col2X, lineY)
        .lineTo(col2X + lineWidth, lineY)
        .stroke();

      doc
        .fontSize(7)
        .font('Helvetica-Bold')
        .text('EL EMPLEADOR', col2X, lineY + 5, {
          width: lineWidth,
          align: 'center',
          continued: false,
        });

      doc
        .fontSize(7)
        .font('Helvetica')
        .text('NOMBRE: MARIA ESTELA GUILLEN', col2X, lineY + 18, {
          width: lineWidth,
          align: 'left',
          continued: false,
        });

      doc.text('CUBAS', col2X, lineY + 28, {
        width: lineWidth,
        align: 'left',
        continued: false,
      });

      doc.text('DNI N° 10346833', col2X, lineY + 38, {
        width: lineWidth,
        align: 'left',
        continued: false,
      });

      // COLUMNA 3 - EL TRABAJADOR
      doc
        .moveTo(col3X, lineY)
        .lineTo(col3X + lineWidth, lineY)
        .stroke();

      doc
        .fontSize(7)
        .font('Helvetica-Bold')
        .text('EL TRABAJADOR', col3X, lineY + 5, {
          width: lineWidth,
          align: 'center',
          continued: false,
        });
      doc
        .fontSize(7)
        .font('Helvetica')
        .text(`NOMBRE: ${fullName}`, col3X, lineY + 18, {
          width: lineWidth,
          align: 'left',
          continued: false,
        });

      doc.text(`DNI.: ${data.dni}`, col3X, lineY + 38, {
        width: lineWidth,
        align: 'left',
        continued: false,
      });

      doc.text(`DIVISION: ${data.subDivisionOrParking}`, col3X, lineY + 48, {
        width: lineWidth,
        align: 'left',
        continued: false,
      });

      // Mover el cursor Y al final de las firmas
      doc.y = lineY + 55;
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
