import { EmployeeData } from '../types/employees.interface';
import PDFDocument from 'pdfkit';
import path from 'path';
import {
  SIGNATURE_EMPLOYEE,
  SIGNATURE_EMPLOYEE_TWO,
} from '../constants/signatures';
import { formatCurrency } from '../utils/formatCurrency';
import {
  DNI_EMPLOYEE_PRIMARY,
  DNI_EMPLOYEE_SECOND,
  FULL_NAME_PRIMARY_EMPLOYEE,
  FULL_NAME_SECOND_EMPLOYEE,
} from './constants';

const arialNormal = path.join(__dirname, '../fonts/ARIAL.TTF');
const arialBold = path.join(__dirname, '../fonts/ARIALBD.TTF');

export const generatePartTimeContract = (
  data: EmployeeData,
): Promise<Buffer> => {
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
      .text('Contrato de Trabajo a Tiempo Parcial,', {
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
        'con R.U.C. Nº 20603381697, con domicilio en Calle Dean Valdivia N°158 Int.1401 Urb. Jardín (Edificio Platinium), Distrito de San Isidro, Provincia y Departamento de Lima, debidamente representada por la Sra. Catherine Susan Chang López identificado con D.N.I. Nº 42933662  y por la Sra. Maria Estela Guillen Cubas, identificada con DNI Nº 10346833, según poderes inscritos en la Partida Electrónica 14130887 del Registro de Personas Jurídicas de Lima, a quien en adelante se le denominará “EL EMPLEADOR”; y de otra parte, el Sr.(a). ',
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
      .text('cumplir con las funciones inherentes al puesto encomendado y las ')
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
      .text('en el Libro de Planillas de Remuneraciones de la Empresa y hacer')
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
      .text('en caso se implemente la entrega de Boletas de Pago, a través de')
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
      .text('prevista en las normas que resulten aplicables.')
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
      .text('labores, éste deberá cumplir la normativa interna aprobada por ', {
        continued: true,
      })
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
      .text('N° 29733, y su Reglamento, así como en la normativa interna de ', {
        continued: true,
      })
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
        'DÉCIMO SEXTA: CUMPLIMIENTO DE LAS NORMAS DE CONDUCTA ÉTICA, RESPONSABILIDAD ADMINISTRATIVA DE LAS PERSONAS JURÍDICAS, PREVENCIÓN DE LAVADO DE ACTIVOS Y FINANCIAMIENTO DEL TERRORISMO Y NORMAS QUE SANCIONAN DELITOS DE CORRUPCIÓN COMETIDOS ENTRE PRIVADOS QUE AFECTEN EL NORMAL DESARROLLO DE LAS RELACIONES COMERCIALES Y LA COMPETENCIA LEAL ENTRE EMPRESAS',
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
      .text('EL EMPLEADOR ', { continued: true, align: 'justify' })
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
        `En señal de conformidad, las partes suscriben dos (02) ejemplares del presente contrato en la ciudad de ${data.province}, el día ${data.entryDate}, quedando un ejemplar en poder del empleador y otro en poder del trabajador, quien declara haber recibido una copia del contrato y estar de acuerdo con su contenido.`,
        { align: 'justify' },
      )
      .moveDown(8);

    // CONFIGURACIÓN DE ESPACIO
    const imageWidth = 85; // Reducido ligeramente para evitar choques
    const imageHeight = 50;
    const signatureGap = 10; // Espacio entre texto y firmas

    // Altura estimada del bloque completo (Imagen + Linea + 4 lineas de texto)
    const estimatedBlockHeight = imageHeight + 80;
    const pageHeight = doc.page.height;
    // Margen de seguridad inferior (el margen del doc es muy pequeño, damos un poco más)
    const safeMarginBottom = doc.page.margins.bottom + 20;

    // 1. CONTROL DE SALTO DE PÁGINA
    // Si no cabe todo el bloque, pasamos a la siguiente hoja
    if (doc.y + estimatedBlockHeight > pageHeight - safeMarginBottom) {
      doc.addPage();
    } else {
      // Si cabe, bajamos el cursor para dejar espacio a la imagen (que va "hacia arriba")
      doc.y += imageHeight + signatureGap;
    }

    // Guardamos la posición Y base para las LÍNEAS (el suelo de la firma)
    const lineY = doc.y;
    const imageY = lineY - imageHeight - 5;

    // 2. CÁLCULO DE COLUMNAS (Matemática exacta)
    const marginLeft = doc.page.margins.left;
    const marginRight = doc.page.margins.right;
    const availableWidth = doc.page.width - marginLeft - marginRight;

    // Dividimos en 3 columnas iguales
    const colWidth = availableWidth / 3;

    // Definimos un ancho máximo para el texto y la línea (dejando aire a los lados)
    // Dejamos 10px de margen a la derecha de cada columna para que no se toquen
    const contentWidth = colWidth - 10;

    // Coordenadas X de inicio para cada columna
    const col1X = marginLeft;
    const col2X = marginLeft + colWidth;
    const col3X = marginLeft + colWidth * 2;

    // Centrado de la línea dentro de su columna
    // Calculamos cuánto mover la línea para que quede al medio de su caja
    const paddingX = (colWidth - contentWidth) / 2;

    const line1X = col1X + paddingX;
    const line2X = col2X + paddingX;
    const line3X = col3X + paddingX;

    // Coordenadas para centrar las imágenes
    const img1X = line1X + (contentWidth - imageWidth) / 2;
    const img2X = line2X + (contentWidth - imageWidth) / 2;

    // --- COLUMNA 1: EMPLEADOR 1 ---
    try {
      if (typeof SIGNATURE_EMPLOYEE !== 'undefined') {
        doc.image(SIGNATURE_EMPLOYEE, img1X, imageY, {
          width: imageWidth,
          height: imageHeight,
          fit: [imageWidth, imageHeight],
          align: 'center',
        });
      }
    } catch (e) {}

    // Línea
    doc
      .moveTo(line1X, lineY)
      .lineTo(line1X + contentWidth, lineY)
      .stroke();

    // Texto (Usamos layout dinámico, no coordenadas fijas Y)
    // 1. Título
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('EL EMPLEADOR', line1X, lineY + 5, {
        width: contentWidth,
        align: 'center',
      });

    // 2. Datos (Reseteamos posición X, dejamos que Y fluya)
    const signer1Name =
      typeof FULL_NAME_PRIMARY_EMPLOYEE !== 'undefined'
        ? FULL_NAME_PRIMARY_EMPLOYEE
        : '';
    const signer1DNI =
      typeof DNI_EMPLOYEE_PRIMARY !== 'undefined' ? DNI_EMPLOYEE_PRIMARY : '';

    doc.font('Arial Normal').text(`NOMBRE: ${signer1Name}`, line1X, doc.y, {
      width: contentWidth,
      align: 'left',
    });

    doc.text(`DNI N° ${signer1DNI}`, line1X, doc.y, {
      width: contentWidth,
      align: 'left',
    });

    // --- COLUMNA 2: EMPLEADOR 2 ---
    // IMPORTANTE: Reseteamos Y a la posición inicial debajo de la línea para empezar esta columna
    // Pero primero calculamos donde terminó la columna 1 para saber cuál es el punto más bajo
    let maxY = doc.y;

    try {
      if (typeof SIGNATURE_EMPLOYEE_TWO !== 'undefined') {
        doc.image(SIGNATURE_EMPLOYEE_TWO, img2X, imageY, {
          width: imageWidth,
          height: imageHeight,
          fit: [imageWidth, imageHeight],
          align: 'center',
        });
      }
    } catch (e) {}

    doc
      .moveTo(line2X, lineY)
      .lineTo(line2X + contentWidth, lineY)
      .stroke();

    // Título
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('EL EMPLEADOR', line2X, lineY + 5, {
        width: contentWidth,
        align: 'center',
      });

    // Datos
    const signer2Name = FULL_NAME_SECOND_EMPLOYEE;
    const signer2DNI =
      typeof DNI_EMPLOYEE_SECOND !== 'undefined' ? DNI_EMPLOYEE_SECOND : '';

    doc.font('Arial Normal').text(`NOMBRE: ${signer2Name}`, line2X, doc.y, {
      width: contentWidth,
      align: 'left',
    });

    doc.text(`DNI N° ${signer2DNI}`, line2X, doc.y, {
      width: contentWidth,
      align: 'left',
    });

    if (doc.y > maxY) maxY = doc.y; // Actualizamos el punto más bajo

    // --- COLUMNA 3: TRABAJADOR ---
    doc
      .moveTo(line3X, lineY)
      .lineTo(line3X + contentWidth, lineY)
      .stroke();

    // Título
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('EL TRABAJADOR', line3X, lineY + 5, {
        width: contentWidth,
        align: 'center',
      });

    // Datos
    // Aquí es donde solía haber problemas si el nombre es largo
    doc.font('Arial Normal');

    // Nombre
    doc.text(
      `NOMBRE: ${data.name} ${data.lastNameFather} ${data.lastNameMother}`,
      line3X,
      doc.y,
      {
        width: contentWidth, // Esto obliga al texto a bajar de línea si no cabe
        align: 'left',
      },
    );

    // DNI (Se escribirá justo debajo de donde termine el nombre, aunque el nombre ocupe 2 o 3 líneas)
    doc.text(`DNI: ${data.dni}`, line3X, doc.y, {
      width: contentWidth,
      align: 'left',
    });

    // División
    doc.text(`DIVISIÓN: ${data.subDivisionOrParking}`, line3X, doc.y, {
      width: contentWidth,
      align: 'left',
    });
    doc.end();
  });
};
export const generatePlanillaContract = (
  data: EmployeeData,
): Promise<Buffer> => {
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

    doc.registerFont('Arial Bold', arialBold);
    doc.registerFont('Arial Normal', arialNormal);
    const fullName =
      `${data.lastNameFather || ' '} ${data.lastNameMother || ' '} ${data.name || ''}`
        .trim()
        .replace(/\s+/g, ' ');
    // Título
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('CONTRATO DE TRABAJO A PLAZO FIJO POR INCREMENTO DE ACTIVIDADES', {
        align: 'center',
        underline: true,
      })
      .moveDown(1);
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text(
        'Conste por el presente documento, que se suscribe por duplicado con igual tenor y valor, el ',
        { continued: true },
      )
      .font('Arial Bold')
      .text('Contrato por Incremento de Actividades, ', {
        continued: true,
      })
      .font('Arial Normal')
      .text(
        'que, al amparo de lo dispuesto en los Artículos 53 y 57 del Texto Único Ordenado del Decreto Legislativo Nº 728 (Decreto Supremo Nº 003-97- TR, Ley de Productividad y Competitividad Laboral) y el Decreto Supremo N° 002-97-TR, celebran, de una parte, la empresa ',
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
      .text(`${fullName} `, { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('identificado con ', { continued: true, align: 'justify' })
      .font('Arial Bold')
      .text(`DNI N° ${data.dni || ''}, `, { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('de nacionalidad peruana, con domicilio en ', {
        continued: true,
        align: 'justify',
      })
      .font('Arial Bold')
      .text(`${data.address || ''}, `, { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('Distrito de ', { continued: true, align: 'justify' })
      .font('Arial Bold')
      .text(`${data.district || ''}, `, { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('Provincia de ', { continued: true, align: 'justify' })
      .font('Arial Bold')
      .text(`${data.province} `, { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('y Departamento de ', { continued: true, align: 'justify' })
      .font('Arial Bold')
      .text(`${data.department} `, { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('fijando como correo electrónico personal ', {
        continued: true,
        align: 'justify',
      })
      .font('Arial Bold')
      .text(`${data.email} `, { continued: true, align: 'justify' })
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
    //Parrafo 1.2
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('1.2       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('En ese contexto, ', { continued: true })
      .font('Arial Bold')
      .text('EL EMPLEADOR ', { continued: true })
      .font('Arial Normal')
      .text(
        'ha asumido la administración de una serie de playas de estacionamiento en la ciudad de ',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'Lima y provincias, así como la implementación de negocios colaterales en las playas de estacionamiento que ya vienen siendo',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'administradas, situación que generará un incremento considerable de sus actividades – directa o indirectamente vinculadas',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'al giro del negocio de estacionamientos, con la consecuente necesidad de contratar personal para concretar sus',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'operaciones en las referidas playas de estacionamiento, siendo que las áreas involucradas son ',
        { continued: true },
      )
      .font('Arial Bold')
      .text('TIME SURCO.');
    //Parrafo 1.3
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('1.3       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text(
        'Conforme lo detalla el correspondiente Informe del Área de Operaciones, el incremento en sus operaciones relacionadas a',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'la administración de playas de estacionamiento es de tal magnitud que no puede ser satisfecho con su personal actual,',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'motivo por el cual requiere contratar a plazo fijo a una persona que tenga la experiencia necesaria para desempeñarse como',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Bold')
      .text(`${data.position || ''}.`);

    //Parrafo 1.4
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('1.4       ', { continued: true, align: 'justify' })
      .font('Arial Bold')
      .text('EL TRABAJADOR, ', { continued: true })
      .font('Arial Normal')
      .text('declara tener experiencia como ', { continued: true })
      .font('Arial Bold')
      .text(`${data.position || ''},`, { continued: true })
      .font('Arial Normal')
      .text('por lo que cuenta con las condiciones necesarias para')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('ocupar el cargo de ', { continued: true })
      .font('Arial Bold')
      .text(`${data.position}, `, { continued: true })
      .font('Arial Normal')
      .text(
        'durante el tiempo que ésta lo estime y la naturaleza de las labores así lo exija.',
      )
      .moveDown(1);
    //texto 2
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('SEGUNDO: OBJETO DEL CONTRATO', {
        align: 'left',
        underline: true,
      })
      .moveDown(1);

    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('2.1       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('Por el presente documento ', { continued: true })
      .font('Arial Bold')
      .text('EL EMPLEADOR ', { continued: true })
      .font('Arial Normal')
      .text('contrata a plazo fijo a ', { continued: true })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text('bajo la modalidad de')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Bold')
      .text('INCREMENTO DE ACTIVIDADES ', { continued: true })
      .font('Arial Normal')
      .text('para que ocupe el cargo de ', { continued: true })
      .font('Arial Bold')
      .text('ANFITRION(A) PT ', { continued: true })
      .font('Arial Normal')
      .text('asumiendo las responsabilidades')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'propias del puesto y de acuerdo a las estipulaciones contenidas en este Contrato.',
      );
    //parrafo 2.2
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('2.2       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('Las partes reconocen y declaran que el cargo de ', {
        continued: true,
      })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text('está ', {
        continued: true,
      })
      .font('Arial Bold')
      .text('SUJETO A CONTROL ', { continued: true })
      .font('Arial Normal')
      .text('de acuerdo a lo establecido ')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('en el artículo 43 del Decreto Supremo Nro. 003-97-TR.')
      .moveDown(1);
    //texto 3
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('TERCERO: PLAZO', {
        align: 'left',
        underline: true,
      })
      .moveDown(1);
    //parrafo 3.1
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('3.1       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('Las labores que desarrollará ', {
        continued: true,
      })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text(
        'tendrán una duración de , los cuales se contabilizarán desde el día',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Bold')
      .text(`${data.entryDate || ''} `, { continued: true })
      .font('Arial Normal')
      .text('y concluirán el día ', { continued: true })
      .font('Arial Bold')
      .text(`${data.endDate || ''}.`);

    //Parrafo 3.2
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('3.2       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('Las partes acuerdan que dado que el cargo que desempeñará ', {
        continued: true,
      })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text('corresponde a uno ', { continued: true })
      .font('Arial Bold')
      .text('SUJETO A CONTROL.')
      .moveDown(1);

    //parrafo 4
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('CUARTO: PRINCIPALES OBLIGACIONES DE EL TRABAJADOR', {
        align: 'left',
        underline: true,
      })
      .moveDown(1);
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('Por medio del presente documento, ', { continued: true })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text('se obliga, referencialmente, a:')
      .moveDown(1);

    //parrafo 4.1
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('4.1       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text(
        'Prestar sus servicios, cumpliendo con las funciones, órdenes e instrucciones que imparta o señale ',
        {
          continued: true,
        },
      )
      .font('Arial Bold')
      .text('EL EMPLEADOR ', { continued: true })
      .font('Arial Normal')
      .text('o sus')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'representantes, para realizar las actividades que correspondan a su cargo.',
      );
    //párrafor 4.2
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('4.2       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text(
        'La prestación laboral deberá ser efectuada de manera personal, no pudiendo ',
        {
          continued: true,
        },
      )
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text('ser reemplazado ni')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('asistido por terceros, debiendo ', { continued: true })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text('cumplir con las funciones inherentes al puesto encomendado y las')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'labores adicionales y/o anexas que fuese necesario ejecutar y sean requeridas y/o determinadas por ',
        { continued: true },
      )
      .font('Arial Bold')
      .text('EL EMPLEADOR.');
    //parrafor 4.3
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('4.3       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text(
        'Prestar sus servicios con responsabilidad, prontitud, esmero y eficiencia, aportando su conocimiento y profesional en el',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('cumplimiento de los objetivos y estrategias de ', {
        continued: true,
      })
      .font('Arial Bold')
      .text('EL EMPLEADOR.');
    //parrafor 4.4
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('4.4       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text(
        'Cumplir estrictamente la legislación peruana en materia laboral, el Reglamento Interno de Trabajo, el Reglamento de',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'Seguridad y Salud en el Trabajo, el Reglamento de Hostigamiento Sexual y demás disposiciones, directivas circulares,',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('reglamentos, normas, etc., que expida ', {
        continued: true,
      })
      .font('Arial Bold')
      .text('EL EMPLEADOR; ', { continued: true })
      .font('Arial Normal')
      .text('declarando conocer todas aquellas que se encuentran vigentes.');
    //parrafor 4.5
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('4.5       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text(
        'No ejecutar por su cuenta o en su beneficio, sea en forma directa o indirecta, actividad o negociaciones dentro de giro de',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Bold')
      .text('EL EMPLEADOR, ', { continued: true })
      .font('Arial Normal')
      .text(
        'en cualquier forma o naturaleza, inclusive fuera de la jornada de trabajo y en días inhábiles o festivos.',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text(
        'declara entender que el incumplimiento a lo antes mencionado constituye una infracción de los deberes',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'esenciales que emanan de su vínculo laboral, por lo que en el caso de no cumplir con su compromiso, tal acto será',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('considerado como una falta grave.');
    //parrafor 4.6
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('4.6       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text(
        'Devolver en forma inmediata todos los materiales (documentos, informes, bienes, herramientas, vestimenta, etc.) que se le',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'entreguen con ocasión del trabajo prestado si la relación laboral concluyese por cualquier causa.',
      );
    //parrafor 4.7
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('4.7       ', { continued: true, align: 'justify' })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text(
        'se obliga a respetar los procedimientos de evaluación de rendimiento y desempeño laboral que tiene',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('establecidos ', { continued: true })
      .font('Arial Bold')
      .text('EL EMPLEADOR, ', { continued: true })
      .font('Arial Normal')
      .text('con el objeto de valorar el nivel de eficiencia logrado por', {
        continued: true,
      })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text('en su puesto')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('de trabajo.');
    //parrafor 4.8
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('4.8       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text(
        'Cualquier otra obligación prevista en este contrato, establecida por ',
        { continued: true },
      )
      .font('Arial Bold')
      .text('EL EMPLEADOR, ', { continued: true })
      .font('Arial Normal')
      .text('que se desprenda de su condición')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'de trabajador y aquellas previstas en las normas que resulten aplicables.',
      );
    //parrafor 4.9
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('4.9       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('En caso sea necesario para el cumplimiento de sus labores, ', {
        continued: true,
      })
      .font('Arial Bold')
      .text('EL TRABAJADOR, ', { continued: true })
      .font('Arial Normal')
      .text('deberá trasladarse a las operaciones y/o')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('plazas en los que ', { continued: true })
      .font('Arial Bold')
      .text('EL EMPLEADOR ', { continued: true })
      .font('Arial Normal')
      .text('realiza actividades comerciales.');
    //parrafor 4.10
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('4.10     ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('En caso ', {
        continued: true,
      })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text(
        'no cumpla con observar el plazo de preaviso legal de renuncia de treinta (30) días, deberá',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('abonar a favor de ', { continued: true })
      .font('Arial Bold')
      .text('EL EMPLEADOR ', { continued: true })
      .font('Arial Normal')
      .text(
        'una penalidad a modo de indemnización equivalente a la remuneración diaria que percibe',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text(
        'por cada día que no preste servicios en desconocimiento de dicho preaviso, para lo cual',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text('autoriza a ', { continued: true })
      .font('Arial Bold')
      .text('EL EMPLEADOR ', { continued: true })
      .font('Arial Normal')
      .text(
        'a que se le descuente el monto que corresponda de su liquidación de',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('beneficios sociales.')
      .moveDown(1);

    //parrafo 5
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('QUINTO: PERÍODO DE PRUEBA', { align: 'left', underline: true })
      .moveDown(1);
    //PARRAFOR 5.1
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('5.1       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text(
        'Ambas partes acuerdan en pactar un período de prueba de  de acuerdo con lo que establece el artículo 10 de la Ley de',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('Productividad y Competitividad Laboral.')
      .moveDown(1);

    //TEXTO 6
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('SEXTO: REMUNERACION', { align: 'left', underline: true })
      .moveDown(1);
    //parrafo 6.1
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('6.1       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text(
        'Las partes dejan expresa constancia que la retribución que perciba ',
        { continued: true },
      )
      .font('Arial Bold')
      .text('EL EMPLEADOR ', { continued: true })
      .font('Arial Normal')
      .text('estará compuesta por una')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('remuneración fija Mensual ascendente al monto bruto de ', {
        continued: true,
      })
      .font('Arial Bold')
      .text(`${formatCurrency(Number(data.salary)) || ''} `, {
        continued: true,
      })
      .font('Arial Bold')
      .text(`${data.salaryInWords || ''}. `);
    //parrafo 6.2
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('6.2       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('Asimismo,', { continued: true })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text(
        'podrá percibir una remuneración variable sobre la base de condiciones de venta y/o en',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'función al cumplimiento de indicadores de gestión y resultados, bajo los términos y condiciones establecidos en las',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('políticas que determine ', { continued: true })
      .font('Arial Bold')
      .text('EL EMPLEADOR ', { continued: true })
      .font('Arial Normal')
      .text(
        'de forma unilateral, las mismas que podrán ser modificadas o suprimidas',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('en cualquier momento y a sola decisión de ', {
        continued: true,
      })
      .font('Arial Bold')
      .text('EL EMPLEADOR, ', { continued: true })
      .font('Arial Normal')
      .text('lo cual es aceptado por ', { continued: true })
      .font('Arial Bold')
      .text('EL TRABAJADOR.')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'El pago de dicha remuneración variable se encuentra sujeto a la vigencia de la relación laboral, es decir,',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'sólo se abonarán las comisiones a los trabajadores con vínculo laboral vigente a la fecha de pago de las mismas.',
      );
    //parrafo 6.3
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('6.3       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('A la remuneración mensual de ', { continued: true })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text(
        'se agregará la Asignación Familiar correspondiente de ser el caso,',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'deduciéndose  las  aportaciones  y  descuentos  por  tributos  establecidos  en  la  ley  que  resulten aplicables.',
      );
    //parrafo 6.5
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('6.4       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('Adicionalmente, ', { continued: true })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text(
        'tendrá derecho al pago de beneficios tales como las gratificaciones legales en los',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'meses de julio y diciembre, la compensación por tiempo de servicios y demás que pudieran corresponderle, de',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'acuerdo a la legislación laboral vigente y sus respectivas modificaciones.',
      );
    //parrafor 6.5
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('6.5       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('Será de cargo de ', { continued: true })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text(
        'el pago del Impuesto a la Renta y los aportes al Sistema Nacional o Privado de',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('Pensiones, los que serán retenidos por ', { continued: true })
      .font('Arial Bold')
      .text('EL EMPLEADOR ', { continued: true })
      .font('Arial Normal')
      .text('así como cualquier otro tributo o carga social que grave las')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('remuneraciones del personal dependiente en el país.');
    //parrafo 6.6
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('6.6       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text(
        'Ambas partes acuerdan que la forma y fecha de pago de la remuneración será determinada por ',
        { continued: true },
      )
      .font('Arial Bold')
      .text('EL EMPLEADOR ', { continued: true })
      .font('Arial Normal')
      .text('y')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('podrá ser modificada de acuerdo con sus necesidades operativas')
      .moveDown(1);

    //texto 7
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('SÉTIMO: OBLIGACIONES DEL EMPLEADOR', {
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
      .text(
        'legislación laboral vigente al momento del pago. Registrar los pagos realizados a ',
        { continued: true },
      )
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text('en el Libro')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'de Planillas de Remuneraciones de la Empresa y hacer entrega oportuna de la boleta de pago.',
      );
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('7.2       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text(
        'Poner en conocimiento de la Autoridad Administrativa de Trabajo el presente Contrato, para su conocimiento y registro,',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'en cumplimiento de lo dispuesto en el Texto Único Ordenado del Decreto Legislativo Nº 728 (Decreto Supremo',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('Nº 003-97-TR, Ley de Productividad y Competitividad Laboral).');
    //parrafo 7.3
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('7.3       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('Retener de la remuneración bruta mensual de ', { continued: true })
      .font('Arial Bold')
      .text('EL TRABAJADOR, ', { continued: true })
      .font('Arial Normal')
      .text('las sumas correspondientes al aporte al Seguro')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('Privado o Público de Pensiones, así como el Impuesto a la Renta.');
    //parrafo 7.4
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('7.4       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text(
        'Las otras contenidas en la legislación laboral vigente y en cualquier norma de carácter interno, incluyendo el ',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'Reglamento Interno de Trabajo, el Reglamento de Seguridad y Salud en el Trabajo y el Reglamento de Hostigamiento ',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('Sexual.')
      .moveDown(1);

    //texto 8
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('OCTAVO: JORNADA DE TRABAJO', {
        align: 'left',
        underline: true,
      })
      .moveDown(1);
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('En relación a la Jornada de Trabajo, ', {
        continued: true,
        align: 'justify',
      })
      .font('Arial Bold')
      .text('EL EMPLEADOR y EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text('acuerdan lo siguiente:');
    //parrafo 8.1
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('8.1       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text(
        'La jornada de trabajo es de 48 horas semanales flexible, teniendo ',
        { continued: true },
      )
      .font('Arial Bold')
      .text('EL EMPLEADOR ', { continued: true })
      .font('Arial Normal')
      .text('la facultad de establecer el horario')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'de trabajo y modificarlo de acuerdo a sus necesidades, con las limitaciones establecidas por la ley.',
      );
    //parrafo 8.2
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('8.2       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('El tiempo de Refrigerio no forma parte de la jornada de trabajo.');
    //parrafo 8.3
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('8.3       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text(
        'Las partes acuerdan que podrán acumularse y compensarse las horas de trabajo diarias o semanales con períodos de',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'descanso dentro de la semana, diferentes semanas o ciclos de trabajo, según sea el caso; también se podrán',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'compensar con las horas que no se completen con trabajo efectivo durante la jornada hasta el límite de 48 horas',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('semanales en promedio. Asimismo, acuerdan que ', {
        continued: true,
      })
      .font('Arial Bold')
      .text('EL EMPLEADOR ', { continued: true })
      .font('Arial Normal')
      .text('podrá introducir modificaciones al horario y')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'jornada de trabajo, establecer jornadas acumulativas, alternativas, flexibles, compensatorias y horarios diferenciados,',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('respetando la jornada máxima establecida por Ley.');

    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('8.4       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('El trabajo en sobretiempo de ', { continued: true })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text('es estrictamente voluntario y, a solicitud de ', {
        continued: true,
      })
      .font('Arial Bold')
      .text('EL EMPLEADOR')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('debiendo ', { continued: true })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text('contar con autorización escrita de ', { continued: true })
      .font('Arial Bold')
      .text('EL EMPLEADOR ', { continued: true })
      .font('Arial Normal')
      .text('para realizar horas extras,')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'según lo establecido en el Reglamento Interno de Trabajo.El trabajo en sobretiempo debe ser prestado de manera',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'efectiva, no considerándose como tal la sola permanencia en las instalaciones de ',
        { continued: true },
      )
      .font('Arial Bold')
      .text('de EL EMPLEADOR.');
    //parrafo 8.5
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('8.5       ', { continued: true, align: 'justify' })
      .font('Arial Bold')
      .text('EL TRABAJADOR y EL EMPLEADOR ', { continued: true })
      .font('Arial Normal')
      .text(
        'acuerdan que durante la vigencia de la relación laboral podrán compensar el',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'trabajo prestado en sobretiempo con el otorgamiento de períodos equivalentes de descanso; debiendo realizarse',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'tal compensación, dentro del mes calendario siguiente a aquel en que se realizó dicho trabajo, salvo pacto en contrario.',
      );

    // parrafor 8.6
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('8.6       ', { continued: true, align: 'justify' })
      .font('Arial Bold')
      .text('EL TRABAJADOR, ', { continued: true })
      .font('Arial Normal')
      .text(
        'por su cargo y la naturaleza de su prestación de servicios se encuentra ',
        { continued: true },
      )
      .font('Arial Bold')
      .text('SUJETO A CONTROL.', { continued: true });
    // parrafor 8.7
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('8.7       ', { continued: true, align: 'justify' })
      .font('Arial Bold')
      .text('EL TRABAJADOR, ', { continued: true })
      .font('Arial Normal')
      .text(
        'declara conocer que, debido al objeto social de la empresa, cuando ésta lo requiera y siempre y',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'cuando le avise con un mínimo de 48 horas de anticipación, el trabajador deberá cumplir con laborar en días feriados',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'o no laborables, sin perjuicio de la compensación o pago de la sobretasa a la que tenga derecho.',
      )
      .moveDown(1);

    //texto 9
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('NOVENO: DECLARACIONES DE LAS PARTES', {
        align: 'left',
        underline: true,
      })
      .moveDown(1);
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('Las partes reconocen, acuerdan y declaran lo siguiente:');

    //parrafo 9.1
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('9.1       ', { continued: true, align: 'justify' })
      .font('Arial Bold')
      .text('EL TRABAJADOR, ', { continued: true })
      .font('Arial Normal')
      .text(
        'se encuentra sujeto al régimen laboral de la actividad privada y le son aplicables los derechos y',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('beneficios previstos en él.');
    //parrafo 9.2
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('9.2       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text(
        'De acuerdo a la facultad establecida en el párrafo segundo del artículo 9 del Texto Único Ordenado de la Ley de',
        { continued: true },
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('Productividad y Competitividad Laboral, ', { continued: true })
      .font('Arial Bold')
      .text('EL EMPLEADOR, ', { continued: true })
      .font('Arial Normal')
      .text('se reserva la facultad de modificar en lugar de la prestación')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'de los servicios, de acuerdo a las necesidades del negocio y observando el criterio de razonabilidad.',
      );
    //parrafo 9.3
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('9.3       ', { continued: true, align: 'justify' })
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
    //parrafo 9.4
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('9.4       ', { continued: true, align: 'justify' })
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
        'sancionar, de modo radical o no sustancial, la prestación de servicios (tiempo, lugar, forma, funcionesy modalidad) de',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Bold')
      .text('EL TRABAJADOR.');
    //parrafo 9.5
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('9.5       ', { continued: true, align: 'justify' })
      .font('Arial Bold')
      .text('EL TRABAJADOR y EL EMPLEADOR ', { continued: true })
      .font('Arial Normal')
      .text(
        'acuerdan que las Boletas de Pago de remuneraciones podrán ser selladas y',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('firmadas por el (los) representante(s) legal(es) de ', {
        continued: true,
      })
      .font('Arial Bold')
      .text('EL EMPLEADOR ', { continued: true })
      .font('Arial Normal')
      .text('con firma(s) digitalizada(s), una vez que la(s)')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'firma(s) sea(n) inscrita(s) en el Registro de Firmas a cargo del Ministerio de Trabajado que se implementará una vez',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'que se aprueben las disposiciones para la implementación del registro de firmas. Al respecto, ',
        { continued: true },
      )
      .font('Arial Bold')
      .text('EL TRABAJADOR')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'presta su consentimiento expreso para que su(s) Boleta(s) de Pago sea(n) suscritas por el (los) representante(s) de',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Bold')
      .text('EL EMPLEADOR  ', { continued: true })
      .font('Arial Normal')
      .text(
        'a través de firma(s) digital(es), una vez que ello sea implementado por el Ministerio de Trabajo.',
        { continued: true },
      );
    //parrafo 9.6
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('9.6       ', { continued: true, align: 'justify' })
      .font('Arial Bold')
      .text('EL TRABAJADOR y EL EMPLEADOR ', {
        continued: true,
        align: 'justify',
      })
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
      .text('EL EMPLEADOR, ', { continued: true })
      .font('Arial Normal')
      .text('o el correo')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('electrónico personal de ', { continued: true })
      .font('Arial Bold')
      .text('EL TRABAJADOR, ', { continued: true })
      .font('Arial Normal')
      .text(
        'indicado en el exordio del presente contrato de trabajo, prestando',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text('su consentimiento expreso para ello. Asimismo, ', {
        continued: true,
      })
      .font('Arial Bold')
      .text('EL TRABAJADOR, ', { continued: true })
      .font('Arial Normal')
      .text('declara como su dirección')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('electrónico ', { continued: true })
      .font('Arial Bold')
      .text(`${data.email || ''}, `, { continued: true })
      .font('Arial Normal')
      .text('en caso se implemente la entrega de Boletas de Pago, a través de')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('dicho medio; obligándose ', {
        continued: true,
      })
      .font('Arial Bold')
      .text('EL TRABAJADOR, ', { continued: true })
      .font('Arial Normal')
      .text('a informar por escrito a ', { continued: true })
      .font('Arial Bold')
      .text('EL EMPLEADOR, ', { continued: true })
      .font('Arial Normal')
      .text('cualquier cambio de su')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('dirección electrónica.')
      .moveDown(1);

    //TEXTO 10
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('DÉCIMO: TÉRMINO DEL CONTRATO', { align: 'left', underline: true })
      .moveDown(1);

    //parrafo 10.1
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('10.1     ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text(
        'Queda entendido que la extinción del presente contrato operará indefectiblemente en la fecha de vencimiento prevista',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'en la cláusula tercera, salvo que las necesidades operativas exijan lo contrario, escenario en el que ',
        {
          continued: true,
        },
      )
      .font('Arial Bold')
      .text('EL EMPLEADOR,')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('propondrá a ', {
        continued: true,
      })
      .font('Arial Bold')
      .text('EL TRABAJADOR, ', { continued: true })
      .font('Arial Normal')
      .text('suscribir una renovación por escrito. Por lo tanto, ', {
        continued: true,
      })
      .font('Arial Bold')
      .text('EL EMPLEADOR, ', { continued: true })
      .font('Arial Normal')
      .text('no está obligado')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'a dar ningún aviso adicional referente al término del presente contrato. En dicho momento, se abonará a',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text(
        'los beneficios sociales que le pudieran corresponder de acuerdo a ley. ',
        { continued: true },
      )
      .font('Arial Bold')
      .text('EL EMPLEADOR ', { continued: true })
      .font('Arial Normal')
      .text('podrá')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'resolver el contrato cuando medien los supuestos establecidos en el Texto Único Ordenado del Decreto Legislativo Nº',
        { continued: true },
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('728, Decreto Supremo Nº 003-97-TR.');

    //parrafo 10.2
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('10.2     ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text(
        'Además, son causales de resolución del presente contrato las siguientes:',
      )
      .font('Arial Normal')
      .text('             ', { continued: true })
      .font('Arial Normal')
      .text('a)         ', { continued: true })
      .font('Arial Normal')
      .text('La voluntad concertada de las partes')
      .font('Arial Normal')
      .text('             ', { continued: true })
      .font('Arial Normal')
      .text('b)         ', { continued: true })
      .font('Arial Normal')
      .text(
        'El incumplimiento de las obligaciones estipuladas en el presente documento. ',
      )
      .font('Arial Normal')
      .text('             ', { continued: true })
      .font('Arial Normal')
      .text('c)         ', { continued: true })
      .font('Arial Normal')
      .text('La comisión de falta grave por parte de ', { continued: true })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text('prevista en las normas que resulten aplicables.')
      .font('Arial Normal')
      .text('             ', { continued: true })
      .font('Arial Normal')
      .text('d)         ', { continued: true })
      .font('Arial Normal')
      .text(
        'Cualquier otra causal prevista en este contrato o que se encuentre establecida en las normas aplicables. ',
      )
      .moveDown(1);
    //TEXTO 11
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('DÉCIMO PRIMERA: PROPIEDAD INTELECTUAL', {
        align: 'left',
        underline: true,
      })
      .moveDown(1);
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('11.1     ', { continued: true, align: 'justify' })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text('cede y transfiere a', { continued: true })
      .font('Arial Bold')
      .text('EL EMPLEADOR', { continued: true })
      .font('Arial Normal')
      .text('en forma total, íntegra y exclusiva, los derechos')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'patrimoniales derivados de los trabajos e informes que sean realizados en cumplimiento del presente contrato,',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('quedando', { continued: true })
      .font('Arial Bold')
      .text(' EL EMPLEADOR ', { continued: true })
      .font('Arial Normal')
      .text(
        'facultado para publicar o reproducir en forma íntegra o parcial dicha información.',
      );
    //parrafor 11.2
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('11.2     ', { continued: true, align: 'justify' })
      .font('Arial Bold')
      .text('EL TRABAJADOR, ', { continued: true })
      .font('Arial Normal')
      .text('en virtud del presente contrato laboral, cede en exclusiva a ', {
        continued: true,
      })
      .font('Arial Bold')
      .text('EL EMPLEADOR ', {
        continued: true,
      })
      .font('Arial Normal')
      .text('todos los')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'derechos alienables sobre las creaciones de propiedad intelectual de las obras que sean creadas por él en el',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('ejercicio de sus funciones y cumplimiento de sus obligaciones.');
    //parrafor 11.3
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('11.3     ', { continued: true, align: 'justify' })
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
        { continued: true },
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('autorización escrita de ', { continued: true })
      .font('Arial Bold')
      .text('EL EMPLEADOR. ', { continued: true })
      .font('Arial Normal')
      .text('Se deja constancia que la información comprende inclusive las ')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('investigaciones, los borradores y los trabajos preliminares.');

    //parrafor 11.4
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('11.4     ', { continued: true, align: 'justify' })
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
      .text('para el cumplimiento de sus funciones.');
    //parrafor 11.5
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('11.5     ', { continued: true, align: 'justify' })
      .font('Arial Bold')
      .text('EL TRABAJADOR, ', { continued: true })
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
    //texto 12
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('DÉCIMO SEGUNDA: USO DE CORREO ELECTRÓNICO', {
        underline: true,
        align: 'left',
      })
      .moveDown(1);

    //parrafor 12.1
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('12.1     ', { continued: true, align: 'left' })
      .font('Arial Bold')
      .text('EL EMPLEADOR ', { continued: true })
      .font('Arial Normal')
      .text(
        'facilitará a EL TRABAJADOR un nombre de usuario y una contraseña dentro del dominio:',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('@apparka.pe y/o cualquier dominio ')
      .font('Arial Bold')
      .text('INVERSIONES URBANÍSTICAS OPERADORA S.A ', { continued: true })
      .font('Arial Normal')
      .text('que pueda crear a futuro.')
      .moveDown(0.5);
    //parrafor 12.2
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('12.2     ', { continued: true, align: 'left' })
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
    //Parrafor 12.3
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('12.3     ', { continued: true, align: 'left' })
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

    //texto 13
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('DÉCIMO TERCERA: EXCLUSIVIDAD', {
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

    if (doc.y + 150 > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
    }
    //texto 14
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('DÉCIMO CUARTA: NO COMPETENCIA', {
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
    //parrafo 14.2
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('14.2     ', { continued: true })
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
    //parrafo 14.4
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('14.4     ', { continued: true })
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
    //TEXTO 15
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('DÉCIMO QUINTA:	RESERVA Y CONFIDENCIALIDAD', {
        underline: true,
        align: 'left',
      })
      .moveDown(1);

    //parrafo 15.1
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('15.1     ', { continued: true, align: 'justify' })
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
      .text('15.2     ', { continued: true, align: 'justify' })
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
    //parrafo 15.3
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('15.3     ', { continued: true, align: 'justify' })
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
    //parrafo 15.4
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('15.4     ', { continued: true, align: 'justify' })
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

    doc
      .fontSize(8)
      .font('Arial Bold')
      .text(
        'DÉCIMO SEXTA: SEGURIDAD Y CONFIDENCIALIDAD EN EL TRATAMIENTO DE DATOS PERSONALES ',
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
      .text('labores, éste deberá cumplir la normativa interna aprobada por ', {
        continued: true,
      })
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
    //parrafo 16.2
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('16.2     ', { continued: true, align: 'justify' })
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
      .text('N° 29733, y su Reglamento, así como en la normativa interna de ', {
        continued: true,
      })
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
    //parrafo 16.3
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('16.3     ', { continued: true, align: 'justify' })
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
        'constituye incumplimiento de obligaciones laborales que dará lugar a la imposición de sanciones disciplinarias, sin',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'perjuicio de las responsabilidades penales, civiles y administrativas que su incumplimiento genere.',
      )
      .moveDown(1);
    //text 17
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text(
        'DÉCIMO SETIMA: CUMPLIMIENTO DE LAS NORMAS DE CONDUCTA ÉTICA, RESPONSABILIDAD ADMINISTRATIVA DE LAS PERSONAS JURÍDICAS, PREVENCIÓN DE LAVADO DE ACTIVOS Y FINANCIAMIENTO DEL TERRORISMO Y NORMAS QUE SANCIONAN DELITOS DE CORRUPCIÓN COMETIDOS ENTRE PRIVADOS QUE AFECTEN EL NORMAL DESARROLLO DE LAS RELACIONES COMERCIALES Y LA COMPETENCIA LEAL ENTRE EMPRESAS',
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
      .text('17.1     ', { continued: true, align: 'justify' })
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
      .text('17.2     ', { continued: true, align: 'justify' })
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
      .text('17.3     ', { continued: true, align: 'justify' })
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

    //PARRAFOR 17.4
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('17.4     ', { continued: true, align: 'justify' })
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

    //PARRAFOR 17.5
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('17.5     ', { continued: true, align: 'justify' })
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
      .text('DÉCIMO OCTAVA: VALIDEZ', {
        underline: true,
        align: 'left',
      })
      .moveDown(1);

    //parrafo 17.1

    doc
      .fontSize(8)
      .font('Arial Normal')
      .text(
        'Las partes ratifican que el presente contrato constituye un acto jurídico válido que no se encuentra afectado por causal de invalidez o ineficacia alguna y se presentará al Ministerio de Trabajo y Promoción del Empleo dentro de los primeros quince (15) días de celebrado.',
      )
      .moveDown(1);

    //TEXTO 18
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('DÉCIMO NOVENA: DE LOS EXÁMENES MÉDICOS', {
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
        'se someterá obligatoriamente a los exámenes médicos que dispongan ',
        { continued: true, align: 'justify' },
      )
      .font('Arial Bold')
      .text('EL EMPLEADOR ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text(
        'y/o la ley, con la finalidad de verificar si éste se encuentra apto para desarrollar los servicios y funciones propios de su cargo. En este sentido, ambas Partes declaran que la conservación de la salud de EL TRABAJADOR es motivo determinante de la relación contractual.',
        { align: 'justify' },
      )
      .moveDown(1);

    //TEXTO 20
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('VIGESIMO:', {
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
    //PARRAFO 20.1
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
    //TEXTO 21
    doc.fontSize(8).font('Arial Bold').text('VIGÉSIMO PRIMERA: DOMICILIO', {
      underline: true,
      align: 'left',
    });
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text(
        'Para todos los efectos legales del presente Contrato, las partes fijan como sus domicilios, los señalados en la introducción de este contrato. Cualquier cambio de domicilio deberá ser comunicado por escrito a la otra parte, mediante comunicación escrita, de lo contrario se entenderá que todas las notificaciones se han realizado válidamente.',
      )
      .moveDown(1);
    //TEXTO 19
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('VIGÉSIMA SEGUNDO: SOLUCIÓN DE DISPUTAS', {
        underline: true,
        align: 'left',
      })
      .moveDown(1);

    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('22.1     ', { continued: true, align: 'justify' })
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
      .text('22.2     ', { continued: true, align: 'justify' })
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
      .text('VIGÉSIMA TERCERA: APLICACIÓN SUPLETORIA', {
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
        `En señal de conformidad, las partes suscriben dos (02) ejemplares del presente contrato en la ciudad de ${data.province}, el día ${data.entryDate}, quedando un ejemplar en poder del empleador y otro en poder del trabajador, quien declara haber recibido una copia del contrato y estar de acuerdo con su contenido.`,
        { align: 'justify' },
      )
      .moveDown(8);

    // CONFIGURACIÓN DE ESPACIO
    const imageWidth = 85; // Reducido ligeramente para evitar choques
    const imageHeight = 50;
    const signatureGap = 10; // Espacio entre texto y firmas

    // Altura estimada del bloque completo (Imagen + Linea + 4 lineas de texto)
    const estimatedBlockHeight = imageHeight + 80;
    const pageHeight = doc.page.height;
    // Margen de seguridad inferior (el margen del doc es muy pequeño, damos un poco más)
    const safeMarginBottom = doc.page.margins.bottom + 20;

    // 1. CONTROL DE SALTO DE PÁGINA
    // Si no cabe todo el bloque, pasamos a la siguiente hoja
    if (doc.y + estimatedBlockHeight > pageHeight - safeMarginBottom) {
      doc.addPage();
    } else {
      // Si cabe, bajamos el cursor para dejar espacio a la imagen (que va "hacia arriba")
      doc.y += imageHeight + signatureGap;
    }

    // Guardamos la posición Y base para las LÍNEAS (el suelo de la firma)
    const lineY = doc.y;
    const imageY = lineY - imageHeight - 5;

    // 2. CÁLCULO DE COLUMNAS (Matemática exacta)
    const marginLeft = doc.page.margins.left;
    const marginRight = doc.page.margins.right;
    const availableWidth = doc.page.width - marginLeft - marginRight;

    // Dividimos en 3 columnas iguales
    const colWidth = availableWidth / 3;

    // Definimos un ancho máximo para el texto y la línea (dejando aire a los lados)
    // Dejamos 10px de margen a la derecha de cada columna para que no se toquen
    const contentWidth = colWidth - 10;

    // Coordenadas X de inicio para cada columna
    const col1X = marginLeft;
    const col2X = marginLeft + colWidth;
    const col3X = marginLeft + colWidth * 2;

    // Centrado de la línea dentro de su columna
    // Calculamos cuánto mover la línea para que quede al medio de su caja
    const paddingX = (colWidth - contentWidth) / 2;

    const line1X = col1X + paddingX;
    const line2X = col2X + paddingX;
    const line3X = col3X + paddingX;

    // Coordenadas para centrar las imágenes
    const img1X = line1X + (contentWidth - imageWidth) / 2;
    const img2X = line2X + (contentWidth - imageWidth) / 2;

    // --- COLUMNA 1: EMPLEADOR 1 ---
    try {
      if (typeof SIGNATURE_EMPLOYEE !== 'undefined') {
        doc.image(SIGNATURE_EMPLOYEE, img1X, imageY, {
          width: imageWidth,
          height: imageHeight,
          fit: [imageWidth, imageHeight],
          align: 'center',
        });
      }
    } catch (e) {}

    // Línea
    doc
      .moveTo(line1X, lineY)
      .lineTo(line1X + contentWidth, lineY)
      .stroke();

    // Texto (Usamos layout dinámico, no coordenadas fijas Y)
    // 1. Título
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('EL EMPLEADOR', line1X, lineY + 5, {
        width: contentWidth,
        align: 'center',
      });

    // 2. Datos (Reseteamos posición X, dejamos que Y fluya)
    const signer1Name =
      typeof FULL_NAME_PRIMARY_EMPLOYEE !== 'undefined'
        ? FULL_NAME_PRIMARY_EMPLOYEE
        : '';
    const signer1DNI =
      typeof DNI_EMPLOYEE_PRIMARY !== 'undefined' ? DNI_EMPLOYEE_PRIMARY : '';

    doc.font('Arial Normal').text(`NOMBRE: ${signer1Name}`, line1X, doc.y, {
      width: contentWidth,
      align: 'left',
    });

    doc.text(`DNI N° ${signer1DNI}`, line1X, doc.y, {
      width: contentWidth,
      align: 'left',
    });

    // --- COLUMNA 2: EMPLEADOR 2 ---
    // IMPORTANTE: Reseteamos Y a la posición inicial debajo de la línea para empezar esta columna
    // Pero primero calculamos donde terminó la columna 1 para saber cuál es el punto más bajo
    let maxY = doc.y;

    try {
      if (typeof SIGNATURE_EMPLOYEE_TWO !== 'undefined') {
        doc.image(SIGNATURE_EMPLOYEE_TWO, img2X, imageY, {
          width: imageWidth,
          height: imageHeight,
          fit: [imageWidth, imageHeight],
          align: 'center',
        });
      }
    } catch (e) {}

    doc
      .moveTo(line2X, lineY)
      .lineTo(line2X + contentWidth, lineY)
      .stroke();

    // Título
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('EL EMPLEADOR', line2X, lineY + 5, {
        width: contentWidth,
        align: 'center',
      });

    // Datos
    const signer2Name = FULL_NAME_SECOND_EMPLOYEE;
    const signer2DNI =
      typeof DNI_EMPLOYEE_SECOND !== 'undefined' ? DNI_EMPLOYEE_SECOND : '';

    doc.font('Arial Normal').text(`NOMBRE: ${signer2Name}`, line2X, doc.y, {
      width: contentWidth,
      align: 'left',
    });

    doc.text(`DNI N° ${signer2DNI}`, line2X, doc.y, {
      width: contentWidth,
      align: 'left',
    });

    if (doc.y > maxY) maxY = doc.y; // Actualizamos el punto más bajo

    // --- COLUMNA 3: TRABAJADOR ---
    doc
      .moveTo(line3X, lineY)
      .lineTo(line3X + contentWidth, lineY)
      .stroke();

    // Título
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('EL TRABAJADOR', line3X, lineY + 5, {
        width: contentWidth,
        align: 'center',
      });

    // Datos
    // Aquí es donde solía haber problemas si el nombre es largo
    doc.font('Arial Normal');

    // Nombre
    doc.text(
      `NOMBRE: ${data.name} ${data.lastNameFather} ${data.lastNameMother}`,
      line3X,
      doc.y,
      {
        width: contentWidth, // Esto obliga al texto a bajar de línea si no cabe
        align: 'left',
      },
    );

    // DNI (Se escribirá justo debajo de donde termine el nombre, aunque el nombre ocupe 2 o 3 líneas)
    doc.text(`DNI: ${data.dni}`, line3X, doc.y, {
      width: contentWidth,
      align: 'left',
    });

    // División
    doc.text(`DIVISIÓN: ${data.subDivisionOrParking}`, line3X, doc.y, {
      width: contentWidth,
      align: 'left',
    });
    doc.end();
  });
};
export const genarateSubsidioContract = (
  data: EmployeeData,
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4' });
    doc.page.margins.top = 30.12; // 2.05 cm
    doc.page.margins.bottom = 33.89; // 0.49 cm
    doc.page.margins.left = 40.69; // 1.23 cm
    doc.page.margins.right = 45.69; // 1.55 cm

    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.registerFont('Arial Bold', arialBold);
    doc.registerFont('Arial Normal', arialNormal);
    const fullName =
      `${data.lastNameFather || ' '} ${data.lastNameMother || ' '} ${data.name || ''}`
        .trim()
        .replace(/\s+/g, ' ');

    const replacementForArray = data.replacementFor?.split(' ');
    const firstAndfirstLastName = `${replacementForArray?.[0]} ${replacementForArray?.[1]}`;
    const secondLastName = `${replacementForArray?.[2]}`;

    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('CONTRATO DE TRABAJO SUJETO A MODALIDAD DE SUPLENCIA', {
        underline: true,
        align: 'center',
      })
      .moveDown(1);

    doc
      .fontSize(8)
      .font('Arial Normal')
      .text(
        'Conste por el presente documento, que se suscribe por duplicado con igual tenor y valor, el ',
        { continued: true },
      )
      .font('Arial Bold')
      .text('Contrato por Incremento de Actividades, ', {
        continued: true,
      })
      .font('Arial Normal')
      .text(
        'que, al amparo de lo dispuesto en los Artículos 53 y 57 del Texto Único Ordenado del Decreto Legislativo Nº 728 (Decreto Supremo Nº 003-97-TR, Ley de Productividad y Competitividad Laboral) y el Decreto Supremo N° 002-97-TR, celebran, de una parte, la empresa ',
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
      .text(`${fullName} `, { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('identificado con ', { continued: true, align: 'justify' })
      .font('Arial Bold')
      .text(`DNI N° ${data.dni || ''}, `, { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('de nacionalidad peruana, con domicilio en ', {
        continued: true,
        align: 'justify',
      })
      .font('Arial Bold')
      .text(`${data.address || ''}, `, { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('Distrito de ', { continued: true, align: 'justify' })
      .font('Arial Bold')
      .text(`${data.district || ''}, `, { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('Provincia de ', { continued: true, align: 'justify' })
      .font('Arial Bold')
      .text(`${data.province} `, { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('y Departamento de ', { continued: true, align: 'justify' })
      .font('Arial Bold')
      .text(`${data.department} `, { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('a quien en adelante se le denominará ', {
        continued: true,
        align: 'justify',
      })
      .font('Arial Bold')
      .text('“EL TRABAJADOR”; ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text(
        'y que en conjunto serán denominados “Las Partes”,  en los términos y condiciones siguientes:',
      )
      .moveDown(1);
    //TEXT 1
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('PRIMERO: PARTES DEL CONTRATO', {
        underline: true,
        align: 'left',
      })
      .moveDown(1);

    //Parrafo 1
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('1.1       ', { continued: true, align: 'justify' })
      .font('Arial Bold')
      .text('EL EMPLEADOR ', { continued: true })
      .font('Arial Normal')
      .text(
        'es una sociedad anónima debidamente constituida e inscrita en la Partida No. 14130887 del Registro de',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'Personas Jurídicas de la Ciudad de Lima, cuyo objeto social es la prestación de servicios de administración, promoción,',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'desarrollo y operación de playas de estacionamiento, sistemas de peaje y actividades conexas.',
      );
    //parrafor 2
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('1.2       ', { continued: true, align: 'justify' })
      .font('Arial Bold')
      .text('EL EMPLEADOR ', { continued: true })
      .font('Arial Normal')
      .text('requiere contratar a ', { continued: true })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text('para cubrir la ausencia del trabajador ', { continued: true })
      .font('Arial Bold')
      .text(`${firstAndfirstLastName}`)
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Bold')
      .text(`${secondLastName} `, { continued: true })
      .font('Arial Normal')
      .text('(en adelante ', { continued: true })
      .font('Arial Bold')
      .text('EL SUPLIDO) ', { continued: true })
      .font('Arial Normal')
      .text('quién viene ocupando el cargo de ', { continued: true })
      .font('Arial Bold')
      .text(`${data.position} `, { continued: true })
      .font('Arial Normal')
      .text('en la Playa')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Bold')
      .text(`${data.subDivisionOrParking} `, { continued: true })
      .font('Arial Normal')
      .text('el mismo que por motivos de ', { continued: true })
      .font('Arial Bold')
      .text(`${data.reasonForSubstitution} `, { continued: true })
      .font('Arial Normal')
      .text('se ausentará por espacio de ')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Bold')
      .text(`${data.timeForCompany}.`);
    //parrafor 3
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('1.3       ', { continued: true, align: 'justify' })
      .font('Arial Bold')
      .text('EL TRABAJADOR, ', { continued: true })
      .font('Arial Normal')
      .text('declara tener experiencia en ', { continued: true })
      .font('Arial Bold')
      .text(`${data.position}, `, { continued: true })
      .font('Arial Normal')
      .text('por lo que cuenta con las condiciones necesarias para')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('ocupar el cargo de ', {
        continued: true,
      })
      .font('Arial Bold')
      .text(`${data.position}, `, {
        continued: true,
      })
      .font('Arial Normal')
      .text(
        'durante el tiempo que ésta lo estime y la naturaleza de las labores así lo exija.',
      )
      .moveDown(1);
    //TEXT 2
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('SEGUNDO: OBJETO DEL CONTRATO', {
        underline: true,
        align: 'left',
      })
      .moveDown(1);

    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('2.1       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('Por el presente documento ', { continued: true })
      .font('Arial Bold')
      .text('EL EMPLEADOR ', { continued: true })
      .font('Arial Normal')
      .text('contrata los servicios de ', { continued: true })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text('a plazo fijo bajo la modalidad de')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Bold')
      .text('SUPLENCIA ', { continued: true })
      .font('Arial Normal')
      .text('para que desempeñe el cargo de ', { continued: true })
      .font('Arial Bold')
      .text(`${data.position} `, { continued: true })
      .font('Arial Normal')
      .text('asumiendo las responsabilidades propias del puesto y')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('de acuerdo a las estipulaciones contenidas en este Contrato.');

    //parrafo 2
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('2.2       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('Las partes reconocen y declaran que el cargo de ', {
        continued: true,
      })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text('está sujeto a supervisión inmediata y corresponde a')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('uno de ', {
        continued: true,
      })
      .font('Arial Bold')
      .text(`${data.workingCondition} `, { continued: true })
      .font('Arial Normal')
      .text(
        'de acuerdo a lo establecido en el artículo 43 del Decreto Supremo Nro. 003-97-TR.',
      )
      .moveDown(1);
    //text 3
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('TERCERO: PLAZO', {
        underline: true,
        align: 'left',
      })
      .moveDown(1);
    //parrafo 3.1
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('3.1       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('Las labores que desarrollará ', {
        continued: true,
      })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text('tendrán una duración de ', { continued: true })
      .font('Arial Bold')
      .text(`${data.timeForCompany} `, { continued: true })
      .font('Arial Normal')
      .text('tendrán una duración de tiempo')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'estimado para superar el incidente que motiva el presente Contrato, según lo precisado en la cláusula 1.2 precedente.',
      );

    //parrafo 3.2
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('3.2       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('El plazo del presente Contrato se contabilizarán desde el día ', {
        continued: true,
      })
      .font('Arial Bold')
      .text(`${data.entryDate} `, { continued: true })
      .font('Arial Normal')
      .text('y concluirán de manera definitiva el día ', { continued: true })
      // .font('Arial Normal')
      // .text('            ', { continued: true })
      .font('Arial Bold')
      .text(`${data.endDate}`)
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'no obstante, Las Partes acuerdan expresamente en caso de que EL SUPLIDO se reincorpore a su puesto de trabajo',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'antes del plazo pactado, el presente contrato quedara extinguido en conformidad con el Art. 61 del Decreto Supremo Nro.',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('003-97-TR.')
      .moveDown(1);

    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('CUARTO: PERÍODO DE PRUEBA', {
        underline: true,
        align: 'left',
      })
      .moveDown(1);

    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('Ambas partes acuerdan en pactar un período de prueba de ', {
        continued: true,
      })
      .font('Arial Bold')
      .text(`${data.probationaryPeriod} `, {
        continued: true,
      })
      .font('Arial Normal')
      .text(
        'de acuerdo con lo que establece el artículo 10 de la Ley de Productividad y Competitividad Laboral.',
      )
      .moveDown(1);
    //texto 5
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('QUINTO: REMUNERACION', {
        underline: true,
        align: 'left',
      })
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
        'recibirá por la prestación íntegra y oportuna de sus servicios, una remuneración bruta mensual de',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Bold')
      .text(`${formatCurrency(data.salary)} `, { continued: true })
      .font('Arial Bold')
      .text(`${data.salaryInWords}, `, { continued: true })
      .font('Arial Normal')
      .text(
        'más la asignación familiar correspondiente de ser el caso, de la cual se deducirán',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'las aportaciones y descuentos por tributos establecidos en la ley que resulten aplicables.',
      );
    //parrafo 5.2
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('5.2       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('Adicionalmente, ', { continued: true })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text(
        'tendrá derecho al pago de beneficios tales como las gratificaciones legales en los meses',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'de julio y diciembre, la compensación por tiempo de servicios y demás que pudieran corresponderle, de acuerdo a la',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'legislación laboral vigente y sus respectivas modificaciones, al convenio celebrado o a las que ',
        { continued: true },
      )
      .font('Arial Bold')
      .text('EL EMPLEADOR, ', { continued: true })
      .font('Arial Normal')
      .text('a título de')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('liberalidad, le otorgue.');
    //parrafo 5.3
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('5.3       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('Será de cargo de ', { continued: true })
      .font('Arial Bold')
      .text('EL TRABAJADOR, ', { continued: true })
      .font('Arial Normal')
      .text(
        'el pago del Impuesto a la Renta, los aportes al Sistema Nacional o Privado de',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('Pensiones, las que serán retenidas por ', {
        continued: true,
      })
      .font('Arial Bold')
      .text('EL EMPLEADOR, ', {
        continued: true,
      })
      .font('Arial Normal')
      .text('así como cualquier otro tributo o carga social que grave las')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('remuneraciones del personal dependiente en el país.')
      .moveDown(1);

    //texto 6
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('SEXTO:	JORNADA DE TRABAJO', {
        underline: true,
        align: 'left',
      })
      .moveDown(1);

    //parrafor 6.1
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('En relación a la Jornada de Trabajo, ', { continued: true })
      .font('Arial Bold')
      .text('EL EMPLEADOR y EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text('acuerdan lo siguiente:');

    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('6.1       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text(
        'La jornada de trabajo es de 48 horas semanales flexible, teniendo ',
        { continued: true },
      )
      .font('Arial Bold')
      .text('EL EMPLEADOR ', { continued: true })
      .font('Arial Normal')
      .text('la facultad de establecer el horario de')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'trabajo y modificarlo de acuerdo a sus necesidades, con las limitaciones establecidas por la ley.',
      );

    //parrafor 6.2
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('6.2       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('El tiempo de Refrigerio no forma parte de la jornada de trabajo.');

    //parrafor 6.3
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('6.3       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text(
        'Las partes acuerdan que podrán acumularse y compensarse las horas de trabajo diarias o semanales con períodos de',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'descanso dentro de la semana, diferentes semanas o ciclos de trabajo, según sea el caso; también se podrán compensar',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'con las horas que no se completen con trabajo efectivo durante la jornada hasta el límite de 48 horas semanales en',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('promedio. Asimismo, acuerdan que ', {
        continued: true,
      })
      .font('Arial Bold')
      .text('EL EMPLEADOR ', { continued: true })
      .font('Arial Normal')
      .text('podrá introducir modificaciones al horario y jornada de trabajo,')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'establecer jornadas acumulativas, alternativas, flexibles, compensatorias y horarios diferenciados, respetando la jornada',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('máxima establecida por Ley.');

    //parrafo 6.4
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('6.4       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('El trabajo en sobretiempo de ', { continued: true })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text('es estrictamente voluntario y, a solicitud de ', {
        continued: true,
      })
      .font('Arial Bold')
      .text('EL EMPLEADOR ', { continued: true })
      .font('Arial Normal')
      .text('debiendo')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text('contar con autorización escrita de ', { continued: true })
      .font('Arial Bold')
      .text('EL EMPLEADOR ', { continued: true })
      .font('Arial Normal')
      .text('para realizar horas extras, según lo establecido en el')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'Reglamento Interno de Trabajo. El trabajo en sobretiemp debe ser prestado de manera efectiva, no considerándose como',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('tal la sola permanencia en las instalaciones de ', {
        continued: true,
      })
      .font('Arial Bold')
      .text('EL EMPLEADOR.');

    if (doc.y + 150 > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
    }
    //parrafo 6.5
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('6.5       ', { continued: true, align: 'justify' })
      .font('Arial Bold')
      .text('EL TRABAJADOR y EL EMPLEADOR ', { continued: true })
      .font('Arial Normal')
      .text(
        'acuerdan que durante la vigencia de la relación laboral podrán compensar el',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'trabajo prestado en sobretiempo con el otorgamiento de períodos equivalentes de descanso; debiendo realizarse',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'realizarse tal compensación, dentro del mes calendario siguiente a aquel en que se realizó dicho trabajo, salvo pacto',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('en contrario.');
    //parrafor 6.6
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('6.6       ', { continued: true, align: 'justify' })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text(
        'por su cargo y la naturaleza de su prestación de servicios se encuentra sujeto de control. Ambas',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'partes acuerdan que la forma y fecha de pago de la remuneración podrá ser modificada por ',
        { continued: true },
      )
      .font('Arial Bold')
      .text('EL EMPLEADOR ', { continued: true })
      .font('Arial Normal')
      .text('de')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('acuerdo con sus necesidades operativas.')
      .moveDown(1);
    //texto 7
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('SÉTIMA: PRINCIPALES OBLIGACIONES DE EL TRABAJADOR', {
        underline: true,
        align: 'left',
      })
      .moveDown(1);
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('            Por medio del presente documento, ', {
        continued: true,
      })
      .font('Arial Normal')
      .text('se obliga, referencialmente, a:');
    //parrafo 7.1

    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('7.1       ', { continued: true, align: 'justify' })
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
      );
    //parrafo 7.2
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('7.2       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text(
        'La prestación laboral deberá ser efectuada de manera personal, no pudiendo ',
        { continued: true },
      )
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text('ser reemplazado ni')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('asistido por terceros, debiendo ', {
        continued: true,
      })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', {
        continued: true,
      })
      .font('Arial Normal')
      .text('cumplir con las funciones inherentes al puesto encomendado y las')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'labores adicionales y/o anexas que fuese necesario ejecutar y sean requeridas y/o determinadas por ',
        { continued: true },
      )
      .font('Arial Bold')
      .text('EL')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Bold')
      .text('EMPLEADOR.');

    //Parrafo 7.3
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('7.3       ', { continued: true, align: 'justify' })
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
      .text('EL EMPLEADOR.');

    //parrafo 7.4
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('7.4       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text(
        'Cumplir estrictamente la legislación peruana en materia laboral, el Reglamento Interno de Trabajo, el Reglamento de',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'Seguridad y Salud en el Trabajo, el Reglamento de Hostigamiento Sexual y demás disposiciones directivas, circulares',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('reglamentos, normas, etc., que expida ', {
        continued: true,
      })
      .font('Arial Bold')
      .text('EL EMPLEADOR; ', { continued: true })
      .font('Arial Normal')
      .text('declarando conocer todas aquellas que se encuentran')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('vigentes.');
    //parrafo 7.5
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('7.5       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text(
        'No ejecutar por su cuenta o en su beneficio, sea en forma directa o indirecta, actividad o negociaciones dentro del giro',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('de ', { continued: true })
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
      .text('EL TRABAJADOR, ', { continued: true })
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

    //parrafo 7.6
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('7.6       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text(
        'Devolver en forma inmediata todos los materiales (documentos, informes, bienes, herramientas, vestimenta, etc. que',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'se le entreguen con ocasión del trabajo prestado si la relación laboral concluyese por cualquier causa.',
      );
    //parrafo 7.7
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('7.7       ', { continued: true, align: 'justify' })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text(
        'se obliga a respetar los procedimientos de evaluación d rendimiento y desempeño laboral que tiene',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('establecidos ', { continued: true })
      .font('Arial Bold')
      .text('EL EMPLEADOR ', { continued: true })
      .font('Arial Normal')
      .text('con el objeto de valorar el nivel de eficiencia logrado por ', {
        continued: true,
      })
      .font('Arial Bold')
      .text('EL EMPLEADOR ', { continued: true })
      .font('Arial Normal')
      .text('en su')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('puesto de trabajo.');
    //parrafo 7.8
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('7.8       ', { continued: true, align: 'justify' })
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
    //TEXT 8
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('OCTAVA: OBLIGACIONES DEL EMPLEADOR', {
        underline: true,
        align: 'left',
      })
      .moveDown(1);
    //parrafo 8.1
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('8.1       ', { continued: true, align: 'justify' })
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
    //Parra 8.2
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('8.2       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('Registrar los pagos realizados a ', { continued: true })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text('en el Libro de Planillas de Remuneraciones de la Empresa y hacer')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('entrega oportuna de la boleta de pago.');
    //Parra 8.3
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('8.3       ', { continued: true, align: 'justify' })
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
    //PARRAFO 8.4
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('8.4       ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('Retener de la remuneración bruta mensual de ', { continued: true })
      .font('Arial Bold')
      .text('EL TRABAJADOR, ', { continued: true })
      .font('Arial Normal')
      .text('las sumas correspondientes al aporte al Seguro')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('Privado o Público de Pensiones, así como el Impuesto a la Renta.');
    //PARRAFO 8.5
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('8.5       ', { continued: true, align: 'justify' })
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

    //TEXT 9
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('NOVENA: DECLARACIONES DE LAS PARTES', {
        underline: true,
        align: 'left',
      });
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('Las partes reconocen, acuerdan y declaran lo siguiente:');
    //parrafo 9.1
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('9.1       ', { continued: true, align: 'justify' })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text(
        'se encuentra sujeto al régimen laboral de la actividad privada y le son aplicables los derechos y',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('beneficios previstos en él.');
    //parrafo 9.2
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('9.2       ', { continued: true, align: 'justify' })
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
      .text('se reserva la facultad de modificar en lugar de la')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'prestación de los servicios, de acuerdo a las necesidades del negocio y observando el criterio de razonabilidad.',
      );
    //parrafo 9.3
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('9.3       ', { continued: true, align: 'justify' })
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
    //parrafo 9.4
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('9.4       ', { continued: true, align: 'justify' })
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
        'sancionar, de modo radical o no sustancial, la prestación de servicios (tiempo, lugar, forma, funciones y modalidad) de',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      // .font('Arial Normal')
      // .text('', { continued: true })
      .font('Arial Bold')
      .text('EL TRABAJADOR.');
    //parrafo 9.5
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('9.5       ', { continued: true, align: 'justify' })
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
      .text('EL EMPLEDOR ', { continued: true })
      .font('Arial Normal')
      .text('con firma (s) digitalizada (s), una vez que la (s)')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'firma (s) sea (n) 2inscrita (s) en el Registro de Firmas a cargo del Ministerio de Trabajado.',
      );
    //parrafo 9.6
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('9.6       ', { continued: true, align: 'justify' })
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
      .text('en caso se implemente la entrega de Boletas de Pago, a ')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('través de dicho medio; obligándose ', { continued: true })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text('a informar por escrito a ', { continued: true })
      .font('Arial Bold')
      .text('EL EMPLEADOR ', { continued: true })
      .font('Arial Normal')
      .text('cualquier cambio de')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('su dirección electrónica.')
      .moveDown(1);
    //TEXT 10
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('DÉCIMA: TÉRMINO DEL CONTRATO', {
        underline: true,
        align: 'left',
      })
      .moveDown(1);
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('10.1     ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text(
        'Queda entendido que la extinción del presente contrato operará indefectiblemente en la fecha de vencimiento prevista',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'en la cláusula tercera, salvo que las necesidades aun persistan, escenario en el que ',
        { continued: true },
      )
      .font('Arial Bold')
      .text('EL EMPLEADOR ', { continued: true })
      .font('Arial Normal')
      .text('propondrá a')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text('suscribir una renovación por escrito. Por lo tanto, ', {
        continued: true,
      })
      .font('Arial Bold')
      .text('EL EMPLEADOR ', {
        continued: true,
      })
      .font('Arial Normal')
      .text('no está obligado a dar')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'ningún aviso adicional referente al término del presente contrato. En dicho momento, se abonará a ',
        { continued: true },
      )
      .font('Arial Bold')
      .text('EL TRABAJADOR')
      .font('Arial Normal')
      .text('            ', { continued: true })
      // .font('Arial Bold')
      // .text(' ', { continued: true })
      .font('Arial Normal')
      .text(
        'los beneficios sociales que le pudieran corresponder de acuerdo a ley. ',
        { continued: true },
      )
      .font('Arial Bold')
      .text('EL EMPLEADOR ', { continued: true })
      .font('Arial Normal')
      .text('podrá')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'resolver el contrato cuando medien los supuestos establecidos en el Texto Único Ordenado del Decreto Legislativo',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('Nº 728, Decreto Supremo Nº 003-97-TR.');
    //parrafo 10.2
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('10.2     ', { continued: true, align: 'justify' })
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
      .text('prevista en las normas que resulten aplicables.')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('d)         ', { continued: true })
      .font('Arial Normal')
      .text('La reincorporación de EL SUPLIDO a su puesto de trabajo.')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('e)         ', { continued: true })
      .font('Arial Normal')
      .text(
        'Cualquier otra causal prevista en este contrato o que se encuentre establecida en las normas aplicables. ',
      )
      .moveDown(1);

    //texto 11
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('DÉCIMA PRIMERA: PROPIEDAD INTELECTUAL', {
        underline: true,
        align: 'left',
      })
      .moveDown(1);
    //parrafo 11.1
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('11.1     ', { continued: true, align: 'justify' })
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
      );
    //parrafo 11.2
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('11.2     ', { continued: true, align: 'justify' })
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

    //parrafo 11.3
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('11.3     ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text(
        'Por lo tanto, toda información creada u originada es de propiedad exclusiva de ',
        { continued: true },
      )
      .font('Arial Bold')
      .text('EL EMPLEADOR, ', { continued: true })
      .font('Arial Normal')
      .text('quedando ', { continued: true })
      .font('Arial Bold')
      .text('EL')
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
      .text('investigaciones, los borradores y los trabajos preliminares. ');
    //parrafo 11.4
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('11.4     ', { continued: true, align: 'justify' })
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
      .text('para el cumplimiento de sus funciones.');

    //parrafo 11.5
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('11.5     ', { continued: true, align: 'justify' })
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
    //TEXTO 12
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('DÉCIMO SEGUNDA: USO DE CORREO ELECTRÓNICO', {
        underline: true,
        align: 'left',
      })
      .moveDown(1);
    //parrafo 12.1
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('12.1     ', { continued: true, align: 'left' })
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
    //parrafor 12.2
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('12.2     ', { continued: true, align: 'left' })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text(
        'no podrá revelar su contraseña a otro personal o algún tercero, siendo plenamente responsable por',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('el uso de dicha herramienta de trabajo.', {
        continued: true,
      })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text('reconoce y acepta que se encuentra prohibido el uso de lo')
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text(
        'recursos informáticos proporcionados por la empresa para fines particulares, no autorizado, tanto en horario laboral,',
      )
      .font('Arial Normal')
      .text('            ', { continued: true })
      .font('Arial Normal')
      .text('como fuera de él.');
    //Parrafor 12.3
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('12.3     ', { continued: true, align: 'left' })
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

    //texto 13
    doc.fontSize(8).font('Arial Bold').text('DÉCIMO TERCERA: EXCLUSIVIDAD', {
      underline: true,
      align: 'left',
    });
    //parrafo 13.1
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text('es contratado de forma exclusiva por ', { continued: true })
      .font('Arial Bold')
      .text('EL EMPLEADOR, ', { continued: true })
      .font('Arial Normal')
      .text(
        'por lo que no podrá dedicarse a otra actividad distinta de la que emana del presente contrato, salvo autorización previa, expresa y por escrito de ',
        { continued: true },
      )
      .font('Arial Bold')
      .text('EL EMPLEADOR.')
      .moveDown(1);
    //text 14
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('DÉCIMO CUARTA: NO COMPETENCIA', {
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
    //parrafo 14.2
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('14.2     ', { continued: true })
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
    //parrafo 14.4
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('14.4     ', { continued: true })
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
    //texto 15
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('DÉCIMO QUINTA: RESERVA Y CONFIDENCIALIDAD', {
        underline: true,
        align: 'left',
      })
      .moveDown(1);
    //parrafo 15.1
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('15.1     ', { continued: true, align: 'justify' })
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
        'y/o sus representantes, a las que hubiera tenido acceso con motivo de la',
      )
      .font('Arial Normal')
      .text('                       ', { continued: true })
      .font('Arial Normal')
      .text('prestación de sus servicios para ', { continued: true })
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
      .text('salvo que dicha persona necesite conocer tal información por')
      .font('Arial Normal')
      .text('                       ', { continued: true })
      .font('Arial Normal')
      .text(
        'razón de sus funciones. Si hubiese cualquier duda sobre lo que constituye información confidencial, o sobre si',
      )
      .font('Arial Normal')
      .text('                       ', { continued: true })
      .font('Arial Normal')
      .text('la información debe ser revelada y a quién, ', {
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
    //parrafor 15.2

    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('15.1     ', { continued: true, align: 'justify' })
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
    //parrafo 15.3
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('15.3     ', { continued: true, align: 'justify' })
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
    //parrafo 15.4
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('15.4     ', { continued: true, align: 'justify' })
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

    //texto 16
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text(
        'DÉCIMO SEXTA: SEGURIDAD Y CONFIDENCIALIDAD EN EL TRATAMIENTO DE DATOS PERSONALES ',
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
      .text('labores, éste deberá cumplir la normativa interna aprobada por ', {
        continued: true,
      })
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
    //parrafo 16.2
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('16.2     ', { continued: true, align: 'justify' })
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
      .text('N° 29733, y su Reglamento, así como en la normativa interna de ', {
        continued: true,
      })
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
    //parrafo 16.3
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('16.3     ', { continued: true, align: 'justify' })
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
    //text 17
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text(
        'DÉCIMO SÉTIMA: CUMPLIMIENTO DE LAS NORMAS DE CONDUCTA ÉTICA, RESPONSABILIDAD ADMINISTRATIVA DE LAS PERSONAS JURÍDICAS, PREVENCIÓN DE LAVADO DE ACTIVOS Y FINANCIAMIENTO DEL TERRORISMO Y NORMAS QUE SANCIONAN DELITOS DE CORRUPCIÓN COMETIDOS ENTRE PRIVADOS QUE AFECTEN EL NORMAL DESARROLLO DE LAS RELACIONES COMERCIALES Y LA COMPETENCIA LEAL ENTRE EMPRESAS',
        {
          underline: true,
          align: 'left',
        },
      )

      .moveDown(1);

    //parrafo 17.1
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('17.1     ', { continued: true, align: 'justify' })
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
    //parrafo 17.2
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('17.2     ', { continued: true, align: 'justify' })
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
    //PARRAFOR 17.3
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('17.3     ', { continued: true, align: 'justify' })
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

    //PARRAFOR 17.4
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('17.4     ', { continued: true, align: 'justify' })
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

    //PARRAFOR 17.5
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('17.5     ', { continued: true, align: 'justify' })
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
      .text('EL EMPLEADOR ', { continued: true, align: 'justify' })
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
    //TEXTO 20
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('VIGESIMA: VALIDEZ', {
        underline: true,
        align: 'left',
      })
      .moveDown(1);

    doc
      .fontSize(8)
      .font('Arial Normal')
      .text(
        'Las partes ratifican que el presente contrato constituye un acto jurídico válido que no se encuentra afectado por causal de invalidez o ineficacia alguna y se presentará al Ministerio de Trabajo y Promoción del Empleo dentro de los primeros quince (15) días de celebrado.',
      )
      .moveDown(1);
    //TEXTO 21
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('VIGESIMA PRIMERA: DOMICILIO', {
        underline: true,
        align: 'left',
      })
      .moveDown(1);
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text(
        'Para todos los efectos legales del presente Contrato, las partes fijan como sus domicilios, los señalados en la introducción de este contrato. Cualquier cambio de domicilio deberá ser comunicado por escrito a la otra parte, mediante comunicación escrita, de lo contrario se entenderá que todas las notificaciones se han realizado válidamente.',
      )
      .moveDown(1);
    //TEXTO 22
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('VIGESIMA SEGUNDA: SOLUCIÓN DE DISPUTAS', {
        underline: true,
        align: 'left',
      })
      .moveDown(1);

    doc
      .fontSize(8)
      .font('Arial Normal')
      .text(
        'En el improbable caso de que lleguen a existir discrepancias, controversias o reclamaciones derivadas de la validez, alcance, interpretación o aplicación del presente contrato, las partes se comprometen a poner el mejor de sus esfuerzos con el fin de lograr una solución armoniosa a sus diferencias.',
      )
      .moveDown(1);

    doc
      .fontSize(8)
      .font('Arial Normal')
      .text(
        'Si lo señalado en el párrafo anterior resulta infructuoso para resolver el conflicto surgido, las partes convienen renunciar al fuero judicial de sus domicilios o centros de trabajo, y se someten a la jurisdicción de los jueces del Distrito Judicial de Lima - Cercado.',
      )
      .moveDown(1);

    //TEXTO 22
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('VIGESIMA TERCERA: APLICACIÓN SUPLETORIA', {
        underline: true,
        align: 'left',
      })
      .moveDown(1);

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
        `En señal de conformidad, las partes suscriben dos (02) ejemplares del presente contrato en la ciudad de ${data.province}, el día ${data.entryDate}, quedando un ejemplar en poder del empleador y otro en poder del trabajador, quien declara haber recibido una copia del contrato y estar de acuerdo con su contenido.`,
        { align: 'justify' },
      )
      .moveDown(8);

    // CONFIGURACIÓN DE ESPACIO
    const imageWidth = 85; // Reducido ligeramente para evitar choques
    const imageHeight = 50;
    const signatureGap = 10; // Espacio entre texto y firmas

    // Altura estimada del bloque completo (Imagen + Linea + 4 lineas de texto)
    const estimatedBlockHeight = imageHeight + 80;
    const pageHeight = doc.page.height;
    // Margen de seguridad inferior (el margen del doc es muy pequeño, damos un poco más)
    const safeMarginBottom = doc.page.margins.bottom + 20;

    // 1. CONTROL DE SALTO DE PÁGINA
    // Si no cabe todo el bloque, pasamos a la siguiente hoja
    if (doc.y + estimatedBlockHeight > pageHeight - safeMarginBottom) {
      doc.addPage();
    } else {
      // Si cabe, bajamos el cursor para dejar espacio a la imagen (que va "hacia arriba")
      doc.y += imageHeight + signatureGap;
    }

    // Guardamos la posición Y base para las LÍNEAS (el suelo de la firma)
    const lineY = doc.y;
    const imageY = lineY - imageHeight - 5;

    // 2. CÁLCULO DE COLUMNAS (Matemática exacta)
    const marginLeft = doc.page.margins.left;
    const marginRight = doc.page.margins.right;
    const availableWidth = doc.page.width - marginLeft - marginRight;

    // Dividimos en 3 columnas iguales
    const colWidth = availableWidth / 3;

    // Definimos un ancho máximo para el texto y la línea (dejando aire a los lados)
    // Dejamos 10px de margen a la derecha de cada columna para que no se toquen
    const contentWidth = colWidth - 10;

    // Coordenadas X de inicio para cada columna
    const col1X = marginLeft;
    const col2X = marginLeft + colWidth;
    const col3X = marginLeft + colWidth * 2;

    // Centrado de la línea dentro de su columna
    // Calculamos cuánto mover la línea para que quede al medio de su caja
    const paddingX = (colWidth - contentWidth) / 2;

    const line1X = col1X + paddingX;
    const line2X = col2X + paddingX;
    const line3X = col3X + paddingX;

    // Coordenadas para centrar las imágenes
    const img1X = line1X + (contentWidth - imageWidth) / 2;
    const img2X = line2X + (contentWidth - imageWidth) / 2;

    // --- COLUMNA 1: EMPLEADOR 1 ---
    try {
      if (typeof SIGNATURE_EMPLOYEE !== 'undefined') {
        doc.image(SIGNATURE_EMPLOYEE, img1X, imageY, {
          width: imageWidth,
          height: imageHeight,
          fit: [imageWidth, imageHeight],
          align: 'center',
        });
      }
    } catch (e) {}

    // Línea
    doc
      .moveTo(line1X, lineY)
      .lineTo(line1X + contentWidth, lineY)
      .stroke();

    // Texto (Usamos layout dinámico, no coordenadas fijas Y)
    // 1. Título
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('EL EMPLEADOR', line1X, lineY + 5, {
        width: contentWidth,
        align: 'center',
      });

    // 2. Datos (Reseteamos posición X, dejamos que Y fluya)
    const signer1Name =
      typeof FULL_NAME_PRIMARY_EMPLOYEE !== 'undefined'
        ? FULL_NAME_PRIMARY_EMPLOYEE
        : '';
    const signer1DNI =
      typeof DNI_EMPLOYEE_PRIMARY !== 'undefined' ? DNI_EMPLOYEE_PRIMARY : '';

    doc.font('Arial Normal').text(`NOMBRE: ${signer1Name}`, line1X, doc.y, {
      width: contentWidth,
      align: 'left',
    });

    doc.text(`DNI N° ${signer1DNI}`, line1X, doc.y, {
      width: contentWidth,
      align: 'left',
    });

    // --- COLUMNA 2: EMPLEADOR 2 ---
    // IMPORTANTE: Reseteamos Y a la posición inicial debajo de la línea para empezar esta columna
    // Pero primero calculamos donde terminó la columna 1 para saber cuál es el punto más bajo
    let maxY = doc.y;

    try {
      if (typeof SIGNATURE_EMPLOYEE_TWO !== 'undefined') {
        doc.image(SIGNATURE_EMPLOYEE_TWO, img2X, imageY, {
          width: imageWidth,
          height: imageHeight,
          fit: [imageWidth, imageHeight],
          align: 'center',
        });
      }
    } catch (e) {}

    doc
      .moveTo(line2X, lineY)
      .lineTo(line2X + contentWidth, lineY)
      .stroke();

    // Título
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('EL EMPLEADOR', line2X, lineY + 5, {
        width: contentWidth,
        align: 'center',
      });

    // Datos
    const signer2Name = FULL_NAME_SECOND_EMPLOYEE;
    const signer2DNI =
      typeof DNI_EMPLOYEE_SECOND !== 'undefined' ? DNI_EMPLOYEE_SECOND : '';

    doc.font('Arial Normal').text(`NOMBRE: ${signer2Name}`, line2X, doc.y, {
      width: contentWidth,
      align: 'left',
    });

    doc.text(`DNI N° ${signer2DNI}`, line2X, doc.y, {
      width: contentWidth,
      align: 'left',
    });

    if (doc.y > maxY) maxY = doc.y; // Actualizamos el punto más bajo

    // --- COLUMNA 3: TRABAJADOR ---
    doc
      .moveTo(line3X, lineY)
      .lineTo(line3X + contentWidth, lineY)
      .stroke();

    // Título
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('EL TRABAJADOR', line3X, lineY + 5, {
        width: contentWidth,
        align: 'center',
      });

    // Datos
    // Aquí es donde solía haber problemas si el nombre es largo
    doc.font('Arial Normal');

    // Nombre
    doc.text(
      `NOMBRE: ${data.name} ${data.lastNameFather} ${data.lastNameMother}`,
      line3X,
      doc.y,
      {
        width: contentWidth, // Esto obliga al texto a bajar de línea si no cabe
        align: 'left',
      },
    );

    // DNI (Se escribirá justo debajo de donde termine el nombre, aunque el nombre ocupe 2 o 3 líneas)
    doc.text(`DNI: ${data.dni}`, line3X, doc.y, {
      width: contentWidth,
      align: 'left',
    });

    // División
    doc.text(`DIVISIÓN: ${data.subDivisionOrParking}`, line3X, doc.y, {
      width: contentWidth,
      align: 'left',
    });
    doc.end();
  });
};
export const generateProcessingOfPresonalDataPDF = async (
  data: EmployeeData,
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4' });
    doc.page.margins.top = 30.12; // 2.05 cm
    doc.page.margins.bottom = 33.89; // 0.49 cm
    doc.page.margins.left = 60.69; // 1.23 cm
    doc.page.margins.right = 55.69; // 1.55 cm

    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.registerFont('Arial Bold', arialBold);
    doc.registerFont('Arial Normal', arialNormal);
    const fullName =
      `${data.lastNameFather || ' '} ${data.lastNameMother || ' '} ${data.name || ''}`
        .trim()
        .replace(/\s+/g, ' ');

    doc
      .font('Arial Bold')
      .fontSize(8)
      .text('TRATAMIENTO DE DATOS PERSONALES', {
        align: 'center',
        underline: true,
      })
      .moveDown(2);
    doc
      .fontSize(7)
      .font('Arial Normal')
      .text(`El Sr. `, {
        continued: true,
        align: 'justify',
      })
      .font('Arial Bold')
      .text(`${fullName} `, {
        continued: true,
        align: 'justify',
      })
      .font('Arial Normal')
      .text('identificado con DNI N° ', {
        continued: true,
        align: 'justify',
      })
      .font('Arial Normal')
      .text(`${data.dni} `, {
        continued: true,
        align: 'justify',
      })
      .font('Arial Normal')
      .text('(en adelante ', {
        continued: true,
        align: 'justify',
      })
      .font('Arial Bold')
      .text('”EL TRABAJADOR”) ', {
        continued: true,
        align: 'justify',
      })
      .font('Arial Normal')
      .text(
        'declara conocer que sus datos personales entregados o que se entreguen a',
        { continued: true, align: 'justify' },
      )
      .font('Arial Bold')
      .text('INVERSIONES URBANÍSTICAS OPERADORA S.A. ', {
        continued: true,
        align: 'justify',
      })
      .font('Arial Normal')
      .text(
        'como consecuencia de la ejecución del contrato de trabajo, se encuentran incorporados en el banco de datos denominado ',
        { continued: true, align: 'justify' },
      )
      .font('Arial Bold')
      .text('“RECURSOS HUMANOS” ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('de titularidad de ', { continued: true, align: 'justify' })
      .font('Arial Bold')
      .text('INVERSIONES URBANÍSTICAS OPERADORA S.A ', {
        continued: true,
        align: 'justify',
      })
      .font('Arial Normal')
      .text('(en adelante ', {
        continued: true,
        align: 'justify',
      })
      .font('Arial Bold')
      .text('“INVERSIONES URBANÍSTICAS OPERADORA”).')
      .moveDown(1);

    doc
      .fontSize(7)
      .font('Arial Normal')
      .text('El tratamiento que realizará ', {
        continued: true,
        align: 'justify',
      })
      .font('Arial Bold')
      .text('INVERSIONES URBANÍSTICAS OPERADORA ', { continued: true })
      .font('Arial Normal')
      .text(
        'consiste en conservar, registrar, organizar, almacenar, consultar, extraer y utilizar los datos personales con la finalidad de gestionar los recursos humanos de la empresa, como es el caso de la elaboración de las planillas, gestión de la seguridad y salud en el trabajo, cumplimiento de las exigencias y requerimientos del Ministerio de Trabajo y Promoción del Empleo, así como de la Superintendencia Nacional de Aduanas y Administración Tributaria y, todo lo que implica la gestión y seguimiento de la relación laboral, lo cual incluye las capacitaciones, evaluaciones periódicas del personal, entrega de beneficios, y envío de información a las empresas del grupo empresarial, para efectos de control y cumplimiento de las políticas institucionales, entre otros, vinculados exclusivamente a la ejecución de la relación contractual.',
        {
          continued: true,
          align: 'justify',
        },
      );
    doc
      .fontSize(7)
      .font('Arial Normal')
      .text(
        'Cabe indicar que en la medida que la prestación de servicios a cargo de ',
        {
          continued: true,
          align: 'justify',
        },
      )
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text('importe su destaque en las instalaciones de los clientes de ', {
        continued: true,
        align: 'justify',
      })
      .font('Arial Bold')
      .text('INVERSIONES URBANÍSTICAS OPERADORA, ', { continued: true })
      .font('Arial Normal')
      .text(
        'para la prestación del servicio de administración y operación de playa de estacionamiento y valet parking por parte de este último, ',
        {
          continued: true,
          align: 'justify',
        },
      )
      .font('Arial Bold')
      .text('INVERSIONES URBANÍSTICAS OPERADORA, ', { continued: true })
      .font('Arial Normal')
      .text('se encuentra facultado a remitir información de ', {
        continued: true,
      })
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text(
        'a su cliente, relativa al cumplimiento de las obligaciones laborales a su cargo, de conformidad con la normatividad de la materia.',
      )
      .moveDown(1);

    doc
      .fontSize(7)
      .font('Arial Normal')
      .text(
        'Para efectos de cumplir con la finalidad señalada en el párrafo anterior, ',
        {
          continued: true,
          align: 'justify',
        },
      )
      .font('Arial Bold')
      .text('INVERSIONES URBANÍSTICAS OPERADORA ', { continued: true })
      .font('Arial Normal')
      .text(
        'cuenta con el apoyo de otras empresas, terceros proveedores de servicios, que actúan en calidad de encargados de tratamiento; los cuales, tienen acceso a los datos personales de los trabajadores; sin perjuicio de las medidas de seguridad establecidas para el efecto.',
      )
      .moveDown(1);

    doc
      .fontSize(7)
      .font('Arial Normal')
      .text('Los datos personales del ', {
        continued: true,
        align: 'justify',
      })
      .font('Arial Bold')
      .text('TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text('recolectados por ', { continued: true })
      .font('Arial Bold')
      .text('INVERSIONES URBANÍSTICAS OPERADORA ', { continued: true })
      .font('Arial Normal')
      .text('son necesarios para la ejecución de la relación laboral.')
      .moveDown(1);

    doc
      .fontSize(7)
      .font('Arial Normal')
      .text(
        'Con posterioridad a la conclusión del contrato, los datos personales de ',
        {
          continued: true,
          align: 'justify',
        },
      )
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text(
        'serán conservados únicamente a fin de ser puestos a disposición de las administraciones públicas, el Poder Judicial y demás autoridades, en ejercicios de sus funciones, de acuerdo a los plazos establecidos por ley para el efecto.',
      )
      .moveDown(1);

    doc
      .fontSize(7)
      .font('Arial Normal')
      .text('Además, mediante la presente se informa al ', {
        continued: true,
        align: 'justify',
      })
      .font('Arial Bold')
      .text('TRABAJADOR, ', { continued: true })
      .font('Arial Normal')
      .text(
        'que con fines de control laboral, acorde a lo dispuesto por el artículo 9º del Texto Único Ordenado del Decreto Legislativo N° 728, Ley de Productividad y Competitividad Laboral, aprobado por Decreto Supremo No. 003-97-TR, el desempeño de sus funciones podrá ser video vigilado, actividad que se realizará atendiendo a criterios de razonabilidad y proporcionalidad, y sin afectar los derechos del ',
        { continued: true },
      )
      .font('Arial Bold')
      .text('TRABAJADOR.')
      .moveDown(1);

    doc
      .fontSize(7)
      .font('Arial Normal')
      .text('El ejercicio por parte del ', {
        continued: true,
        align: 'justify',
      })
      .font('Arial Bold')
      .text('TRABAJADOR, ', { continued: true })
      .font('Arial Normal')
      .text(
        'de sus derechos de acceso, rectificación, cancelación y oposición, se podrá llevar a cabo en los términos dispuestos en la Ley N° 29733 - Ley de Protección de Datos Personales y su Reglamento, aprobado por el Decreto Supremo N° 003-2013-JUS, presentando una solicitud escrita ante la Oficina de Capital Humano de ',
        { continued: true },
      )
      .font('Arial Bold')
      .text('INVERSIONES URBANÍSTICAS OPERADORA, ', { continued: true })
      .font('Arial Normal')
      .text(
        'ubicada en Calle Dean Valdivia N°148 Int.1401 Urb. Jardín (Edificio Platinium), Distrito de San Isidro. Asimismo, ',
        { continued: true },
      )
      .font('Arial Normal')
      .text('“INVERSIONES URBANÍSTICAS OPERADORA”', { continued: true })
      .font('Arial Normal')
      .text(
        'le informa que podrá establecer otros canales para tramitar estas solicitudes, lo que será informado oportunamente en la página web.”',
      )
      .moveDown(8);

    // CONFIGURACIÓN DE ESPACIO
    const imageWidth = 85; // Reducido ligeramente para evitar choques
    const imageHeight = 50;
    const signatureGap = 10; // Espacio entre texto y firmas

    // Altura estimada del bloque completo (Imagen + Linea + 4 lineas de texto)
    const estimatedBlockHeight = imageHeight + 80;
    const pageHeight = doc.page.height;
    // Margen de seguridad inferior (el margen del doc es muy pequeño, damos un poco más)
    const safeMarginBottom = doc.page.margins.bottom + 20;

    // 1. CONTROL DE SALTO DE PÁGINA
    // Si no cabe todo el bloque, pasamos a la siguiente hoja
    if (doc.y + estimatedBlockHeight > pageHeight - safeMarginBottom) {
      doc.addPage();
    } else {
      // Si cabe, bajamos el cursor para dejar espacio a la imagen (que va "hacia arriba")
      doc.y += imageHeight + signatureGap;
    }

    // Guardamos la posición Y base para las LÍNEAS (el suelo de la firma)
    const lineY = doc.y;
    const imageY = lineY - imageHeight - 5;

    // 2. CÁLCULO DE COLUMNAS (Matemática exacta)
    const marginLeft = doc.page.margins.left;
    const marginRight = doc.page.margins.right;
    const availableWidth = doc.page.width - marginLeft - marginRight;

    // Dividimos en 3 columnas iguales
    const colWidth = availableWidth / 3;

    // Definimos un ancho máximo para el texto y la línea (dejando aire a los lados)
    // Dejamos 10px de margen a la derecha de cada columna para que no se toquen
    const contentWidth = colWidth - 10;

    // Coordenadas X de inicio para cada columna
    const col1X = marginLeft;
    const col2X = marginLeft + colWidth;
    const col3X = marginLeft + colWidth * 2;

    // Centrado de la línea dentro de su columna
    // Calculamos cuánto mover la línea para que quede al medio de su caja
    const paddingX = (colWidth - contentWidth) / 2;

    const line1X = col1X + paddingX;
    const line2X = col2X + paddingX;
    const line3X = col3X + paddingX;

    // Coordenadas para centrar las imágenes
    const img1X = line1X + (contentWidth - imageWidth) / 2;
    const img2X = line2X + (contentWidth - imageWidth) / 2;

    // --- COLUMNA 1: EMPLEADOR 1 ---
    try {
      if (typeof SIGNATURE_EMPLOYEE !== 'undefined') {
        doc.image(SIGNATURE_EMPLOYEE, img1X, imageY, {
          width: imageWidth,
          height: imageHeight,
          fit: [imageWidth, imageHeight],
          align: 'center',
        });
      }
    } catch (e) {}

    // Línea
    doc
      .moveTo(line1X, lineY)
      .lineTo(line1X + contentWidth, lineY)
      .stroke();

    // Texto (Usamos layout dinámico, no coordenadas fijas Y)
    // 1. Título
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('EL EMPLEADOR', line1X, lineY + 5, {
        width: contentWidth,
        align: 'center',
      });

    // 2. Datos (Reseteamos posición X, dejamos que Y fluya)
    const signer1Name =
      typeof FULL_NAME_PRIMARY_EMPLOYEE !== 'undefined'
        ? FULL_NAME_PRIMARY_EMPLOYEE
        : '';
    const signer1DNI =
      typeof DNI_EMPLOYEE_PRIMARY !== 'undefined' ? DNI_EMPLOYEE_PRIMARY : '';

    doc.font('Arial Normal').text(`NOMBRE: ${signer1Name}`, line1X, doc.y, {
      width: contentWidth,
      align: 'left',
    });

    doc.text(`DNI N° ${signer1DNI}`, line1X, doc.y, {
      width: contentWidth,
      align: 'left',
    });

    // --- COLUMNA 2: EMPLEADOR 2 ---
    // IMPORTANTE: Reseteamos Y a la posición inicial debajo de la línea para empezar esta columna
    // Pero primero calculamos donde terminó la columna 1 para saber cuál es el punto más bajo
    let maxY = doc.y;

    try {
      if (typeof SIGNATURE_EMPLOYEE_TWO !== 'undefined') {
        doc.image(SIGNATURE_EMPLOYEE_TWO, img2X, imageY, {
          width: imageWidth,
          height: imageHeight,
          fit: [imageWidth, imageHeight],
          align: 'center',
        });
      }
    } catch (e) {}

    doc
      .moveTo(line2X, lineY)
      .lineTo(line2X + contentWidth, lineY)
      .stroke();

    // Título
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('EL EMPLEADOR', line2X, lineY + 5, {
        width: contentWidth,
        align: 'center',
      });

    // Datos
    const signer2Name = FULL_NAME_SECOND_EMPLOYEE;
    const signer2DNI =
      typeof DNI_EMPLOYEE_SECOND !== 'undefined' ? DNI_EMPLOYEE_SECOND : '';

    doc.font('Arial Normal').text(`NOMBRE: ${signer2Name}`, line2X, doc.y, {
      width: contentWidth,
      align: 'left',
    });

    doc.text(`DNI N° ${signer2DNI}`, line2X, doc.y, {
      width: contentWidth,
      align: 'left',
    });

    if (doc.y > maxY) maxY = doc.y; // Actualizamos el punto más bajo

    // --- COLUMNA 3: TRABAJADOR ---
    doc
      .moveTo(line3X, lineY)
      .lineTo(line3X + contentWidth, lineY)
      .stroke();

    // Título
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('EL TRABAJADOR', line3X, lineY + 5, {
        width: contentWidth,
        align: 'center',
      });

    // Datos
    // Aquí es donde solía haber problemas si el nombre es largo
    doc.font('Arial Normal');

    // Nombre
    doc.text(
      `NOMBRE: ${data.name} ${data.lastNameFather} ${data.lastNameMother}`,
      line3X,
      doc.y,
      {
        width: contentWidth, // Esto obliga al texto a bajar de línea si no cabe
        align: 'left',
      },
    );

    // DNI (Se escribirá justo debajo de donde termine el nombre, aunque el nombre ocupe 2 o 3 líneas)
    doc.text(`DNI: ${data.dni}`, line3X, doc.y, {
      width: contentWidth,
      align: 'left',
    });

    // División
    doc.text(`DIVISIÓN: ${data.subDivisionOrParking}`, line3X, doc.y, {
      width: contentWidth,
      align: 'left',
    });
    doc.end();
  });
};
export const generateDocAnexo = async (data: EmployeeData): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
    });

    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Asegúrate de que estas fuentes estén definidas en tu archivo
    doc.registerFont('Arial Bold', arialBold);
    doc.registerFont('Arial Normal', arialNormal);

    doc.fontSize(8).font('Arial Bold').text('ANEXO 1', { align: 'center' });

    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('ANEXO 1', { align: 'center' })
      .font('Arial Bold')
      .text('RECOMENDACIONES EN MATERIA DE SEGURIDAD Y SALUD EN EL TRABAJO')
      .font('Arial Bold')
      .text('(Ley Nº 29783, Art. 35º, inc. c))', {
        align: 'center',
      })
      .moveDown(1.5);

    doc
      .fontSize(8)
      .font('Arial Normal')
      .text(
        'De acuerdo a lo establecido en el artículo 35 de la Ley N° 29783, Ley de Seguridad y Salud en el Trabajo, y el artículo 30 de su Reglamento aprobado por Decreto Supremo N° 005-2012-TR, por medio del presente documento ',
        { continued: true },
      )
      .font('Arial Bold')
      .text('EL EMPLEADOR ', { continued: true })
      .font('Arial Normal')
      .text(
        'cumple con describir las recomendaciones de seguridad y salud en el trabajo que deberá tener presente y cumplir ',
        { continued: true },
      )
      .font('Arial Bold')
      .text('EL TRABAJADOR, ', { continued: true })
      .font('Arial Normal')
      .text('en la ejecución de sus funciones para ', { continued: true })
      .font('Arial Normal')
      .text('EL EMPLEADOR ', { continued: true })
      .font('Arial Normal')
      .text('en el puesto de ', { continued: true })
      .font('Arial Bold')
      .text(`${data.position}`);

    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text(
        'deberá tener presente los siguientes riesgos propios del centro de trabajo donde prestará sus servicios, así como las medidas de protección y prevención en relación con tales riesgos:',
      )
      .moveDown(2);

    doc.table({
      columnStyles: [100, 200],
      data: [
        ['Riesgos asociados', 'Medidas de protección y prevención'],
        ['One value goes here', 'Another one here'],
      ],
    });

    doc.end();
  });
};
