import { ErrorTemplateData } from '../types/notification.types';

export function getErrorTemplate(data: ErrorTemplateData): string {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Error de Archivo</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td style="padding: 20px 0 30px 0;">
                
                <!-- Contenedor Principal -->
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; border: 1px solid #e5e7eb; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    
                    <!-- Franja Superior de Color -->
                    <tr>
                        <td bgcolor="#EF4444" style="padding: 6px 0;"></td>
                    </tr>

                    <!-- Área de Contenido -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                
                                <!-- Título -->
                                <tr>
                                    <td align="center" style="padding-bottom: 10px;">
                                        <h1 style="margin: 0; font-size: 24px; color: #111827;">Error de Archivo</h1>
                                    </td>
                                </tr>
                                
                                <!-- Subtítulo/Descripción breve -->
                                <tr>
                                    <td align="center" style="padding-bottom: 30px;">
                                        <p style="margin: 0; font-size: 16px; color: #6B7280;">No pudimos procesar el archivo enviado.</p>
                                    </td>
                                </tr>

                                <!-- Cuerpo Dinámico -->
                                <tr>
                                    <td style="font-size: 16px; line-height: 1.5; color: #374151;">
                                        
                    <p style="margin-bottom: 16px;">Hola <strong>${data.userName}</strong>,</p>
                    <p style="margin-bottom: 16px;">Hubo un error crítico al intentar leer el archivo <strong>"${data.fileName}"</strong>. La carga se ha cancelado completamente.</p>
                    
                    <div style="border-left: 4px solid #EF4444; background-color: #FEF2F2; padding: 15px; margin-bottom: 24px;">
                        <strong style="color: #991B1B; display: block; margin-bottom: 5px;">Diagnóstico del Sistema:</strong>
                        <span style="color: #7F1D1D; font-size: 14px;">${data.errorMessage}</span>
                    </div>

                    <p style="margin-bottom: 24px;">Por favor, verifica que el archivo tenga el formato correcto y vuelve a intentarlo.</p>
                
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
