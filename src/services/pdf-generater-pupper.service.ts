import puppeteer from 'puppeteer';
import { logger } from '../validators/logger';
import { EmployeeData } from '../types/employees.types';
import { formatCurrency } from '../utils/formatCurrency';

/**
 * Servicio para generar PDFs de contratos usando Puppeteer
 */
export class PdfGeneratorPupperService {
  /**
   * Genera un contrato PDF basado en el tipo de contrato
   */
  async generateContract(
    employeeData: EmployeeData,
    contractType: string,
  ): Promise<{ buffer: Buffer; filename: string }> {
    logger.info(
      { dni: employeeData.dni, contractType },
      '📄 Generando contrato PDF con Puppeteer',
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

      logger.info(
        { filename },
        '✅ Contrato PDF generado exitosamente con Puppeteer',
      );

      return { buffer, filename };
    } catch (error) {
      logger.error(
        { error, dni: employeeData.dni },
        '❌ Error generando PDF con Puppeteer',
      );
      throw error;
    }
  }

  /**
   * Genera contrato de Planilla usando Puppeteer
   */
  private async generatePlanillaContract(data: EmployeeData): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      const htmlContent = this.generatePlanillaHTML(data);

      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0',
      });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '2.05cm',
          right: '1.55cm',
          bottom: '0.49cm',
          left: '1.23cm',
        },
      });

      await browser.close();
      return Buffer.from(pdfBuffer);
    } catch (error) {
      await browser.close();
      throw error;
    }
  }

  /**
   * Genera el HTML para el contrato de Planilla
   */
  private generatePlanillaHTML(data: EmployeeData): string {
    const fullName =
      `${data.lastNameFather || ''} ${data.lastNameMother || ''} ${data.name || ''}`
        .trim()
        .replace(/\s+/g, ' ');

    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contrato de Trabajo</title>
  <style>
    @page {
      margin: 2.05cm 1.55cm 0.49cm 1.23cm;
      size: A4;
    }
    
    body {
      font-family: Arial, sans-serif;
      font-size: 8pt;
      line-height: 1.4;
      color: #000;
      margin: 0;
      padding: 0;
    }
    
    .main-title {
      text-align: center;
      font-weight: bold;
      text-decoration: underline;
      font-size: 8pt;
      margin-bottom: 1em;
    }
    
    .section-title {
      font-weight: bold;
      text-decoration: underline;
      font-size: 8pt;
      margin-top: 1em;
      margin-bottom: 0.5em;
    }
    
    p {
      text-align: justify;
      margin: 0.5em 0;
      font-size: 8pt;
    }
    
    strong {
      font-weight: bold;
    }
    
    .sub-paragraph {
      margin-left: 0;
      text-align: justify;
    }
    
    .signatures {
      display: flex;
      justify-content: space-between;
      margin-top: 3em;
      page-break-inside: avoid;
    }
    
    .signature-block {
      text-align: center;
      width: 40%;
    }
    
    .signature-line {
      border-top: 1px solid #000;
      margin-bottom: 0.5em;
      padding-top: 0.2em;
    }
  </style>
</head>
<body>
  <h3 class="main-title">CONTRATO DE TRABAJO DE TIEMPO PARCIAL</h3>
  
  <p>
    Conste por el presente documento, que se suscribe por duplicado con igual tenor y valor, el 
    <strong>Contrato de Trabajo a Tiempo Parcial,</strong> que, al amparo de lo dispuesto en el 
    Texto Único Ordenado del Decreto Legislativo Nº 728 (Decreto Supremo Nº 003-97-TR, Ley de 
    Productividad y Competitividad Laboral) y el Decreto Supremo N° 002-97-TR, celebran, de una 
    parte, la empresa <strong>INVERSIONES URBANÍSTICAS OPERADORA S.A.,</strong> con R.U.C. Nº 
    20603381697, con domicilio en Calle Dean Valdivia N°148 Int.1401 Urb. Jardín (Edificio Platinium), 
    Distrito de San Isidro, Provincia y Departamento de Lima, debidamente representada por la Sra. 
    Catherine Susan Chang López identificado con D.N.I. Nº 42933662 y por la Sra. Maria Estela 
    Guillen Cubas, identificada con DNI Nº 10346833, según poderes inscritos en la Partida Electrónica 
    14130887 del Registro de Personas Jurídicas de Lima, a quien en adelante se le denominará 
    <strong>"EL EMPLEADOR"</strong>; y de otra parte, el Sr.(a). <strong>${fullName}</strong> 
    identificado con <strong>DNI N° ${data.dni || ''},</strong> de nacionalidad peruana, con 
    domicilio en <strong>${data.address || ''},</strong> Distrito de <strong>${data.district || ''},</strong> 
    Provincia de <strong>${data.province || ''}</strong> y Departamento de <strong>${data.department || ''}</strong> 
    a quien en adelante se le denominará <strong>"EL TRABAJADOR"</strong>; en los términos y 
    condiciones siguientes:
  </p>
  
  <h4 class="section-title">PRIMERO: PARTES DEL CONTRATO</h4>
  
  <p class="sub-paragraph">
    <strong>1.1</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>EL EMPLEADOR</strong> es una 
    sociedad anónima debidamente constituida e inscrita en la Partida No. 14130887 del Registro de 
    Personas Jurídicas de la Ciudad de Lima, cuyo objeto social es la prestación de servicios de 
    administración, promoción, desarrollo y operación de playas de estacionamiento, sistemas de 
    peaje y actividades conexas.
  </p>
  
  <p class="sub-paragraph">
    <strong>1.2</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>EL EMPLEADOR</strong> para 
    realizar actividades comerciales y de servicios en las distintas divisiones de negocios, 
    requiere contratar personal que desempeñará labores a tiempo parcial.
  </p>
  
  <p class="sub-paragraph">
    <strong>1.3</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>EL TRABAJADOR</strong> declara 
    estar capacitado y no tener impedimento físico ni legal para desempeñar las funciones que le 
    encomienda <strong>EL EMPLEADOR</strong> en el marco del presente <strong>CONTRATO.</strong>
  </p>
  
  <h4 class="section-title">SEGUNDA: OBJETO DEL CONTRATO</h4>
  
  <p class="sub-paragraph">
    <strong>2.1</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Por el presente documento 
    <strong>EL EMPLEADOR</strong> contrata a <strong>EL TRABAJADOR</strong> para que realice 
    actividades de <strong>${data.position || ''}</strong> asumiendo las responsabilidades propias 
    del puesto y de acuerdo a las estipulaciones contenidas en este Contrato.
  </p>
  
  <p class="sub-paragraph">
    <strong>2.2</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Las partes reconocen y declaran que 
    el cargo de EL TRABAJADOR está sujeto a fiscalización inmediata.
  </p>

  <!-- AQUÍ DEBES AGREGAR LAS DEMÁS CLÁUSULAS (TERCERO, CUARTO, QUINTO, etc.) -->
  <!-- Sigue el mismo patrón que te mostré arriba -->
  
  <div class="signatures">
    <div class="signature-block">
      <div class="signature-line">_____________________</div>
      <div>Firma del Empleado</div>
    </div>
    <div class="signature-block">
      <div class="signature-line">_____________________</div>
      <div>Firma del Empleador</div>
    </div>
  </div>
  
</body>
</html>
    `;
  }

  /**
   * Genera contrato de Subsidio usando Puppeteer
   */
  private async generateSubsidioContract(data: EmployeeData): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      const htmlContent = this.generateSubsidioHTML(data);

      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0',
      });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '50px',
          right: '50px',
          bottom: '50px',
          left: '50px',
        },
      });

      await browser.close();
      return Buffer.from(pdfBuffer);
    } catch (error) {
      await browser.close();
      throw error;
    }
  }

  /**
   * Genera el HTML para el contrato de Subsidio
   */
  private generateSubsidioHTML(data: EmployeeData): string {
    const fullName =
      `${data.name || ''} ${data.lastNameFather || ''} ${data.lastNameMother || ''}`
        .trim()
        .replace(/\s+/g, ' ');
    const salary = data.salary
      ? formatCurrency(Number(data.salary))
      : 'S/ 0.00';

    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    h1 { text-align: center; font-size: 18px; }
    h2 { font-size: 14px; margin-top: 20px; }
    p { font-size: 12px; line-height: 1.6; text-align: justify; }
    .signatures { display: flex; justify-content: space-between; margin-top: 60px; }
    .signature-block { text-align: center; width: 40%; }
    .signature-line { border-top: 1px solid #000; padding-top: 5px; }
  </style>
</head>
<body>
  <h1>CONTRATO DE TRABAJO CON SUBSIDIO TEMPORAL</h1>
  
  <h2>DATOS DEL BENEFICIARIO</h2>
  <p><strong>Nombre completo:</strong> ${fullName}</p>
  <p><strong>DNI:</strong> ${data.dni || ''}</p>
  <p><strong>Dirección:</strong> ${data.address || ''}</p>
  <p><strong>Distrito:</strong> ${data.district || ''}</p>
  
  <h2>CONDICIONES DEL SUBSIDIO</h2>
  <p><strong>Monto del subsidio:</strong> ${salary}</p>
  <p><strong>Tipo:</strong> Subsidio temporal</p>
  
  <h2>TÉRMINOS Y CONDICIONES</h2>
  <p>1. Este subsidio es de carácter temporal y puede ser renovado previa evaluación.</p>
  <p>2. El beneficiario deberá cumplir con las condiciones establecidas para mantener el subsidio.</p>
  <p>3. Los pagos se realizarán mensualmente según calendario establecido.</p>
  <p>4. El subsidio no incluye beneficios laborales de planilla.</p>
  
  <div class="signatures">
    <div class="signature-block">
      <div class="signature-line">_____________________</div>
      <div>Firma del Beneficiario</div>
    </div>
    <div class="signature-block">
      <div class="signature-line">_____________________</div>
      <div>Firma del Responsable</div>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Genera contrato Part-time usando Puppeteer
   * TODO: Implementar siguiendo el mismo patrón
   */
  private async generatePartTimeContract(data: EmployeeData): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      const htmlContent = this.generatePlanillaHTML(data);

      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0',
      });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '2.05cm',
          right: '1.55cm',
          bottom: '0.49cm',
          left: '1.23cm',
        },
      });

      await browser.close();
      return Buffer.from(pdfBuffer);
    } catch (error) {
      await browser.close();
      throw error;
    }
  }

  /**
   * Genera contrato APE usando Puppeteer
   * TODO: Implementar siguiendo el mismo patrón
   */
  private async generateApeContract(data: EmployeeData): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      const htmlContent = this.generatePlanillaHTML(data);

      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0',
      });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '2.05cm',
          right: '1.55cm',
          bottom: '0.49cm',
          left: '1.23cm',
        },
      });

      await browser.close();
      return Buffer.from(pdfBuffer);
    } catch (error) {
      await browser.close();
      throw error;
    }
  }
}
