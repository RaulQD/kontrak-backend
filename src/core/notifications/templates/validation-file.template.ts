export interface FileErrorTemplateData {
  userName: string;
  createdByEmail: string;
  fileName: string;
  errors: string[]; // Array de mensajes de error
}

export function getFileErrorTemplate(data: FileErrorTemplateData): string {
  // Generar lista de errores
  const errorListHtml = data.errors
    .map(
      (error) => `
        <li style="margin-bottom: 10px; padding: 12px; background-color: #FEE2E2; border-left: 3px solid #DC2626; border-radius: 4px; color: #991B1B; list-style: none;">
            ${error}
        </li>`,
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #F3F4F6;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F3F4F6; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Franja Superior -->
                    <tr>
                        <td bgcolor="#DC2626" style="padding: 6px 0;"></td>
                    </tr>
                    <!-- Contenido -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h1 style="margin: 0 0 10px 0; font-size: 24px; color: #111827;">Error de Archivo</h1>
                            <p style="color: #6B7280; margin-bottom: 30px;">
                                Hola <strong>${data.userName}</strong>,
                            </p>
                            <p style="color: #6B7280; margin-bottom: 20px;">
                                El archivo <strong>"${data.fileName}"</strong> no pudo ser procesado debido a los siguientes errores:
                            </p>
                            <!-- Lista de Errores -->
                            <ul style="margin: 0; padding: 0;">
                                ${errorListHtml}
                            </ul>
                            <p style="color: #6B7280; margin-top: 30px;">
                                Por favor, sube un archivo con el formato correcto e inténtalo de nuevo.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}
