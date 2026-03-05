import { getFieldLabel } from '../../../shared/constants/field-labels';
import { ValidationErrorTemplateData } from '../types/notification.types';

export function getValidationErrorTemplate(
  data: ValidationErrorTemplateData,
): string {
  // Generar lista de errores HTML
  const errorListHtml = data.errors
    .slice(0, 10) // Máximo 10 errores para no saturar el email
    .map(
      (err) => `
    <li style="margin-bottom: 15px; padding: 12px; background-color: #FEF3C7; border-left: 3px solid #F59E0B; border-radius: 4px;">
        <div style="margin-bottom: 6px;">
            <strong style="color: #92400E;">Fila ${err.row}</strong>
            <span style="background-color: #FDE68A; padding: 3px 8px; border-radius: 4px; color: #92400E; font-size: 12px; font-weight: bold; margin-left: 6px;">
                ${getFieldLabel(err.field)}
            </span>
        </div>
        <div style="color: #78350F; font-size: 14px; line-height: 1.4;">
            ${err.message}
        </div>
    </li>`,
    )
    .join('');

  const moreErrorsText =
    data.errors.length > 10
      ? `<p style="font-size: 12px; color: #92400E; margin-top: 10px;">... y ${data.errors.length - 10} errores adicionales.</p>`
      : '';

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Errores de Validación</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td style="padding: 20px 0 30px 0;">
                
                <!-- Contenedor Principal -->
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; border: 1px solid #e5e7eb; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    
                    <!-- Franja Superior de Color -->
                    <tr>
                        <td bgcolor="#F59E0B" style="padding: 6px 0;"></td>
                    </tr>

                    <!-- Área de Contenido -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">

                                <!-- Título -->
                                <tr>
                                    <td align="center" style="padding-bottom: 10px;">
                                        <h1 style="margin: 0; font-size: 24px; color: #111827;">Errores de Validación</h1>
                                    </td>
                                </tr>
                                
                                <!-- Subtítulo/Descripción breve -->
                                <tr>
                                    <td align="center" style="padding-bottom: 30px;">
                                        <p style="margin: 0; font-size: 16px; color: #6B7280;">Encontramos problemas en los datos enviados.</p>
                                    </td>
                                </tr>

                                <!-- Cuerpo Dinámico -->
                                <tr>
                                    <td style="font-size: 16px; line-height: 1.5; color: #374151;">
                                        
                    <p style="margin-bottom: 16px;">Hola <strong>${data.userName}</strong>,</p>
                    <p style="margin-bottom: 24px;">Hemos procesado tu archivo <strong>"${data.fileName}"</strong>, pero encontramos inconsistencias que impiden completar la importación de algunos registros:</p>
                    
                    <div style="background-color: #FFFBEB; border: 1px solid #FCD34D; border-radius: 8px; overflow: hidden; margin-bottom: 24px;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td style="padding: 15px; border-bottom: 1px solid #FDE68A; background-color: #FEF3C7;">
                                    <strong style="color: #92400E; font-size: 14px;">Reporte de Incidencias (${data.errors.length} errores)</strong>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 15px;">
                                    <ul style="margin: 0; padding-left: 20px; color: #4B5563; font-size: 14px; line-height: 1.6;">
                                        ${errorListHtml}
                                    </ul>
                                    ${moreErrorsText}
                                </td>
                            </tr>
                        </table>
                    </div>

                    <p style="font-size: 14px; color: #6B7280; margin-bottom: 24px;">Por favor, corrige estos registros en tu archivo original y vuelve a intentarlo.</p>
                
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
