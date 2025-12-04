import { EmployeeData } from '../types/employees.types';

// FUNCIÓN PARA GENERAR EL HTML DEL CONTRATO
export const generateContractHTML = (data: EmployeeData): string => {
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
    /* ESTILOS GENERALES */
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
    
    /* TÍTULO PRINCIPAL */
    .main-title {
      text-align: center;
      font-weight: bold;
      text-decoration: underline;
      font-size: 8pt;
      margin-bottom: 1em;
    }
    
    /* TÍTULOS DE SECCIONES */
    .section-title {
      font-weight: bold;
      text-decoration: underline;
      font-size: 8pt;
      margin-top: 1em;
      margin-bottom: 0.5em;
    }
    
    /* PÁRRAFOS */
    p {
      text-align: justify;
      margin: 0.5em 0;
      font-size: 8pt;
    }
    
    /* TEXTOS EN NEGRITA */
    strong {
      font-weight: bold;
    }
    
    /* SUB-PÁRRAFOS CON NUMERACIÓN */
    .sub-paragraph {
      margin-left: 0;
      text-align: justify;
    }
    
    /* FIRMAS */
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
  <!-- TÍTULO PRINCIPAL -->
  <h3 class="main-title">CONTRATO DE TRABAJO DE TIEMPO PARCIAL</h3>
  
  <!-- PÁRRAFO INTRODUCTORIO -->
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
  
  <!-- CLÁUSULA PRIMERO -->
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
  
  <!-- CLÁUSULA SEGUNDO -->
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

  <!-- AQUÍ CONTINUARÍAS CON LAS DEMÁS CLÁUSULAS SIGUIENDO EL MISMO PATRÓN -->
  
  <!-- FIRMAS (AL FINAL DEL DOCUMENTO) -->
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
};
