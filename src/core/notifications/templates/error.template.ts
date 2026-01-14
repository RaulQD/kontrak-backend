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
                                
                                <!-- Icono -->
                                <tr>
                                    <td align="center">
                                        
                <div style="background-color: #FEE2E2; color: #EF4444; width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                </div>
                
                                    </td>
                                </tr>

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
