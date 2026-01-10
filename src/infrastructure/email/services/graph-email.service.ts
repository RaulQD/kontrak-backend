import { Client } from '@microsoft/microsoft-graph-client';
import { SendEmailOptions } from '../types/email.types';
import { OneDriveProvider } from '../../../module/provider/onedrive.provider';

export class GraphEmailService {
  private client: Client;
  constructor() {
    this.client = OneDriveProvider.getClient();
  }
  async sendEmailWithAttachment(options: SendEmailOptions) {
    const { to, cc, subject, body, attachment } = options;
    //CONVERTIR EL BUFFER EN BASE64
    const base64Content = attachment?.content.toString('base64');
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
      attachments: [
        {
          '@odata.type': '#microsoft.graph.fileAttachment',
          name: attachment?.filename,
          contentType: attachment?.contentType,
          contentBytes: base64Content,
        },
      ],
    };
    await this.client
      .api(`users/${process.env.ONEDRIVE_USER_EMAIL}/sendMail`)
      .post({ message });
  }
}
