import { SuccessTemplateData } from '../types/notification.types';

export function getSuccessTemplate(data: SuccessTemplateData): string {
  const totalContracts =
    data.contracts.fullTime +
    data.contracts.partTime +
    data.contracts.subsidio +
    data.contracts.apeTratamientoDatos;

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Carga Completada</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td style="padding: 20px 0 30px 0;">
                
                <!-- Contenedor Principal -->
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; border: 1px solid #e5e7eb; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    
                    <!-- Franja Superior de Color -->
                    <tr>
                        <td bgcolor="#10B981" style="padding: 6px 0;"></td>
                    </tr>

                    <!-- Área de Contenido -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">


                                <!-- Título -->
                                <tr>
                                    <td align="center" style="padding-bottom: 10px;">
                                        <h1 style="margin: 0; font-size: 24px; color: #111827;">Carga Completada</h1>
                                    </td>
                                </tr>
                                
                                <!-- Subtítulo/Descripción breve -->
                                <tr>
                                    <td align="center" style="padding-bottom: 30px;">
                                        <p style="margin: 0; font-size: 16px; color: #6B7280;">El archivo ha sido procesado exitosamente.</p>
                                    </td>
                                </tr>

                                <!-- Cuerpo Dinámico -->
                                <tr>
                                    <td style="font-size: 16px; line-height: 1.5; color: #374151;">
                                        
                    <p style="margin-bottom: 16px;">Hola <strong>${data.userName}</strong>,</p>
                    <p style="margin-bottom: 24px;">El procesamiento del archivo <strong>"${data.fileName}"</strong> ha finalizado correctamente. Aquí tienes el resumen:</p>
                    
                    <!-- Resumen General -->
                    <div style="background-color: #F3F4F6; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td width="50%" style="padding-bottom: 15px; border-bottom: 1px solid #E5E7EB; color: #6B7280; font-size: 14px;">Total Empleados</td>
                                <td width="50%" align="right" style="padding-bottom: 15px; border-bottom: 1px solid #E5E7EB; color: #111827; font-weight: bold; font-size: 16px;">${data.totalEmployees}</td>
                            </tr>
                            <tr>
                                <td width="50%" style="padding: 15px 0; color: #6B7280; font-size: 14px;">Total Contratos</td>
                                <td width="50%" align="right" style="padding: 15px 0; color: #10B981; font-weight: bold; font-size: 16px;">${totalContracts}</td>
                            </tr>
                        </table>
                    </div>

                    <!-- Detalle por Tipo de Contrato -->
                    <p style="font-weight: bold; color: #374151; margin-bottom: 12px;">Contratos por Tipo:</p>
                    <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 15px; margin-bottom: 24px;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Full Time (Planilla)</td>
                                <td align="right" style="padding: 8px 0; color: #111827; font-weight: bold;">${data.contracts.fullTime}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; border-top: 1px solid #E5E7EB; color: #6B7280; font-size: 14px;">Part Time</td>
                                <td align="right" style="padding: 8px 0; border-top: 1px solid #E5E7EB; color: #111827; font-weight: bold;">${data.contracts.partTime}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; border-top: 1px solid #E5E7EB; color: #6B7280; font-size: 14px;">Subsidio</td>
                                <td align="right" style="padding: 8px 0; border-top: 1px solid #E5E7EB; color: #111827; font-weight: bold;">${data.contracts.subsidio}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; border-top: 1px solid #E5E7EB; color: #6B7280; font-size: 14px;">APE - Tratamiento de Datos</td>
                                <td align="right" style="padding: 8px 0; border-top: 1px solid #E5E7EB; color: #3B82F6; font-weight: bold;">${data.contracts.apeTratamientoDatos}</td>
                            </tr>
                        </table>
                    </div>
                    <p style="font-size: 14px; color: #6B7280;">Los documentos ya están disponibles en OneDrive.</p>
                
                                    </td>
                                </tr>

                            </table>
                        </td>
                    </tr>

                </table>
                <!-- Fin Contenedor Principal -->
                
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                    <tr>
                        <td align="center" style="padding-top: 20px; color: #9CA3AF; font-size: 12px;">
                            Este es un mensaje generado automáticamente.
                        </td>
                    </tr>
                </table>

            </td>
        </tr>
    </table>
</body>
</html>
`;
}
