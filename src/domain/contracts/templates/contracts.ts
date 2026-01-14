import {
  SIGNATURE_EMPLOYEE,
  SIGNATURE_EMPLOYEE_TWO,
} from '../../../shared/constants/signatures';
import {
  DNI_EMPLOYEE_PRIMARY,
  DNI_EMPLOYEE_SECOND,
  FULL_NAME_PRIMARY_EMPLOYEE,
  FULL_NAME_SECOND_EMPLOYEE,
} from '../constants/constants';
import Handlebars from 'handlebars';
import {
  ANEXO,
  CONTRACT_FULL_TIME,
  CONTRACT_PART_TIME,
  CONTRACT_SUBSIDIO,
  PROCESSING_PERSONAL_DATA,
} from './templates';
import { Browser } from 'puppeteer';
import { formatCurrency } from '../../../shared/utils/formatCurrency';
import { EmployeeData } from '../../../shared/types/employees.interface';

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
    division: data.division,
    workingCondition: data.workingCondition,
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
    division: data.division,
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
    division: data.division,
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
    format: 'LETTER',
    printBackground: true,
    preferCSSPageSize: true,
    margin: {
      top: '2.68cm',
      right: '2.26cm',
      bottom: '2.68cm',
      left: '1.41cm',
    },
  });

  await page.close();

  return Buffer.from(pdfBuffer);
};

export const generateProcessingOfPersonalDataPDF = async (
  data: EmployeeData,
  browser: Browser,
): Promise<Buffer> => {
  const template = Handlebars.compile(PROCESSING_PERSONAL_DATA);
  const finalHTML = template({
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
    division: data.division,
    signer1Name: FULL_NAME_PRIMARY_EMPLOYEE,
    signer1DNI: DNI_EMPLOYEE_PRIMARY,
    signer2Name: FULL_NAME_SECOND_EMPLOYEE,
    signer2DNI: DNI_EMPLOYEE_SECOND,
    signature1: SIGNATURE_EMPLOYEE,
    signature2: SIGNATURE_EMPLOYEE_TWO,
  });
  const page = await browser.newPage();
  await page.setContent(finalHTML, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({
    format: 'LETTER',
    printBackground: true,
    preferCSSPageSize: true,
    margin: {
      top: '2.68cm',
      right: '2.26cm',
      bottom: '0.49cm',
      left: '1.81cm',
    },
  });
  await page.close();
  return Buffer.from(pdfBuffer);
};
