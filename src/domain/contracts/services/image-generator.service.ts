import puppeteer from 'puppeteer';
import { EmployeeData } from '../../../shared/types/employees.interface';

export class ImageGeneratorService {
  constructor() {}
  async excelToImage(employees: EmployeeData[]): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    // Viewport más ancho para que quepa todo
    await page.setViewport({ width: 1200, height: 800 });

    const html = `
    <html>
    <head>
      <style>
        body { 
          font-family: 'Calibri', Arial, sans-serif;
          padding: 10px;
          background: white;
          margin: 0;
        }
        table { 
          border-collapse: collapse; 
          width: 100%;
          font-size: 12px;
          table-layout: fixed;
        }
        th, td { 
          border: 1px solid #000; 
          padding: 8px 10px;
          text-align: center;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        th { 
          background: #FFFF00; 
          color: black;
          font-weight: bold;
          white-space: nowrap;
        }
        /* Anchos de columnas */
        th:nth-child(1), td:nth-child(1) { width: 10%; } /* Apellido Paterno */
        th:nth-child(2), td:nth-child(2) { width: 10%; } /* Apellido Materno */
        th:nth-child(3), td:nth-child(3) { width: 12%; } /* Nombre */
        th:nth-child(4), td:nth-child(4) { width: 8%; }  /* DNI */
        th:nth-child(5), td:nth-child(5) { width: 10%; } /* Fecha Ingreso */
        th:nth-child(6), td:nth-child(6) { width: 10%; } /* Fecha Nacimiento */
        th:nth-child(7), td:nth-child(7) { width: 40%; } /* Dirección - más ancha */
        
        tr:nth-child(even) { background: #f9f9f9; }
      </style>
    </head>
    <body>
      <table>
        <tr>
          <th>APELLIDO<br>PATERNO</th>
          <th>APELLIDO<br>MATERNO</th>
          <th>NOMBRE<br>COMPLETO</th>
          <th>DNI</th>
          <th>FECHA DE<br>INGRESO</th>
          <th>FECHA DE<br>NACIMIENTO</th>
          <th>DIRECCION</th>
        </tr>
        ${employees
          .map(
            (emp) => `
          <tr>
            <td>${emp.lastNameFather || ''}</td>
            <td>${emp.lastNameMother || ''}</td>
            <td>${emp.name || ''}</td>
            <td>${emp.dni || ''}</td>
            <td>${emp.entryDate || ''}</td>
            <td>${emp.birthDate || ''}</td>
            <td>${emp.address || ''}</td>
          </tr>
        `,
          )
          .join('')}
      </table>
    </body>
    </html>
  `;
    await page.setContent(html);

    // Capturar solo la tabla, no toda la página
    const table = await page.$('table');
    const screenshot = await table!.screenshot();

    await browser.close();
    return screenshot as Buffer;
  }
}
