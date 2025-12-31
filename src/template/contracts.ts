import { EmployeeData } from '../types/employees.interface';
import PDFDocument from 'pdfkit';
import path from 'path';
import {
  SIGNATURE_EMPLOYEE,
  SIGNATURE_EMPLOYEE_TWO,
} from '../constants/signatures';
import { formatCurrency } from '../utils/formatCurrency';
import fs from 'fs';
import {
  DNI_EMPLOYEE_PRIMARY,
  DNI_EMPLOYEE_SECOND,
  FULL_NAME_PRIMARY_EMPLOYEE,
  FULL_NAME_SECOND_EMPLOYEE,
} from './constants';

const arialNormal = fs.readFileSync(path.join(__dirname, '../fonts/ARIAL.TTF'));
const arialBold = fs.readFileSync(path.join(__dirname, '../fonts/ARIALBD.TTF'));

export const generatePartTimeContract = (
  data: EmployeeData,
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const cmToPt = (cm: number) => cm * 28.3465;
    const doc = new PDFDocument({
      size: 'A4',
      margins: {
        top: cmToPt(2.12),
        bottom: cmToPt(2.4),
        left: cmToPt(2.4),
        right: cmToPt(2.7),
      },
    });

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
    // --- VARIABLES DE ALINEACIÓN ---
    const marginL = doc.page.margins.left;
    const numberWidth = 25;
    const textX = marginL + numberWidth;
    const textWidth = doc.page.width - doc.page.margins.right - textX;
    const fullWidth =
      doc.page.width - doc.page.margins.left - doc.page.margins.right;

    // TÍTULO
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('CONTRATO DE TRABAJO DE TIEMPO PARCIAL', {
        align: 'center',
        underline: true,
      })
      .moveDown(1);

    // INTRODUCCIÓN
    doc
      .font('Arial Normal')
      .text(
        'Conste por el presente documento, que se suscribe por duplicado con igual tenor y valor, Contrato de Trabajo a Tiempo Parcial que, al amparo de lo dispuesto en los Artículos 53 y 57 del Texto Único Ordenado del Decreto Legislativo Nº 728 (Decreto Supremo Nº 003-97- TR, Ley de Productividad y Competitividad Laboral) y el Decreto Supremo N° 002-97-TR, celebran, de una parte, la empresa ',
        {
          continued: true,
          align: 'justify',
          lineGap: 2,
        },
      );
    doc.font('Arial Bold').text('INVERSIONES URBANÍSTICAS OPERADORA S.A. ', {
      continued: true,
      align: 'justify',
      lineGap: 2,
    });
    doc
      .font('Arial Normal')
      .text(
        ', con R.U.C. Nº 20603381697, con domicilio en Calle Dean Valdivia N°148 Int.1401 Urb. Jardín (Edificio Platinium), Distrito de San Isidro, Provincia y Departamento de Lima, debidamente representada por la Sra. Catherine Susan Chang López identificado con D.N.I. Nº 42933662 y por la Sra. Maria Estela Guillen Cubas, identificada con DNI Nº 10346833, según poderes inscritos en la Partida Electrónica 14130887 del Registro de Personas Jurídicas de Lima, a quien en adelante se le denominará "EL EMPLEADOR"; y de otra parte, el Sr.(a). ',
        {
          continued: true,
          align: 'justify',
          lineGap: 2,
        },
      );

    doc.font('Arial Bold').text(fullName.trim(), {
      continued: true,
      align: 'justify',
      lineGap: 2,
    });
    doc.font('Arial Normal').text(' identificado con ', {
      continued: true,
      align: 'justify',
      lineGap: 2,
    });

    doc.font('Arial Bold').text(`DNI N° ${data.dni.trim()} `, {
      continued: true,
      align: 'justify',
      lineGap: 2,
    });

    doc
      .font('Arial Normal')
      .text(', de nacionalidad peruana, con domicilio en ', {
        continued: true,
        align: 'justify',
        lineGap: 2,
      });

    doc.font('Arial Bold').text(data.address.trim(), {
      continued: true,
      align: 'justify',
      lineGap: 2,
    });

    doc.font('Arial Normal').text(', Distrito de ', {
      continued: true,
      align: 'justify',
      lineGap: 2,
    });

    doc.font('Arial Bold').text(data.district.trim(), {
      continued: true,
      align: 'justify',
      lineGap: 2,
    });

    doc.font('Arial Normal').text(', Provincia de ', {
      continued: true,
      align: 'justify',
      lineGap: 2,
    });

    doc.font('Arial Bold').text(`${data.province.trim()} `, {
      continued: true,
      align: 'justify',
      lineGap: 2,
    });

    doc.font('Arial Normal').text('y Departamento de ', {
      continued: true,
      align: 'justify',
      lineGap: 2,
    });

    doc.font('Arial Bold').text(`${data.department.trim()} `, {
      continued: true,
      align: 'justify',
      lineGap: 2,
    });
    doc
      .font('Arial Normal')
      .text(
        'a quien en adelante se le denominará "EL TRABAJADOR"; en los términos y condiciones siguientes:',
        {
          continued: false,
          align: 'justify',
          lineGap: 2,
        },
      );

    doc.moveDown(1);

    // --- PRIMERO ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('PRIMERO: PARTES DEL CONTRATO', marginL, doc.y, {
        align: 'left',
        underline: true,
      });

    doc.moveDown(1);
    let currentY = doc.y;

    // 1.1
    doc.font('Arial Normal').text('1.1', marginL, currentY);
    doc.font('Arial Bold').text('EL EMPLEADOR ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc
      .font('Arial Normal')
      .text(
        'es una sociedad anónima debidamente constituida e inscrita en la Partida No. 14130887 del Registro de Personas Jurídicas de la Ciudad de Lima, cuyo objeto social es la prestación de servicios de administración, promoción, desarrollo y operación de playas de estacionamiento, sistemas de peaje y actividades conexas.',
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    // 1.2
    currentY = doc.y;
    doc.font('Arial Normal').text('1.2', marginL, currentY);
    doc.font('Arial Bold').text('EL EMPLEADOR ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc
      .font('Arial Normal')
      .text(
        'para realizar actividades comerciales y de servicios en las distintas divisiones de negocios, requiere contar contratar personal que desempeñará labores a tiempo parcial.',
        { width: textWidth, align: 'justify', continued: false },
      );

    // 1.3
    currentY = doc.y;
    doc.font('Arial Normal').text('1.3', marginL, currentY);
    doc.font('Arial Bold').text('EL TRABAJADOR ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc
      .font('Arial Normal')
      .text(
        'declara estar capacitado y no tener impedimento físico ni legal para desempeñar las funciones que le encomienda ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text('en el marco del presente ', { continued: true });
    doc.font('Arial Bold').text('CONTRATO.', { continued: false });

    doc.moveDown(1);

    // --- SEGUNDO ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('SEGUNDA: OBJETO DEL CONTRATO', marginL, doc.y, {
        align: 'left',
        underline: true,
      });

    doc.moveDown(1);

    // 2.1
    currentY = doc.y;
    doc.font('Arial Normal').text('2.1', marginL, currentY);
    doc
      .font('Arial Normal')
      .text('Por el presente documento ', textX, currentY, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc.font('Arial Normal').text('contrata a ', { continued: true });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text('para que realice actividades de ', { continued: true });
    doc.font('Arial Bold').text(`${data.position} `, { continued: true });
    doc
      .font('Arial Normal')
      .text(
        ', asumiendo las responsabilidades propias del puesto y de acuerdo a las estipulaciones contenidas en este Contrato.',
        { continued: false },
      );

    // 2.2
    currentY = doc.y;
    doc.font('Arial Normal').text('2.2', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Las partes reconocen y declaran que el cargo de EL TRABAJADOR está sujeto a fiscalización inmediata.',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(1);

    // --- TERCERO ---
    doc.fontSize(8).font('Arial Bold').text('TERCERO: PLAZO', marginL, doc.y, {
      align: 'left',
      underline: true,
    });

    doc.moveDown(1);

    // 3.1
    currentY = doc.y;
    doc.font('Arial Normal').text('3.1', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Atendiendo a las características propias del Contrato a Tiempo Parcial, ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc.font('Arial Normal').text('contrata a ', { continued: true });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text('por un plazo indeterminado.', { continued: false });

    // 3.2
    currentY = doc.y;
    doc.font('Arial Normal').text('3.2', marginL, currentY);
    doc
      .font('Arial Bold')
      .text('EL EMPLEADOR y/o EL TRABAJADOR ', textX, currentY, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });
    doc
      .font('Arial Normal')
      .text(
        'podrán dar por terminado el presente contrato, sin expresión de causa, bastando para ello la comunicación previa a la otra parte con una anticipación de 05 (cinco) días calendarios.',
        { continued: false },
      );

    doc.moveDown(1);

    // --- CUARTO ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('CUARTO: JORNADA DE TRABAJO', marginL, doc.y, {
        align: 'left',
        underline: true,
      });

    doc.moveDown(1);

    // 4.1
    currentY = doc.y;
    doc.font('Arial Normal').text('4.1', marginL, currentY);
    doc
      .font('Arial Normal')
      .text('En relación a la Jornada de Trabajo, ', textX, currentY, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });
    doc
      .font('Arial Bold')
      .text('EL EMPLEADOR y EL TRABAJADOR ', { continued: true });
    doc.font('Arial Normal').text('acuerdan que ', { continued: true });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'cumplirá una jornada menor a cuatro (04) horas diarias en promedio a la semana, de conformidad con lo dispuesto en los artículos 11 y 12 del Decreto Supremo 001-96-TR, que aprueba el Reglamento de Ley de Fomento al Empleo, y las demás normas que regulan el contrato de trabajo a tiempo parcial.',
        { continued: false },
      );

    doc.moveDown(1);

    // --- QUINTO ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('QUINTO: REMUNERACION', marginL, doc.y, {
        align: 'left',
        underline: true,
      });

    doc.moveDown(1);

    // 5.1
    currentY = doc.y;
    doc.font('Arial Normal').text('5.1', marginL, currentY);
    doc.font('Arial Bold').text('EL TRABAJADOR ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc
      .font('Arial Normal')
      .text(
        'recibíra por la prestación integra y oportuna de sus servicios, una renumeración brutal mensual ',
        { continued: true },
      );

    // Formato moneda
    const salario = `S/ ${Number(data.salary).toFixed(2)}`;
    doc.font('Arial Bold').text(`${salario} `, { continued: true });
    doc.font('Arial Bold').text(`${data.salaryInWords} `, { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'más la asignación familiar correspondiente de ser el caso, de la cual se deducirán las aportaciones y descuentos por tributos establecidos en la ley que resulten aplicables.',
        { continued: false },
      );

    // 5.2
    currentY = doc.y;
    doc.font('Arial Normal').text('5.2', marginL, currentY);
    doc.font('Arial Normal').text('Adicionalmente, ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'tendrá derecho al pago de beneficios tales como las gratificaciones legales en los meses de julio y diciembre, de acuerdo a la legislación laboral vigente y sus respectivas modificaciones, al convenio celebrado o a las que ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });
    doc
      .font('Arial Normal')
      .text('a título de liberalidad, le otorgue.', { continued: false });

    // 5.3
    currentY = doc.y;
    doc.font('Arial Normal').text('5.3', marginL, currentY);
    doc.font('Arial Bold').text('EL TRABAJADOR ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc
      .font('Arial Normal')
      .text(
        'declara conocer que por sus horas de labor no le alcanza el derecho a la protección contra el despido arbitrario y a la compensación por tiempo de servicios.',
        { continued: false },
      );

    // 5.4
    currentY = doc.y;
    doc.font('Arial Normal').text('5.4', marginL, currentY);
    doc.font('Arial Normal').text('Será de cargo de ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'el pago del Impuesto a la Renta, los aportes al Sistema Nacional o Privado de Pensiones, las que en caso corresponda serán retenidas por ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'así como cualquier otro tributo o carga social que grave las remuneraciones del personal dependiente en el país.',
        { continued: false },
      );

    // 5.5
    currentY = doc.y;
    doc.font('Arial Normal').text('5.5', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Ambas partes acuerdan que la forma y fecha de pago de la remuneración podrá ser modificada por ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text('de acuerdo con sus necesidades operativas', { continued: false });

    doc.moveDown(1);
    // --- SEXTO ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text(
        'SEXTO: PRINCIPALES OBLIGACIONES DE EL TRABAJADOR',
        marginL,
        doc.y,
        {
          align: 'left',
          underline: true,
        },
      );

    doc
      .font('Arial Normal')
      .text('Por medio del presente documento, ', textX, doc.y, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });
    doc.moveDown(1);
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text('se obliga, referencialmente a:', { continued: false });

    // 6.1
    currentY = doc.y;
    doc.font('Arial Normal').text('6.1', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Prestar sus servicios, cumpliendo con las funciones, órdenes e instrucciones que imparta o señale ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'o sus representantes, para realizar las actividades que correspondan a su cargo.',
        { continued: false },
      );

    // 6.2
    currentY = doc.y;
    doc.font('Arial Normal').text('6.2', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'La prestación laboral deberá ser efectuada de manera personal, no pudiendo ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text('ser reemplazado ni asistido por terceros, debiendo ', {
        continued: true,
      });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'cumplir con las funciones inherentes al puesto encomendado y las labores adicionales y/o anexas que fuese necesario ejecutar y sean requeridas y/o determinadas por ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR.', { continued: false });

    // 6.3
    currentY = doc.y;
    doc.font('Arial Normal').text('6.3', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Prestar sus servicios con responsabilidad, prontitud, esmero y eficiencia, aportando su conocimiento y experiencia profesional en el cumplimiento de los objetivos y estrategias de ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR.', { continued: false });

    // 6.4
    currentY = doc.y;
    doc.font('Arial Normal').text('6.4', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Cumplir estrictamente la legislación peruana en materia laboral, el Reglamento Interno de Trabajo, el Reglamento de Seguridad y Salud en el Trabajo, el Reglamento de Hostigamiento Sexual y demás disposiciones, directivas, circulares, reglamentos, normas, etc., que expida ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text('declarando conocer todas aquellas que se encuentren vigentes.', {
        continued: false,
      });

    // 6.5
    currentY = doc.y;
    doc.font('Arial Normal').text('6.5', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'No ejecutar por su cuenta o en su beneficio, sea en forma directa o indirecta, actividad o negociaciones dentro del giro de ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'en cualquier forma o naturaleza, inclusive fuera de la jornada de trabajo y en días inhábiles o festivos. ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'declara entender que el incumplimiento a lo antes mencionado constituye una infracción de los deberes esenciales que emanan de su vínculo laboral, por lo que en el caso de no cumplir con su compromiso, tal acto será considerado como una falta grave.',
        { continued: false },
      );

    // 6.6
    currentY = doc.y;
    doc.font('Arial Normal').text('6.6', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Devolver en forma inmediata todos los materiales (documentos, informes, bienes, herramientas, vestimenta, etc.) que se le entreguen con ocasión del trabajo prestado si la relación laboral concluyese por cualquier causa.',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    // 6.7
    currentY = doc.y;
    doc.font('Arial Normal').text('6.7', marginL, currentY);
    doc.font('Arial Bold').text('EL TRABAJADOR ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc
      .font('Arial Normal')
      .text(
        'se obliga a respetar los procedimientos de evaluación de rendimiento y desempeño laboral que tiene establecido ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });
    doc
      .font('Arial Normal')
      .text('con el objeto de valorar el nivel de eficiencia logrado por ', {
        continued: true,
      });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text('en su puesto de trabajo.', { continued: false });

    // 6.8
    currentY = doc.y;
    doc.font('Arial Normal').text('6.8', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Cualquier otra obligación prevista en este contrato, establecida por ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'que se desprenda de su condición de trabajador y aquellas previstas en las normas que resulten aplicables.',
        { continued: false },
      );

    doc.moveDown(1);

    // --- SÉTIMO ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('SÉTIMO: OBLIGACIONES DEL EMPLEADOR', marginL, doc.y, {
        align: 'left',
        underline: true,
      });

    doc.moveDown(1);
    // 7.1
    currentY = doc.y;
    doc.font('Arial Normal').text('7.1', marginL, currentY);
    doc.font('Arial Normal').text('Pagar a ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'todos los derechos y beneficios que le correspondan de acuerdo a lo dispuesto en la legislación laboral vigente al momento del pago.',
        { continued: false },
      );

    // 7.2
    currentY = doc.y;
    doc.font('Arial Normal').text('7.2', marginL, currentY);
    doc
      .font('Arial Normal')
      .text('Registrar los pagos realizados a ', textX, currentY, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'en el Libro de Planillas de Remuneraciones de la Empresa y hacer entrega oportuna de la boleta de pago.',
        { continued: false },
      );

    // 7.3
    currentY = doc.y;
    doc.font('Arial Normal').text('7.3', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Poner en conocimiento de la Autoridad Administrativa de Trabajo el presente Contrato, para su conocimiento y registro, en cumplimiento de lo dispuesto en el Texto Único Ordenado del Decreto Legislativo Nº 728 (Decreto Supremo Nº 003-97-TR, Ley de Productividad y Competitividad Laboral).',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    // 7.4
    currentY = doc.y;
    doc.font('Arial Normal').text('7.4', marginL, currentY);
    doc
      .font('Arial Normal')
      .text('Retener de la remuneración bruta mensual de ', textX, currentY, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });
    doc.font('Arial Bold').text('EL TRABAJADOR, ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'las sumas correspondientes al aporte al Seguro Privado o Público de Pensiones, así como el Impuesto a la Renta.',
        { continued: false },
      );

    // 7.5
    currentY = doc.y;
    doc.font('Arial Normal').text('7.5', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Las otras contenidas en la legislación laboral vigente y en cualquier norma de carácter interno, incluyendo el Reglamento Interno de Trabajo, el Reglamento de Seguridad y Salud en el Trabajo y el Reglamento de Hostigamiento Sexual.',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(1);

    // --- OCTAVO ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('OCTAVO: DECLARACIONES DE LAS PARTES', marginL, doc.y, {
        align: 'left',
        underline: true,
      });

    doc.moveDown(1);
    doc
      .font('Arial Normal')
      .text(
        'Las partes reconocen, acuerdan y declaran lo siguiente:',
        textX,
        doc.y,
      );

    // 8.1
    currentY = doc.y;
    doc.font('Arial Normal').text('8.1', marginL, currentY);
    doc.font('Arial Bold').text('EL TRABAJADOR ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc
      .font('Arial Normal')
      .text(
        'se encuentra sujeto al régimen laboral de la actividad privada y le son aplicables los derechos y beneficios previstos en él.',
        { continued: false },
      );

    // 8.2
    currentY = doc.y;
    doc.font('Arial Normal').text('8.2', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'De acuerdo a la facultad establecida en el párrafo segundo del artículo 9 del Texto Único Ordenado de la Ley de Productividad y Competitividad Laboral, ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'se reserva la facultad de modificar en lugar de la prestación de los servicios, de acuerdo a las necesidades del negocio y observando el criterio de razonabilidad.',
        { continued: false },
      );

    // 8.3
    currentY = doc.y;
    doc.font('Arial Normal').text('8.3', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Sin perjuicio de las labores para las cuales ha sido contratado, las partes declaran que ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'prestará todas aquellas actividades conexas o complementarias a las propias del cargo que ocupará, que razonablemente correspondan.',
        { continued: false },
      );

    // 8.4
    currentY = doc.y;
    doc.font('Arial Normal').text('8.4', marginL, currentY);
    doc
      .font('Arial Normal')
      .text('Las partes convienen que ', textX, currentY, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'tiene facultades para organizar, fiscalizar, suprimir, modificar, reemplazar y sancionar, de modo radical o no sustancial, la prestación de servicios (tiempo, lugar, forma, funciones y modalidad) de ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL TRABAJADOR.', { continued: false });

    // 8.5
    currentY = doc.y;
    doc.font('Arial Normal').text('8.5', marginL, currentY);
    doc
      .font('Arial Bold')
      .text('EL TRABAJADOR y EL EMPLEADOR ', textX, currentY, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });
    doc
      .font('Arial Normal')
      .text(
        'acuerdan que las Boletas de Pago de remuneraciones podrán ser selladas y firmadas por el (los) representante (s) legal (es) de ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'con firma (s) digitalizada (s), una vez que la (s) firma (s) sea (n) inscrita (s) en el Registro de Firmas a cargo del Ministerio de Trabajado que se implementará una vez que se aprueben las disposiciones para la implementación del registro de firmas. Al respecto, ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'presta su consentimiento expreso para que su (s) Boleta (s) de Pago sea (n) suscritas por el (los) representante (s) de ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'a través de firma (s) digital (es), una vez que ello sea implementado por el Ministerio de Trabajo.',
        { continued: false },
      );

    // 8.6
    currentY = doc.y;
    doc.font('Arial Normal').text('8.6', marginL, currentY);
    doc
      .font('Arial Bold')
      .text('EL TRABAJADOR y EL EMPLEADOR ', textX, currentY, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });
    doc
      .font('Arial Normal')
      .text(
        'acuerdan que la entrega de la Boleta de Pago y demás documentos derivados de la relación laboral podrán efectuarse a través del empleo de tecnologías de la información y comunicación, tales como Intranet, Correo Electrónico u otro de similar naturaleza que implemente ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc.font('Arial Normal').text('prestando ', { continued: true });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text('su consentimiento expreso para ello. Asimismo, ', {
        continued: true,
      });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text('declara como su dirección electrónica ', { continued: true });
    doc.font('Arial Bold').text(`${data.email} `, { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'en caso se implemente la entrega de Boletas de Pago, a través de dicho medio; obligándose ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text('a informar por escrito a ', { continued: true });
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text('cualquier cambio de su dirección electrónica.', {
        continued: false,
      });

    doc.moveDown(1);
    // --- NOVENO ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('NOVENO: TÉRMINO DEL CONTRATO', marginL, doc.y, {
        align: 'left',
        underline: true,
      });

    // 9.1
    currentY = doc.y;
    doc.font('Arial Normal').text('9.1', marginL, currentY);
    doc
      .font('Arial Bold')
      .text('EL EMPLEADOR y/o EL TRABAJADOR, ', textX, currentY, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });
    doc
      .font('Arial Normal')
      .text(
        'según corresponda podrán dar por terminado el presente contrato, sin expresión de causa, bastando para ello la comunicación previa a la otra parte con una anticipación de 05 (cinco) días calendarios.',
        { continued: false },
      );

    // 9.2
    currentY = doc.y;
    doc.font('Arial Normal').text('9.2', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Además, son causales de resolución del presente contrato las siguientes:',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    const listX = textX + 15;
    const listTextWidth = textWidth - 15;

    doc.text('a) La voluntad concertada de las partes', listX, doc.y, {
      width: listTextWidth,
      align: 'left',
    });
    doc.text(
      'b) El incumplimiento de las obligaciones estipuladas en el presente documento.',
      listX,
      doc.y,
      { width: listTextWidth, align: 'left' },
    );
    doc
      .font('Arial Normal')
      .text('c) La comisión de falta grave por parte de ', listX, doc.y, {
        width: listTextWidth,
        align: 'left',
        continued: true,
      });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text('prevista en las normas que resulten aplicables.', {
        continued: false,
      });
    doc.text(
      'd) Cualquier otra causal prevista en este contrato o que se encuentre establecida en las normas aplicables.',
      listX,
      doc.y,
      { width: listTextWidth, align: 'left' },
    );

    doc.moveDown(1);

    // --- DECIMO ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('DÉCIMO: PROPIEDAD INTELECTUAL', marginL, doc.y, {
        align: 'left',
        underline: true,
      });
    doc.moveDown(1);

    // 10.1
    currentY = doc.y;
    doc.font('Arial Normal').text('10.1', marginL, currentY);
    doc.font('Arial Bold').text('EL TRABAJADOR ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc.font('Arial Normal').text('cede y transfiere a ', { continued: true });
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'en forma total, íntegra y exclusiva, los derechos patrimoniales derivados de los trabajos e informes que sean realizados en cumplimiento del presente contrato, quedando ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'facultado para publicar o reproducir en forma íntegra o parcial dicha información.',
        { continued: false },
      );

    doc.moveDown(0.5);

    // 10.2
    currentY = doc.y;
    doc.font('Arial Normal').text('10.2', marginL, currentY);
    doc.font('Arial Bold').text('EL TRABAJADOR, ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc
      .font('Arial Normal')
      .text('en virtud del presente contrato laboral, cede en exclusiva a ', {
        continued: true,
      });
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'todos los derechos alienables sobre las creaciones de propiedad intelectual de las obras que sean creadas por él en el ejercicio de sus funciones y cumplimiento de sus obligaciones.',
        { continued: false },
      );

    doc.moveDown(0.5);

    // 10.3
    currentY = doc.y;
    doc.font('Arial Normal').text('10.3', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Por lo tanto, toda información creada u originada es de propiedad exclusiva de ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });
    doc.font('Arial Normal').text('quedando ', { continued: true });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'prohibido de reproducirla, venderla o suministrarla a cualquier persona natural o jurídica, salvo autorización escrita de ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR. ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'Se deja constancia que la información comprende inclusive las investigaciones, los borradores y los trabajos preliminares.',
        { continued: false },
      );

    doc.moveDown(0.5);

    // 10.4
    currentY = doc.y;
    doc.font('Arial Normal').text('10.4', marginL, currentY);
    doc.font('Arial Normal').text('En ese sentido, ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc.font('Arial Normal').text('acepta que ', { continued: true });
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'tiene plenas facultades para acceder, revisar y leer, sin previa notificación, el íntegro del contenido de la información que se encuentre en cualquiera de los medios y/o herramientas proporcionados por ',
        { continued: true },
      );
    doc
      .font('Arial Bold')
      .text('EL EMPLEADOR a EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text('para el cumplimiento de sus funciones.', { continued: false });

    doc.moveDown(0.5);

    // 10.5
    currentY = doc.y;
    doc.font('Arial Normal').text('10.5', marginL, currentY);
    doc.font('Arial Bold').text('EL TRABAJADOR ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc
      .font('Arial Normal')
      .text(
        'declara que la remuneración acordada en el presente contrato comprende cualquier compensación correspondiente a los compromisos asumidos en la presente cláusula.',
        { continued: false },
      );

    doc.moveDown(1);

    // --- DECIMO PRIMERO ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('DÉCIMO PRIMERO: USO DE CORREO ELECTRÓNICO', marginL, doc.y, {
        align: 'left',
        underline: true,
      });

    doc.moveDown(0.5);

    // 11.1
    currentY = doc.y;
    doc.font('Arial Normal').text('11.1', marginL, currentY);
    doc.font('Arial Bold').text('EL EMPLEADOR ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc
      .font('Arial Normal')
      .text(
        'facilitará a EL TRABAJADOR un nombre de usuario y una contraseña dentro del dominio: @apparka.pe y/o cualquier dominio que pueda crear a futuro.',
        { continued: false },
      );

    doc.moveDown(0.5);

    // 11.2
    currentY = doc.y;
    doc.font('Arial Normal').text('11.2', marginL, currentY);
    doc.font('Arial Bold').text('EL TRABAJADOR ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc
      .font('Arial Normal')
      .text(
        'no podrá revelar su contraseña a otro personal o algún tercero, siendo plenamente responsable por el uso de dicha herramienta de trabajo. ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'reconoce y acepta que se encuentra prohibido el uso de los recursos informáticos proporcionados por la empresa para fines particulares, no autorizado, tanto en horario laboral, como fuera de él.',
        { continued: false },
      );

    doc.moveDown(0.5);

    // 11.3
    currentY = doc.y;
    doc.font('Arial Normal').text('11.3', marginL, currentY);
    doc.font('Arial Normal').text('En ese sentido, ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc.font('Arial Normal').text('acepta que ', { continued: true });
    doc.font('Arial Bold').text('LA EMPRESA ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'tiene plenas facultades para revisar y leer, sin previa notificación, el contenido de la información almacenada, enviada o recibida mediante el uso de los sistemas de correo electrónico. Al respecto, mediante la suscripción del presente contrato, se otorga a ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'copia de la “Política para el uso del correo electrónico y páginas web”, debiendo cumplir con los establecido en la misma, bajo responsabilidad.',
        { continued: false },
      );

    doc.moveDown(1);

    // --- DECIMO SEGUNDA ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('DÉCIMO SEGUNDA: EXCLUSIVIDAD', marginL, doc.y, {
        align: 'left',
        underline: true,
      });

    doc.moveDown(0.5);

    // 12.1
    currentY = doc.y;
    doc.font('Arial Normal').text('12.1', marginL, currentY);
    doc.font('Arial Bold').text('EL TRABAJADOR ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc
      .font('Arial Normal')
      .text('es contratado de forma exclusiva por ', { continued: true });
    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'por lo que no podrá dedicarse a otra actividad distinta de la que emana del presente contrato, salvo autorización previa, expresa y por escrito de ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR.', { continued: false });

    doc.moveDown(1);

    // --- DECIMO TERCERA ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('DÉCIMO TERCERA: NO COMPETENCIA', marginL, doc.y, {
        align: 'left',
        underline: true,
      });

    doc.moveDown(0.5);

    // 13.1
    currentY = doc.y;
    doc.font('Arial Normal').text('13.1', marginL, currentY);
    doc.font('Arial Bold').text('EL TRABAJADOR ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc
      .font('Arial Normal')
      .text('se compromete a no competir con ', { continued: true });
    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });
    doc
      .font('Arial Normal')
      .text('en los términos y condiciones que se acuerdan a continuación:', {
        continued: false,
      });

    doc.moveDown(0.5);

    // Listado a, b, c, d
    const bulletX = textX + 15;
    const contentX = bulletX + 20;
    const contentW = doc.page.width - doc.page.margins.right - contentX;

    currentY = doc.y;
    doc.font('Arial Normal').text('a.', bulletX, currentY);
    doc
      .font('Arial Normal')
      .text(
        'A no realizar ningún tipo de inversión en empresas o instituciones de cualquier tipo cuyas actividades puedan estar en conflicto con los intereses de ',
        contentX,
        currentY,
        {
          width: contentW,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR.', { continued: false });

    currentY = doc.y;
    doc.font('Arial Normal').text('b.', bulletX, currentY);
    doc
      .font('Arial Normal')
      .text(
        'A no prestar servicios en forma dependiente o independiente para personas, instituciones o empresas que compiten, directa o indirectamente, con ',
        contentX,
        currentY,
        {
          width: contentW,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR.', { continued: false });

    currentY = doc.y;
    doc.font('Arial Normal').text('c.', bulletX, currentY);
    doc
      .font('Arial Normal')
      .text(
        'A no utilizar la información de carácter reservado que le fue proporcionada por ',
        contentX,
        currentY,
        {
          width: contentW,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'para desarrollar por cuenta propia o de terceros, actividades que compitan con las que realiza o planeara realizar ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR.', { continued: false });

    currentY = doc.y;
    doc.font('Arial Normal').text('d.', bulletX, currentY);
    doc
      .font('Arial Normal')
      .text(
        'A no inducir o intentar influenciar, ni directa ni indirectamente, a ningún trabajador de ',
        contentX,
        currentY,
        {
          width: contentW,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'a que termine su empleo con el mismo, para que trabaje, dependiente o independientemente, para ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'o para cualquier otra persona, entidad, institución o empresa, que compita con ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR.', { continued: false });

    doc.moveDown(0.5);

    // 13.2
    currentY = doc.y;
    doc.font('Arial Normal').text('13.2', marginL, currentY);
    doc.font('Arial Normal').text('Las obligaciones que ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'asume en virtud al literal c) de la presente cláusula, regirán indefinidamente, independientemente de la vigencia del presente contrato.',
        { continued: false },
      );

    doc.moveDown(0.5);

    // 13.3
    currentY = doc.y;
    doc.font('Arial Normal').text('13.3', marginL, currentY);
    doc
      .font('Arial Normal')
      .text('El incumplimiento por parte de ', textX, currentY, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'de cualquiera de las obligaciones contenidas en la presente cláusula, facultará a ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'a iniciar las acciones legales que pudieran corresponder en defensa de sus derechos y a obtener la indemnización por daños y perjuicios a que hubiera lugar.',
        { continued: false },
      );

    doc.moveDown(0.5);

    // 13.4
    currentY = doc.y;
    doc.font('Arial Normal').text('13.4', marginL, currentY);
    doc.font('Arial Bold').text('EL TRABAJADOR ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc
      .font('Arial Normal')
      .text(
        'declara que la remuneración acordada en la cláusula sétima comprende cualquier compensación correspondiente a los compromisos asumidos en la presente cláusula.',
        { continued: false },
      );

    doc.moveDown(1);

    // --- DECIMO CUARTO ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('DÉCIMO CUARTO: RESERVA Y CONFIDENCIALIDAD', marginL, doc.y, {
        align: 'left',
        underline: true,
      });

    doc.moveDown(0.5);

    // 14.1
    currentY = doc.y;
    doc.font('Arial Normal').text('14.1', marginL, currentY);
    doc.font('Arial Bold').text('EL TRABAJADOR ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc
      .font('Arial Normal')
      .text(
        'se compromete a mantener reserva y confidencialidad absoluta con relación a la información y documentación obtenida con ocasión de su trabajo para ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });
    doc
      .font('Arial Normal')
      .text('en los términos y condiciones que se acuerdan a continuación:', {
        continued: false,
      });

    doc.moveDown(0.5);

    // Listado 14.1
    currentY = doc.y;
    doc.font('Arial Normal').text('a.', bulletX, currentY);
    doc
      .font('Arial Normal')
      .text(
        'A observar ante cualquier persona, entidad o empresa una discreción absoluta sobre cualquier actividad o información sobre ',
        contentX,
        currentY,
        {
          width: contentW,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'y/o sus representantes, a las que hubiera tenido acceso con motivo de la prestación de sus servicios para ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR.', { continued: false });

    currentY = doc.y;
    doc.font('Arial Normal').text('b.', bulletX, currentY);
    doc
      .font('Arial Normal')
      .text(
        'A no revelar a ninguna persona, entidad o empresa, ni usar para ningún propósito, en provecho propio o de terceros, cualquier información vinculada a ',
        contentX,
        currentY,
        {
          width: contentW,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text('de cualquier naturaleza.', { continued: false });

    currentY = doc.y;
    doc.font('Arial Normal').text('c.', bulletX, currentY);
    doc
      .font('Arial Normal')
      .text(
        'A no revelar a ninguna persona que preste servicios a ',
        contentX,
        currentY,
        {
          width: contentW,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });
    doc
      .font('Arial Normal')
      .text('ningún tipo de información confidencial o de propiedad de ', {
        continued: true,
      });
    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'salvo que dicha persona necesite conocer tal información por razón de sus funciones. Si hubiese cualquier duda sobre lo que constituye información confidencial, o sobre si la información debe ser revelada y a quién, ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL TRABAJADOR, ', { continued: true });
    doc
      .font('Arial Normal')
      .text('se obliga a solicitar autorización de sus superiores.', {
        continued: false,
      });

    currentY = doc.y;
    doc.font('Arial Normal').text('d.', bulletX, currentY);
    doc
      .font('Arial Normal')
      .text(
        'A no usar de forma inapropiada ni revelar información confidencial alguna o de propiedad de la persona, entidad o empresa para la cual laboró con anterioridad a ser contratado por ',
        contentX,
        currentY,
        {
          width: contentW,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });
    doc
      .font('Arial Normal')
      .text('así como a no introducir en las instalaciones de ', {
        continued: true,
      });
    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'ningún documento que no haya sido publicado ni ninguna clase de bien que pertenezca a cualquiera de dichas personas, entidades o empresas, sin su consentimiento previo. ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'se obliga igualmente a no violar ningún convenio de confidencialidad o sobre derechos de propiedad que haya firmado en conexión con tales personas, entidades o empresas.',
        { continued: false },
      );

    currentY = doc.y;
    doc.font('Arial Normal').text('e.', bulletX, currentY);
    doc.font('Arial Normal').text('A devolver a ', contentX, currentY, {
      width: contentW,
      align: 'justify',
      continued: true,
    });
    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'al concluir su prestación de servicios, sea cual fuere la causa, archivos, correspondencia, registros o cualquier documento o material contenido o fijado en cualquier medio o soporte, que se le hubiese proporcionado o que hubiesen sido creados en virtud de su relación de trabajo (incluyendo copias de los mismos), así como todo bien que se le hubiese entregado, incluyendo (sin limitación) todo distintivo de identificación, tarjetas de ingreso, uniforme, herramientas de trabajo y cualquier otro material otorgado.',
        { continued: false },
      );

    doc.moveDown(0.5);

    // 14.2
    currentY = doc.y;
    doc.font('Arial Normal').text('14.2', marginL, currentY);
    doc.font('Arial Normal').text('Las obligaciones que ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'asume en los literales a), b), c), d) y e) de la presente cláusula, regirán indefinidamente, independientemente de la vigencia del presente contrato.',
        { continued: false },
      );

    doc.moveDown(0.5);

    // 14.3
    currentY = doc.y;
    doc.font('Arial Normal').text('14.3', marginL, currentY);
    doc
      .font('Arial Normal')
      .text('El incumplimiento por parte de ', textX, currentY, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'de cualquiera de las obligaciones contenidas en la presente cláusula, facultará a ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'a iniciar las acciones legales que pudieran corresponder en defensa de sus derechos y a obtener la indemnización por daños y perjuicios a que hubiera lugar.',
        { continued: false },
      );

    doc.moveDown(0.5);

    // 14.4
    currentY = doc.y;
    doc.font('Arial Normal').text('14.4', marginL, currentY);
    doc.font('Arial Bold').text('EL TRABAJADOR ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc
      .font('Arial Normal')
      .text(
        'declara que la remuneración acordada en la cláusula tercera comprende cualquier compensación correspondiente a los compromisos asumidos en la presente cláusula.',
        { continued: false },
      );

    doc.moveDown(1);

    // --- DECIMO QUINTA ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text(
        'DÉCIMO QUINTA: SEGURIDAD Y CONFIDENCIALIDAD EN EL TRATAMIENTO DE DATOS PERSONALES',
        marginL,
        doc.y,
        {
          align: 'left',
          underline: true,
        },
      );

    doc.moveDown(0.5);

    // 15.1
    currentY = doc.y;
    doc.font('Arial Normal').text('15.1', marginL, currentY);
    doc.font('Arial Normal').text('En caso ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'accediera a datos personales de cualquier índole como consecuencia de desarrollo de sus labores, éste deberá cumplir la normativa interna aprobada por ',
        { continued: true },
      );
    doc
      .font('Arial Bold')
      .text('INVERSIONES URBANÍSTICAS OPERADORA S.A. ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'referida a La Protección de Datos Personales, que incluye la Ley N° 29733, y su Reglamento, aprobado por el Decreto Supremo N° 003-2013-JUS.',
        { continued: false },
      );

    doc.moveDown(0.2);
    // Segundo parrafo de 15.1
    doc
      .font('Arial Normal')
      .text('En cualquier caso, corresponde a ', textX, doc.y, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });
    doc
      .font('Arial Bold')
      .text('INVERSIONES URBANÍSTICAS OPERADORA S.A. ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'decidir sobre la finalidad y contenido del tratamiento de datos personales, limitándose ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'a utilizar éstos única y exclusivamente para el cumplimiento de sus funciones y conforme a las indicaciones de ',
        { continued: true },
      );
    doc
      .font('Arial Bold')
      .text('INVERSIONES URBANÍSTICAS OPERADORA S.A.', { continued: false });

    doc.moveDown(0.5);

    // 15.2
    currentY = doc.y;
    doc.font('Arial Normal').text('15.2', marginL, currentY);
    doc.font('Arial Normal').text('De esta forma, ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc.font('Arial Normal').text('queda obligado a:', { continued: false });

    doc.moveDown(0.5);

    // Listado 15.2
    currentY = doc.y;
    doc.font('Arial Normal').text('a.', bulletX, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Tratar, custodiar y proteger los datos personales a los que pudiese acceder como consecuencia del ejercicio de sus funciones, cumpliendo con las medidas de índole jurídica, técnica y organizativas establecidas en la Ley N° 29733, y su Reglamento, así como en la normativa interna de ',
        contentX,
        currentY,
        {
          width: contentW,
          align: 'justify',
          continued: true,
        },
      );
    doc
      .font('Arial Bold')
      .text('INVERSIONES URBANÍSTICAS OPERADORA S.A.', { continued: false });

    currentY = doc.y;
    doc.font('Arial Normal').text('b.', bulletX, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Utilizar o aplicar los datos personales, exclusivamente, para la realización de sus funciones y, en su caso, de acuerdo con las instrucciones impartidas por ',
        contentX,
        currentY,
        {
          width: contentW,
          align: 'justify',
          continued: true,
        },
      );
    doc
      .font('Arial Bold')
      .text('INVERSIONES URBANÍSTICAS OPERADORA S.A.', { continued: false });

    currentY = doc.y;
    doc.font('Arial Normal').text('c.', bulletX, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Mantener el deber de secreto y confidencialidad de los datos personales de manera indefinida; es decir, durante la vigencia del presente contrato, así como una vez concluido éste.',
        contentX,
        currentY,
        {
          width: contentW,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // 15.3
    currentY = doc.y;
    doc.font('Arial Normal').text('15.3', marginL, currentY);
    doc.font('Arial Normal').text('El incumplimiento de ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'respecto de sus obligaciones vinculadas al tratamiento de datos personales, constituye incumplimiento de obligaciones laborales que dará lugar a la imposición de sanciones disciplinarias, sin perjuicio de las responsabilidades penales, civiles y administrativas que su incumplimiento genere.',
        { continued: false },
      );

    doc.moveDown(1);

    // --- DECIMO SEXTA ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('DÉCIMO SEXTA: CUMPLIMIENTO DE NORMAS', marginL, doc.y, {
        align: 'left',
        underline: true,
      });

    doc.moveDown(0.5);

    // 16.1
    currentY = doc.y;
    doc.font('Arial Normal').text('16.1', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Lo establecido en la presente cláusula seguirá las disposiciones contenidas en la normativa de Responsabilidad Administrativa de las Personas Jurídicas, aprobada por la Ley N° 30424, con las modificaciones incorporadas por el Decreto Legislativo N° 1352, Ley N° 31740 y la Ley 30835, y de las normas sobre Prevención del Lavado de Activos y Financiamiento del Terrorismo, aprobadas por la Ley N° 27693, y su reglamento, aprobado por el Decreto Supremo N° 018-2006-JUS (en adelante, PLAFT), así como el correcto cumplimiento de la legislación peruana vigente en general.',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // 16.2
    currentY = doc.y;
    doc.font('Arial Normal').text('16.2', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'El TRABAJADOR declara que no ha incumplido las normas anticorrupción vigentes, ni ofrecido, pagado o comprometido a pagar, autorizado el pago de cualquier dinero directa o indirectamente, u ofrecido, entregado o comprometido a entregar, autorizado a entregar directa o indirectamente, cualquier objeto de valor, a cualquier funcionario gubernamental. EL TRABAJADOR se compromete a no incurrir en ninguno de los delitos mencionados ni ningún otro ilícito penal en el desarrollo de sus labores, ni siquiera cuando sea o pueda ser en beneficio del EMPLEADOR.',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // 16.3
    currentY = doc.y;
    doc.font('Arial Normal').text('16.3', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Asimismo, mediante Decreto Legislativo N° 1385 ha sido modificado el Código Penal, a fin de sancionar penalmente los actos de corrupción cometidos entre privados que afectan el normal desarrollo de las relaciones comerciales y la competencia leal entre empresas.',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // 16.4
    currentY = doc.y;
    doc.font('Arial Normal').text('16.4', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Las Partes acuerdan que, durante el periodo de vigencia del Contrato, estarán obligadas a actuar en estricto cumplimiento de la legislación vigente, quedando completamente prohibido, bajo cualquier circunstancia, realizar actos que impliquen la vulneración de la ley penal.',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // 16.5
    currentY = doc.y;
    doc.font('Arial Normal').text('16.5', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Adicionalmente, EL TRABAJADOR se compromete a no cometer delitos estipulados en la Ley N°31740, los cuales se encuentran relacionadas con las leyes de Lavado de Activos, Terrorismo, Fraude en Personas Jurídicas, Delitos contra el Patrimonio Cultural y Delitos Aduaneros.',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(1);

    // --- DECIMO SETIMA ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('DÉCIMO SETIMA: VALIDEZ', marginL, doc.y, {
        align: 'left',
        underline: true,
      });

    doc.moveDown(0.5);

    // 17.1
    currentY = doc.y;
    doc.font('Arial Normal').text('17.1', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Las partes ratifican que el presente contrato constituye un acto jurídico válido que no se encuentra afectado por causal de invalidez o ineficacia alguna y se presentará al Ministerio de Trabajo y Promoción del Empleo dentro de los primeros quince (15) días de celebrado.',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(1);

    // --- DECIMO OCTAVA ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('DÉCIMO OCTAVA: DE LOS EXÁMENES MÉDICOS', marginL, doc.y, {
        align: 'left',
        underline: true,
      });

    doc.moveDown(0.5);

    // 18.1
    currentY = doc.y;
    doc.font('Arial Normal').text('18.1', marginL, currentY);
    doc.font('Arial Bold').text('EL TRABAJADOR ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc
      .font('Arial Normal')
      .text(
        'se someterá obligatoriamente a los exámenes médicos que dispongan ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'y/o la ley, con la finalidad de verificar si éste se encuentra apto para desarrollar los servicios y funciones propios de su cargo. En este sentido, ambas Partes declaran que la conservación de la salud de EL TRABAJADOR es motivo determinante de la relación contractual.',
        { continued: false },
      );

    doc.moveDown(1);

    // --- DECIMO NOVENA ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text(
        'DÉCIMO NOVENA: DE LAS RECOMENDACIONES EN MATERIA DE SEGURIDAD Y SALUD EN EL TRABAJO',
        marginL,
        doc.y,
        {
          align: 'left',
          underline: true,
        },
      );

    doc.moveDown(0.5);

    // 19.1
    currentY = doc.y;
    doc.font('Arial Normal').text('19.1', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'De conformidad con lo establecido en el artículo 35° de la Ley N° 29783 – Ley de Seguridad y Salud en el Trabajo y, en calidad de anexo al presente contrato ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('(ANEXO – 1), ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'se incorpora la descripción de las recomendaciones de seguridad y salud en el trabajo, las mismas que ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'deberá seguir y tomar en consideración de forma rigurosa durante la prestación de sus servicios.',
        { continued: false },
      );

    doc.moveDown(1);

    // --- VIGESIMA ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('VIGÉSIMA: DOMICILIO', marginL, doc.y, {
        align: 'left',
        underline: true,
      });

    doc.moveDown(0.5);

    // 20.1
    currentY = doc.y;
    doc.font('Arial Normal').text('20.1', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Para todos los efectos legales del presente Contrato, las partes fijan como sus domicilios, los señalados en la introducción de este contrato.',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    // 20.2
    currentY = doc.y;
    doc.font('Arial Normal').text('20.2', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Cualquier cambio de domicilio deberá ser comunicado por escrito a la otra parte, mediante comunicación escrita, de lo contrario se entenderá que todas las notificaciones se han realizado válidamente. ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(1);
    // --- VIGESIMA PRIMERA ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('VIGÉSIMA PRIMERA: SOLUCIÓN DE DISPUTAS', marginL, doc.y, {
        align: 'left',
        underline: true,
      });

    doc.moveDown(0.5);

    // 21.1
    currentY = doc.y;
    doc.font('Arial Normal').text('21.1', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'En el improbable caso de que lleguen a existir discrepancias, controversias o reclamaciones derivadas de la validez, alcance, interpretación o aplicación del presente contrato, las partes se comprometen a poner el mejor de sus con el fin de lograr una solución armoniosa a sus diferencias.',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    // 21.2
    currentY = doc.y;
    doc.font('Arial Normal').text('21.2', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Si lo señalado en el párrafo anterior resulta infructuoso para resolver el conflicto surgido, las partes convienen renunciar al fuero judicial de sus domicilios o centros de trabajo, y se someten a la jurisdicción de los jueces del Distrito Judicial de Lima - Cercado.',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(1);
    // --- VIGESIMA SEGUNDA ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('VIGÉSIMA SEGUNDA: APLICACIÓN SUPLETORIA', marginL, doc.y, {
        align: 'left',
        underline: true,
      });

    doc.moveDown(0.5);

    doc
      .font('Arial Normal')
      .text(
        'En todo lo no previsto por el presente contrato, el vínculo laboral se regirá por las disposiciones laborales vigentes que regulan a los contratos de trabajo sujetos a modalidad, contenidas actualmente en el Texto único Ordenado del Decreto Legislativo Nº 728 (Decreto Supremo Nº 003-97-TR, Ley de Productividad y Competitividad Laboral) y su Reglamento y por las disposiciones complementarias o modificatorias que pudieran darse en el futuro.',
        marginL,
        doc.y,
        {
          width: fullWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(1);

    // --- CIERRE ---
    doc
      .font('Arial Normal')
      .text(
        `En señal de conformidad, las partes suscriben dos (02) ejemplares del presente contrato en la ciudad de ${data.province}, el día ${data.entryDate}, quedando un ejemplar en poder del empleador y otro en poder del trabajador, quien declara haber recibido una copia del contrato y estar de acuerdo con su contenido.`,
        marginL,
        doc.y,
        {
          width: fullWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(4);

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
    const cmToPt = (cm: number) => cm * 28.3465;
    const doc = new PDFDocument({
      size: 'A4',
      margins: {
        top: cmToPt(2.12), // Word: 2.05 cm
        bottom: cmToPt(2.4), // Word: 0.49 cm (Cuidado: es muy poco margen)
        left: cmToPt(2.7), // Word: 1.23 cm
        right: cmToPt(2.8), // Word: 1.55 cm
      },
    });

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
      .fontSize(7)
      .font('Arial Bold')
      .text('CONTRATO DE TRABAJO A PLAZO FIJO POR INCREMENTO DE ACTIVIDADES', {
        align: 'center',
        underline: true,
      })
      .moveDown(1);

    doc.fontSize(7);

    // 2. Empezamos el párrafo (Parte estática inicial)
    doc
      .font('Arial Normal')
      .text(
        'Conste por el presente documento, que se suscribe por duplicado con igual tenor y valor, Contrato por Incremento de Actividades que, al amparo de lo dispuesto en los Artículos 53 y 57 del Texto Único Ordenado del Decreto Legislativo Nº 728 (Decreto Supremo Nº 003-97- TR, Ley de Productividad y Competitividad Laboral) y el Decreto Supremo N° 002-97-TR, celebran, de una parte, la empresa ',
        {
          continued: true, // <--- La clave mágica
          align: 'justify',
          lineGap: 2,
        },
      );

    doc.font('Arial Bold').text('INVERSIONES URBANÍSTICAS OPERADORA S.A. ', {
      continued: true, // <--- La clave mágica
      align: 'justify',
      lineGap: 2,
    });
    doc
      .font('Arial Normal')
      .text(
        ', con R.U.C. Nº 20603381697, con domicilio en Calle Dean Valdivia N°148 Int.1401 Urb. Jardín (Edificio Platinium), Distrito de San Isidro, Provincia y Departamento de Lima, debidamente representada por la Sra. Catherine Susan Chang López identificado con D.N.I. Nº 42933662 y por la Sra. Maria Estela Guillen Cubas, identificada con DNI Nº 10346833, según poderes inscritos en la Partida Electrónica 14130887 del Registro de Personas Jurídicas de Lima, a quien en adelante se le denominará "EL EMPLEADOR"; y de otra parte, el Sr.(a). ',
        {
          continued: true,
          align: 'justify',
          lineGap: 2,
        },
      );

    doc.font('Arial Bold').text(fullName.trim(), {
      continued: true,
      align: 'justify',
      lineGap: 2,
    });

    doc.font('Arial Normal').text(' identificado con ', {
      continued: true,
      align: 'justify',
      lineGap: 2,
    });

    doc.font('Arial Bold').text(`DNI N° ${data.dni.trim()} `, {
      continued: true,
      align: 'justify',
      lineGap: 2,
    });

    // 6. Conector (Normal)
    doc
      .font('Arial Normal')
      .text(', de nacionalidad peruana, con domicilio en ', {
        continued: true,
        align: 'justify',
        lineGap: 2,
      });

    doc.font('Arial Bold').text(data.address.trim(), {
      continued: true,
      align: 'justify',
      lineGap: 2,
    });

    doc.font('Arial Normal').text(', Distrito de ', {
      continued: true,
      align: 'justify',
      lineGap: 2,
    });

    doc.font('Arial Bold').text(data.district.trim(), {
      continued: true,
      align: 'justify',
      lineGap: 2,
    });

    doc.font('Arial Normal').text(', Provincia de ', {
      continued: true,
      align: 'justify',
      lineGap: 2,
    });

    doc.font('Arial Bold').text(`${data.province.trim()} `, {
      continued: true,
      align: 'justify',
      lineGap: 2,
    });

    doc.font('Arial Normal').text('y Departamento de ', {
      continued: true,
      align: 'justify',
      lineGap: 2,
    });

    doc.font('Arial Bold').text(`${data.department.trim()} `, {
      continued: true,
      align: 'justify',
      lineGap: 2,
    });

    doc.font('Arial Normal').text('fijando como correo electrónico personal ', {
      continued: true,
      align: 'justify',
      lineGap: 2,
    });

    doc.font('Arial Bold').text(`${data.email.trim()} `, {
      continued: true,
      align: 'justify',
      lineGap: 2,
    });

    doc
      .font('Arial Normal')
      .text(
        'a quien en adelante se le denominará "EL TRABAJADOR"; en los términos y condiciones siguientes:',
        {
          continued: false,
          align: 'justify',
          lineGap: 2,
        },
      );

    doc.moveDown(1);

    const marginL = doc.page.margins.left;
    const numberWidth = 25; // Espacio reservado para "1.1", "1.2", etc.
    const textX = marginL + numberWidth; // Donde empieza el texto
    // Calculamos el ancho disponible para el texto restando los márgenes y la sangría del número
    const textWidth = doc.page.width - doc.page.margins.right - textX;

    //titulo Nro 1
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('PRIMERO: PARTES DEL CONTRATO', {
        align: 'left',
        underline: true,
      })
      .moveDown(1);
    let currentY = doc.y;

    // A. Escribimos el Número a la izquierda
    doc.font('Arial Normal').text('1.1', marginL, currentY);

    // B. Escribimos el bloque de texto (con sangría)
    // Nota: Forzamos la X y la Y inicial
    doc.font('Arial Bold').text('EL EMPLEADOR ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });

    doc
      .font('Arial Normal')
      .text(
        'es una sociedad anónima debidamente constituida e inscrita en la Partida No. 14130887 del Registro de Personas Jurídicas de la Ciudad de Lima, cuyo objeto social es la prestación de servicios de administración, promoción, desarrollo y operación de playas de estacionamiento, sistemas de peaje y actividades conexas.',
        {
          width: textWidth,
          align: 'justify',
          continued: false, // Fin del párrafo
        },
      );

    doc.moveDown(0.5); // Pequeño espacio entre puntos

    // --- PÁRRAFO 1.2 ---
    currentY = doc.y; // Actualizamos Y

    doc.font('Arial Normal').text('1.2', marginL, currentY);

    doc.font('Arial Normal').text('En ese contexto, ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });

    doc.font('Arial Bold').text('EL EMPLEADOR ', {
      width: textWidth,
      align: 'justify',
      continued: true,
    });

    doc
      .font('Arial Normal')
      .text(
        'ha asumido la administración de una serie de playas de estacionamiento en la ciudad de Lima y provincias, así como la implementación de negocios colaterales en las playas de estacionamiento que ya vienen siendo administradas, situación que generará un incremento considerable de sus actividades – directa o indirectamente vinculadas al giro del negocio de estacionamientos, con la consecuente necesidad de contratar personal para concretar sus operaciones en las referidas playas de estacionamiento, siendo que las áreas involucradas son ',
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );

    // Asumo que 'TIME SURCO' es un dato variable o fijo, lo dejo en negrita como tenías
    doc.font('Arial Bold').text('TIME SURCO.', {
      width: textWidth,
      align: 'justify',
      continued: false,
    });

    doc.moveDown(0.5);

    // --- PÁRRAFO 1.3 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('1.3', marginL, currentY);

    doc
      .font('Arial Normal')
      .text(
        'Conforme lo detalla el correspondiente Informe del Área de Operaciones, el incremento en sus operaciones relacionadas a la administración de playas de estacionamiento es de tal magnitud que no puede ser satisfecho con su personal actual, motivo por el cual requiere contratar a plazo fijo a una persona que tenga la experiencia necesaria para desempeñarse como ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );

    doc.font('Arial Bold').text(`${data.position || ''}.`, {
      width: textWidth,
      align: 'justify',
      continued: false,
    });

    doc.moveDown(0.5);

    // --- PÁRRAFO 1.4 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('1.4', marginL, currentY);

    doc.font('Arial Bold').text('EL TRABAJADOR, ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });

    doc.font('Arial Normal').text('declara tener experiencia como ', {
      width: textWidth,
      align: 'justify',
      continued: true,
    });

    doc.font('Arial Bold').text(`${data.position || ''}, `, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });

    doc
      .font('Arial Normal')
      .text(
        'por lo que cuenta con las condiciones necesarias para ocupar el cargo de ',
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );

    doc.font('Arial Bold').text(`${data.position}, `, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });

    doc
      .font('Arial Normal')
      .text(
        'durante el tiempo que ésta lo estime y la naturaleza de las labores así lo exija.',
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(1);

    //texto 2
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('SEGUNDO: OBJETO DEL CONTRATO', marginL, doc.y, {
        width: textWidth + numberWidth,
        align: 'left',
        underline: true,
      })
      .moveDown(1);

    currentY = doc.y;

    doc.font('Arial Normal').text('2.1', marginL, currentY);

    doc
      .font('Arial Normal')
      .text('Por el presente documento ', textX, currentY, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });

    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text('contrata a plazo fijo a ', { continued: true });

    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });

    doc.font('Arial Normal').text('bajo la modalidad de ', { continued: true });

    doc
      .font('Arial Bold')
      .text('INCREMENTO DE ACTIVIDADES ', { continued: true });

    doc
      .font('Arial Normal')
      .text('para que ocupe el cargo de ', { continued: true });

    doc.font('Arial Bold').text('ANFITRION(A) PT ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'asumiendo las responsabilidades propias del puesto y de acuerdo a las estipulaciones contenidas en este Contrato.',
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // --- PÁRRAFO 2.2 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('2.2', marginL, currentY);

    doc
      .font('Arial Normal')
      .text(
        'Las partes reconocen y declaran que el cargo de ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );

    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });

    doc.font('Arial Normal').text('está ', { continued: true });

    doc.font('Arial Bold').text('SUJETO A CONTROL ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'de acuerdo a lo establecido en el artículo 43 del Decreto Supremo Nro. 003-97-TR.',
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(1);
    //texto 3
    doc.font('Arial Bold').text('TERCERO: PLAZO', marginL, doc.y, {
      width: textWidth + numberWidth,
      underline: true,
      align: 'left',
    });

    doc.moveDown(1);
    currentY = doc.y;
    //parrafo 3.1
    doc.font('Arial Normal').text('3.1', marginL, currentY);

    doc
      .font('Arial Normal')
      .text('Las labores que desarrollará ', textX, currentY, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });

    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'tendrán una duración de , los cuales se contabilizarán desde el día ',
        { continued: true },
      );

    doc
      .font('Arial Bold')
      .text(`${data.entryDate || ''} `, { continued: true });

    doc.font('Arial Normal').text('y concluirán el día ', { continued: true });

    doc.font('Arial Bold').text(`${data.endDate || ''}.`, {
      width: textWidth,
      align: 'justify',
      continued: false,
    });

    doc.moveDown(0.5);

    // --- PÁRRAFO 3.2 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('3.2', marginL, currentY);

    doc
      .font('Arial Normal')
      .text(
        'Las partes acuerdan que dado que el cargo que desempeñará ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );

    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });

    doc.font('Arial Normal').text('corresponde a uno ', { continued: true });

    doc.font('Arial Bold').text('SUJETO A CONTROL.', {
      width: textWidth,
      align: 'justify',
      continued: false,
    });

    doc.moveDown(1);
    //parrafo 4
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text(
        'CUARTO: PRINCIPALES OBLIGACIONES DE EL TRABAJADOR',
        marginL,
        doc.y,
        {
          width: textWidth + numberWidth,
          underline: true,
          align: 'left',
        },
      );

    doc.moveDown(0.5);

    doc
      .font('Arial Normal')
      .text('Por medio del presente documento, ', textX, doc.y, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });

    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text('se obliga, referencialmente, a:', { continued: false });

    doc.moveDown(0.5);

    // --- PÁRRAFO 4.1 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('4.1', marginL, currentY);

    doc
      .font('Arial Normal')
      .text(
        'Prestar sus servicios, cumpliendo con las funciones, órdenes e instrucciones que imparta o señale ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );

    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'o sus representantes, para realizar las actividades que correspondan a su cargo.',
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // --- PÁRRAFO 4.2 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('4.2', marginL, currentY);

    doc
      .font('Arial Normal')
      .text(
        'La prestación laboral deberá ser efectuada de manera personal, no pudiendo ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );

    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text('ser reemplazado ni asistido por terceros, debiendo ', {
        continued: true,
      });

    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'cumplir con las funciones inherentes al puesto encomendado y las labores adicionales y/o anexas que fuese necesario ejecutar y sean requeridas y/o determinadas por ',
        { continued: true },
      );

    doc.font('Arial Bold').text('EL EMPLEADOR.', {
      width: textWidth,
      align: 'justify',
      continued: false,
    });

    doc.moveDown(0.5);

    // --- PÁRRAFO 4.3 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('4.3', marginL, currentY);

    doc
      .font('Arial Normal')
      .text(
        'Prestar sus servicios con responsabilidad, prontitud, esmero y eficiencia, aportando su conocimiento y profesional en el cumplimiento de los objetivos y estrategias de ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );

    doc.font('Arial Bold').text('EL EMPLEADOR.', {
      width: textWidth,
      align: 'justify',
      continued: false,
    });

    doc.moveDown(0.5);

    // --- PÁRRAFO 4.4 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('4.4', marginL, currentY);

    doc
      .font('Arial Normal')
      .text(
        'Cumplir estrictamente la legislación peruana en materia laboral, el Reglamento Interno de Trabajo, el Reglamento de Seguridad y Salud en el Trabajo, el Reglamento de Hostigamiento Sexual y demás disposiciones, directivas circulares, reglamentos, normas, etc., que expida ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );

    doc.font('Arial Bold').text('EL EMPLEADOR; ', { continued: true });

    doc
      .font('Arial Normal')
      .text('declarando conocer todas aquellas que se encuentran vigentes.', {
        width: textWidth,
        align: 'justify',
        continued: false,
      });

    doc.moveDown(0.5);

    // --- PÁRRAFO 4.5 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('4.5', marginL, currentY);

    doc
      .font('Arial Normal')
      .text(
        'No ejecutar por su cuenta o en su beneficio, sea en forma directa o indirecta, actividad o negociaciones dentro de giro de ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );

    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'en cualquier forma o naturaleza, inclusive fuera de la jornada de trabajo y en días inhábiles o festivos. ',
        { continued: true },
      );

    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'declara entender que el incumplimiento a lo antes mencionado constituye una infracción de los deberes esenciales que emanan de su vínculo laboral, por lo que en el caso de no cumplir con su compromiso, tal acto será considerado como una falta grave.',
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // --- PÁRRAFO 4.6 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('4.6', marginL, currentY);

    doc
      .font('Arial Normal')
      .text(
        'Devolver en forma inmediata todos los materiales (documentos, informes, bienes, herramientas, vestimenta, etc.) que se le entreguen con ocasión del trabajo prestado si la relación laboral concluyese por cualquier causa.',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);
    if (doc.y + 60 > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
    }
    // --- PÁRRAFO 4.7 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('4.7', marginL, currentY);

    doc.font('Arial Bold').text('EL TRABAJADOR ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });

    doc
      .font('Arial Normal')
      .text(
        'se obliga a respetar los procedimientos de evaluación de rendimiento y desempeño laboral que tiene establecidos ',
        { continued: true },
      );

    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });

    doc
      .font('Arial Normal')
      .text('con el objeto de valorar el nivel de eficiencia logrado por ', {
        continued: true,
      });

    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });

    doc.font('Arial Normal').text('en su puesto de trabajo.', {
      width: textWidth,
      align: 'justify',
      continued: false,
    });

    doc.moveDown(0.5);
    // Aplicamos la misma lógica de seguridad aquí
    if (doc.y + 60 > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
    }
    // --- PÁRRAFO 4.8 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('4.8', marginL, currentY);

    doc
      .font('Arial Normal')
      .text(
        'Cualquier otra obligación prevista en este contrato, establecida por ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );

    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'que se desprenda de su condición de trabajador y aquellas previstas en las normas que resulten aplicables.',
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // --- PÁRRAFO 4.9 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('4.9', marginL, currentY);

    doc
      .font('Arial Normal')
      .text(
        'En caso sea necesario para el cumplimiento de sus labores, ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );

    doc.font('Arial Bold').text('EL TRABAJADOR, ', { continued: true });

    doc
      .font('Arial Normal')
      .text('deberá trasladarse a las operaciones y/o plazas en los que ', {
        continued: true,
      });

    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });

    doc.font('Arial Normal').text('realiza actividades comerciales.', {
      width: textWidth,
      align: 'justify',
      continued: false,
    });

    doc.moveDown(0.5);

    // --- PÁRRAFO 4.10 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('4.10', marginL, currentY);

    doc.font('Arial Normal').text('En caso ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });

    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'no cumpla con observar el plazo de preaviso legal de renuncia de treinta (30) días, deberá abonar a favor de ',
        { continued: true },
      );

    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'una penalidad a modo de indemnización equivalente a la remuneración diaria que percibe ',
        { continued: true },
      );

    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'por cada día que no preste servicios en desconocimiento de dicho preaviso, para lo cual ',
        { continued: true },
      );

    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });

    doc.font('Arial Normal').text('autoriza a ', { continued: true });

    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'a que se le descuente el monto que corresponda de su liquidación de beneficios sociales.',
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(1);

    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('QUINTO: PERÍODO DE PRUEBA', marginL, doc.y, {
        width: textWidth + numberWidth,
        align: 'left',
        underline: true,
      });

    doc.moveDown(1);

    // --- PÁRRAFO 5.1 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('5.1', marginL, currentY);

    doc
      .font('Arial Normal')
      .text(
        'Ambas partes acuerdan en pactar un período de prueba de ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );

    doc.font('Arial Bold').text(`${data.probationaryPeriod || ''} `, {
      continued: true,
      align: 'justify',
    });

    doc
      .font('Arial Normal')
      .text(
        ' de acuerdo con lo que establece el artículo 10 de la Ley de Productividad y Competitividad Laboral.',
        {
          width: textWidth,
          align: 'justify',
          continued: false, // <--- Aquí termina el párrafo
        },
      );

    doc.moveDown(1);

    // ==========================================
    // SEXTO: REMUNERACION
    // ==========================================

    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('SEXTO: REMUNERACION', marginL, doc.y, {
        width: textWidth + numberWidth,
        align: 'left',
        underline: true,
      });

    doc.moveDown(0.5);

    // --- PÁRRAFO 6.1 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('6.1', marginL, currentY);

    doc
      .font('Arial Normal')
      .text(
        'Las partes dejan expresa constancia que la retribución que perciba ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );

    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'estará compuesta por una remuneración fija Mensual ascendente al monto bruto de ',
        { continued: true },
      );

    // Manejo de moneda
    const salario =
      typeof formatCurrency === 'function'
        ? formatCurrency(Number(data.salary))
        : `S/ ${data.salary}`;

    doc.font('Arial Bold').text(`${salario} `, { continued: true });

    doc
      .font('Arial Bold')
      .text(`${data.salaryInWords || ''}. `, { continued: false });

    doc.moveDown(0.5);

    // --- PÁRRAFO 6.2 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('6.2', marginL, currentY);

    doc.font('Arial Normal').text('Asimismo, ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });

    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'podrá percibir una remuneración variable sobre la base de condiciones de venta y/o en función al cumplimiento de indicadores de gestión y resultados, bajo los términos y condiciones establecidos en las políticas que determine ',
        { continued: true },
      );

    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'de forma unilateral, las mismas que podrán ser modificadas o suprimidas en cualquier momento y a sola decisión de ',
        { continued: true },
      );

    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });

    doc
      .font('Arial Normal')
      .text('lo cual es aceptado por ', { continued: true });

    doc.font('Arial Bold').text('EL TRABAJADOR. ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'El pago de dicha remuneración variable se encuentra sujeto a la vigencia de la relación laboral, es decir, sólo se abonarán las comisiones a los trabajadores con vínculo laboral vigente a la fecha de pago de las mismas.',
        { continued: false },
      );

    doc.moveDown(0.5);

    // --- PÁRRAFO 6.3 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('6.3', marginL, currentY);

    doc
      .font('Arial Normal')
      .text('A la remuneración mensual de ', textX, currentY, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });

    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'se agregará la Asignación Familiar correspondiente de ser el caso, deduciéndose las aportaciones y descuentos por tributos establecidos en la ley que resulten aplicables.',
        { continued: false },
      );

    doc.moveDown(0.5);

    if (doc.y + 60 > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
    }
    // --- PÁRRAFO 6.4 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('6.4', marginL, currentY);

    doc.font('Arial Normal').text('Adicionalmente, ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });

    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'tendrá derecho al pago de beneficios tales como las gratificaciones legales en los meses de julio y diciembre, la compensación por tiempo de servicios y demás que pudieran corresponderle, de acuerdo a la legislación laboral vigente y sus respectivas modificaciones.',
        { continued: false },
      );

    doc.moveDown(0.5);
    if (doc.y + 60 > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
    }
    // --- PÁRRAFO 6.5 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('6.5', marginL, currentY);

    doc.font('Arial Normal').text('Será de cargo de ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });

    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'el pago del Impuesto a la Renta y los aportes al Sistema Nacional o Privado de Pensiones, los que serán retenidos por ',
        { continued: true },
      );

    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'así como cualquier otro tributo o carga social que grave las remuneraciones del personal dependiente en el país.',
        { continued: false },
      );

    doc.moveDown(0.5);

    // --- PÁRRAFO 6.6 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('6.6', marginL, currentY);

    doc
      .font('Arial Normal')
      .text(
        'Ambas partes acuerdan que la forma y fecha de pago de la remuneración será determinada por ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );

    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'y podrá ser modificada de acuerdo con sus necesidades operativas.',
        { continued: false },
      );

    doc.moveDown(1);

    // Título SÉTIMO
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('SÉTIMO: OBLIGACIONES DEL EMPLEADOR', marginL, doc.y, {
        width: textWidth + numberWidth,
        align: 'left',
        underline: true,
      });

    doc.moveDown(0.5);

    // --- PÁRRAFO 7.1 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('7.1', marginL, currentY);

    doc.font('Arial Normal').text('Pagar a ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });

    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'todos los derechos y beneficios que le correspondan de acuerdo a lo dispuesto en la legislación laboral vigente al momento del pago. Registrar los pagos realizados a ',
        { continued: true },
      );

    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'en el Libro de Planillas de Remuneraciones de la Empresa y hacer entrega oportuna de la boleta de pago.',
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // --- PÁRRAFO 7.2 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('7.2', marginL, currentY);

    doc
      .font('Arial Normal')
      .text(
        'Poner en conocimiento de la Autoridad Administrativa de Trabajo el presente Contrato, para su conocimiento y registro, en cumplimiento de lo dispuesto en el Texto Único Ordenado del Decreto Legislativo Nº 728 (Decreto Supremo Nº 003-97-TR, Ley de Productividad y Competitividad Laboral).',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // --- PÁRRAFO 7.3 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('7.3', marginL, currentY);

    doc
      .font('Arial Normal')
      .text('Retener de la remuneración bruta mensual de ', textX, currentY, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });

    doc.font('Arial Bold').text('EL TRABAJADOR, ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'las sumas correspondientes al aporte al Seguro Privado o Público de Pensiones, así como el Impuesto a la Renta.',
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // --- PÁRRAFO 7.4 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('7.4', marginL, currentY);

    doc
      .font('Arial Normal')
      .text(
        'Las otras contenidas en la legislación laboral vigente y en cualquier norma de carácter interno, incluyendo el Reglamento Interno de Trabajo, el Reglamento de Seguridad y Salud en el Trabajo y el Reglamento de Hostigamiento Sexual.',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(1);

    // ==========================================
    // OCTAVO: JORNADA DE TRABAJO
    // ==========================================

    // Título OCTAVO
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('OCTAVO: JORNADA DE TRABAJO', marginL, doc.y, {
        width: textWidth + numberWidth,
        align: 'left',
        underline: true,
      });

    doc.moveDown(0.5);

    // Introducción (Sin número)
    doc
      .font('Arial Normal')
      .text('En relación a la Jornada de Trabajo, ', textX, doc.y, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });

    doc
      .font('Arial Bold')
      .text('EL EMPLEADOR y EL TRABAJADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text('acuerdan lo siguiente:', { continued: false });

    doc.moveDown(0.5);

    // --- PÁRRAFO 8.1 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('8.1', marginL, currentY);

    doc
      .font('Arial Normal')
      .text(
        'La jornada de trabajo es de 48 horas semanales flexible, teniendo ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );

    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'la facultad de establecer el horario de trabajo y modificarlo de acuerdo a sus necesidades, con las limitaciones establecidas por la ley.',
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // --- PÁRRAFO 8.2 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('8.2', marginL, currentY);

    doc
      .font('Arial Normal')
      .text(
        'El tiempo de Refrigerio no forma parte de la jornada de trabajo.',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // --- PÁRRAFO 8.3 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('8.3', marginL, currentY);

    doc
      .font('Arial Normal')
      .text(
        'Las partes acuerdan que podrán acumularse y compensarse las horas de trabajo diarias o semanales con períodos de descanso dentro de la semana, diferentes semanas o ciclos de trabajo, según sea el caso; también se podrán compensar con las horas que no se completen con trabajo efectivo durante la jornada hasta el límite de 48 horas semanales en promedio. Asimismo, acuerdan que ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );

    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'podrá introducir modificaciones al horario y jornada de trabajo, establecer jornadas acumulativas, alternativas, flexibles, compensatorias y horarios diferenciados, respetando la jornada máxima establecida por Ley.',
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // --- PÁRRAFO 8.4 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('8.4', marginL, currentY);

    doc
      .font('Arial Normal')
      .text('El trabajo en sobretiempo de ', textX, currentY, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });

    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text('es estrictamente voluntario y, a solicitud de ', {
        continued: true,
      });

    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true }); // Faltaba espacio al final en tu código original

    doc.font('Arial Normal').text('debiendo ', { continued: true });

    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text('contar con autorización escrita de ', { continued: true });

    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'para realizar horas extras, según lo establecido en el Reglamento Interno de Trabajo. El trabajo en sobretiempo debe ser prestado de manera efectiva, no considerándose como tal la sola permanencia en las instalaciones de ',
        { continued: true },
      );

    doc.font('Arial Bold').text('EL EMPLEADOR.', {
      // Corregido "de EL EMPLEADOR" repetido
      width: textWidth,
      align: 'justify',
      continued: false,
    });

    doc.moveDown(0.5);

    // --- PÁRRAFO 8.5 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('8.5', marginL, currentY);

    doc
      .font('Arial Bold')
      .text('EL TRABAJADOR y EL EMPLEADOR ', textX, currentY, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });

    doc
      .font('Arial Normal')
      .text(
        'acuerdan que durante la vigencia de la relación laboral podrán compensar el trabajo prestado en sobretiempo con el otorgamiento de períodos equivalentes de descanso; debiendo realizarse tal compensación, dentro del mes calendario siguiente a aquel en que se realizó dicho trabajo, salvo pacto en contrario.',
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // --- PÁRRAFO 8.6 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('8.6', marginL, currentY);

    doc.font('Arial Bold').text('EL TRABAJADOR, ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });

    doc
      .font('Arial Normal')
      .text(
        'por su cargo y la naturaleza de su prestación de servicios se encuentra ',
        { continued: true },
      );

    doc.font('Arial Bold').text('SUJETO A CONTROL.', {
      width: textWidth,
      align: 'justify',
      continued: false,
    });

    doc.moveDown(0.5);

    // --- PÁRRAFO 8.7 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('8.7', marginL, currentY);

    doc.font('Arial Bold').text('EL TRABAJADOR, ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });

    doc
      .font('Arial Normal')
      .text(
        'declara conocer que, debido al objeto social de la empresa, cuando ésta lo requiera y siempre y cuando le avise con un mínimo de 48 horas de anticipación, el trabajador deberá cumplir con laborar en días feriados o no laborables, sin perjuicio de la compensación o pago de la sobretasa a la que tenga derecho.',
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(1);

    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('NOVENO: DECLARACIONES DE LAS PARTES', marginL, doc.y, {
        width: textWidth + numberWidth,
        align: 'left',
        underline: true,
      });

    doc.moveDown(0.5);

    // Introducción
    doc
      .font('Arial Normal')
      .text(
        'Las partes reconocen, acuerdan y declaran lo siguiente:',
        textX,
        doc.y,
      );

    doc.moveDown(0.5);

    // --- PÁRRAFO 9.1 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('9.1', marginL, currentY);

    doc.font('Arial Bold').text('EL TRABAJADOR, ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });

    doc
      .font('Arial Normal')
      .text(
        'se encuentra sujeto al régimen laboral de la actividad privada y le son aplicables los derechos y beneficios previstos en él.',
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // --- PÁRRAFO 9.2 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('9.2', marginL, currentY);

    doc
      .font('Arial Normal')
      .text(
        'De acuerdo a la facultad establecida en el párrafo segundo del artículo 9 del Texto Único Ordenado de la Ley de Productividad y Competitividad Laboral, ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );

    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'se reserva la facultad de modificar en lugar de la prestación de los servicios, de acuerdo a las necesidades del negocio y observando el criterio de razonabilidad.',
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // --- PÁRRAFO 9.3 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('9.3', marginL, currentY);

    doc
      .font('Arial Normal')
      .text(
        'Sin perjuicio de las labores para las cuales ha sido contratado, las partes declaran que ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );

    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'prestará todas aquellas actividades conexas o complementarias a las propias del cargo que ocupará, que razonablemente correspondan.',
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // --- PÁRRAFO 9.4 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('9.4', marginL, currentY);

    doc
      .font('Arial Normal')
      .text('Las partes convienen que ', textX, currentY, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });

    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'tiene facultades para organizar, fiscalizar, suprimir, modificar, reemplazar y sancionar, de modo radical o no sustancial, la prestación de servicios (tiempo, lugar, forma, funciones y modalidad) de ',
        { continued: true },
      );

    doc.font('Arial Bold').text('EL TRABAJADOR.', {
      width: textWidth,
      align: 'justify',
      continued: false,
    });

    doc.moveDown(0.5);

    // --- PÁRRAFO 9.5 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('9.5', marginL, currentY);

    doc
      .font('Arial Bold')
      .text('EL TRABAJADOR y EL EMPLEADOR ', textX, currentY, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });

    doc
      .font('Arial Normal')
      .text(
        'acuerdan que las Boletas de Pago de remuneraciones podrán ser selladas y firmadas por el (los) representante(s) legal(es) de ',
        { continued: true },
      );

    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'con firma(s) digitalizada(s), una vez que la(s) firma(s) sea(n) inscrita(s) en el Registro de Firmas a cargo del Ministerio de Trabajado que se implementará una vez que se aprueben las disposiciones para la implementación del registro de firmas. Al respecto, ',
        { continued: true },
      );

    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true }); // Agregué espacio al final

    doc
      .font('Arial Normal')
      .text(
        'presta su consentimiento expreso para que su(s) Boleta(s) de Pago sea(n) suscritas por el (los) representante(s) de ',
        { continued: true },
      );

    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'a través de firma(s) digital(es), una vez que ello sea implementado por el Ministerio de Trabajo.',
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // --- PÁRRAFO 9.6 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('9.6', marginL, currentY);

    doc
      .font('Arial Bold')
      .text('EL TRABAJADOR y EL EMPLEADOR ', textX, currentY, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });

    doc
      .font('Arial Normal')
      .text(
        'acuerdan que la entrega de la Boleta de Pago y demás documentos derivados de la relación laboral podrán efectuarse a través del empleo de tecnologías de la información y comunicación, tales como Intranet, Correo Electrónico u otro de similar naturaleza que implemente ',
        { continued: true },
      );

    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });

    doc
      .font('Arial Normal')
      .text('o el correo electrónico personal de ', { continued: true });

    doc.font('Arial Bold').text('EL TRABAJADOR, ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'indicado en el exordio del presente contrato de trabajo, prestando ',
        { continued: true },
      );

    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text('su consentimiento expreso para ello. Asimismo, ', {
        continued: true,
      });

    doc.font('Arial Bold').text('EL TRABAJADOR, ', { continued: true });

    doc
      .font('Arial Normal')
      .text('declara como su dirección electrónico ', { continued: true });

    doc.font('Arial Bold').text(`${data.email || ''}, `, { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'en caso se implemente la entrega de Boletas de Pago, a través de dicho medio; obligándose ',
        { continued: true },
      );

    doc.font('Arial Bold').text('EL TRABAJADOR, ', { continued: true });

    doc
      .font('Arial Normal')
      .text('a informar por escrito a ', { continued: true });

    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });

    doc
      .font('Arial Normal')
      .text('cualquier cambio de su dirección electrónica.', {
        width: textWidth,
        align: 'justify',
        continued: false,
      });

    doc.moveDown(1);
    // ==========================================
    // DÉCIMO: TÉRMINO DEL CONTRATO
    // ==========================================

    // Título DÉCIMO
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('DÉCIMO: TÉRMINO DEL CONTRATO', marginL, doc.y, {
        width: textWidth + numberWidth,
        align: 'left',
        underline: true,
      });

    doc.moveDown(0.5);

    // --- PÁRRAFO 10.1 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('10.1', marginL, currentY);

    doc
      .font('Arial Normal')
      .text(
        'Queda entendido que la extinción del presente contrato operará indefectiblemente en la fecha de vencimiento prevista en la cláusula tercera, salvo que las necesidades operativas exijan lo contrario, escenario en el que ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );

    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });

    doc.font('Arial Normal').text('propondrá a ', { continued: true });

    doc.font('Arial Bold').text('EL TRABAJADOR, ', { continued: true });

    doc
      .font('Arial Normal')
      .text('suscribir una renovación por escrito. Por lo tanto, ', {
        continued: true,
      });

    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'no está obligado a dar ningún aviso adicional referente al término del presente contrato. En dicho momento, se abonará a ',
        { continued: true },
      );

    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'los beneficios sociales que le pudieran corresponder de acuerdo a ley. ',
        { continued: true },
      );

    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'podrá resolver el contrato cuando medien los supuestos establecidos en el Texto Único Ordenado del Decreto Legislativo Nº 728, Decreto Supremo Nº 003-97-TR.',
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // --- PÁRRAFO 10.2 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('10.2', marginL, currentY);

    doc
      .font('Arial Normal')
      .text(
        'Además, son causales de resolución del presente contrato las siguientes:',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    const listX = textX + 15;
    const listTextWidth = textWidth - 15;

    doc.text('a) La voluntad concertada de las partes', listX, doc.y, {
      width: listTextWidth,
      align: 'left',
    });
    doc.text(
      'b) El incumplimiento de las obligaciones estipuladas en el presente documento.',
      listX,
      doc.y,
      { width: listTextWidth, align: 'left' },
    );

    doc
      .font('Arial Normal')
      .text('c) La comisión de falta grave por parte de ', listX, doc.y, {
        width: listTextWidth,
        align: 'left',
        continued: true,
      });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text('prevista en las normas que resulten aplicables.', {
        continued: false,
      });

    doc.text(
      'd) Cualquier otra causal prevista en este contrato o que se encuentre establecida en las normas aplicables.',
      listX,
      doc.y,
      { width: listTextWidth, align: 'left' },
    );

    doc.moveDown(1);

    // Título DÉCIMO PRIMERA
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('DÉCIMO PRIMERA: PROPIEDAD INTELECTUAL', marginL, doc.y, {
        width: textWidth + numberWidth,
        align: 'left',
        underline: true,
      });

    doc.moveDown(0.5);

    // --- PÁRRAFO 11.1 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('11.1', marginL, currentY);

    doc.font('Arial Bold').text('EL TRABAJADOR ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });

    doc.font('Arial Normal').text('cede y transfiere a ', { continued: true });

    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'en forma total, íntegra y exclusiva, los derechos patrimoniales derivados de los trabajos e informes que sean realizados en cumplimiento del presente contrato, quedando ',
        { continued: true },
      );

    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'facultado para publicar o reproducir en forma íntegra o parcial dicha información.',
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // --- PÁRRAFO 11.2 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('11.2', marginL, currentY);

    doc.font('Arial Bold').text('EL TRABAJADOR, ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });

    doc
      .font('Arial Normal')
      .text('en virtud del presente contrato laboral, cede en exclusiva a ', {
        continued: true,
      });

    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'todos los derechos alienables sobre las creaciones de propiedad intelectual de las obras que sean creadas por él en el ejercicio de sus funciones y cumplimiento de sus obligaciones.',
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // --- PÁRRAFO 11.3 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('11.3', marginL, currentY);

    doc
      .font('Arial Normal')
      .text(
        'Por lo tanto, toda información creada u originada es de propiedad exclusiva de ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );

    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });

    doc.font('Arial Normal').text('quedando ', { continued: true });

    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'prohibido de reproducirla, venderla o suministrarla a cualquier persona natural o jurídica, salvo autorización escrita de ',
        { continued: true },
      );

    doc.font('Arial Bold').text('EL EMPLEADOR. ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'Se deja constancia que la información comprende inclusive las investigaciones, los borradores y los trabajos preliminares.',
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // --- PÁRRAFO 11.4 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('11.4', marginL, currentY);

    doc.font('Arial Normal').text('En ese sentido, ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });

    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });

    doc.font('Arial Normal').text('acepta que ', { continued: true });

    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'tiene plenas facultades para acceder, revisar y leer, sin previa notificación, el íntegro del contenido de la información que se encuentre en cualquiera de los medios y/o herramientas proporcionados por ',
        { continued: true },
      );

    doc
      .font('Arial Bold')
      .text('EL EMPLEADOR a EL TRABAJADOR ', { continued: true });

    doc.font('Arial Normal').text('para el cumplimiento de sus funciones.', {
      width: textWidth,
      align: 'justify',
      continued: false,
    });

    doc.moveDown(0.5);

    // --- PÁRRAFO 11.5 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('11.5', marginL, currentY);

    doc.font('Arial Bold').text('EL TRABAJADOR, ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });

    doc
      .font('Arial Normal')
      .text(
        'declara que la remuneración acordada en el presente contrato comprende cualquier compensación correspondiente a los compromisos asumidos en la presente cláusula.',
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(1);
    if (doc.y + 60 > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
    }
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('DÉCIMO SEGUNDA: USO DE CORREO ELECTRÓNICO', marginL, doc.y, {
        width: textWidth + numberWidth,
        align: 'left',
        underline: true,
      });

    doc.moveDown(0.5);

    // --- PÁRRAFO 12.1 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('12.1', marginL, currentY);

    doc.font('Arial Bold').text('EL EMPLEADOR ', textX, currentY, {
      width: textWidth,
      align: 'left',
      continued: true, // Usamos 'left' aquí según tu código original, pero 'justify' suele ser mejor
    });

    doc
      .font('Arial Normal')
      .text(
        'facilitará a EL TRABAJADOR un nombre de usuario y una contraseña dentro del dominio: @apparka.pe y/o cualquier dominio ',
        { continued: true },
      );

    doc
      .font('Arial Bold')
      .text('INVERSIONES URBANÍSTICAS OPERADORA S.A ', { continued: true });

    doc.font('Arial Normal').text('que pueda crear a futuro.', {
      width: textWidth,
      align: 'left',
      continued: false,
    });

    doc.moveDown(0.5);

    // --- PÁRRAFO 12.2 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('12.2', marginL, currentY);

    doc.font('Arial Bold').text('EL TRABAJADOR ', textX, currentY, {
      width: textWidth,
      align: 'left',
      continued: true,
    });

    doc
      .font('Arial Normal')
      .text(
        'no podrá revelar su contraseña a otro personal o algún tercero, siendo plenamente responsable por el uso de dicha herramienta de trabajo. ',
        { continued: true },
      );

    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'reconoce y acepta que se encuentra prohibido el uso de los recursos informáticos proporcionados por la empresa para fines particulares, no autorizado, tanto en horario laboral, como fuera de él.',
        {
          width: textWidth,
          align: 'left',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // --- PÁRRAFO 12.3 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('12.3', marginL, currentY);

    doc.font('Arial Normal').text('En ese sentido, ', textX, currentY, {
      width: textWidth,
      align: 'left',
      continued: true,
    });

    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });

    doc.font('Arial Normal').text('acepta que ', { continued: true });

    doc.font('Arial Bold').text('LA EMPRESA ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'tiene plenas facultades para revisar y leer, sin previa notificación, el contenido de la información almacenada, enviada o recibida mediante el uso de los sistemas de correo electrónico. Al respecto, mediante la suscripción del presente contrato, se otorga a ',
        { continued: true },
      );

    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'copia de la “Política para el uso del correo electrónico y páginas web”, debiendo cumplir con los establecido en la misma, bajo responsabilidad.',
        {
          width: textWidth,
          align: 'left',
          continued: false,
        },
      );

    doc.moveDown(1);

    // Título DÉCIMO TERCERA
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('DÉCIMO TERCERA: EXCLUSIVIDAD', marginL, doc.y, {
        width: textWidth + numberWidth,
        align: 'left',
        underline: true,
      });

    doc.moveDown(0.5);

    // --- PÁRRAFO 13.1 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('13.1', marginL, currentY);

    doc.font('Arial Bold').text('EL TRABAJADOR ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });

    doc
      .font('Arial Normal')
      .text('es contratado de forma exclusiva por ', { continued: true });

    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'por lo que no podrá dedicarse a otra actividad distinta de la que emana del presente contrato, salvo autorización previa, expresa y por escrito de ',
        { continued: true },
      );

    doc.font('Arial Bold').text('EL EMPLEADOR.', {
      width: textWidth,
      align: 'justify',
      continued: false,
    });

    doc.moveDown(1);

    // ==========================================
    // DÉCIMO CUARTA: NO COMPETENCIA
    // ==========================================

    // Título DÉCIMO CUARTA
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('DÉCIMO CUARTA: NO COMPETENCIA', marginL, doc.y, {
        width: textWidth + numberWidth,
        align: 'left',
        underline: true,
      });

    doc.moveDown(0.5);

    // --- PÁRRAFO 14.1 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('14.1', marginL, currentY);

    doc.font('Arial Bold').text('EL TRABAJADOR ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });

    doc
      .font('Arial Normal')
      .text('se compromete a no competir con ', { continued: true });

    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });

    doc
      .font('Arial Normal')
      .text('en los términos y condiciones que se acuerdan a continuación:', {
        width: textWidth,
        align: 'justify',
        continued: false,
      });

    doc.moveDown(0.5);

    // Lista de literales (a, b, c, d)
    // Usamos una pequeña sangría adicional para la lista
    const bulletX = textX + 15;
    // 2. Donde empieza el texto (un poco más a la derecha)
    const contentX = bulletX + 20;
    // 3. Calculamos el ancho exacto del texto para que justifique bien sin salirse de la hoja
    const contentW = doc.page.width - doc.page.margins.right - contentX;
    currentY = doc.y;
    // Literal a
    doc.font('Arial Normal').text('a)', bulletX, currentY);
    doc
      .font('Arial Normal')
      .text(
        'A no realizar ningún tipo de inversión en empresas o instituciones de cualquier tipo cuyas actividades puedan estar en conflicto con los intereses de ',
        contentX,
        currentY,
        {
          width: contentW,
          align: 'justify',
          continued: true,
        },
      );

    doc.font('Arial Bold').text('EL EMPLEADOR.', {
      width: contentW,
      align: 'justify',
      continued: false,
    });

    currentY = doc.y;
    doc.font('Arial Normal').text('b) ', bulletX, currentY);
    // Literal b
    doc
      .font('Arial Normal')
      .text(
        'A no prestar servicios en forma dependiente o independiente para personas, instituciones o empresas que compiten, directa o indirectamente, con ',
        contentX,
        currentY,
        {
          width: contentW,
          align: 'justify',
          continued: true,
        },
      );

    doc.font('Arial Bold').text('EL EMPLEADOR.', {
      width: contentW,
      align: 'justify',
      continued: false,
    });

    currentY = doc.y;
    doc.font('Arial Normal').text('c)', bulletX, currentY);

    doc.text(
      'A no utilizar la información de carácter reservado que le fue proporcionada por ',
      contentX,
      currentY,
      {
        width: contentW,
        align: 'justify',
        continued: true,
      },
    );
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'para desarrollar por cuenta propia o de terceros, actividades que compitan con las que realiza o planeara realizar ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR.', {
      width: contentW,
      align: 'justify',
      continued: false,
    });

    // Literal d
    currentY = doc.y;
    doc.font('Arial Normal').text('d)', bulletX, currentY);

    doc.text(
      'A no inducir o intentar influenciar, ni directa ni indirectamente, a ningún trabajador de ',
      contentX,
      currentY,
      {
        width: contentW,
        align: 'justify',
        continued: true,
      },
    );
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'a que termine su empleo con el mismo, para que trabaje, dependiente o independientemente, para ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'o para cualquier otra persona, entidad, institución o empresa, que compita con ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR.', {
      width: contentW,
      align: 'justify',
      continued: false,
    });

    doc.moveDown(0.5);

    // --- PÁRRAFO 14.2 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('14.2', marginL, currentY);

    doc.font('Arial Normal').text('Las obligaciones que ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });

    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'asume en virtud al literal c) de la presente cláusula, regirán indefinidamente, independientemente de la vigencia del presente contrato.',
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // --- PÁRRAFO 14.3 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('14.3', marginL, currentY);

    doc
      .font('Arial Normal')
      .text('El incumplimiento por parte de ', textX, currentY, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });

    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'de cualquiera de las obligaciones contenidas en la presente cláusula, facultará a ',
        { continued: true },
      );

    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'a iniciar las acciones legales que pudieran corresponder en defensa de sus derechos y a obtener la indemnización por daños y perjuicios a que hubiera lugar.',
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // --- PÁRRAFO 14.4 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('14.4', marginL, currentY);

    doc.font('Arial Bold').text('EL TRABAJADOR ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });

    doc
      .font('Arial Normal')
      .text(
        'declara que la remuneración acordada en la cláusula sétima comprende cualquier compensación correspondiente a los compromisos asumidos en la presente cláusula.',
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(1);

    // Título DÉCIMO QUINTA
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('DÉCIMO QUINTA: RESERVA Y CONFIDENCIALIDAD', marginL, doc.y, {
        width: textWidth + numberWidth,
        align: 'left',
        underline: true,
      });

    doc.moveDown(0.5);

    // --- PÁRRAFO 15.1 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('15.1', marginL, currentY);

    doc.font('Arial Bold').text('EL TRABAJADOR ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });

    doc
      .font('Arial Normal')
      .text(
        'se compromete a mantener reserva y confidencialidad absoluta con relación a la información y documentación obtenida con ocasión de su trabajo para ',
        { continued: true },
      );

    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });

    doc
      .font('Arial Normal')
      .text('en los términos y condiciones que se acuerdan a continuación:', {
        width: textWidth,
        align: 'justify',
        continued: false,
      });

    doc.moveDown(0.5);

    currentY = doc.y;
    doc.font('Arial Normal').text('a)', bulletX, currentY);
    doc.text(
      'A observar ante cualquier persona, entidad o empresa una discreción absoluta sobre cualquier actividad o información sobre ',
      contentX,
      currentY,
      {
        width: contentW,
        align: 'justify',
        continued: true,
      },
    );
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'y/o sus representantes, a las que hubiera tenido acceso con motivo de la prestación de sus servicios para ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR.', {
      width: contentW,
      align: 'justify',
      continued: false,
    });

    // Literal b
    currentY = doc.y;
    doc.font('Arial Normal').text('b) ', bulletX, currentY);
    doc.text(
      'A no revelar a ninguna persona, entidad o empresa, ni usar para ningún propósito, en provecho propio o de terceros, cualquier información vinculada a ',
      contentX,
      currentY,
      {
        width: contentW,
        align: 'justify',
        continued: true,
      },
    );
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc.font('Arial Normal').text('de cualquier naturaleza.', {
      width: contentW,
      align: 'justify',
      continued: false,
    });

    // Literal c
    currentY = doc.y;
    doc.font('Arial Normal').text('c) ', bulletX, currentY);

    doc.text(
      'A no revelar a ninguna persona que preste servicios a ',
      contentX,
      currentY,
      {
        width: contentW,
        align: 'justify',
        continued: true,
      },
    );
    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });
    doc
      .font('Arial Normal')
      .text('ningún tipo de información confidencial o de propiedad de ', {
        continued: true,
      });
    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'salvo que dicha persona necesite conocer tal información por razón de sus funciones. Si hubiese cualquier duda sobre lo que constituye información confidencial, o sobre si la información debe ser revelada y a quién, ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL TRABAJADOR, ', { continued: true });
    doc
      .font('Arial Normal')
      .text('se obliga a solicitar autorización de sus superiores.', {
        width: contentW,
        align: 'justify',
        continued: false,
      });

    // Literal d
    currentY = doc.y;

    doc.font('Arial Normal').text('d) ', bulletX, currentY);

    doc.text(
      'A no usar de forma inapropiada ni revelar información confidencial alguna o de propiedad de la persona, entidad o empresa para la cual laboró con anterioridad a ser contratado por ',
      contentX,
      currentY,
      {
        width: contentW,
        align: 'justify',
        continued: true,
      },
    );
    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });
    doc
      .font('Arial Normal')
      .text('así como a no introducir en las instalaciones de ', {
        continued: true,
      });
    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'ningún documento que no haya sido publicado ni ninguna clase de bien que pertenezca a cualquiera de dichas personas, entidades o empresas, sin su consentimiento previo. ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'se obliga igualmente a no violar ningún convenio de confidencialidad o sobre derechos de propiedad que haya firmado en conexión con tales personas, entidades o empresas.',
        { width: contentW, align: 'justify', continued: false },
      );

    // Literal e
    currentY = doc.y;
    doc.font('Arial Normal').text('e) ', bulletX, currentY);
    doc.text('A devolver a ', contentX, currentY, {
      width: contentW,
      align: 'justify',
      continued: true,
    });
    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'al concluir su prestación de servicios, sea cual fuere la causa, archivos, correspondencia, registros o cualquier documento o material contenido o fijado en cualquier medio o soporte, que se le hubiese proporcionado o que hubiesen sido creados en virtud de su relación de trabajo (incluyendo copias de los mismos), así como todo bien que se le hubiese entregado, incluyendo (sin limitación) todo distintivo de identificación, tarjetas de ingreso, uniforme, herramientas de trabajo y cualquier otro material otorgado.',
        { width: contentW, align: 'justify', continued: false },
      );

    doc.moveDown(0.5);

    // --- PÁRRAFO 15.2 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('15.2', marginL, currentY);

    doc.font('Arial Normal').text('Las obligaciones que ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });

    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'asume en los literales a), b), c), d) y e) de la presente cláusula, regirán indefinidamente, independientemente de la vigencia del presente contrato.',
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // --- PÁRRAFO 15.3 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('15.3', marginL, currentY);

    doc
      .font('Arial Normal')
      .text('El incumplimiento por parte de ', textX, currentY, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });

    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'de cualquiera de las obligaciones contenidas en la presente cláusula, facultará a ',
        { continued: true },
      );

    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'a iniciar las acciones legales que pudieran corresponder en defensa de sus derechos y a obtener la indemnización por daños y perjuicios a que hubiera lugar.',
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);
    if (doc.y + 60 > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
    }
    // --- PÁRRAFO 15.4 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('15.4', marginL, currentY);

    doc.font('Arial Bold').text('EL TRABAJADOR ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });

    doc
      .font('Arial Normal')
      .text(
        'declara que la remuneración acordada en la cláusula tercera comprende cualquier compensación correspondiente a los compromisos asumidos en la presente cláusula.',
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(1);
    if (doc.y + 60 > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
    }
    // ==========================================
    // DÉCIMO SEXTA: PROTECCIÓN DE DATOS
    // ==========================================

    // Título
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text(
        'DÉCIMO SEXTA: SEGURIDAD Y CONFIDENCIALIDAD EN EL TRATAMIENTO DE DATOS PERSONALES',
        marginL,
        doc.y,
        {
          width: textWidth + numberWidth,
          align: 'left',
          underline: true,
        },
      );

    doc.moveDown(0.5);

    // --- PÁRRAFO 16.1 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('16.1', marginL, currentY);

    doc.font('Arial Normal').text('En caso ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });

    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'accediera a datos personales de cualquier índole como consecuencia de desarrollo de sus labores, éste deberá cumplir la normativa interna aprobada por ',
        { continued: true },
      );

    doc
      .font('Arial Bold')
      .text('INVERSIONES URBANÍSTICAS OPERADORA S.A. ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'referida a La Protección de Datos Personales, que incluye la Ley N° 29733, y su Reglamento, aprobado por el Decreto Supremo N° 003-2013-JUS.',
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // Continuación de 16.1 (Segundo párrafo sin número, alineado al texto)
    doc
      .font('Arial Normal')
      .text('En cualquier caso, corresponde a ', textX, doc.y, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });

    doc
      .font('Arial Bold')
      .text('INVERSIONES URBANÍSTICAS OPERADORA S.A. ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'decidir sobre la finalidad y contenido del tratamiento de datos personales, limitándose ',
        { continued: true },
      );

    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'a utilizar éstos única y exclusivamente para el cumplimiento de sus funciones y conforme a las indicaciones de ',
        { continued: true },
      );

    doc.font('Arial Bold').text('INVERSIONES URBANÍSTICAS OPERADORA S.A.', {
      width: textWidth,
      align: 'justify',
      continued: false,
    });

    doc.moveDown(0.5);

    // --- PÁRRAFO 16.2 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('16.2', marginL, currentY);

    doc.font('Arial Normal').text('De esta forma, ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });

    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });

    doc.font('Arial Normal').text('queda obligado a:', {
      width: textWidth,
      align: 'justify',
      continued: false,
    });

    doc.moveDown(0.5);

    // --- LISTA 16.2 (a, b, c) ---
    // Configuración de sangría francesa para la lista
    const listBulletX = textX + 15;
    const listContentX = listBulletX + 20;
    const listContentW = doc.page.width - doc.page.margins.right - listContentX;

    // a)
    let itemY = doc.y;
    doc.font('Arial Normal').text('a)', listBulletX, itemY);
    doc.text(
      'Tratar, custodiar y proteger los datos personales a los que pudiese acceder como consecuencia del ejercicio de sus funciones, cumpliendo con las medidas de índole jurídica, técnica y organizativas establecidas en la Ley N° 29733, y su Reglamento, así como en la normativa interna de ',
      listContentX,
      itemY,
      { width: listContentW, align: 'justify', continued: true },
    );
    doc.font('Arial Bold').text('INVERSIONES URBANÍSTICAS OPERADORA S.A.', {
      width: listContentW,
      align: 'justify',
      continued: false,
    });

    doc.moveDown(0.5);

    // b)
    itemY = doc.y;
    doc.font('Arial Normal').text('b)', listBulletX, itemY);
    doc.text(
      'Utilizar o aplicar los datos personales, exclusivamente, para la realización de sus funciones y, en su caso, de acuerdo con las instrucciones impartidas por ',
      listContentX,
      itemY,
      { width: listContentW, align: 'justify', continued: true },
    );
    doc.font('Arial Bold').text('INVERSIONES URBANÍSTICAS OPERADORA S.A.', {
      width: listContentW,
      align: 'justify',
      continued: false,
    });

    doc.moveDown(0.5);

    // c)
    itemY = doc.y;
    doc.font('Arial Normal').text('c)', listBulletX, itemY);
    doc.text(
      'Mantener el deber de secreto y confidencialidad de los datos personales de manera indefinida; es decir, durante la vigencia del presente contrato, así como una vez concluido éste.',
      listContentX,
      itemY,
      { width: listContentW, align: 'justify', continued: false },
    );

    doc.moveDown(0.5);

    // --- PÁRRAFO 16.3 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('16.3', marginL, currentY);

    doc.font('Arial Normal').text('El incumplimiento de ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });

    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'respecto de sus obligaciones vinculadas al tratamiento de datos personales, constituye incumplimiento de obligaciones laborales que dará lugar a la imposición de sanciones disciplinarias, sin perjuicio de las responsabilidades penales, civiles y administrativas que su incumplimiento genere.',
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(1);

    // ==========================================
    // DÉCIMO SÉTIMA: CUMPLIMIENTO DE NORMAS
    // ==========================================

    // Título Largo
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text(
        'DÉCIMO SETIMA: CUMPLIMIENTO DE LAS NORMAS DE CONDUCTA ÉTICA, RESPONSABILIDAD ADMINISTRATIVA DE LAS PERSONAS JURÍDICAS, PREVENCIÓN DE LAVADO DE ACTIVOS Y FINANCIAMIENTO DEL TERRORISMO Y NORMAS QUE SANCIONAN DELITOS DE CORRUPCIÓN COMETIDOS ENTRE PRIVADOS QUE AFECTEN EL NORMAL DESARROLLO DE LAS RELACIONES COMERCIALES Y LA COMPETENCIA LEAL ENTRE EMPRESAS',
        marginL,
        doc.y,
        {
          width: textWidth + numberWidth,
          align: 'left',
          underline: true,
        },
      );

    doc.moveDown(0.5);

    // --- PÁRRAFO 17.1 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('17.1', marginL, currentY);

    doc
      .font('Arial Normal')
      .text(
        'Lo establecido en la presente cláusula seguirá las disposiciones contenidas en la normativa de Responsabilidad Administrativa de las Personas Jurídicas, aprobada por la Ley N° 30424, con las modificaciones incorporadas por el Decreto Legislativo N° 1352, Ley N° 31740 y la Ley 30835, y de las normas sobre Prevención del Lavado de Activos y Financiamiento del Terrorismo, aprobadas por la Ley N° 27693, y su reglamento, aprobado por el Decreto Supremo N° 018-2006-JUS (en adelante, PLAFT), así como el correcto cumplimiento de la legislación peruana vigente en general, incluyendo reglamentos, directivas, regulaciones, jurisprudencia vinculante, decisiones, decretos, órdenes, instrumentos y cualquier otra medida legislativa o decisión con fuerza de ley en el Perú de obligatorio cumplimiento para el EMPLEADOR o el TRABAJADOR o cualquiera de ellas.',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // --- PÁRRAFO 17.2 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('17.2', marginL, currentY);

    doc
      .font('Arial Normal')
      .text(
        'El TRABAJADOR declara que no ha incumplido las normas anticorrupción vigentes, ni ofrecido, pagado o comprometido a pagar, autorizado el pago de cualquier dinero directa o indirectamente, u ofrecido, entregado o comprometido a entregar, autorizado a entregar directa o indirectamente, cualquier objeto de valor, a cualquier funcionario gubernamental o a cualquier persona que busque el beneficio de un funcionario gubernamental. Asimismo, declara que no ha sido sancionado ni investigado por la comisión de los delitos de lavado de activos, financiamiento del terrorismo, corrupción de funcionarios, apropiación ilícita, fraude financiero, defraudación tributaria. EL TRABAJADOR se compromete a no incurrir en ninguno de los delitos mencionados ni ningún otro ilícito penal en el desarrollo de sus labores, ni siquiera cuando sea o pueda ser en beneficio del EMPLEADOR.',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // --- PÁRRAFO 17.3 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('17.3', marginL, currentY);

    doc
      .font('Arial Normal')
      .text(
        'Asimismo, mediante Decreto Legislativo N° 1385 ha sido modificado el Código Penal, a fin de sancionar penalmente los actos de corrupción cometidos entre privados que afectan el normal desarrollo de las relaciones comerciales y la competencia leal entre empresas.',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5); // Separación de párrafos dentro del 17.3

    // Continuación 17.3 (Texto indentado)
    doc
      .font('Arial Normal')
      .text(
        'Al respecto, EL TRABAJADOR declara conocer que está impedido de, directa o indirectamente, aceptar, recibir o solicitar donativo, promesa o cualquier otra ventaja o beneficio indebido de cualquier naturaleza, para sí o para un tercero para realizar u omitir un acto que permita favorecer a otro en la adquisición o comercialización de bienes o mercancías, en la contratación de servicios comerciales o en las relaciones comerciales de su EMPLEADOR.',
        textX,
        doc.y,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    doc
      .font('Arial Normal')
      .text(
        'Asimismo, EL TRABAJADOR declara conocer que está impedido de, directa o indirectamente, prometer, ofrecer o conceder a accionistas, gerentes, directores, administradores, representantes legales, apoderados, empleados o asesores de una persona jurídica de derecho privado, organización no gubernamental, asociación, fundación, comité, incluidos los entes no inscritos o sociedades irregulares, una ventaja o beneficio indebido de cualquier naturaleza, para ellos o para un tercero, como contraprestación para realizar u omitir un acto que permita favorecer a éste u otro en la comercialización o adquisición de bienes o mercancías, en la contratación de servicios comerciales o en las relaciones comerciales de su EMPLEADOR.',
        textX,
        doc.y,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    doc
      .font('Arial Normal')
      .text(
        'Asimismo, EL TRABAJADOR declara conocer que está impedido de, directa o indirectamente, aceptar, recibir o solicitar donativo, promesa o cualquier otra ventaja o beneficio indebido de cualquier naturaleza para sí o para un tercero para realizar u omitir un acto en perjuicio de su EMPLEADOR. Asimismo, EL TRABAJADOR declara conocer que está impedido de, directa o indirectamente, prometer, ofrecer o conceder a accionistas, gerentes, directores, administradores, representantes legales, apoderados, empleados o asesores de una persona jurídica de derecho privado, organización no gubernamental, asociación, fundación, comité, incluidos los entes no inscritos o sociedades irregulares, una ventaja o beneficio indebido de cualquier naturaleza, para ellos o para un tercero, como contraprestación para realizar u omitir realizar u omitir un acto en perjuicio de su EMPLEADOR.',
        textX,
        doc.y,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // --- PÁRRAFO 17.4 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('17.4', marginL, currentY);

    doc
      .font('Arial Normal')
      .text(
        'Las Partes acuerdan que, durante el periodo de vigencia del Contrato, estarán obligadas a actuar en estricto cumplimiento de la legislación vigente, quedando completamente prohibido, bajo cualquier circunstancia, realizar actos que impliquen la vulneración de la ley penal.',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // --- PÁRRAFO 17.5 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('17.5', marginL, currentY);

    doc
      .font('Arial Normal')
      .text(
        'Adicionalmente, EL TRABAJADOR se compromete a no cometer delitos estipulados en la Ley N°31740, los cuales se encuentran relacionadas con las siguientes leyes:',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // --- LISTA DE LEYES (Bullets) ---

    const printBullet = (texto: string) => {
      const bY = doc.y;
      doc.text('•', bulletX, bY);
      doc.text(texto, contentX, bY, {
        width: contentW,
        align: 'justify',
      });
      doc.moveDown(0.2);
    };

    printBullet('DL N°1106: Lavado de Activos');
    printBullet('Ley N°25475: Terrorismo');
    printBullet('Código Penal Peruano: Fraude en las Personas Jurídicas');
    printBullet('Código Penal Peruano: Delitos Contra El Patrimonio Cultural');
    printBullet('Decreto Legislativo N°813: Ley Penal Tributaria');
    printBullet('Ley N°28008: Delitos Aduaneros');

    doc.moveDown(1);

    const fullWidth =
      doc.page.width - doc.page.margins.left - doc.page.margins.right;
    //TEXTO 18

    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('DÉCIMO OCTAVA: VALIDEZ', marginL, doc.y, {
        width: textWidth + numberWidth,
        underline: true,
        align: 'left',
      })
      .moveDown(1);

    //parrafo 18.1

    // Texto cuerpo
    doc
      .font('Arial Normal')
      .text(
        'Las partes ratifican que el presente contrato constituye un acto jurídico válido que no se encuentra afectado por causal de invalidez o ineficacia alguna y se presentará al Ministerio de Trabajo y Promoción del Empleo dentro de los primeros quince (15) días de celebrado.',
        marginL,
        doc.y,
        {
          width: fullWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(1);

    //TEXTO 19
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('DÉCIMO NOVENA: DE LOS EXÁMENES MÉDICOS', marginL, doc.y, {
        width: textWidth + numberWidth,
        align: 'left',
        underline: true,
      })
      .moveDown(1);
    currentY = doc.y;
    //parrafo 18.1
    doc.font('Arial Bold').text('EL TRABAJADOR ', marginL, currentY, {
      width: fullWidth,
      align: 'justify',
      continued: true,
    });

    doc
      .font('Arial Normal')
      .text(
        'se someterá obligatoriamente a los exámenes médicos que dispongan ',
        { continued: true },
      );

    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'y/o la ley, con la finalidad de verificar si éste se encuentra apto para desarrollar los servicios y funciones propios de su cargo. En este sentido, ambas Partes declaran que la conservación de la salud de EL TRABAJADOR es motivo determinante de la relación contractual.',
        {
          width: fullWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(1);

    //TEXTO 20
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text(
        'VIGESIMO: DE LAS RECOMENDACIONES EN MATERIA DE SEGURIDAD Y SALUD EN EL TRABAJO',
        marginL,
        doc.y,
        {
          width: textWidth + numberWidth,
          align: 'left',
          underline: true,
        },
      );

    doc.moveDown(1);
    currentY = doc.y;
    //PARRAFO 20.1
    doc
      .font('Arial Normal')
      .text(
        'De conformidad con lo establecido en el artículo 35° de la Ley N° 29783 – Ley de Seguridad y Salud en el Trabajo y, en calidad de anexo al presente contrato ',
        marginL,
        doc.y,
        {
          width: fullWidth,
          align: 'justify',
          continued: true,
        },
      );

    doc.font('Arial Bold').text('(ANEXO – 1), ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'se incorpora la descripción de las recomendaciones de seguridad y salud en el trabajo, las mismas que ',
        { continued: true },
      );

    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });

    doc
      .font('Arial Normal')
      .text(
        'deberá seguir y tomar en consideración de forma rigurosa durante la prestación de sus servicios.',
        {
          width: fullWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(1);
    //TEXTO 21
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('VIGÉSIMO PRIMERA: DOMICILIO', marginL, doc.y, {
        width: textWidth + numberWidth,
        align: 'left',
        underline: true,
      });

    doc.moveDown(0.5);
    currentY = doc.y;
    // Texto cuerpo
    doc
      .font('Arial Normal')
      .text(
        'Para todos los efectos legales del presente Contrato, las partes fijan como sus domicilios, los señalados en la introducción de este contrato. Cualquier cambio de domicilio deberá ser comunicado por escrito a la otra parte, mediante comunicación escrita, de lo contrario se entenderá que todas las notificaciones se han realizado válidamente.',
        marginL,
        currentY,
        {
          width: fullWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(1);
    //TEXTO 19
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('VIGÉSIMA SEGUNDO: SOLUCIÓN DE DISPUTAS', marginL, doc.y, {
        width: textWidth + numberWidth,
        underline: true,
        align: 'left',
      })
      .moveDown(1);
    currentY = doc.y;
    doc.font('Arial Normal').text('22.1', marginL, currentY);

    doc.text(
      'En el improbable caso de que lleguen a existir discrepancias, controversias o reclamaciones derivadas de la validez, alcance, interpretación o aplicación del presente contrato, las partes se comprometen a poner el mejor de sus con el fin de lograr una solución armoniosa a sus diferencias.',
      textX,
      currentY,
      {
        width: textWidth,
        align: 'justify',
        continued: false,
      },
    );

    doc.moveDown(0.5);

    // --- PÁRRAFO 22.2 ---
    currentY = doc.y;

    doc.font('Arial Normal').text('22.2', marginL, currentY);

    doc.text(
      'Si lo señalado en el párrafo anterior resulta infructuoso para resolver el conflicto surgido, las partes convienen renunciar al fuero judicial de sus domicilios o centros de trabajo, y se someten a la jurisdicción de los jueces del Distrito Judicial de Lima - Cercado.',
      textX,
      currentY,
      {
        width: textWidth,
        align: 'justify',
        continued: false,
      },
    );
    doc.moveDown(1);
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('VIGÉSIMA TERCERA: APLICACIÓN SUPLETORIA', marginL, doc.y, {
        width: textWidth + numberWidth,
        align: 'left',
        underline: true,
      });

    doc.moveDown(0.5);

    // Texto Cuerpo (Sin número, pero respetando la sangría del texto)
    doc
      .font('Arial Normal')
      .text(
        'En todo lo no previsto por el presente contrato, el vínculo laboral se regirá por las disposiciones laborales vigentes que regulan a los contratos de trabajo sujetos a modalidad, contenidas actualmente en el Texto único Ordenado del Decreto Legislativo Nº 728 (Decreto Supremo Nº 003-97-TR, Ley de Productividad y Competitividad Laboral) y su Reglamento y por las disposiciones complementarias o modificatorias que pudieran darse en el futuro.',
        marginL,
        doc.y,
        {
          width: fullWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(1);

    // ==========================================
    // PÁRRAFO FINAL DE CIERRE
    // ==========================================

    doc
      .font('Arial Normal')
      .text(
        `En señal de conformidad, las partes suscriben dos (02) ejemplares del presente contrato en la ciudad de ${data.province}, el día ${data.entryDate}, quedando un ejemplar en poder del empleador y otro en poder del trabajador, quien declara haber recibido una copia del contrato y estar de acuerdo con su contenido.`,
        marginL,
        doc.y,
        {
          width: fullWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(2);

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
    const cmToPt = (cm: number) => cm * 28.3465;
    const doc = new PDFDocument({
      size: 'A4',
      margins: {
        top: cmToPt(2.12),
        bottom: cmToPt(2.4),
        left: cmToPt(2.7),
        right: cmToPt(2.8),
      },
    });

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

    // Lógica para el nombre del suplido
    const replacementForArray = data.replacementFor?.split(' ');
    const firstAndfirstLastName = `${replacementForArray?.[0] || ''} ${replacementForArray?.[1] || ''}`;
    const secondLastName = `${replacementForArray?.[2] || ''}`;

    // --- VARIABLES DE ALINEACIÓN ---
    const marginL = doc.page.margins.left;
    const numberWidth = 25;
    const textX = marginL + numberWidth;
    const textWidth = doc.page.width - doc.page.margins.right - textX;
    const fullWidth =
      doc.page.width - doc.page.margins.left - doc.page.margins.right;

    // TÍTULO
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('CONTRATO DE TRABAJO SUJETO A MODALIDAD DE SUPLENCIA', {
        underline: true,
        align: 'center',
      })
      .moveDown(1);

    // INTRODUCCIÓN
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text(
        'Conste por el presente documento, que se suscribe por duplicado con igual tenor y valor, el ',
        { continued: true, align: 'justify' },
      )
      .font('Arial Bold')
      // Nota: Mantengo el texto exacto que me pasaste, aunque dice "Incremento" en la intro del código fuente original
      .text('Contrato por Incremento de Actividades, ', {
        continued: true,
      })
      .font('Arial Normal')
      .text(
        'que, al amparo de lo dispuesto en los Artículos 53 y 57 del Texto Único Ordenado del Decreto Legislativo Nº 728 (Decreto Supremo Nº 003-97-TR, Ley de Productividad y Competitividad Laboral) y el Decreto Supremo N° 002-97-TR, celebran, de una parte, la empresa ',
        { continued: true },
      )
      .font('Arial Bold')
      .text('INVERSIONES URBANÍSTICAS OPERADORA S.A., ', {
        continued: true,
      })
      .font('Arial Normal')
      .text(
        'con R.U.C. Nº 20603381697, con domicilio en Calle Dean Valdivia N°148 Int.1401 Urb. Jardín (Edificio Platinium), Distrito de San Isidro, Provincia y Departamento de Lima, debidamente representada por la Sra. Catherine Susan Chang López identificado con D.N.I. Nº 42933662  y por la Sra. Maria Estela Guillen Cubas, identificada con DNI Nº 10346833, según poderes inscritos en la Partida Electrónica 14130887 del Registro de Personas Jurídicas de Lima, a quien en adelante se le denominará “EL EMPLEADOR”; y de otra parte, el Sr.(a). ',
        { continued: true },
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
      .text('a quien en adelante se le denominará ', {
        continued: true,
      })
      .font('Arial Bold')
      .text('“EL TRABAJADOR”; ', { continued: true })
      .font('Arial Normal')
      .text(
        'y que en conjunto serán denominados “Las Partes”,  en los términos y condiciones siguientes:',
        { continued: false },
      )
      .moveDown(1);

    let currentY = doc.y;

    // --- PRIMERO ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('PRIMERO: PARTES DEL CONTRATO', marginL, doc.y, {
        underline: true,
        align: 'left',
      })
      .moveDown(1);

    currentY = doc.y;

    // 1.1
    doc.font('Arial Normal').text('1.1', marginL, currentY);
    doc.font('Arial Bold').text('EL EMPLEADOR ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc
      .font('Arial Normal')
      .text(
        'es una sociedad anónima debidamente constituida e inscrita en la Partida No. 14130887 del Registro de Personas Jurídicas de la Ciudad de Lima, cuyo objeto social es la prestación de servicios de administración, promoción, desarrollo y operación de playas de estacionamiento, sistemas de peaje y actividades conexas.',
        { continued: false },
      );

    // 1.2
    currentY = doc.y;
    doc.font('Arial Normal').text('1.2', marginL, currentY);
    doc.font('Arial Bold').text('EL EMPLEADOR ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc.font('Arial Normal').text('requiere contratar a ', { continued: true });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc.font('Arial Normal').text('para cubrir la ausencia del trabajador ', {
      continued: true,
    });
    doc
      .font('Arial Bold')
      .text(`${firstAndfirstLastName} `, { continued: true });
    doc.font('Arial Bold').text(`${secondLastName} `, { continued: true });
    doc.font('Arial Normal').text('(en adelante ', { continued: true });
    doc.font('Arial Bold').text('EL SUPLIDO) ', { continued: true });
    doc.font('Arial Normal').text('quién viene ocupando el cargo de ', {
      continued: true,
    });
    doc.font('Arial Bold').text(`${data.position} `, { continued: true });
    doc.font('Arial Normal').text('en la Playa ', { continued: true });
    doc
      .font('Arial Bold')
      .text(`${data.subDivisionOrParking} `, { continued: true });
    doc.font('Arial Normal').text('el mismo que por motivos de ', {
      continued: true,
    });
    doc
      .font('Arial Bold')
      .text(`${data.reasonForSubstitution} `, { continued: true });
    doc.font('Arial Normal').text('se ausentará por espacio de ', {
      continued: true,
    });
    doc
      .font('Arial Bold')
      .text(`${data.timeForCompany}.`, { continued: false });

    // 1.3
    currentY = doc.y;
    doc.font('Arial Normal').text('1.3', marginL, currentY);
    doc.font('Arial Bold').text('EL TRABAJADOR, ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc.font('Arial Normal').text('declara tener experiencia en ', {
      continued: true,
    });
    doc.font('Arial Bold').text(`${data.position}, `, { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'por lo que cuenta con las condiciones necesarias para ocupar el cargo de ',
        { continued: true },
      );
    doc.font('Arial Bold').text(`${data.position}, `, {
      continued: true,
    });
    doc
      .font('Arial Normal')
      .text(
        'durante el tiempo que ésta lo estime y la naturaleza de las labores así lo exija.',
        { continued: false },
      );

    doc.moveDown(1);

    // --- SEGUNDO ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('SEGUNDO: OBJETO DEL CONTRATO', marginL, doc.y, {
        underline: true,
        align: 'left',
      })
      .moveDown(1);

    // 2.1
    currentY = doc.y;
    doc.font('Arial Normal').text('2.1', marginL, currentY);
    doc
      .font('Arial Normal')
      .text('Por el presente documento ', textX, currentY, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc.font('Arial Normal').text('contrata los servicios de ', {
      continued: true,
    });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc.font('Arial Normal').text('a plazo fijo bajo la modalidad de ', {
      continued: true,
    });
    doc.font('Arial Bold').text('SUPLENCIA ', { continued: true });
    doc.font('Arial Normal').text('para que desempeñe el cargo de ', {
      continued: true,
    });
    doc.font('Arial Bold').text(`${data.position} `, { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'asumiendo las responsabilidades propias del puesto y de acuerdo a las estipulaciones contenidas en este Contrato.',
        { continued: false },
      );

    // 2.2
    currentY = doc.y;
    doc.font('Arial Normal').text('2.2', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Las partes reconocen y declaran que el cargo de ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text('está sujeto a supervisión inmediata y corresponde a uno de ', {
        continued: true,
      });
    doc
      .font('Arial Bold')
      .text(`${data.workingCondition} `, { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'de acuerdo a lo establecido en el artículo 43 del Decreto Supremo Nro. 003-97-TR.',
        { continued: false },
      );

    doc.moveDown(1);

    // --- TERCERO ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('TERCERO: PLAZO', marginL, doc.y, {
        underline: true,
        align: 'left',
      })
      .moveDown(1);

    // 3.1
    currentY = doc.y;
    doc.font('Arial Normal').text('3.1', marginL, currentY);
    doc
      .font('Arial Normal')
      .text('Las labores que desarrollará ', textX, currentY, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc.font('Arial Normal').text('tendrán una duración de ', {
      continued: true,
    });
    doc.font('Arial Bold').text(`${data.timeForCompany} `, { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'tendrán una duración de tiempo estimado para superar el incidente que motiva el presente Contrato, según lo precisado en la cláusula 1.2 precedente.',
        { continued: false },
      );

    // 3.2
    currentY = doc.y;
    doc.font('Arial Normal').text('3.2', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'El plazo del presente Contrato se contabilizarán desde el día ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text(`${data.entryDate} `, { continued: true });
    doc.font('Arial Normal').text('y concluirán de manera definitiva el día ', {
      continued: true,
    });
    doc.font('Arial Bold').text(`${data.endDate} `, { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'no obstante, Las Partes acuerdan expresamente en caso de que EL SUPLIDO se reincorpore a su puesto de trabajo antes del plazo pactado, el presente contrato quedara extinguido en conformidad con el Art. 61 del Decreto Supremo Nro. 003-97-TR.',
        { continued: false },
      );

    doc.moveDown(1);

    // --- CUARTO ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('CUARTO: PERÍODO DE PRUEBA', marginL, doc.y, {
        underline: true,
        align: 'left',
      })
      .moveDown(1);

    // Sin número, texto directo
    currentY = doc.y;
    doc.font('Arial Normal').text('4.1', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Ambas partes acuerdan en pactar un período de prueba de ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text(`${data.probationaryPeriod} `, {
      continued: true,
    });
    doc
      .font('Arial Normal')
      .text(
        'de acuerdo con lo que establece el artículo 10 de la Ley de Productividad y Competitividad Laboral.',
        { continued: false },
      );

    doc.moveDown(1);

    // --- QUINTO ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('QUINTO: REMUNERACION', marginL, doc.y, {
        underline: true,
        align: 'left',
      })
      .moveDown(1);

    // 5.1
    currentY = doc.y;
    doc.font('Arial Normal').text('5.1', marginL, currentY);
    doc.font('Arial Bold').text('EL TRABAJADOR ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc
      .font('Arial Normal')
      .text(
        'recibirá por la prestación íntegra y oportuna de sus servicios, una remuneración bruta mensual de ',
        { continued: true },
      );

    // Formateo de moneda
    const salaryFormatted =
      typeof formatCurrency === 'function'
        ? formatCurrency(Number(data.salary))
        : `S/ ${data.salary}`;

    doc.font('Arial Bold').text(`${salaryFormatted} `, { continued: true });
    doc.font('Arial Bold').text(`${data.salaryInWords}, `, { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'más la asignación familiar correspondiente de ser el caso, de la cual se deducirán las aportaciones y descuentos por tributos establecidos en la ley que resulten aplicables.',
        { continued: false },
      );

    // 5.2
    currentY = doc.y;
    doc.font('Arial Normal').text('5.2', marginL, currentY);
    doc.font('Arial Normal').text('Adicionalmente, ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'tendrá derecho al pago de beneficios tales como las gratificaciones legales en los meses de julio y diciembre, la compensación por tiempo de servicios y demás que pudieran corresponderle, de acuerdo a la legislación laboral vigente y sus respectivas modificaciones, al convenio celebrado o a las que ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });
    doc.font('Arial Normal').text('a título de liberalidad, le otorgue.', {
      continued: false,
    });

    // 5.3
    currentY = doc.y;
    doc.font('Arial Normal').text('5.3', marginL, currentY);
    doc.font('Arial Normal').text('Será de cargo de ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc.font('Arial Bold').text('EL TRABAJADOR, ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'el pago del Impuesto a la Renta, los aportes al Sistema Nacional o Privado de Pensiones, las que serán retenidas por ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'así como cualquier otro tributo o carga social que grave las remuneraciones del personal dependiente en el país.',
        { continued: false },
      );

    doc.moveDown(1);
    // --- SEXTO ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('SEXTO: JORNADA DE TRABAJO', marginL, doc.y, {
        underline: true,
        align: 'left',
      })
      .moveDown(1);

    // Introducción
    doc
      .font('Arial Normal')
      .text('En relación a la Jornada de Trabajo, ', textX, doc.y, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });
    doc.font('Arial Bold').text('EL EMPLEADOR y EL TRABAJADOR ', {
      continued: true,
    });
    doc
      .font('Arial Normal')
      .text('acuerdan lo siguiente:', { continued: false });

    // 6.1
    currentY = doc.y;
    doc.font('Arial Normal').text('6.1', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'La jornada de trabajo es de 48 horas semanales flexible, teniendo ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'la facultad de establecer el horario de trabajo y modificarlo de acuerdo a sus necesidades, con las limitaciones establecidas por la ley.',
        { continued: false },
      );
    // 6.2
    currentY = doc.y;
    doc.font('Arial Normal').text('6.2', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'El tiempo de Refrigerio no forma parte de la jornada de trabajo.',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    if (doc.y + 60 > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
    }
    // 6.3
    currentY = doc.y;
    doc.font('Arial Normal').text('6.3', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Las partes acuerdan que podrán acumularse y compensarse las horas de trabajo diarias o semanales con períodos de descanso dentro de la semana, diferentes semanas o ciclos de trabajo, según sea el caso; también se podrán compensar con las horas que no se completen con trabajo efectivo durante la jornada hasta el límite de 48 horas semanales en promedio. Asimismo, acuerdan que ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'podrá introducir modificaciones al horario y jornada de trabajo, establecer jornadas acumulativas, alternativas, flexibles, compensatorias y horarios diferenciados, respetando la jornada máxima establecida por Ley.',
        { continued: false },
      );

    doc.moveDown(0.5);

    // 6.4
    currentY = doc.y;
    doc.font('Arial Normal').text('6.4', marginL, currentY);
    doc
      .font('Arial Normal')
      .text('El trabajo en sobretiempo de ', textX, currentY, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text('es estrictamente voluntario y, a solicitud de ', {
        continued: true,
      });
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc.font('Arial Normal').text('debiendo ', { continued: true });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text('contar con autorización escrita de ', { continued: true });
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'para realizar horas extras, según lo establecido en el Reglamento Interno de Trabajo. El trabajo en sobretiemp debe ser prestado de manera efectiva, no considerándose como tal la sola permanencia en las instalaciones de ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR.', { continued: false });

    // Control salto de página
    if (doc.y + 60 > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
    }

    doc.moveDown(0.5);

    // 6.5
    currentY = doc.y;
    doc.font('Arial Normal').text('6.5', marginL, currentY);
    doc
      .font('Arial Bold')
      .text('EL TRABAJADOR y EL EMPLEADOR ', textX, currentY, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });
    doc
      .font('Arial Normal')
      .text(
        'acuerdan que durante la vigencia de la relación laboral podrán compensar el trabajo prestado en sobretiempo con el otorgamiento de períodos equivalentes de descanso; debiendo realizarse tal compensación, dentro del mes calendario siguiente a aquel en que se realizó dicho trabajo, salvo pacto en contrario.',
        { continued: false },
      );

    doc.moveDown(0.5);

    // 6.6
    currentY = doc.y;
    doc.font('Arial Normal').text('6.6', marginL, currentY);
    doc.font('Arial Bold').text('EL TRABAJADOR ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc
      .font('Arial Normal')
      .text(
        'por su cargo y la naturaleza de su prestación de servicios se encuentra sujeto de control. Ambas partes acuerdan que la forma y fecha de pago de la remuneración podrá ser modificada por ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text('de acuerdo con sus necesidades operativas.', { continued: false });

    doc.moveDown(1);

    // --- SÉTIMA ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text(
        'SÉTIMA: PRINCIPALES OBLIGACIONES DE EL TRABAJADOR',
        marginL,
        doc.y,
        {
          underline: true,
          align: 'left',
        },
      )
      .moveDown(1);

    doc
      .font('Arial Normal')
      .text('Por medio del presente documento, ', textX, doc.y, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc.font('Arial Normal').text('se obliga, referencialmente, a:', {
      continued: false,
    });

    doc.moveDown(0.5);

    // 7.1
    currentY = doc.y;
    doc.font('Arial Normal').text('7.1', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Prestar sus servicios, cumpliendo con las funciones, órdenes e instrucciones que imparta o señale ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'o sus representantes, para realizar las actividades que correspondan a su cargo.',
        { continued: false },
      );

    doc.moveDown(0.5);

    // 7.2
    currentY = doc.y;
    doc.font('Arial Normal').text('7.2', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'La prestación laboral deberá ser efectuada de manera personal, no pudiendo ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text('ser reemplazado ni asistido por terceros, debiendo ', {
        continued: true,
      });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'cumplir con las funciones inherentes al puesto encomendado y las labores adicionales y/o anexas que fuese necesario ejecutar y sean requeridas y/o determinadas por ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR.', { continued: false });

    doc.moveDown(0.5);

    // 7.3
    currentY = doc.y;
    doc.font('Arial Normal').text('7.3', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Prestar sus servicios con responsabilidad, prontitud, esmero y eficiencia, aportando su conocimiento y experiencia profesional en el cumplimiento de los objetivos y estrategias de ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR.', { continued: false });

    doc.moveDown(0.5);

    // 7.4
    currentY = doc.y;
    doc.font('Arial Normal').text('7.4', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Cumplir estrictamente la legislación peruana en materia laboral, el Reglamento Interno de Trabajo, el Reglamento de Seguridad y Salud en el Trabajo, el Reglamento de Hostigamiento Sexual y demás disposiciones directivas, circulares reglamentos, normas, etc., que expida ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR; ', { continued: true });
    doc
      .font('Arial Normal')
      .text('declarando conocer todas aquellas que se encuentran vigentes.', {
        continued: false,
      });

    doc.moveDown(0.5);

    // 7.5
    currentY = doc.y;
    doc.font('Arial Normal').text('7.5', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'No ejecutar por su cuenta o en su beneficio, sea en forma directa o indirecta, actividad o negociaciones dentro del giro de ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'en cualquier forma o naturaleza, inclusive fuera de la jornada de trabajo y en días inhábiles o festivos. ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL TRABAJADOR, ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'declara entender que el incumplimiento a lo antes mencionado constituye una infracción de los deberes esenciales que emanan de su vínculo laboral, por lo que en el caso de no cumplir con su compromiso, tal acto será considerado como una falta grave.',
        { continued: false },
      );

    doc.moveDown(0.5);

    // 7.6
    currentY = doc.y;
    doc.font('Arial Normal').text('7.6', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Devolver en forma inmediata todos los materiales (documentos, informes, bienes, herramientas, vestimenta, etc. que se le entreguen con ocasión del trabajo prestado si la relación laboral concluyese por cualquier causa.',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // 7.7
    currentY = doc.y;
    doc.font('Arial Normal').text('7.7', marginL, currentY);
    doc.font('Arial Bold').text('EL TRABAJADOR ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc
      .font('Arial Normal')
      .text(
        'se obliga a respetar los procedimientos de evaluación d rendimiento y desempeño laboral que tiene establecidos ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text('con el objeto de valorar el nivel de eficiencia logrado por ', {
        continued: true,
      });
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text('en su puesto de trabajo.', { continued: false });

    doc.moveDown(0.5);

    // 7.8
    currentY = doc.y;
    doc.font('Arial Normal').text('7.8', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Cualquier otra obligación prevista en este contrato, establecida por ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'que se desprenda de su condición de trabajador y aquellas previstas en las normas que resulten aplicables.',
        { continued: false },
      );

    doc.moveDown(1);

    // --- OCTAVA ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('OCTAVA: OBLIGACIONES DEL EMPLEADOR', marginL, doc.y, {
        underline: true,
        align: 'left',
      })
      .moveDown(1);

    // 8.1
    currentY = doc.y;
    doc.font('Arial Normal').text('8.1', marginL, currentY);
    doc.font('Arial Normal').text('Pagar a ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'todos los derechos y beneficios que le correspondan de acuerdo a lo dispuesto en la legislación laboral vigente al momento del pago.',
        { continued: false },
      );

    doc.moveDown(0.5);

    // 8.2
    currentY = doc.y;
    doc.font('Arial Normal').text('8.2', marginL, currentY);
    doc
      .font('Arial Normal')
      .text('Registrar los pagos realizados a ', textX, currentY, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'en el Libro de Planillas de Remuneraciones de la Empresa y hacer entrega oportuna de la boleta de pago.',
        { continued: false },
      );

    doc.moveDown(0.5);

    // 8.3
    currentY = doc.y;
    doc.font('Arial Normal').text('8.3', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Poner en conocimiento de la Autoridad Administrativa de Trabajo el presente Contrato, para su conocimiento y registro, en cumplimiento de lo dispuesto en el Texto Único Ordenado del Decreto Legislativo Nº 728 (Decreto Supremo Nº 003-97-TR, Ley de Productividad y Competitividad Laboral).',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // 8.4
    currentY = doc.y;
    doc.font('Arial Normal').text('8.4', marginL, currentY);
    doc
      .font('Arial Normal')
      .text('Retener de la remuneración bruta mensual de ', textX, currentY, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });
    doc.font('Arial Bold').text('EL TRABAJADOR, ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'las sumas correspondientes al aporte al Seguro Privado o Público de Pensiones, así como el Impuesto a la Renta.',
        { continued: false },
      );

    doc.moveDown(0.5);

    // 8.5
    currentY = doc.y;
    doc.font('Arial Normal').text('8.5', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Las otras contenidas en la legislación laboral vigente y en cualquier norma de carácter interno, incluyendo el Reglamento Interno de Trabajo, el Reglamento de Seguridad y Salud en el Trabajo y el Reglamento de Hostigamiento Sexual.',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(1);
    // --- NOVENA ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('NOVENA: DECLARACIONES DE LAS PARTES', marginL, doc.y, {
        underline: true,
        align: 'left',
      })
      .moveDown(0.5);

    doc
      .font('Arial Normal')
      .text(
        'Las partes reconocen, acuerdan y declaran lo siguiente:',
        textX,
        doc.y,
      );

    doc.moveDown(0.5);

    // 9.1
    currentY = doc.y;
    doc.font('Arial Normal').text('9.1', marginL, currentY);
    doc.font('Arial Bold').text('EL TRABAJADOR ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc
      .font('Arial Normal')
      .text(
        'se encuentra sujeto al régimen laboral de la actividad privada y le son aplicables los derechos y beneficios previstos en él.',
        { continued: false },
      );

    doc.moveDown(0.5);

    // 9.2
    currentY = doc.y;
    doc.font('Arial Normal').text('9.2', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'De acuerdo a la facultad establecida en el párrafo segundo del artículo 9 del Texto Único Ordenado de la Ley de Productividad y Competitividad Laboral, ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'se reserva la facultad de modificar en lugar de la prestación de los servicios, de acuerdo a las necesidades del negocio y observando el criterio de razonabilidad.',
        { continued: false },
      );

    doc.moveDown(0.5);
    if (doc.y + 60 > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
    }
    // 9.3
    currentY = doc.y;
    doc.font('Arial Normal').text('9.3', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Sin perjuicio de las labores para las cuales ha sido contratado, las partes declaran que ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'prestará todas aquellas actividades conexas o complementarias a las propias del cargo que ocupará, que razonablemente correspondan.',
        { continued: false },
      );

    doc.moveDown(0.5);

    // 9.4
    currentY = doc.y;
    doc.font('Arial Normal').text('9.4', marginL, currentY);
    doc
      .font('Arial Normal')
      .text('Las partes convienen que ', textX, currentY, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'tiene facultades para organizar, fiscalizar, suprimir, modificar, reemplazar y sancionar, de modo radical o no sustancial, la prestación de servicios (tiempo, lugar, forma, funciones y modalidad) de ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL TRABAJADOR.', { continued: false });

    doc.moveDown(0.5);

    // 9.5
    currentY = doc.y;
    doc.font('Arial Normal').text('9.5', marginL, currentY);
    doc
      .font('Arial Bold')
      .text('EL TRABAJADOR y EL EMPLEDOR ', textX, currentY, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });
    doc
      .font('Arial Normal')
      .text(
        'acuerdan que las Boletas de Pago de remuneraciones podrán ser selladas y firmadas por el (los) representante (s) legal (es) de ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL EMPLEDOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'con firma (s) digitalizada (s), una vez que la (s) firma (s) sea (n) inscrita (s) en el Registro de Firmas a cargo del Ministerio de Trabajado.',
        { continued: false },
      );

    doc.moveDown(0.5);

    // 9.6
    currentY = doc.y;
    doc.font('Arial Normal').text('9.6', marginL, currentY);
    doc
      .font('Arial Bold')
      .text('EL TRABAJADOR y EL EMPLEADOR ', textX, currentY, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });
    doc
      .font('Arial Normal')
      .text(
        'acuerdan que la entrega de la Boleta de Pago y demás documentos derivados de la relación laboral podrán efectuarse a través del empleo de tecnologías de la información y comunicación, tales como Intranet, Correo Electrónico u otro de similar naturaleza que implemente ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc.font('Arial Normal').text('prestando ', { continued: true });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text('su consentimiento expreso para ello. Asimismo, ', {
        continued: true,
      });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc.font('Arial Normal').text('declara como su dirección electrónica ', {
      continued: true,
    });
    doc.font('Arial Bold').text(`${data.email} `, { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'en caso se implemente la entrega de Boletas de Pago, a través de dicho medio; obligándose ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text('a informar por escrito a ', { continued: true });
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text('cualquier cambio de su dirección electrónica.', {
        continued: false,
      });

    doc.moveDown(1);

    // --- DECIMA ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('DÉCIMA: TÉRMINO DEL CONTRATO', marginL, doc.y, {
        underline: true,
        align: 'left',
      })
      .moveDown(1);

    // 10.1
    currentY = doc.y;
    doc.font('Arial Normal').text('10.1', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Queda entendido que la extinción del presente contrato operará indefectiblemente en la fecha de vencimiento prevista en la cláusula tercera, salvo que las necesidades aun persistan, escenario en el que ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc.font('Arial Normal').text('propondrá a ', { continued: true });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text('suscribir una renovación por escrito. Por lo tanto, ', {
        continued: true,
      });
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'no está obligado a dar ningún aviso adicional referente al término del presente contrato. En dicho momento, se abonará a ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'los beneficios sociales que le pudieran corresponder de acuerdo a ley. ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'podrá resolver el contrato cuando medien los supuestos establecidos en el Texto Único Ordenado del Decreto Legislativo Nº 728, Decreto Supremo Nº 003-97-TR.',
        { continued: false },
      );

    doc.moveDown(0.5);

    // 10.2
    currentY = doc.y;
    doc.font('Arial Normal').text('10.2', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Además, son causales de resolución del presente contrato las siguientes:',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    const listX = textX + 15;
    const listTextWidth = textWidth - 15;

    doc.text('a) La voluntad concertada de las partes', listX, doc.y, {
      width: listTextWidth,
      align: 'left',
    });
    doc.text(
      'b) El incumplimiento de las obligaciones estipuladas en el presente documento.',
      listX,
      doc.y,
      { width: listTextWidth, align: 'left' },
    );
    doc
      .font('Arial Normal')
      .text('c) La comisión de falta grave por parte de ', listX, doc.y, {
        width: listTextWidth,
        align: 'left',
        continued: true,
      });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text('prevista en las normas que resulten aplicables.', {
        continued: false,
      });
    doc.text(
      'd) La reincorporación de EL SUPLIDO a su puesto de trabajo.',
      listX,
      doc.y,
      {
        width: listTextWidth,
        align: 'left',
      },
    );
    doc.text(
      'e) Cualquier otra causal prevista en este contrato o que se encuentre establecida en las normas aplicables.',
      listX,
      doc.y,
      { width: listTextWidth, align: 'left' },
    );

    doc.moveDown(1);

    // --- DECIMA PRIMERA ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('DÉCIMA PRIMERA: PROPIEDAD INTELECTUAL', marginL, doc.y, {
        underline: true,
        align: 'left',
      })
      .moveDown(1);

    // 11.1
    currentY = doc.y;
    doc.font('Arial Normal').text('11.1', marginL, currentY);
    doc.font('Arial Bold').text('EL TRABAJADOR ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc.font('Arial Normal').text('cede y transfiere a ', { continued: true });
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'en forma total, íntegra y exclusiva, los derechos patrimoniales derivados de los trabajos e informes que sean realizados en cumplimiento del presente contrato, quedando ',
        { continued: true },
      );
    doc.font('Arial Bold').text(' EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'facultado para publicar o reproducir en forma íntegra o parcial dicha información.',
        { continued: false },
      );

    doc.moveDown(0.5);

    // 11.2
    currentY = doc.y;
    doc.font('Arial Normal').text('11.2', marginL, currentY);
    doc.font('Arial Bold').text('EL TRABAJADOR, ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc
      .font('Arial Normal')
      .text('en virtud del presente contrato laboral, cede en exclusiva a ', {
        continued: true,
      });
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'todos los derechos alienables sobre las creaciones de propiedad intelectual de las obras que sean creadas por él en el ejercicio de sus funciones y cumplimiento de sus obligaciones.',
        { continued: false },
      );

    doc.moveDown(0.5);

    // 11.3
    currentY = doc.y;
    doc.font('Arial Normal').text('11.3', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Por lo tanto, toda información creada u originada es de propiedad exclusiva de ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });
    doc.font('Arial Normal').text('quedando ', { continued: true });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'prohibido de reproducirla, venderla o suministrarla a cualquier persona natural o jurídica, salvo autorización escrita de ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR. ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'Se deja constancia que la información comprende inclusive las investigaciones, los borradores y los trabajos preliminares.',
        { continued: false },
      );

    doc.moveDown(0.5);

    // 11.4
    currentY = doc.y;
    doc.font('Arial Normal').text('11.4', marginL, currentY);
    doc.font('Arial Normal').text('En ese sentido, ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc.font('Arial Normal').text('acepta que ', { continued: true });
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'tiene plenas facultades para acceder, revisar y leer, sin previa notificación, el íntegro del contenido de la información que se encuentre en cualquiera de los medios y/o herramientas proporcionados por ',
        { continued: true },
      );
    doc
      .font('Arial Bold')
      .text('EL EMPLEADOR a EL TRABAJADOR ', { continued: true });
    doc.font('Arial Normal').text('para el cumplimiento de sus funciones.', {
      continued: false,
    });

    doc.moveDown(0.5);

    // 11.5
    currentY = doc.y;
    doc.font('Arial Normal').text('11.5', marginL, currentY);
    doc.font('Arial Bold').text('EL TRABAJADOR', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc
      .font('Arial Normal')
      .text(
        'declara que la remuneración acordada en el presente contrato comprende cualquier compensación correspondiente a los compromisos asumidos en la presente cláusula.',
        { continued: false },
      );

    doc.moveDown(1);

    // --- DECIMO SEGUNDA ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('DÉCIMO SEGUNDA: USO DE CORREO ELECTRÓNICO', marginL, doc.y, {
        align: 'left',
        underline: true,
      });

    doc.moveDown(0.5);

    // 12.1
    currentY = doc.y;
    doc.font('Arial Normal').text('12.1', marginL, currentY);
    doc.font('Arial Bold').text('EL EMPLEADOR ', textX, currentY, {
      width: textWidth,
      align: 'left',
      continued: true,
    });
    doc
      .font('Arial Normal')
      .text(
        'facilitará a EL TRABAJADOR un nombre de usuario y una contraseña dentro del dominio: @apparka.pe y/o cualquier dominio que pueda crear a futuro.',
        { continued: false },
      );

    doc.moveDown(0.5);

    // 12.2
    currentY = doc.y;
    doc.font('Arial Normal').text('12.2', marginL, currentY);
    doc.font('Arial Bold').text('EL TRABAJADOR ', textX, currentY, {
      width: textWidth,
      align: 'left',
      continued: true,
    });
    doc
      .font('Arial Normal')
      .text(
        'no podrá revelar su contraseña a otro personal o algún tercero, siendo plenamente responsable por el uso de dicha herramienta de trabajo. ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'reconoce y acepta que se encuentra prohibido el uso de los recursos informáticos proporcionados por la empresa para fines particulares, no autorizado, tanto en horario laboral, como fuera de él.',
        { continued: false },
      );

    doc.moveDown(0.5);

    // 12.3
    currentY = doc.y;
    doc.font('Arial Normal').text('12.3', marginL, currentY);
    doc.font('Arial Normal').text('En ese sentido, ', textX, currentY, {
      width: textWidth,
      align: 'left',
      continued: true,
    });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc.font('Arial Normal').text('acepta que ', { continued: true });
    doc.font('Arial Bold').text('LA EMPRESA ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'tiene plenas facultades para revisar y leer, sin previa notificación, el contenido de la información almacenada, enviada o recibida mediante el uso de los sistemas de correo electrónico. Al respecto, mediante la suscripción del presente contrato, se otorga a ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'copia de la “Política para el uso del correo electrónico y páginas web”, debiendo cumplir con los establecido en la misma, bajo responsabilidad.',
        { continued: false },
      );

    doc.moveDown(1);

    // --- DECIMO TERCERA ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('DÉCIMO TERCERA: EXCLUSIVIDAD', marginL, doc.y, {
        align: 'left',
        underline: true,
      });

    doc.moveDown(0.5);

    // 13.1
    currentY = doc.y;
    doc.font('Arial Normal').text('13.1', marginL, currentY);
    doc.font('Arial Bold').text('EL TRABAJADOR ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc.font('Arial Normal').text('es contratado de forma exclusiva por ', {
      continued: true,
    });
    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'por lo que no podrá dedicarse a otra actividad distinta de la que emana del presente contrato, salvo autorización previa, expresa y por escrito de ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR.', { continued: false });

    doc.moveDown(1);
    if (doc.y + 80 > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
    }
    // --- DECIMO CUARTA ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('DÉCIMO CUARTA: NO COMPETENCIA', marginL, doc.y, {
        align: 'left',
        underline: true,
      });

    doc.moveDown(0.5);

    // 14.1
    currentY = doc.y;
    doc.font('Arial Normal').text('14.1', marginL, currentY);
    doc.font('Arial Bold').text('EL TRABAJADOR ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc.font('Arial Normal').text('se compromete a no competir con ', {
      continued: true,
    });
    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });
    doc
      .font('Arial Normal')
      .text('en los términos y condiciones que se acuerdan a continuación:', {
        continued: false,
      });

    doc.moveDown(0.5);

    // Lista 14.1 (a,b,c,d)
    const bulletX = textX + 15;
    const contentX = bulletX + 20;
    const contentW = doc.page.width - doc.page.margins.right - contentX;

    currentY = doc.y;
    doc.font('Arial Normal').text('a.', bulletX, currentY);
    doc
      .font('Arial Normal')
      .text(
        'A no realizar ningún tipo de inversión en empresas o instituciones de cualquier tipo cuyas actividades puedan estar en conflicto con los intereses de ',
        contentX,
        currentY,
        {
          width: contentW,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR.', { continued: false });

    currentY = doc.y;
    doc.font('Arial Normal').text('b.', bulletX, currentY);
    doc
      .font('Arial Normal')
      .text(
        'A no prestar servicios en forma dependiente o independiente para personas, instituciones o empresas que compiten, directa o indirectamente, con ',
        contentX,
        currentY,
        {
          width: contentW,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR.', { continued: false });

    currentY = doc.y;
    doc.font('Arial Normal').text('c.', bulletX, currentY);
    doc.text(
      'A no utilizar la información de carácter reservado que le fue proporcionada por ',
      contentX,
      currentY,
      {
        width: contentW,
        align: 'justify',
        continued: true,
      },
    );
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'para desarrollar por cuenta propia o de terceros, actividades que compitan con las que realiza o planeara realizar ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR.', { continued: false });

    currentY = doc.y;
    doc.font('Arial Normal').text('d.', bulletX, currentY);
    doc.text(
      'A no inducir o intentar influenciar, ni directa ni indirectamente, a ningún trabajador de ',
      contentX,
      currentY,
      {
        width: contentW,
        align: 'justify',
        continued: true,
      },
    );
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'a que termine su empleo con el mismo, para que trabaje, dependiente o independientemente, para ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'o para cualquier otra persona, entidad, institución o empresa, que compita con ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR.', { continued: false });

    doc.moveDown(0.5);

    // 14.2
    currentY = doc.y;
    doc.font('Arial Normal').text('14.2', marginL, currentY);
    doc.font('Arial Normal').text('Las obligaciones que ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'asume en virtud al literal c) de la presente cláusula, regirán indefinidamente, independientemente de la vigencia del presente contrato.',
        { continued: false },
      );

    doc.moveDown(0.5);

    // 14.3
    currentY = doc.y;
    doc.font('Arial Normal').text('14.3', marginL, currentY);
    doc
      .font('Arial Normal')
      .text('El incumplimiento por parte de ', textX, currentY, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'de cualquiera de las obligaciones contenidas en la presente cláusula, facultará a ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'a iniciar las acciones legales que pudieran corresponder en defensa de sus derechos y a obtener la indemnización por daños y perjuicios a que hubiera lugar.',
        { continued: false },
      );

    doc.moveDown(0.5);

    // 14.4
    currentY = doc.y;
    doc.font('Arial Normal').text('14.4', marginL, currentY);
    doc.font('Arial Bold').text('EL TRABAJADOR ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc
      .font('Arial Normal')
      .text(
        'declara que la remuneración acordada en la cláusula sétima comprende cualquier compensación correspondiente a los compromisos asumidos en la presente cláusula.',
        { continued: false },
      );

    doc.moveDown(1);

    // --- DECIMO QUINTA ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('DÉCIMO QUINTA: RESERVA Y CONFIDENCIALIDAD', marginL, doc.y, {
        align: 'left',
        underline: true,
      });

    doc.moveDown(0.5);

    // 15.1
    currentY = doc.y;
    doc.font('Arial Normal').text('15.1', marginL, currentY);
    doc.font('Arial Bold').text('EL TRABAJADOR ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc
      .font('Arial Normal')
      .text(
        'se compromete a mantener reserva y confidencialidad absoluta con relación a la información y documentación obtenida con ocasión de su trabajo para ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });
    doc
      .font('Arial Normal')
      .text('en los términos y condiciones que se acuerdan a continuación:', {
        continued: false,
      });

    doc.moveDown(0.5);

    // Lista 15.1 (a,b,c,d,e)
    currentY = doc.y;
    doc.font('Arial Normal').text('a.', bulletX, currentY);
    doc
      .font('Arial Normal')
      .text(
        'A observar ante cualquier persona, entidad o empresa una discreción absoluta sobre cualquier actividad o información sobre ',
        contentX,
        currentY,
        {
          width: contentW,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'y/o sus representantes, a las que hubiera tenido acceso con motivo de la prestación de sus servicios para ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR.', { continued: false });

    currentY = doc.y;
    doc.font('Arial Normal').text('b.', bulletX, currentY);
    doc
      .font('Arial Normal')
      .text(
        'A no revelar a ninguna persona, entidad o empresa, ni usar para ningún propósito, en provecho propio o de terceros, cualquier información vinculada a ',
        contentX,
        currentY,
        {
          width: contentW,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text('de cualquier naturaleza.', { continued: false });

    currentY = doc.y;
    doc.font('Arial Normal').text('c.', bulletX, currentY);
    doc
      .font('Arial Normal')
      .text(
        'A no revelar a ninguna persona que preste servicios a ',
        contentX,
        currentY,
        {
          width: contentW,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });
    doc
      .font('Arial Normal')
      .text('ningún tipo de información confidencial o de propiedad de ', {
        continued: true,
      });
    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'salvo que dicha persona necesite conocer tal información por razón de sus funciones. Si hubiese cualquier duda sobre lo que constituye información confidencial, o sobre si la información debe ser revelada y a quién, ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL TRABAJADOR, ', { continued: true });
    doc
      .font('Arial Normal')
      .text('se obliga a solicitar autorización de sus superiores.', {
        continued: false,
      });

    currentY = doc.y;
    doc.font('Arial Normal').text('d.', bulletX, currentY);
    doc
      .font('Arial Normal')
      .text(
        'A no usar de forma inapropiada ni revelar información confidencial alguna o de propiedad de la persona, entidad o empresa para la cual laboró con anterioridad a ser contratado por ',
        contentX,
        currentY,
        {
          width: contentW,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });
    doc
      .font('Arial Normal')
      .text('así como a no introducir en las instalaciones de ', {
        continued: true,
      });
    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'ningún documento que no haya sido publicado ni ninguna clase de bien que pertenezca a cualquiera de dichas personas, entidades o empresas, sin su consentimiento previo. ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'se obliga igualmente a no violar ningún convenio de confidencialidad o sobre derechos de propiedad que haya firmado en conexión con tales personas, entidades o empresas.',
        { continued: false },
      );

    currentY = doc.y;
    doc.font('Arial Normal').text('e.', bulletX, currentY);
    doc.font('Arial Normal').text('A devolver a ', contentX, currentY, {
      width: contentW,
      align: 'justify',
      continued: true,
    });
    doc.font('Arial Bold').text('EL EMPLEADOR, ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'al concluir su prestación de servicios, sea cual fuere la causa, archivos, correspondencia, registros o cualquier documento o material contenido o fijado en cualquier medio o soporte, que se le hubiese proporcionado o que hubiesen sido creados en virtud de su relación de trabajo (incluyendo copias de los mismos), así como todo bien que se le hubiese entregado, incluyendo (sin limitación) todo distintivo de identificación, tarjetas de ingreso, uniforme, herramientas de trabajo y cualquier otro material otorgado.',
        { continued: false },
      );

    doc.moveDown(0.5);

    // 15.2
    currentY = doc.y;
    doc.font('Arial Normal').text('15.2', marginL, currentY);
    doc.font('Arial Normal').text('Las obligaciones que ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'asume en los literales a), b), c) y d) de la presente cláusula, regirán indefinidamente, independientemente de la vigencia del presente contrato.',
        { continued: false },
      );

    doc.moveDown(0.5);

    // 15.3
    currentY = doc.y;
    doc.font('Arial Normal').text('15.3', marginL, currentY);
    doc
      .font('Arial Normal')
      .text('El incumplimiento por parte de ', textX, currentY, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'de cualquiera de las obligaciones contenidas en la presente cláusula, facultará a ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'a iniciar las acciones legales que pudieran corresponder en defensa de sus derechos y a obtener la indemnización por daños y perjuicios a que hubiera lugar.',
        { continued: false },
      );

    doc.moveDown(0.5);

    // 15.4
    currentY = doc.y;
    doc.font('Arial Normal').text('15.4', marginL, currentY);
    doc.font('Arial Bold').text('EL TRABAJADOR ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc
      .font('Arial Normal')
      .text(
        'declara que la remuneración acordada en la cláusula tercera comprende cualquier compensación correspondiente a los compromisos asumidos en la presente cláusula.',
        { continued: false },
      );

    doc.moveDown(1);

    // --- DECIMO SEXTA ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text(
        'DÉCIMO SEXTA: SEGURIDAD Y CONFIDENCIALIDAD EN EL TRATAMIENTO DE DATOS PERSONALES',
        marginL,
        doc.y,
        {
          align: 'left',
          underline: true,
        },
      );

    doc.moveDown(0.5);

    // 16.1
    currentY = doc.y;
    doc.font('Arial Normal').text('16.1', marginL, currentY);
    doc.font('Arial Normal').text('En caso ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'accediera a datos personales de cualquier índole como consecuencia de desarrollo de sus labores, éste deberá cumplir la normativa interna aprobada por ',
        { continued: true },
      );
    doc
      .font('Arial Bold')
      .text('INVERSIONES URBANÍSTICAS OPERADORA S.A. ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'referida a La Protección de Datos Personales, que incluye la Ley N° 29733, y su Reglamento, aprobado por el Decreto Supremo N° 003-2013-JUS.',
        { continued: false },
      );

    doc.moveDown(0.2);
    // Segundo parrafo de 16.1
    doc
      .font('Arial Normal')
      .text('En cualquier caso, corresponde a ', textX, doc.y, {
        width: textWidth,
        align: 'justify',
        continued: true,
      });
    doc
      .font('Arial Bold')
      .text('INVERSIONES URBANÍSTICAS OPERADORA S.A. ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'decidir sobre la finalidad y contenido del tratamiento de datos personales, limitándose ',
        {
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'a utilizar éstos única y exclusivamente para el cumplimiento de sus funciones y conforme a las indicaciones de ',
        { continued: true },
      );
    doc
      .font('Arial Bold')
      .text('INVERSIONES URBANÍSTICAS OPERADORA S.A.', { continued: false });
    doc.moveDown(0.5);
    // 16.2
    currentY = doc.y;
    doc.font('Arial Normal').text('16.2', marginL, currentY);
    doc.font('Arial Normal').text('De esta forma, ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc.font('Arial Normal').text('queda obligado a:', { continued: false });

    doc.moveDown(0.5);

    // Lista 16.2
    currentY = doc.y;
    doc.font('Arial Normal').text('a.', bulletX, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Tratar, custodiar y proteger los datos personales a los que pudiese acceder como consecuencia del ejercicio de sus funciones, cumpliendo con las medidas de índole jurídica, técnica y organizativas establecidas en la Ley N° 29733, y su Reglamento, así como en la normativa interna de ',
        contentX,
        currentY,
        {
          width: contentW,
          align: 'justify',
          continued: true,
        },
      );
    doc
      .font('Arial Bold')
      .text('INVERSIONES URBANÍSTICAS OPERADORA S.A.', { continued: false });

    currentY = doc.y;
    doc.font('Arial Normal').text('b.', bulletX, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Utilizar o aplicar los datos personales, exclusivamente, para la realización de sus funciones y, en su caso, de acuerdo con las instrucciones impartidas por ',
        contentX,
        currentY,
        {
          width: contentW,
          align: 'justify',
          continued: true,
        },
      );
    doc
      .font('Arial Bold')
      .text('INVERSIONES URBANÍSTICAS OPERADORA S.A.', { continued: false });

    currentY = doc.y;
    doc.font('Arial Normal').text('c.', bulletX, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Mantener el deber de secreto y confidencialidad de los datos personales de manera indefinida; es decir, durante la vigencia del presente contrato, así como una vez concluido éste.',
        contentX,
        currentY,
        {
          width: contentW,
          align: 'justify',
          continued: false,
        },
      );

    // 16.3
    currentY = doc.y;
    doc.font('Arial Normal').text('16.3', marginL, currentY);
    doc.font('Arial Normal').text('El incumplimiento de ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'respecto de sus obligaciones vinculadas al tratamiento de datos personales, constituye incumplimiento de obligaciones laborales que dará lugar a la imposición de sanciones disciplinarias, sin perjuicio de las responsabilidades penales, civiles y administrativas que su incumplimiento genere.',
        { continued: false },
      );

    doc.moveDown(1);

    // --- DECIMO SÉPTIMA ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text(
        'DÉCIMO SÉPTIMA: CUMPLIMIENTO DE LAS NORMAS DE CONDUCTA ÉTICA, RESPONSABILIDAD ADMINISTRATIVA DE LAS PERSONAS JURÍDICAS, PREVENCIÓN DE LAVADO DE ACTIVOS Y FINANCIAMIENTO DEL TERRORISMO Y NORMAS QUE SANCIONAN DELITOS DE CORRUPCIÓN COMETIDOS ENTRE PRIVADOS QUE AFECTEN EL NORMAL DESARROLLO DE LAS RELACIONES COMERCIALES Y LA COMPETENCIA LEAL ENTRE EMPRESAS',
        marginL,
        doc.y,
        {
          align: 'left',
          underline: true,
        },
      );

    doc.moveDown(0.5);

    // 17.1
    currentY = doc.y;
    doc.font('Arial Normal').text('17.1', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Lo establecido en la presente cláusula seguirá las disposiciones contenidas en la normativa de Responsabilidad Administrativa de las Personas Jurídicas, aprobada por la Ley N° 30424, con las modificaciones incorporadas por el Decreto Legislativo N° 1352, Ley N° 31740 y la Ley 30835, y de las normas sobre Prevención del Lavado de Activos y Financiamiento del Terrorismo, aprobadas por la Ley N° 27693, y su reglamento, aprobado por el Decreto Supremo N° 018-2006-JUS (en adelante, PLAFT), así como el correcto cumplimiento de la legislación peruana vigente en general.',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // 17.2
    currentY = doc.y;
    doc.font('Arial Normal').text('17.2', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'El TRABAJADOR declara que no ha incumplido las normas anticorrupción vigentes, ni ofrecido, pagado o comprometido a pagar, autorizado el pago de cualquier dinero directa o indirectamente, u ofrecido, entregado o comprometido a entregar, autorizado a entregar directa o indirectamente, cualquier objeto de valor, a cualquier funcionario gubernamental. EL TRABAJADOR se compromete a no incurrir en ninguno de los delitos mencionados ni ningún otro ilícito penal en el desarrollo de sus labores, ni siquiera cuando sea o pueda ser en beneficio del EMPLEADOR.',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // 17.3
    currentY = doc.y;
    doc.font('Arial Normal').text('17.3', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Asimismo, mediante Decreto Legislativo N° 1385 ha sido modificado el Código Penal, a fin de sancionar penalmente los actos de corrupción cometidos entre privados que afectan el normal desarrollo de las relaciones comerciales y la competencia leal entre empresas.',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // 17.4
    currentY = doc.y;
    doc.font('Arial Normal').text('17.4', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Las Partes acuerdan que, durante el periodo de vigencia del Contrato, estarán obligadas a actuar en estricto cumplimiento de la legislación vigente, quedando completamente prohibido, bajo cualquier circunstancia, realizar actos que impliquen la vulneración de la ley penal.',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // 17.5
    currentY = doc.y;
    doc.font('Arial Normal').text('17.5', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Adicionalmente, EL TRABAJADOR se compromete a no cometer delitos estipulados en la Ley N°31740, los cuales se encuentran relacionadas con las siguientes leyes:',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(0.5);

    // Lista leyes (bullets)
    const printBullet = (texto: string) => {
      const bY = doc.y;
      doc.text('•', bulletX, bY);
      doc.text(texto, contentX, bY, {
        width: contentW,
        align: 'justify',
      });
      doc.moveDown(0.2);
    };

    printBullet('DL N°1106: Lavado de Activos');
    printBullet('Ley N°25475: Terrorismo');
    printBullet('Código Penal Peruano: Fraude en las Personas Jurídicas');
    printBullet('Código Penal Peruano: Delitos Contra El Patrimonio Cultural');
    printBullet('Decreto Legislativo N°813: Ley Penal Tributaria');
    printBullet('Ley N°28008: Delitos Aduaneros');

    doc.moveDown(1);
    // --- DECIMO OCTAVA ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('DÉCIMO OCTAVA: VALIDEZ', marginL, doc.y, {
        align: 'left',
        underline: true,
      });

    doc.moveDown(0.5);

    // 18.1
    currentY = doc.y;
    doc.font('Arial Normal').text('18.1', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Las partes ratifican que el presente contrato constituye un acto jurídico válido que no se encuentra afectado por causal de invalidez o ineficacia alguna y se presentará al Ministerio de Trabajo y Promoción del Empleo dentro de los primeros quince (15) días de celebrado.',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(1);

    // --- DECIMO NOVENA ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('DÉCIMO NOVENA: DE LOS EXÁMENES MÉDICOS', marginL, doc.y, {
        align: 'left',
        underline: true,
      });

    doc.moveDown(0.5);

    // 19.1
    currentY = doc.y;
    doc.font('Arial Normal').text('19.1', marginL, currentY);
    doc.font('Arial Bold').text('EL TRABAJADOR ', textX, currentY, {
      width: textWidth,
      align: 'justify',
      continued: true,
    });
    doc
      .font('Arial Normal')
      .text(
        'se someterá obligatoriamente a los exámenes médicos que dispongan ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL EMPLEADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'y/o la ley, con la finalidad de verificar si éste se encuentra apto para desarrollar los servicios y funciones propios de su cargo. En este sentido, ambas Partes declaran que la conservación de la salud de EL TRABAJADOR es motivo determinante de la relación contractual.',
        { continued: false },
      );

    doc.moveDown(1);

    // --- VIGESIMA ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text(
        'VIGÉSIMA: DE LAS RECOMENDACIONES EN MATERIA DE SEGURIDAD Y SALUD EN EL TRABAJO',
        marginL,
        doc.y,
        {
          align: 'left',
          underline: true,
        },
      );

    doc.moveDown(0.5);

    // 20.1
    currentY = doc.y;
    doc.font('Arial Normal').text('20.1', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'De conformidad con lo establecido en el artículo 35° de la Ley N° 29783 – Ley de Seguridad y Salud en el Trabajo y, en calidad de anexo al presente contrato ',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('(ANEXO – 1), ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'se incorpora la descripción de las recomendaciones de seguridad y salud en el trabajo, las mismas que ',
        { continued: true },
      );
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'deberá seguir y tomar en consideración de forma rigurosa durante la prestación de sus servicios.',
        { continued: false },
      );

    doc.moveDown(1);

    // --- VIGESIMA PRIMERA ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('VIGÉSIMA PRIMERA: DOMICILIO', marginL, doc.y, {
        align: 'left',
        underline: true,
      });

    doc.moveDown(0.5);

    // 21.1
    currentY = doc.y;
    doc.font('Arial Normal').text('21.1', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Para todos los efectos legales del presente Contrato, las partes fijan como sus domicilios, los señalados en la introducción de este contrato.',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    // 21.2
    currentY = doc.y;
    doc.font('Arial Normal').text('21.2', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Cualquier cambio de domicilio deberá ser comunicado por escrito a la otra parte, mediante comunicación escrita, de lo contrario se entenderá que todas las notificaciones se han realizado válidamente.',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(1);

    // --- VIGESIMA SEGUNDA ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('VIGÉSIMA SEGUNDA: SOLUCIÓN DE DISPUTAS', marginL, doc.y, {
        align: 'left',
        underline: true,
      });

    doc.moveDown(0.5);

    // 22.1
    currentY = doc.y;
    doc.font('Arial Normal').text('22.1', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'En el improbable caso de que lleguen a existir discrepancias, controversias o reclamaciones derivadas de la validez, alcance, interpretación o aplicación del presente contrato, las partes se comprometen a poner el mejor de sus con el fin de lograr una solución armoniosa a sus diferencias.',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    // 22.2
    currentY = doc.y;
    doc.font('Arial Normal').text('22.2', marginL, currentY);
    doc
      .font('Arial Normal')
      .text(
        'Si lo señalado en el párrafo anterior resulta infructuoso para resolver el conflicto surgido, las partes convienen renunciar al fuero judicial de sus domicilios o centros de trabajo, y se someten a la jurisdicción de los jueces del Distrito Judicial de Lima - Cercado.',
        textX,
        currentY,
        {
          width: textWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(1);

    // --- VIGESIMA TERCERA ---
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('VIGÉSIMA TERCERA: APLICACIÓN SUPLETORIA', marginL, doc.y, {
        align: 'left',
        underline: true,
      });

    doc.moveDown(0.5);

    doc
      .font('Arial Normal')
      .text(
        'En todo lo no previsto por el presente contrato, el vínculo laboral se regirá por las disposiciones laborales vigentes que regulan a los contratos de trabajo sujetos a modalidad, contenidas actualmente en el Texto único Ordenado del Decreto Legislativo Nº 728 (Decreto Supremo Nº 003-97-TR, Ley de Productividad y Competitividad Laboral) y su Reglamento y por las disposiciones complementarias o modificatorias que pudieran darse en el futuro.',
        marginL,
        doc.y,
        {
          width: fullWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(1);

    // CIERRE
    doc
      .font('Arial Normal')
      .text(
        `En señal de conformidad, las partes suscriben dos (02) ejemplares del presente contrato en la ciudad de ${data.province}, el día ${data.entryDate}, quedando un ejemplar en poder del empleador y otro en poder del trabajador, quien declara haber recibido una copia del contrato y estar de acuerdo con su contenido.`,
        marginL,
        doc.y,
        {
          width: fullWidth,
          align: 'justify',
          continued: false,
        },
      );

    doc.moveDown(4);

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
    const cmToPt = (cm: number) => cm * 28.3465;
    const doc = new PDFDocument({
      size: 'A4',
      margins: {
        top: cmToPt(2.12),
        bottom: cmToPt(2.4),
        left: cmToPt(2.7),
        right: cmToPt(2.8),
      },
    });

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

    // --- VARIABLES DE ALINEACIÓN ---
    const marginL = doc.page.margins.left;
    const marginR = doc.page.margins.right;
    const fullWidth = doc.page.width - marginL - marginR;

    // TÍTULO
    doc
      .font('Arial Bold')
      .fontSize(8)
      .text('TRATAMIENTO DE DATOS PERSONALES', {
        align: 'center',
        underline: true,
      })
      .moveDown(2);

    // CUERPO DEL DOCUMENTO
    doc.fontSize(7); // Mantenemos el tamaño 7 solicitado

    // Párrafo 1: Introducción
    doc.font('Arial Normal').text('El Sr. ', marginL, doc.y, {
      width: fullWidth,
      align: 'justify',
      continued: true,
    });
    doc.font('Arial Bold').text(`${fullName} `, { continued: true });
    doc
      .font('Arial Normal')
      .text('identificado con DNI N° ', { continued: true });
    doc.font('Arial Normal').text(`${data.dni} `, { continued: true });
    doc.font('Arial Normal').text('(en adelante ', { continued: true });
    doc.font('Arial Bold').text('”EL TRABAJADOR”) ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'declara conocer que sus datos personales entregados o que se entreguen a ',
        { continued: true },
      );
    doc.font('Arial Bold').text('INVERSIONES URBANÍSTICAS OPERADORA S.A. ', {
      continued: true,
    });
    doc
      .font('Arial Normal')
      .text(
        'como consecuencia de la ejecución del contrato de trabajo, se encuentran incorporados en el banco de datos denominado ',
        { continued: true },
      );
    doc.font('Arial Bold').text('“RECURSOS HUMANOS” ', { continued: true });
    doc.font('Arial Normal').text('de titularidad de ', { continued: true });
    doc.font('Arial Bold').text('INVERSIONES URBANÍSTICAS OPERADORA S.A ', {
      continued: true,
    });
    doc.font('Arial Normal').text('(en adelante ', { continued: true });
    doc
      .font('Arial Bold')
      .text('“INVERSIONES URBANÍSTICAS OPERADORA”).', { continued: false });

    doc.moveDown(1);

    // Párrafo 2: El tratamiento...
    doc
      .font('Arial Normal')
      .text('El tratamiento que realizará ', marginL, doc.y, {
        width: fullWidth,
        align: 'justify',
        continued: true,
      });
    doc
      .font('Arial Bold')
      .text('INVERSIONES URBANÍSTICAS OPERADORA ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'consiste en conservar, registrar, organizar, almacenar, consultar, extraer y utilizar los datos personales con la finalidad de gestionar los recursos humanos de la empresa, como es el caso de la elaboración de las planillas, gestión de la seguridad y salud en el trabajo, cumplimiento de las exigencias y requerimientos del Ministerio de Trabajo y Promoción del Empleo, así como de la Superintendencia Nacional de Aduanas y Administración Tributaria y, todo lo que implica la gestión y seguimiento de la relación laboral, lo cual incluye las capacitaciones, evaluaciones periódicas del personal, entrega de beneficios, y envío de información a las empresas del grupo empresarial, para efectos de control y cumplimiento de las políticas institucionales, entre otros, vinculados exclusivamente a la ejecución de la relación contractual.',
        { continued: false },
      );

    doc.moveDown(1);

    // Párrafo 3: Cabe indicar...
    doc
      .font('Arial Normal')
      .text(
        'Cabe indicar que en la medida que la prestación de servicios a cargo de ',
        marginL,
        doc.y,
        {
          width: fullWidth,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text('importe su destaque en las instalaciones de los clientes de ', {
        continued: true,
      });
    doc
      .font('Arial Bold')
      .text('INVERSIONES URBANÍSTICAS OPERADORA, ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'para la prestación del servicio de administración y operación de playa de estacionamiento y valet parking por parte de este último, ',
        { continued: true },
      );
    doc
      .font('Arial Bold')
      .text('INVERSIONES URBANÍSTICAS OPERADORA, ', { continued: true });
    doc
      .font('Arial Normal')
      .text('se encuentra facultado a remitir información de ', {
        continued: true,
      });
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'a su cliente, relativa al cumplimiento de las obligaciones laborales a su cargo, de conformidad con la normatividad de la materia.',
        { continued: false },
      );

    doc.moveDown(1);

    // Párrafo 4: Para efectos de cumplir...
    doc
      .font('Arial Normal')
      .text(
        'Para efectos de cumplir con la finalidad señalada en el párrafo anterior, ',
        marginL,
        doc.y,
        {
          width: fullWidth,
          align: 'justify',
          continued: true,
        },
      );
    doc
      .font('Arial Bold')
      .text('INVERSIONES URBANÍSTICAS OPERADORA ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'cuenta con el apoyo de otras empresas, terceros proveedores de servicios, que actúan en calidad de encargados de tratamiento; los cuales, tienen acceso a los datos personales de los trabajadores; sin perjuicio de las medidas de seguridad establecidas para el efecto.',
        { continued: false },
      );

    doc.moveDown(1);

    // Párrafo 5: Los datos personales...
    doc.font('Arial Normal').text('Los datos personales del ', marginL, doc.y, {
      width: fullWidth,
      align: 'justify',
      continued: true,
    });
    doc.font('Arial Bold').text('TRABAJADOR ', { continued: true });
    doc.font('Arial Normal').text('recolectados por ', { continued: true });
    doc
      .font('Arial Bold')
      .text('INVERSIONES URBANÍSTICAS OPERADORA ', { continued: true });
    doc
      .font('Arial Normal')
      .text('son necesarios para la ejecución de la relación laboral.', {
        continued: false,
      });

    doc.moveDown(1);

    // Párrafo 6: Con posterioridad...
    doc
      .font('Arial Normal')
      .text(
        'Con posterioridad a la conclusión del contrato, los datos personales de ',
        marginL,
        doc.y,
        {
          width: fullWidth,
          align: 'justify',
          continued: true,
        },
      );
    doc.font('Arial Bold').text('EL TRABAJADOR ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'serán conservados únicamente a fin de ser puestos a disposición de las administraciones públicas, el Poder Judicial y demás autoridades, en ejercicios de sus funciones, de acuerdo a los plazos establecidos por ley para el efecto.',
        { continued: false },
      );

    doc.moveDown(1);

    // Párrafo 7: Además, mediante la presente...
    doc
      .font('Arial Normal')
      .text('Además, mediante la presente se informa al ', marginL, doc.y, {
        width: fullWidth,
        align: 'justify',
        continued: true,
      });
    doc.font('Arial Bold').text('TRABAJADOR, ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'que con fines de control laboral, acorde a lo dispuesto por el artículo 9º del Texto Único Ordenado del Decreto Legislativo N° 728, Ley de Productividad y Competitividad Laboral, aprobado por Decreto Supremo No. 003-97-TR, el desempeño de sus funciones podrá ser video vigilado, actividad que se realizará atendiendo a criterios de razonabilidad y proporcionalidad, y sin afectar los derechos del ',
        { continued: true },
      );
    doc.font('Arial Bold').text('TRABAJADOR.', { continued: false });

    doc.moveDown(1);

    // Párrafo 8: El ejercicio...
    doc
      .font('Arial Normal')
      .text('El ejercicio por parte del ', marginL, doc.y, {
        width: fullWidth,
        align: 'justify',
        continued: true,
      });
    doc.font('Arial Bold').text('TRABAJADOR, ', { continued: true });
    doc
      .font('Arial Normal')
      .text(
        'de sus derechos de acceso, rectificación, cancelación y oposición, se podrá llevar a cabo en los términos dispuestos en la Ley N° 29733 - Ley de Protección de Datos Personales y su Reglamento, aprobado por el Decreto Supremo N° 003-2013-JUS, presentando una solicitud escrita ante la Oficina de Capital Humano de ',
        { continued: true },
      );
    doc.font('Arial Bold').text('INVERSIONES URBANÍSTICAS OPERADORA, ', {
      continued: true,
    });
    doc
      .font('Arial Normal')
      .text(
        'ubicada en Calle Dean Valdivia N°148 Int.1401 Urb. Jardín (Edificio Platinium), Distrito de San Isidro. Asimismo, “INVERSIONES URBANÍSTICAS OPERADORA” le informa que podrá establecer otros canales para tramitar estas solicitudes, lo que será informado oportunamente en la página web.”',
        { continued: false },
      );

    doc.moveDown(5);

    // ==========================================
    // FIRMAS (Bloque Dinámico)
    // ==========================================
    const imageWidth = 85;
    const imageHeight = 50;
    const signatureGap = 10;

    const estimatedBlockHeight = imageHeight + 80;
    const pageHeight = doc.page.height;
    const safeMarginBottom = doc.page.margins.bottom + 20;

    // Control de salto de página
    if (doc.y + estimatedBlockHeight > pageHeight - safeMarginBottom) {
      doc.addPage();
    } else {
      doc.y += imageHeight + signatureGap;
    }

    const lineY = doc.y;
    const imageY = lineY - imageHeight - 5;

    // Cálculo de columnas
    const availableWidth = doc.page.width - marginL - marginR;
    const colWidth = availableWidth / 3;
    const contentWidth = colWidth - 10; // Ancho del contenido de la firma

    const col1X = marginL;
    const col2X = marginL + colWidth;
    const col3X = marginL + colWidth * 2;

    const paddingX = (colWidth - contentWidth) / 2;
    const line1X = col1X + paddingX;
    const line2X = col2X + paddingX;
    const line3X = col3X + paddingX;

    const img1X = line1X + (contentWidth - imageWidth) / 2;
    const img2X = line2X + (contentWidth - imageWidth) / 2;

    // --- Columna 1: Empleador 1 ---
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

    doc
      .moveTo(line1X, lineY)
      .lineTo(line1X + contentWidth, lineY)
      .stroke();
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('EL EMPLEADOR', line1X, lineY + 5, {
        width: contentWidth,
        align: 'center',
      });

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

    // --- Columna 2: Empleador 2 ---
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
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('EL EMPLEADOR', line2X, lineY + 5, {
        width: contentWidth,
        align: 'center',
      });

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

    if (doc.y > maxY) maxY = doc.y;

    // --- Columna 3: Trabajador ---
    doc
      .moveTo(line3X, lineY)
      .lineTo(line3X + contentWidth, lineY)
      .stroke();
    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('EL TRABAJADOR', line3X, lineY + 5, {
        width: contentWidth,
        align: 'center',
      });
    doc.font('Arial Normal');
    doc.text(
      `NOMBRE: ${data.name} ${data.lastNameFather} ${data.lastNameMother}`,
      line3X,
      doc.y,
      { width: contentWidth, align: 'left' },
    );
    doc.text(`DNI: ${data.dni}`, line3X, doc.y, {
      width: contentWidth,
      align: 'left',
    });
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

    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('ANEXO 1', { align: 'center' })
      .font('Arial Bold')
      .text('RECOMENDACIONES EN MATERIA DE SEGURIDAD Y SALUD EN EL TRABAJO', {
        align: 'center',
      })
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
        { continued: true, align: 'justify' },
      )
      .font('Arial Bold')
      .text('EL EMPLEADOR ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text(
        'cumple con describir las recomendaciones de seguridad y salud en el trabajo que deberá tener presente y cumplir ',
        { continued: true, align: 'justify' },
      )
      .font('Arial Bold')
      .text('EL TRABAJADOR, ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('en la ejecución de sus funciones para ', {
        continued: true,
        align: 'justify',
      })
      .font('Arial Normal')
      .text('EL EMPLEADOR ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text('en el puesto de ', { continued: true, align: 'justify' })
      .font('Arial Bold')
      .text(`${data.position}`);

    doc
      .fontSize(8)
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text(
        'deberá tener presente los siguientes riesgos propios del centro de trabajo donde prestará sus servicios, así como las medidas de protección y prevención en relación con tales riesgos:',
      )
      .moveDown(2);

    doc
      .table({
        defaultStyle: { border: 1 },
        columnStyles: [150, 330],
        rowStyles: [30],
        data: [
          [
            {
              backgroundColor: '#93c5fd',
              text: 'Riesgos asociados ',
              align: 'center',
            },
            {
              backgroundColor: '#93c5fd',
              text: 'Medidas de protección y prevención',
              align: 'center',
            },
          ],
          [
            {
              text: 'Caídas al mismo nivel',
              align: { x: 'left', y: 'center' },
            },
            {
              text: ' - Mantener el orden y limpieza en las zonas de trabajo.\n - Mantener las zonas de tránsito libre de obstáculos (cajas, papeleras, cables, etc.).\n - Extremar las precauciones con el suelo mojado y especialmente resbaladizo \n - Respetar las señales de advertencia.',
              align: { x: 'left', y: 'center' },
            },
          ],
          [
            {
              text: 'Caídas a distinto nivel',
              align: { x: 'left', y: 'center' },
            },
            {
              text: ' - Utilizar los pasamanos al bajar o subir las escaleras.\n - Respetar las señales de advertencia.',
              align: { x: 'left', y: 'center' },
            },
          ],
          [
            {
              text: 'Riesgo eléctrico',
              align: { x: 'left', y: 'center' },
            },
            {
              text: ' - No sobrecargar los enchufes.\n - Respetar las señales de advertencia.\n - No manipular los cuadros eléctricos, excepto personal debidamente autorizado y \n   capacitado para ello.',
              align: { x: 'left', y: 'center' },
            },
          ],
          [
            {
              text: 'Quemaduras, incendios, explosiones',
              align: { x: 'left', y: 'center' },
            },
            {
              text: ' - Revisar periódicamente la instalación de combustible y el correcto funcionamiento de \n   los medios de protección contra incendios.\n - Conocer y respetar las vías de evacuación y salidas de emergencia existentes en el\n   área de trabajo.',
              align: { x: 'left', y: 'center' },
            },
          ],
        ],
      })
      .moveDown(1);

    doc
      .fontSize(8)
      .font('Arial Normal')
      .text(
        '1. Asimismo, EL TRABAJADOR deberá tener presente los siguientes riesgos propios del puesto de trabajo de [*] que desempeñará en EL EMPLEADOR, así como las medidas de protección y prevención relacionadas con tales riesgos:',
      )
      .moveDown(1);
    doc
      .table({
        defaultStyle: { border: 1 },
        columnStyles: [150, 330],
        rowStyles: [30],
        data: [
          [
            {
              backgroundColor: '#93c5fd',
              text: 'Riesgos asociados ',
              align: 'center',
            },
            {
              backgroundColor: '#93c5fd',
              text: 'Medidas de protección y prevención',
              align: 'center',
            },
          ],
          [
            {
              text: 'Lesiones por la espalda por sobreesfuerzos',
              align: { x: 'left', y: 'center' },
            },
            {
              text: ' - Utilizar, si es posible, medios mecánicos para transportar objetos, sobre todo si las \n   cargas son pesadas, voluminosas o si la frecuencia con que estas se manipulan son \n   elevadas.\n - Solicitar ayuda a otra persona.',
              align: { x: 'left', y: 'center' },
            },
          ],
          [
            {
              text: 'Lesiones por movimientos forzados',
              align: { x: 'left', y: 'center' },
            },
            {
              text: ' - Utilizar sillas ergonómicas y ajustar la altura de la pantalla del computador a la altura \n   de los ojos.',
              align: { x: 'left', y: 'center' },
            },
          ],
          [
            {
              text: 'Lesiones en dedos o muñecas por la incorrecta colocación de la mano combinada con la frecuencia de pulsación',
              align: { x: 'left', y: 'center' },
            },
            {
              text: ' - Evitar hacer presión sobre las muñecas.\n - Utilizar almohadilla de apoyo para mejorar la posición de las muñecas al utilizar el \n   teclado y mouse.\n - El antebrazo, la muñeca y la mano deben formar una línea recta.',
              align: { x: 'left', y: 'center' },
            },
          ],
          [
            {
              text: 'Molestias / lesiones lumbares por posturas inadecuadas',
              align: { x: 'left', y: 'center' },
            },
            {
              text: ' - Cambios de posturas de forma periódica.\n - Pausas activas. \n - Verificar altura de mesa de trabajo. \n - Sentarse correctamente sobre sillas ergonómicas.\n - Ajustar la altura de la silla; al apoyar las manos en el teclado, el brazo y antebrazo \n   debe formar un ángulo de 90°.',
              align: { x: 'left', y: 'center' },
            },
          ],
          [
            {
              text: 'Daños al sistema músculo esquelético por posturas estáticas prolongadas',
              align: { x: 'left', y: 'center' },
            },
            {
              text: ' - Utilizar el asiento colocado de tal forma que los movimientos se realicen sin forzar la\n   postura.\n - Adecuar el escritorio, silla y computador para evitar posturas forzadas.',
              align: { x: 'left', y: 'center' },
            },
          ],
          [
            {
              text: 'Caídas de objetos en manipulación',
              align: { x: 'left', y: 'center' },
            },
            {
              text: ' - Utilizar escalerillas o plataformas para alcanzar objetos situados a una altura por \n   encima de los hombros para evitar golpes por caída de los mismos durante la \n   manipulación.',
              align: { x: 'left', y: 'center' },
            },
          ],
          [
            {
              text: 'Caídas al mismo nivel',
              align: { x: 'left', y: 'center' },
            },
            {
              text: ' - Mantener el orden y limpieza en las zonas de trabajo.\n - Mantener las zonas de tránsito libre de obstáculos (cajas, papeleras, cables, etc.).\n - Extremar las precauciones con el suelo mojado y especialmente resbaladizo.\n - Respetar las señales de advertencia.',
              align: { x: 'left', y: 'center' },
            },
          ],
          [
            {
              text: 'Caídas a distinto nivel',
              align: { x: 'left', y: 'center' },
            },
            {
              text: ' - Utilizar los pasamanos al bajar o subir las escaleras.\n - Respetar las señales de advertencia.',
              align: { x: 'left', y: 'center' },
            },
          ],
          [
            {
              text: 'Golpes contra objetos y por objetos',
              align: { x: 'left', y: 'center' },
            },
            {
              text: ' - Realizar orden y limpieza en el puesto de trabajo. \n - Mantener los objetos, piezas, elementos en su lugar.\n - Comprobar que el recorrido esté libre de obstáculos.',
              align: { x: 'left', y: 'center' },
            },
          ],
          [
            {
              text: 'Golpes contra muebles u objetos inmóviles (cajones abiertos u otros)',
              align: { x: 'left', y: 'center' },
            },
            {
              text: ' - Mantener cajones y puertas cerradas, de esta manera se evitarán posibles golpes o \n   caídas. \n - No colocar mobiliario o almacenar material de oficina en zonas de paso habitual.',
              align: { x: 'left', y: 'center' },
            },
          ],
          [
            {
              text: 'Golpes por uso inadecuado de herramientas',
              align: { x: 'left', y: 'center' },
            },
            {
              text: ' - Utilizar la herramienta de diseño adecuado para el trabajo a realizar.',
              align: { x: 'left', y: 'center' },
            },
          ],
          [
            {
              text: 'Cortes en la mano por contacto con elementos y herramientas cortantes',
              align: { x: 'left', y: 'center' },
            },
            {
              text: ' - Utilizar equipos de protección personal (EPP). \n - Los mangos de las herramientas deben conservarse en perfectas condiciones.',
              align: { x: 'left', y: 'center' },
            },
          ],
          [
            {
              text: 'Micro traumatismos en procesos de corte repetitivos',
              align: { x: 'left', y: 'center' },
            },
            {
              text: ' - Hacer uso de las herramientas de forma adecuada y haciendo uso del manual del\n   fabricante.',
              align: { x: 'left', y: 'center' },
            },
          ],
          [
            {
              text: 'Sobreesfuerzo por manipulación de objetos pesados',
              align: { x: 'left', y: 'center' },
            },
            {
              text: ' En las operaciones de manipulación manual de cargas se deben adoptar las posturas y\n  movimientos adecuados:\n - Aproximarse a la carga lo máximo posible. \n - Asegurar un buen apoyo de los pies, manteniéndolos ligeramente separados. En caso \n   el objeto esté sobre una base elevada,aproximarlo al tronco, consiguiendo una base y \n   agarre firme y estable.\n - Agacharse flexionando las rodillas, manteniendo la espalda recta.\n - Levantar la carga utilizando los músculos de las piernas y no con la espalda.\n - Tomar firmemente la carga con las dos manos.\n - Mantener la carga próxima al cuerpo durante todo el trayecto y andar dando pasos\n   cortos.\n - En elevaciones con giro, procurar mover los pies en vez de girar la cintura. \n - Evitar los movimientos bruscos en la espalda, en especial los giros, incluso cuando se\n   maneja carga ligera.',
              align: { x: 'left', y: 'center' },
            },
          ],
          [
            {
              text: 'Sobreesfuerzos por manipulación manual de cargas y movimientos repetitivos',
              align: { x: 'left', y: 'center' },
            },
            {
              text: ' - Evitar los movimientos repetitivos frecuentes.\n - Alternar dichos movimientos con los de otras operaciones que, aunque también \n   supongan movimientos repetitivos, sean producidos por otros grupos\n   musculares (cambiar de mano y de postura de forma periódica)',
              align: { x: 'left', y: 'center' },
            },
          ],
          [
            {
              text: 'Contacto eléctrico con uniones defectuosas sin aislaciones',
              align: { x: 'left', y: 'center' },
            },
            {
              text: ' - No disponer cables en zonas de paso.',
              align: { x: 'left', y: 'center' },
            },
          ],
          [
            {
              text: 'Contactos eléctricos indirectos, con partes o elementos metálicos accidentalmente puestos bajo tensión',
              align: { x: 'left', y: 'center' },
            },
            {
              text: ' - Revisar los equipos eléctricos antes de utilizarlos.\n - No utilizar / manipular herramientas eléctricas que se encuentran húmedas o mojadas, \n   ni equipos en mal estado.',
              align: { x: 'left', y: 'center' },
            },
          ],
          [
            {
              text: 'Contactos eléctricos por usar extensiones subestándar en los enchufes',
              align: { x: 'left', y: 'center' },
            },
            {
              text: ' - Utilizar enchufes correctamente. \n - No sobrecargar los enchufes. \n - No tirar de los cables. \n - Apagar los equipos (computadoras, impresoras, fotocopiadoras, etc.) cuando finalice la \n   jornada.',
              align: { x: 'left', y: 'center' },
            },
          ],
          [
            {
              text: 'Quemaduras por cortocircuitos',
              align: { x: 'left', y: 'center' },
            },
            {
              text: ' - No utilizar herramientas eléctricas con las manos o los pies húmedos.',
              align: { x: 'left', y: 'center' },
            },
          ],
          [
            {
              text: 'Quemaduras por trabajar con hornos y manejar objetos calientes',
              align: { x: 'left', y: 'center' },
            },
            {
              text: ' - Utilizar los equipos de protección personal (EPP).',
              align: { x: 'left', y: 'center' },
            },
          ],
          [
            {
              text: 'Sobrecarga mental por estrés por atención al público',
              align: { x: 'left', y: 'center' },
            },
            {
              text: ' - Mantener disponible la información más frecuente y necesaria solicitada por los\n   usuarios. \n - Liberar el escritorio de documentación. \n - Crear un grado de autonomía adecuado en el ritmo y organización básica del trabajo. \n - Hacer pausas para los cambios de postura y reducción de fatiga física y mental.',
              align: { x: 'left', y: 'center' },
            },
          ],
          [
            {
              text: 'Fatiga visual: aumento del parpadeo, lagrimeo, pesadez en parpados u ojos',
              align: { x: 'left', y: 'center' },
            },
            {
              text: ' - Verificar que l apantalle esté entre 10° y 60° por debajo de la horizontal de los ojos del\n   operador.\n - Establecer pausas de 10 minutos cada 90 o 60 minutos de trabajo.\n - Alternar la visualización de la pantalla con impresos para descansar la vista.\n - Utilizar la iluminación adecuada en el lugar de trabajo.\n - Eliminar los reflejos originados por las ventanas, colocando cortinas.\n - Realizar hábitos saludables: descanso adecuado y alimentación saludable.',
              align: { x: 'left', y: 'center' },
            },
          ],
          [
            {
              text: 'Fatiga física: dolor habitual en región cervical, dorsal o lumbar, tensión en hombros, cuello o espalda, molestias en las piernas (adormecimiento)',
              align: { x: 'left', y: 'center' },
            },
            {
              text: ' - Utilizar un espacio de trabajo con dimensiones adecuadas.\n - Utilizar sillas con base estable y regulación en altura. El respaldo lumbar debe ser\n   ajustable en inclinación.',
              align: { x: 'left', y: 'center' },
            },
          ],
          [
            {
              text: 'Fatiga auditiva',
              align: { x: 'left', y: 'center' },
            },
            {
              text: ' - Aislar impresoras, ventiladores y fotocopiadoras de la zona de trabajo de las personas\n   que realizan trabajo intelectual.',
              align: { x: 'left', y: 'center' },
            },
          ],
          [
            {
              text: 'Estrés por sobrecarga de trabajo y falta de control de las actividades',
              align: { x: 'left', y: 'center' },
            },
            {
              text: ' - Delegar las responsabilidades al personal.\n - Mantener la calma en situaciones conflictivas. \n - Trabajar coordinadamente. \n - Reorganizar el tiempo de trabajo por cada actividad.',
              align: { x: 'left', y: 'center' },
            },
          ],
        ],
      })
      .moveDown(1);
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('Adicionalmente, ', { continued: true })
      .font('Arial Normal')
      .text('EL TRABAJADOR  ', { continued: true })
      .font('Arial Normal')
      .text(
        'se obliga a cumplir rigurosamente las disposiciones que a continuación se indican a título enunciativo, más no limitativo:',
      )
      .moveDown(1);

    doc
      .fontSize(8)
      .font('Arial Normal')
      .text('         ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text(
        '-   Leer y practicar estrictamente las obligaciones contenidas en el Reglamento Interno de Seguridad y Salud en el Trabajo (“RISST”).',
      )
      .moveDown(1)
      .font('Arial Normal')
      .text('         ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text(
        '-   Respetar y aplicar las medidas de prevención de riesgos señaladas en el mapa de riesgos.',
      )
      .moveDown(1)
      .font('Arial Normal')
      .text('         ', { continued: true, align: 'justify' })
      .font('Arial Bold')
      .text('-   EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text(
        'se obliga a aplicar las instrucciones impartidas en las capacitaciones dictadas por ',
        { continued: true },
      )
      .font('Arial Bold')
      .text('EL EMPLEADOR ', { continued: true })
      .font('Arial Normal')
      .text('en materia')
      .font('Arial Normal')
      .text('             ', { continued: true })
      .font('Arial Normal')
      .text(
        'de Seguridad y Salud en el Trabajo. La inobservancia de dichas disposiciones podrá ser sancionada por ',
        { continued: true },
      )
      .font('Arial Bold')
      .text('EL EMPLEADOR.')
      .moveDown(1)
      .font('Arial Normal')
      .text('         ', { continued: true, align: 'justify' })
      .font('Arial Bold')
      .text('-   EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text(
        'tiene la obligación de comunicar al área SSOMA todo evento o situación que ponga o pueda poner en riesgo ',
      )
      .font('Arial Normal')
      .text('             ', { continued: true })
      .font('Arial Normal')
      .text(
        'su seguridad y salud, o la de sus compañeros, siempre que éstas se produzcan dentro de las instalaciones de',
      )
      .moveDown(1)
      .font('Arial Normal')
      .text('         ', { continued: true, align: 'justify' })
      .font('Arial Bold')
      .text('-   EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text(
        'se compromete a someterse a los exámenes médicos a los que, en función al cargo y funciones',
      )
      .font('Arial Normal')
      .text('             ', { continued: true })
      .font('Arial Normal')
      .text('desempeñadas, se encuentren obligados.')
      .moveDown(1)
      .font('Arial Normal')
      .text('         ', { continued: true, align: 'justify' })
      .font('Arial Bold')
      .text('-   EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text(
        'se compromete a respetar y aplicar los estándares de seguridad y salud establecidos para el puesto que',
      )
      .font('Arial Normal')
      .text('             ', { continued: true })
      .font('Arial Normal')
      .text('desarrolla.')
      .moveDown(1)
      .font('Arial Normal')
      .text('         ', { continued: true, align: 'justify' })
      .font('Arial Normal')
      .text(
        '-   Constituye falta grave sancionable, el uso indebido o no uso por parte de ',
        { continued: true },
      )
      .font('Arial Bold')
      .text('EL TRABAJADOR ', { continued: true })
      .font('Arial Normal')
      .text('de los instrumentos y materiales de')
      .font('Arial Normal')
      .text('             ', { continued: true })
      .font('Arial Normal')
      .text(
        'trabajo, así como de los equipos de protección personal y colectiva que proporcione ',
        { continued: true },
      )
      .font('Arial Bold')
      .text('EL EMPLEADOR ', { continued: true })
      .font('Arial Normal')
      .text('o el')
      .font('Arial Normal')
      .text('             ', { continued: true })
      .font('Arial Normal')
      .text(
        'o el incumplimiento de cualquier otra medida de prevención o protección.',
      )
      .moveDown(1);
    doc
      .fontSize(8)
      .font('Arial Normal')
      .text(
        'Las presentes medidas son de obligatorio cumplimiento en tanto que no se desarrollen otras que puedan modificarlas.',
      )
      .moveDown(1)
      .font('Arial Normal')
      .text(
        'En señal de conformidad, las partes suscriben dos (02) ejemplares del presente contrato en la ciudad de ',
        { continued: true },
      )
      .font('Arial Bold')
      .text(`${data.department}, `, { continued: true })
      .font('Arial Normal')
      .text('el día ', { continued: true })
      .font('Arial Bold')
      .text(`${data.entryDate}`)
      .font('Arial Normal')
      .text(
        'quedando un ejemplar en poder del empleador y otro en poder del trabajador, quien declara haber recibido una copia del contrato y estar de acuerdo con su contenido.',
      )
      .moveDown(4);
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
