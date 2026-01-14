import { Client } from '@microsoft/microsoft-graph-client';
import { SendEmailOptions } from '../types/email.types';
import { OneDriveProvider } from '../../onedrive/provider/onedrive.provider';

export class GraphEmailService {
  private client: Client;
  constructor() {
    this.client = OneDriveProvider.getClient();
  }
  async sendEmailWithAttachment(options: SendEmailOptions): Promise<void> {
    const { from, to, cc, subject, body, attachment } = options;
    const message = {
      subject,
      body: {
        contentType: 'HTML',
        content: body,
      },
      toRecipients: to.map((email) => ({
        emailAddress: {
          address: email,
        },
      })),
      ccRecipients:
        cc?.map((email) => ({
          emailAddress: { address: email },
        })) || [],
      attachments: attachment
        ? [
            {
              '@odata.type': '#microsoft.graph.fileAttachment',
              name: attachment.filename,
              contentBytes: attachment.content.toString('base64'),
            },
          ]
        : [],
    };
    try {
      const response = await this.client
        .api(`/users/${from}/sendMail`)
        .post({ message, saveToSentItems: true });
      console.log('response', response);
    } catch (error) {
      console.error('Error al enviar el correo', error);
      throw error;
    }
  }
}
