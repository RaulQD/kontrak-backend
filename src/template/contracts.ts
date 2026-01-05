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
import Handlebars from 'handlebars';
import {
  ANEXO,
  CONTRACT_FULL_TIME,
  CONTRACT_PART_TIME,
  CONTRACT_SUBSIDIO,
} from './templates';
import { Browser } from 'puppeteer';

const arialNormal = fs.readFileSync(
  path.join(__dirname, '../../src/assets/fonts/ARIAL.TTF'),
);
const arialBold = fs.readFileSync(
  path.join(__dirname, '../../src/assets/fonts/ARIALBD.TTF'),
);

export const generatePartTimeContract = async (
  data: EmployeeData,
  browser: Browser,
): Promise<Buffer> => {
  const template = Handlebars.compile(CONTRACT_PART_TIME);
  const finalHtml = template({
    // Datos del empleado
    fullName:
      `${data.name || ''} ${data.lastNameFather || ''} ${data.lastNameMother || ''}`.trim(),
    dni: data.dni,
    address: data.address,
    district: data.district,
    province: data.province,
    department: data.department,
    position: data.position,
    salary: Number(data.salary).toFixed(2),
    salaryInWords: data.salaryInWords,
    email: data.email,
    entryDate: data.entryDate,
    subDivision: data.subDivisionOrParking,

    // Datos fijos de los firmantes (definidos arriba)
    signer1Name: FULL_NAME_PRIMARY_EMPLOYEE,
    signer1DNI: DNI_EMPLOYEE_PRIMARY,
    signer2Name: FULL_NAME_SECOND_EMPLOYEE,
    signer2DNI: DNI_EMPLOYEE_SECOND,
    signature1: SIGNATURE_EMPLOYEE, // Debe ser URL o base64
    signature2: SIGNATURE_EMPLOYEE_TWO,
  });

  const page = await browser.newPage();
  await page.setContent(finalHtml, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    format: 'Letter',
    printBackground: true,
    preferCSSPageSize: true,
    margin: {
      top: '2.05cm',
      bottom: '0.49cm',
      left: '1.73cm',
      right: '1.55cm',
    },
  });

  await page.close();

  return Buffer.from(pdfBuffer);
};

export const generatePlanillaContract = async (
  data: EmployeeData,
  browser: Browser,
): Promise<Buffer> => {
  const salaryFormatted = Number(data.salary).toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const template = Handlebars.compile(CONTRACT_FULL_TIME);
  const finalHtml = template({
    // Datos Dinámicos
    fullName:
      `${data.name || ''} ${data.lastNameFather || ''} ${data.lastNameMother || ''}`.trim(),
    dni: data.dni,
    address: data.address,
    district: data.district,
    province: data.province,
    department: data.department,
    email: data.email,
    position: data.position,
    entryDate: data.entryDate,
    endDate: data.endDate,
    salary: salaryFormatted, // Variable formateada
    salaryInWords: data.salaryInWords,
    probationaryPeriod: data.probationaryPeriod,
    subDivision: data.subDivisionOrParking,
    // Datos Fijos de Firmantes
    signer1Name: FULL_NAME_PRIMARY_EMPLOYEE,
    signer1DNI: DNI_EMPLOYEE_PRIMARY,
    signer2Name: FULL_NAME_SECOND_EMPLOYEE,
    signer2DNI: DNI_EMPLOYEE_SECOND,
    signature1: SIGNATURE_EMPLOYEE,
    signature2: SIGNATURE_EMPLOYEE_TWO,
  });

  const page = await browser.newPage();
  await page.setContent(finalHtml, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    format: 'Letter',
    printBackground: true,
    preferCSSPageSize: true,
    margin: {
      top: '2.12cm',
      bottom: '0.49cm',
      left: '1.41cm',
      right: '2.26cm',
    },
  });

  await page.close();

  return Buffer.from(pdfBuffer);
};

export const generateSubsidioContract = async (
  data: EmployeeData,
  browser: Browser,
): Promise<Buffer> => {
  const fullName =
    `${data.lastNameFather || ' '} ${data.lastNameMother || ' '} ${data.name || ''}`
      .trim()
      .replace(/\s+/g, ' ');

  // Lógica para el nombre del suplido
  const replacementForArray = data.replacementFor?.split(' ');
  const firstAndfirstLastName = `${replacementForArray?.[0] || ''} ${replacementForArray?.[1] || ''}`;
  const secondLastName = `${replacementForArray?.[2] || ''}`;
  const salaryFormatted =
    typeof formatCurrency === 'function'
      ? formatCurrency(Number(data.salary))
      : `S/ ${data.salary}`;
  const template = Handlebars.compile(CONTRACT_SUBSIDIO);
  const finalHtml = template({
    ...data,
    fullName,
    firstAndfirstLastName,
    secondLastName,
    salaryFormatted,
    signer1Name: FULL_NAME_PRIMARY_EMPLOYEE,
    signer1DNI: DNI_EMPLOYEE_PRIMARY,
    signer2Name: FULL_NAME_SECOND_EMPLOYEE,
    signer2DNI: DNI_EMPLOYEE_SECOND,
    signature1:
      typeof SIGNATURE_EMPLOYEE !== 'undefined' ? SIGNATURE_EMPLOYEE : null,
    signature2:
      typeof SIGNATURE_EMPLOYEE_TWO !== 'undefined'
        ? SIGNATURE_EMPLOYEE_TWO
        : null,
  });

  const page = await browser.newPage();
  await page.setContent(finalHtml, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    format: 'Letter',
    printBackground: true,
    preferCSSPageSize: true,
    margin: {
      top: '1.75cm',
      bottom: '1.75cm',
      left: '3cm',
      right: '1.84cm',
    },
  });

  await page.close();

  return Buffer.from(pdfBuffer);
};
export const generateDocAnexo = async (
  data: EmployeeData,
  browser: Browser,
): Promise<Buffer> => {
  const template = Handlebars.compile(ANEXO);
  const finalHtml = template({
    fullName:
      `${data.name || ''} ${data.lastNameFather || ''} ${data.lastNameMother || ''}`.trim(),
    dni: data.dni,
    address: data.address,
    district: data.district,
    province: data.province,
    department: data.department,
    position: data.position,
    entryDate: data.entryDate,
    subDivision: data.subDivisionOrParking,
    signer1Name: FULL_NAME_PRIMARY_EMPLOYEE,
    signer1DNI: DNI_EMPLOYEE_PRIMARY,
    signer2Name: FULL_NAME_SECOND_EMPLOYEE,
    signer2DNI: DNI_EMPLOYEE_SECOND,
    signature1: SIGNATURE_EMPLOYEE,
    signature2: SIGNATURE_EMPLOYEE_TWO,
  });

  const page = await browser.newPage();
  await page.setContent(finalHtml, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: {
      top: '2.5cm',
      right: '2.5cm',
      bottom: '2.5cm',
      left: '2.5cm',
    },
  });

  await page.close();

  return Buffer.from(pdfBuffer);
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
